import prisma from "@/lib/db";
import CartCard from "./cartCard";
import { FaCartPlus } from "react-icons/fa6";

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
                    Variant: true // Include variant info
                }
            }
        }
    });

    const cartItems = cart?.CartItems;

    return (
        <div className="w-full flex-1 pb-5">
            {(cartItems?.length ?? 0) > 0 ? (
                <div className="h-full max-h-[60vh] rounded-md space-y-2 p-2 overflow-y-auto overflow-x-hidden scrollbar-hidden">
                    {cart?.CartItems.map((item, idx) => (
                        <CartCard
                            key={idx}
                            id={item.Id}
                            name={item.Product.Name}
                            price={item.Price}
                            qty={item.Quantity}
                            discount={item.Discount ?? 0}
                            size={item.Variant?.Size ?? null}  // Pass variant size
                            color={item.Variant?.Color ?? null} // Pass variant color
                        />
                    ))}
                </div>
            ) : (
                <div className="w-full rounded-md max-h-[60vh] h-full flex flex-col justify-center items-center">
                    <FaCartPlus size={40} color="grey" />
                    {/* <p className="text-gray-500">add an item</p> */}
                </div>
            )}
        </div>
    );
}
