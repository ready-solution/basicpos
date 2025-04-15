import prisma from "@/lib/db";
import PayContainer from "./payContainer";

export default async function TotalContainer() {
    const cartTotalValue = await prisma.cart.findFirst({
        where: {
            Status: "active",
        },
        include: {
            CartItems: {
                include: {
                    Product: {
                        include: {
                            Variants: true,
                        }
                    }
                }
            }
        }
    });

    const discountValue = cartTotalValue?.CartItems.reduce((totalDiscount: number, item: any) => {
        return totalDiscount + (item.Discount ?? 0);
    }, 0);

    const subtotal = cartTotalValue?.CartItems.reduce((total: number, item: any) => {
        const product = item.Product;
    
        // Find the matching variant using VariantId from CartItem
        const matchedVariant = product.Variants.find((v: any) => v.Id === item.VariantId);
    
        const price =
            product?.Price && product.Price > 0
                ? product.Price
                : matchedVariant?.Price || 0;
    
        return total + price * item.Quantity;
    }, 0);

    const grandtotal = (subtotal ?? 0) - (discountValue ?? 0);

    return (
        <div className="w-full flex flex-col justify-between">
            <div className="text-sm">
                <div className="w-full bg-zinc-200 text-zinc-800 rounded">
                    <div className="px-2 flex justify-between py-2">
                        <p>Subtotal</p>
                        <p>
                            {subtotal?.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                        </p>
                    </div>
                    {
                        discountValue != 0 ? (
                            <div className="px-2 flex justify-between py-2">
                                <p>Discount</p>
                                <p>
                                    {discountValue?.toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    })}
                                </p>
                            </div>
                        ) : (
                            null
                        )
                    }
                </div>
                <div className="font-medium text-lg px-2 flex justify-between py-3">
                    <p>Grand total</p>
                    <p>
                        {grandtotal?.toLocaleString('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </p>
                </div>
            </div>
            <PayContainer />
        </div >
    )
}