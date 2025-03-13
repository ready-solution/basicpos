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
        <div className="w-full flex flex-col space-y-5 mt-5 bg-white">
            {/*  */}

            <div className="font-medium">
                <h2 className="text-center">Order Detail's</h2>
            </div>
            <div className="flex flex-col text-sm">
                {
                    cart?.CartItems.map((x, y) => (
                        <div key={y} className="flex flex-col items-center">
                            <div className="flex justify-between w-[30%]">
                                <div className="flex space-x-3">
                                    <p>{x.Quantity}x</p>
                                    <p>{x.Product.Name}</p>
                                </div>
                                <p>
                                    {(x.Price * x.Quantity).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            </div>
                            {
                                x.Variant ? (
                                    <div className="flex flex-col text-xs w-[30%]">
                                        <p className="pl-7">Size {x.Variant?.Size}, {x.Variant?.Color}</p>
                                    </div>
                                ) : null
                            }
                            {
                                x.Discount ? (
                                    <div className="flex justify-end w-[30%] py-1 text-xs font-medium">
                                        <p >-</p>
                                        <p >
                                            {(x.Discount).toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}
                                        </p>
                                    </div>
                                ) : null
                            }
                        </div>
                    ))
                }
                <div className="w-[30%] mx-auto mt-5 border-t-1 pt-2 flex flex-col items-center">
                    <div className="w-full flex justify-between">
                        <p>Subtotal</p>
                        <p>
                            {(subtotal ?? "00").toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </p>
                    </div>
                    {
                        discountValue && (
                            <div className="flex justify-between w-full">
                                <p>Total Discount</p>
                                <p>
                                    - {(discountValue).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            </div>
                        )
                    }
                    <div className="flex justify-between w-full mt-5 text-lg font-medium text-cyan-800">
                        <p>Grand Total</p>
                        <p>
                            {(grandtotal ?? "00").toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </p>
                    </div>
                </div>
                {/* <ConfirmPaymentButton id={order?.Id ? order.Id : "not-found"} /> */}
            </div>
            <PaymentMethod />
            <div className="py-5">
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