"use server"
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCart(formData: FormData) {
    const productId = Number(formData.get("productId"));
    const size = formData.get("size") as string | null;
    const color = formData.get("color") as string | null;
    const quantity = Number(formData.get("quantity"));

    // Step 1: Find active cart or create a new one
    let checkCart = await prisma.cart.findFirst({
        where: { Status: "active" }
    });

    let cartId = checkCart ? checkCart.Id : null;
    if (!cartId) {
        const newCart = await prisma.cart.create({
            data: { Status: "active" }
        });
        cartId = newCart.Id;
    }

    // Step 2: Get product details
    const product = await prisma.product.findUnique({
        where: { Id: productId },
        include: {
            Variants: true, // Include variants to check if this product has any
        }
    });

    if (!product) {
        throw new Error("Product not found");
    }

    let price = product.Price;
    let stock = product.Stock; // Default stock for non-variant products
    let variantId: number | null = null;

    // Step 3: If the product has variants, find the correct variant by size & color
    if (product.Variants.length > 0) {
        const selectedVariant = product.Variants.find(v =>
            (v.Size === size || v.Size === null) &&
            (v.Color === color || v.Color === null)
        );

        if (!selectedVariant) {
            throw new Error("Selected variant does not exist.");
        }

        variantId = selectedVariant.Id;
        price = selectedVariant.Price;
        stock = selectedVariant.Stock;
    } else {
        // If product has variants, product stock should always be 0
        stock = product.Variants.length > 0 ? 0 : product.Stock;
    }

    // Step 4: Check if requested quantity exceeds stock
    if (quantity > stock) {
        throw new Error("Not enough stock available.");
    }

    // Step 5: Check if the product (with or without variant) is already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            CartId: cartId,
            ProductId: productId,
            VariantId: variantId
        }
    });

    let totalPrice: number;
    let discount = 0; // Default to no discount

    if (existingCartItem) {
        discount = existingCartItem.Discount ?? 0;
        totalPrice = (existingCartItem.Quantity + quantity) * price;
        totalPrice -= discount * (existingCartItem.Quantity + quantity);

        await prisma.cartItem.update({
            where: { Id: existingCartItem.Id },
            data: {
                Quantity: existingCartItem.Quantity + quantity,  // Adjust quantity
                TotalPrice: totalPrice  // Recalculate total price
            }
        });
    } else {
        // Step 6: If product (or variant) doesn't exist in cart, create a new cart item
        await prisma.cartItem.create({
            data: {
                CartId: cartId,
                ProductId: productId,
                VariantId: variantId,
                Quantity: quantity,
                Price: price,
                TotalPrice: price * quantity
            }
        });
    }

    // Step 7: Revalidate order page after adding to cart
    revalidatePath("/order");
}

export async function clearCart(id: string) {
    await prisma.cart.update({
        where: {
            Id: id
        },
        data: {
            CartItems: {
                deleteMany: {},
            }
        }
    });
    revalidatePath("/order")
}

export async function deleteFromCart(id: number) {
    await prisma.cartItem.delete({
        where: {
            Id: id,
        },
    });
    revalidatePath("/order");
};

export async function updateCartQty(id: number, qty: number) {
    const cartItem = await prisma.cartItem.findUnique({
        where: { Id: id },
        include: {
            Product: true,
            Variant: true, // Include variant if applicable
        },
    });

    if (!cartItem) {
        throw new Error('Cart item not found');
    }

    let price = cartItem.Product.Price;
    let stock = cartItem.Product.Stock; // Default to product stock

    // If this cart item is a variant, use the variant's price & stock
    if (cartItem.Variant) {
        price = cartItem.Variant.Price;
        stock = cartItem.Variant.Stock;
    }

    // Ensure requested quantity does not exceed stock
    if (qty > stock) {
        throw new Error(`Not enough stock available. Only ${stock} left.`);
    }

    // Calculate new total price
    const discount = cartItem.Discount ?? 0;
    const newTotalPrice = (price * qty) - discount;

    // Update the cart item with new quantity & total price
    await prisma.cartItem.update({
        where: { Id: id },
        data: {
            Quantity: qty,
            TotalPrice: newTotalPrice,
        },
    });

    // Revalidate cart/order page to reflect changes
    revalidatePath("/order");
}

export async function addDiscount(id: number, amount: string) {
    const currItem = await prisma.cartItem.findUnique({ where: { Id: id } });

    if (!currItem) {
        throw new Error('Cart item not found');
    };

    await prisma.cartItem.update({
        where: { Id: id },
        data: {
            TotalPrice: (currItem.Price * currItem.Quantity) - Number(amount),
            Discount: Number(amount),
        }
    });

    revalidatePath("/order");
};

export async function payment(formData: FormData) {
    const currCart = await prisma.cart.findFirst({
        where: { Status: "active" },
        include: {
            CartItems: {
                include: {
                    Product: true,
                    Variant: true, // Include variant if applicable
                }
            }
        },
    });

    if (!currCart) throw new Error("Cart not found.");

    // Generate Invoice Code
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:T.]/g, "").slice(0, 8); // YYYYMMDD
    const timeStamp = now.getMilliseconds(); // Get milliseconds for uniqueness

    // Generate a random 3-letter string
    const randomString = Math.random().toString(36).substring(2, 5).toUpperCase();

    const invoiceCode: string = `${formattedDate}${timeStamp}${randomString}`;

    // Calculate Subtotal & Discount
    const subTotal = currCart.CartItems.reduce((total, item) => {
        const price = item.Variant ? item.Variant.Price : item.Product.Price;
        return total + price * item.Quantity;
    }, 0);

    const discountValue = currCart.CartItems.reduce((totalDiscount, item) => {
        return totalDiscount + (item.Discount ?? 0);
    }, 0);

    const grandTotal = subTotal - discountValue;

    // Create New Order
    const newOrder = await prisma.order.create({
        data: {
            InvoiceNo: invoiceCode,
            PaymentType: formData.get("payment") as string,
            SubTotal: subTotal,
            DiscItemTotal: discountValue,
            Total: grandTotal,
            Status: "process",
            isPrint: false,
            isEmail: false,
        }
    });

    if (!newOrder) throw new Error("Failed to create order.");

    // Process Order Details & Reduce Stock
    await prisma.$transaction(async (tx) => {
        await Promise.all(currCart.CartItems.map(async (item) => {
            const price = item.Variant ? item.Variant.Price : item.Product.Price;

            // Reduce stock (check if item is variant or product)
            if (item.VariantId) {
                await tx.productVariant.update({
                    where: { Id: item.VariantId },
                    data: { Stock: { decrement: item.Quantity } },
                });
            } else {
                await tx.product.update({
                    where: { Id: item.ProductId },
                    data: { Stock: { decrement: item.Quantity } },
                });
            }

            // Create Order Detail
            await tx.orderDetail.create({
                data: {
                    OrderId: newOrder.Id,
                    ProductId: item.ProductId,
                    VariantId: item.VariantId,
                    Qty: item.Quantity,
                    Price: price,
                    Discount: item.Discount ?? 0,
                    TotalPrice: item.TotalPrice,
                }
            });
        }));

        // Clear the cart after successful checkout
        await tx.cartItem.deleteMany({ where: { CartId: currCart.Id } });
        await tx.cart.update({ where: { Id: currCart.Id }, data: { Status: "completed" } });
    });

    // Refresh order page
    revalidatePath("/order/payment");
    redirect(`/payment/${newOrder.Id}`)
}

export async function confirmPayment(id: string) {
    await prisma.order.update({
        where: {
            Id: id,
        },
        data: {
            Status: "confirmed",
        }
    });

    const activeCart = await prisma.cart.findFirst({
        where: {
            Status: "active"
        },
    });

    await prisma.cart.update({
        where: {
            Id: activeCart?.Id
        },
        data: {
            Status: activeCart?.Id,
        }
    });

    redirect(`/order/payment/${id}`)
};

export async function addProduct(formData: FormData) {
    const productName = formData.get("product") as string;
    if (!productName) throw new Error("Product name is required.");

    const baseSlug = productName.replace(/\s+/g, "-").toLowerCase();
    let slug = baseSlug;

    // Step 1: Check if the slug already exists, and generate a unique one
    let counter = 1;
    while (await prisma.product.findUnique({ where: { Slug: slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    // Step 2: Convert form data values correctly
    const price = Number(formData.get("price"));
    if (isNaN(price) || price < 0) throw new Error("Invalid price value.");

    const stock = Number(formData.get("stock")); // Handle stock
    if (isNaN(stock) || stock < 0) throw new Error("Invalid stock value.");
    console.log(`enable value is ${formData.get("enabled")}`);

    const enabled = formData.get("enabled") === "true"; // Proper boolean conversion

    const categoryId = Number(formData.get("category"));
    const categoryExists = await prisma.category.findUnique({ where: { Id: categoryId } });
    if (!categoryExists) throw new Error("Category does not exist.");

    // Step 3: Insert new product
    await prisma.product.create({
        data: {
            Name: productName,
            Slug: slug,
            Price: price,
            Stock: stock, // Now included
            Enabled: enabled,
            categoryId: categoryId,
            Available: true,
        }
    });

    // Step 4: Revalidate path after adding the product
    revalidatePath("/product");
}

export async function excelProduct(products: any[]) {
    for (const product of products) {
        let baseSlug = product.name.replace(/\s+/g, "-").toLowerCase();
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.product.findUnique({ where: { Slug: slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const categoryId = Number(product.categoryId);
        const categoryExists = await prisma.category.findUnique({ where: { Id: categoryId } });
        if (!categoryExists) {
            throw new Error(`Category with ID ${categoryId} does not exist.`);
        }

        const createdProduct = await prisma.product.create({
            data: {
                Name: product.name,
                Slug: slug,
                Price: Number(product.price) || 0,
                Stock: Number(product.stock) || 0,
                Enabled: product.enabled === true,
                categoryId: categoryId,
                Available: true,
            }
        });

        if (product.variants && product.variants.length > 0) {
            const productVariants = product.variants.map((variant: any) => ({
                ProductId: createdProduct.Id,
                Size: String(variant.size), // Ensure string
                Color: variant.color,
                Price: variant.vprice || createdProduct.Price,
                Stock: variant.vstock || createdProduct.Stock,
            }));

            await prisma.productVariant.createMany({
                data: productVariants,
                skipDuplicates: true,
            });
        }
    }

    revalidatePath("/product");
}

export async function productEnabled(id: number) {
    const product = await prisma.product.findUnique({ where: { Id: id } });
    if (!product) {
        throw new Error('Cart item not found');
    };

    await prisma.product.update({
        where: {
            Id: id
        },
        data: {
            Enabled: product.Enabled ? false : true,
        }
    });

    revalidatePath('/product');
};

export async function productStockChange(id: number, stock: number) {
    await prisma.product.update({
        where: {
            Id: id
        },
        data: {
            Stock: stock
        }
    })
}

export async function mainProductPriceChange(id: number, price: number) {
    await prisma.product.update({
        where: {
            Id: id
        },
        data: {
            Price: price
        }
    })
}

export async function addCategory(formData: FormData) {
    const categoryName = formData.get("category") as string;
    if (!categoryName) throw new Error("Category name is required.");
    const existingCategory = await prisma.category.findFirst({
        where: {
            Name: categoryName,
        },
    });
    if (existingCategory) {
        throw new Error("Category name already exists.");
    };
    await prisma.category.create({
        data: {
            Name: categoryName,
            Slug: categoryName.replace(/\s+/g, "-").toLowerCase()
        },
    });
    revalidatePath("/product/categories");
}

export async function deleteProduct(ids: number[]) {
    // Step 1: Validate input (ids should be an array of numbers)
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('Invalid product IDs');
    }

    try {
        // Step 2: Delete the products from the database by marking available as false
        const deletedProducts = await prisma.product.updateMany({
            where: {
                Id: {
                    in: ids,
                },
            },
            data: {
                Available: false,
            }
        });

        // Step 3: Check if any products were deleted
        if (deletedProducts.count === 0) {
            throw new Error('No products found to delete');
        }

        // Step 4: Return success message
        revalidatePath("/product");
        return { success: true, message: `${deletedProducts.count} product(s) deleted successfully.` };
    } catch (error) {
        // Step 5: Handle errors
        console.error('Error deleting products:', error);
        throw new Error('Failed to delete products');
    }

}