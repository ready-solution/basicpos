import prisma from "@/lib/db";
import CartCard from "./cartCard";
import Image from "next/image";

export default async function CartContainer() {
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
                }
            }
        }
    });

    const cartItems = cart?.CartItems;

    return (
        <div className="w-full flex-9">
            {
                (cartItems?.length?? 0) > 0 ? (
                    <div className="max-h-[430px] p-2 space-y-2 overflow-y-auto overflow-x-hidden">
                        {
                            cart?.CartItems.map((item, idx) => (
                                    <CartCard key={idx} id={item.Id} name={item.Product.Name} price={item.Price} qty={item.Quantity} discount={item.Discount ?? 0} />
                            ))
                        }
                    </div>
                ) : (
                    <div className="w-full bg-pink-100 h-full flex justify-center items-center">
                        <p>add an item</p>
                    </div>
                )
            }
        </div >
    )
}