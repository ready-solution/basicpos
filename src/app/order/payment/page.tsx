import prisma from "@/lib/db";
import PaymentMethod from "@/app/components/paymentMethod";
import PaymentButton from "@/app/components/payButton";
import Changes from "@/app/components/changes";

export default async function PaymentPage(props: {
    searchParams?: Promise<{
        method?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const methodQuery = searchParams?.method || "";

    const cart = await prisma.cart.findFirst({
        where: { Status: { contains: "active" } },
        include: {
            CartItems: {
                include: {
                    Product: true,
                    Variant: true
                }
            }
        }
    });

    const discountValue = cart?.CartItems.reduce((total, item) => total + (item.Discount ?? 0), 0) ?? 0;
    const subtotal = cart?.CartItems.reduce((total, item) => {
        const price = item.Product.Price > 0 ? item.Product.Price : item.Variant?.Price || 0;
        return total + (price * item.Quantity);
    }, 0) ?? 0;

    const grandtotal = subtotal - discountValue;

    return (
        <div className="bg-white w-[385px] mx-auto pt-10">
            <div className="flex flex-col items-center pb-10 mt-5 space-y-3 font-mono text-sm text-black">
                <h2 className="text-center font-semibold uppercase text-xs tracking-widest">Order Receipt</h2>

                {cart?.CartItems.map((x, i) => {
                    const price = x.Product.Price > 0 ? x.Product.Price : x.Variant?.Price || 0;
                    const total = price * x.Quantity;

                    return (
                        <div key={i} className="flex flex-col items-center w-full px-6">
                            <div className="flex justify-between w-full">
                                <div className="flex gap-2">
                                    <p>{x.Quantity}x</p>
                                    <p>{x.Product.Name}</p>
                                </div>
                                <p>{total.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0
                                })}</p>
                            </div>

                            {x.Variant && (
                                <div className="w-full text-xs text-gray-600 pl-6">
                                    <p>Size {x.Variant.Size}, {x.Variant.Color}</p>
                                </div>
                            )}

                            {x.Discount && x.Discount > 0 && (
                                <div className="flex justify-between w-full pl-6 text-xs font-medium text-red-600">
                                    <p>Discount</p>
                                    <p>
                                        {x.Discount?.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        })}
                                    </p>
                                </div>
                            )}
                            <div className="border-t border-dashed border-gray-300 w-full my-1" />
                        </div>
                    );
                })}

                <div className="w-full px-6 mt-2 space-y-1 border-t pt-2 text-xs">
                    <div className="flex justify-between w-full">
                        <p>Subtotal</p>
                        <p>{subtotal.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0
                        })}</p>
                    </div>

                    {discountValue > 0 && (
                        <div className="flex justify-between w-full text-red-600 font-medium">
                            <p>Total Discount</p>
                            <p>- {discountValue.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0
                            })}</p>
                        </div>
                    )}

                    <div className="flex justify-between w-full text-base font-bold text-cyan-800 pt-2 border-t">
                        <p>Grand Total</p>
                        <p>{grandtotal.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0
                        })}</p>
                    </div>
                </div>


            </div>
            <div className="bg-zinc-100 w-full">
                <div className="w-full pt-4">
                    <PaymentMethod />
                </div>

                {methodQuery === "CASH" && (
                    <div className="w-full">
                        <Changes total={grandtotal} />
                    </div>
                )}

                <div className="w-full pt-3">
                    <PaymentButton payMethod={methodQuery} />
                </div>
            </div>
        </div>
    );
}