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
        <div className="w-full flex-4 flex bg-amber-100 flex-col justify-between">
            <div>
                <div className="bg-red-100 px-2 flex justify-between">
                    <p>subtotal</p>
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
                        <div className="bg-green-100 px-2 flex justify-between">
                            <p>discount</p>
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
                        <div className="px-2 text-sm">
                            <p>no discount applied</p>
                        </div>
                    )
                }
                <div className="bg-red-100 px-2 flex justify-between pt-5 pb-3">
                    <p>grand total</p>
                    <p className="font-medium">
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