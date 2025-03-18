import Link from "next/link";
import prisma from "@/lib/db";

export default async function PayContainer() {
    const cart = await prisma.cart.findFirst({
        where: {
            Status: "active"
        },
        include: {
            CartItems: true
        }
    });

    const isCartEmpty = !cart?.CartItems || cart.CartItems.length === 0;

    return (
        <Link 
            href={isCartEmpty ? "#" : "/order/payment"} // If cart is empty, disable the link
            className={`p-2 w-full text-center ${isCartEmpty ? 'bg-gray-400 text-gray-300 cursor-not-allowed' : 'cursor-pointer bg-zinc-600 hover:bg-zinc-800 active:bg-green-700 hover:text-white'}`}
        >
            <p className="text-white">Proceed</p>
        </Link>
    );
}
