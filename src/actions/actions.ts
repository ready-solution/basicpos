"use server"
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCart(formData: FormData) {
    const checkCart = await prisma.cart.findFirst({
        where: {
            Status: "active"
        }
    });
    let cartId = checkCart ? checkCart.Id : null;
    if (!cartId) {
        const newCart = await prisma.cart.create({
            data: {
                Status: "active",
            }
        });
        cartId = newCart.Id;
    }
    const productId = formData.get("productId") as string;  // Example field
    const quantity = Number(formData.get("quantity") as string);  // Example field
    const product = await prisma.product.findUnique({
        where: { Id: Number(productId) }
    });

    if (!product) {
        throw new Error("Product not found");
    }

    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            CartId: cartId,
            ProductId: Number(productId)
        }
    });

    let totalPrice: number;
    let discount = 0; // Default to no discount

    if (existingCartItem) {
        discount = existingCartItem.Discount ?? 0;
        totalPrice = (existingCartItem.Quantity + quantity) * product.Price;
        totalPrice -= (discount * (existingCartItem.Quantity + quantity));

        await prisma.cartItem.update({
            where: { Id: existingCartItem.Id },
            data: {
                Quantity: existingCartItem.Quantity + quantity,  // Adjust the quantity
                TotalPrice: (existingCartItem.Quantity + quantity) * product.Price,  // Recalculate the total price
            }
        });
    } else {
        // Step 7: If product doesn't exist, add a new cart item
        await prisma.cartItem.create({
            data: {
                CartId: cartId,
                ProductId: Number(productId),
                Quantity: quantity,
                Price: product.Price,
                TotalPrice: product.Price * quantity
            }
        });
    }

    revalidatePath("/order")
};

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
        where: {
            Id: id,
        },
        include: {
            Product: true,
        },
    });

    if (!cartItem) {
        throw new Error('Cart item not found');
    };

    const discount = cartItem.Discount ?? 0;
    const newTotalPrice = (cartItem.Product.Price * qty) - discount;
    const newQty = qty;

    await prisma.cartItem.update({
        where: {
            Id: id,
        },
        data: {
            Quantity: newQty,
            TotalPrice: newTotalPrice,
        },
    });
    revalidatePath("/order");
};

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
        where: {
            Status: "active",
        },
        include: {
            CartItems: {
                include: {
                    Product: true,
                }
            }
        },
    });

    if (!currCart) { throw new Error('Cart item not found') };

    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const invoiceCode: string = `${currCart.Id}-${formattedDate}`;

    const subTotal = currCart?.CartItems.reduce((total, item) => {
        return total + (item.Product.Price * item.Quantity);
    }, 0);
    const discountValue = currCart?.CartItems.reduce((totalDiscount, item) => {
        return totalDiscount + (item.Discount ?? 0);
    }, 0);
    const grandtotal = (subTotal ?? 0) - (discountValue ?? 0);

    const newOrder = await prisma.order.create({
        data: {
            InvoiceNo: invoiceCode,
            PaymentType: formData.get("payment") as string,
            SubTotal: subTotal,
            DiscItemTotal: discountValue,
            Total: grandtotal,
            Status: "process",
            isPrint: false,
            isEmail: false,
        }
    });

    if (!newOrder) throw new Error('Failed to create order.');

    const orderDetailsData = await Promise.all(currCart.CartItems.map(async (item) => {
        const product = await prisma.product.findUnique({
            where: { Id: item.ProductId },
        });

        return {
            OrderId: newOrder.Id,
            Name: product?.Name || "",
            Qty: item.Quantity,
            Price: item.Product.Price,
            Discount: item.Discount ?? 0,
            TotalPrice: item.TotalPrice,
        };
    }));

    await prisma.orderDetail.createMany({
        data: orderDetailsData,
    });
    revalidatePath("/order/payment")
    redirect("/order/payment");
};

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