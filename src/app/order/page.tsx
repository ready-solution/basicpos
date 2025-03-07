import prisma from "@/lib/db";
import OrderCard from "../components/orderCard";

export default async function OrderPage() {
    const productList = await prisma.product.findMany();

    return (
        // <div className="w-full min-h-screen grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-max">
        <div className="w-full flex flex-wrap gap-4">
            {
                productList.map((product, idx) => (
                    <OrderCard id={product.Id} name={product.Name} price={product.Price} key={idx} />
                ))
            }
        </div>
    )
}