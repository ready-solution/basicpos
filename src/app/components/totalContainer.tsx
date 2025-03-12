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
                    Product: true,
                }
            }
        }
    });

    const discountValue = cartTotalValue?.CartItems.reduce((totalDiscount, item) => {
        return totalDiscount + (item.Discount ?? 0);
    }, 0);

    const subtotal = cartTotalValue?.CartItems.reduce((total, item) => {
        return total + (item.Product.Price * item.Quantity);
    }, 0);

    const grandtotal = (subtotal ?? 0) - (discountValue ?? 0);

    return (
        <div className="w-full flex-4 flex flex-col justify-between">
            <div className="text-sm">
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
                        <div className="px-2 flex justify-between">
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
                <div className="font-medium text-lg px-2 flex justify-between py-5">
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