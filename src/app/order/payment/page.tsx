import prisma from "@/lib/db";
import { confirmPayment } from "@/actions/actions";
import PaymentMethod from "@/app/components/paymentMethod";
import ConfirmPaymentButton from "@/app/components/confirmPaymentButton";
import PaymentButton from "@/app/components/payButton";
import Changes from "@/app/components/changes";

export default async function PaymentPage(props: {
    searchParams?: Promise<{
        method?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const methodQuery = searchParams?.method || '';

    const cart = await prisma.cart.findFirst({
        where: {
            Status: {
                contains: "active"
            }
        },
        include: {
            CartItems: {
                include: {
                    Product: true,
                    Variant: true // Include variant info
                }
            }
        }
    });

    const discountValue = cart?.CartItems.reduce((totalDiscount, item) => {
        return totalDiscount + (item.Discount ?? 0);
    }, 0);

    const subtotal = cart?.CartItems.reduce((total, item) => {
        return total + (item.Product.Price * item.Quantity);
    }, 0);

    const grandtotal = (subtotal ?? 0) - (discountValue ?? 0);


    return (
        <div className="w-full flex flex-col space-y-5 bg-white">
            {/*  */}
            <PaymentMethod />
            <div className="py-5">
                <h3 className="text-center">{methodQuery} PAYMENT</h3>
            </div>
            <div className="flex flex-col">
                {
                    cart?.CartItems.map((x, y) => (
                        <div key={y} className="flex flex-col items-center">
                            <div className="flex justify-between w-[30%]">
                                <p>{x.Product.Name}</p>
                                <p>{x.Price}</p>
                            </div>
                            {
                                x.Discount ? (
                                    <div className="flex justify-between w-[30%]">
                                        <p className="pl-8 font-medium text-red-500">discount</p>
                                        <p className="font-medium text-red-500">{x.Discount}</p>
                                    </div>
                                ) : null
                            }
                            {
                                x.Variant ? (
                                    <div className="flex flex-col w-[30%]">
                                        <p className="pl-8 font-medium text-blue-200">Size {x.Variant?.Size}, {x.Variant?.Color}</p>
                                    </div>
                                ) : null
                            }
                        </div>
                    ))
                }
                <div className="w-[30%] mx-auto mt-5 border-t-1 flex flex-col items-center">
                    <div className="w-full flex justify-between">
                        <p>Subtotal</p>
                        <p>{subtotal}</p>
                    </div>
                    {
                        discountValue && (
                            <div className="flex justify-between w-full">
                                <p>Total Discount</p>
                                <p>{discountValue}</p>
                            </div>
                        )
                    }
                    <div className="flex justify-between w-full">
                        <p>Grand Total</p>
                        <p>{grandtotal}</p>
                    </div>
                </div>
                {/* <ConfirmPaymentButton id={order?.Id ? order.Id : "not-found"} /> */}
            </div>
            <div className="bg-gray-100 p-5">
                {
                    methodQuery == "CASH" ? (
                        <Changes total={grandtotal} />
                    ) : null
                }
            </div>
            <PaymentButton payMethod={methodQuery} />
        </div>
    )
}