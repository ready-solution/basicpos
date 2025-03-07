import { Params } from "next/dist/server/request/params";
import OrderCard from "../../components/orderCard";
import prisma from "@/lib/db";

export default async function OrderIdPage({ params }: { params: Params }) {
    const { id } = await params;
    const productList = await prisma.product.findMany({
        where: {
            categoryId: Number(id),
        }
    })
    return (
        // <div className="w-full min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
        <div className="w-full flex flex-wrap gap-4">
            {
                productList.map((product, idx) => (
                    <OrderCard id={product.Id} name={product.Name} price={product.Price} key={idx} />
                ))
            }
        </div>
    )
}