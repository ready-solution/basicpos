import prisma from "@/lib/db";
import { confirmPayment } from "@/actions/actions";
import ConfirmPaymentButton from "@/app/components/confirmPaymentButton";

export default async function PaymentPage() {
    const order = await prisma.order.findFirst({
        where: {
            Status: "process"
        },
        include: {
            OrderDetails: true
        }
    });

    const orderDetails = await prisma.orderDetail.findMany({
        where: {
            OrderId: order?.Id
        }
    });

    const handleConfirmPayment = (id: string) => {
        confirmPayment(id);
    }

    return (
        <div className="w-full flex flex-col flex-wrap bg-white">
            <div className="py-5">
                <h3 className="text-center">{order?.PaymentType} PAYMENT</h3>
            </div>
            <div className="flex flex-col">
                {
                    orderDetails.map((x, y) => (
                        <div key={y} className="flex flex-col items-center">
                            <div className="flex justify-between w-[30%]">
                                <p>{x.Name}</p>
                                <p>{x.Price}</p>
                            </div>
                            {
                                x.Discount > 0 && (
                                    <div className="flex justify-between w-[30%]">
                                        <p className="pl-8 font-medium text-red-500">discount</p>
                                        <p className="font-medium text-red-500">{x.Discount}</p>
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
                <div className="w-[30%] mx-auto mt-5 border-t-1 flex flex-col items-center">
                    <div className="w-full flex justify-between">
                        <p>Subtotal</p>
                        <p>{order?.SubTotal}</p>
                    </div>
                    {
                        order?.DiscItemTotal && (
                            <div className="flex justify-between w-full">
                                <p>Total Discount</p>
                                <p>{order?.DiscItemTotal}</p>
                            </div>
                        )
                    }
                    <div className="flex justify-between w-full">
                        <p>Grand Total</p>
                        <p>{order?.Total}</p>
                    </div>
                </div>
                <ConfirmPaymentButton id={order?.Id ? order.Id : "not-found"} />
            </div>

        </div>
    )
}