import prisma from "@/lib/db"
import ClearCartButton from "./clearCartButton"

export default async function ClearCart() {
    const cartId = await prisma.cart.findFirst({
        where: {
            Status: "Active"
        }
    });
    return (
        <div>
            <ClearCartButton id={cartId?.Id ? cartId.Id : "404"} />
        </div>
    )
}