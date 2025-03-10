import prisma from "@/lib/db";
import OrderCard from "../components/orderCard";

export default async function OrderPage(props: {
    searchParams?: Promise<{
        product?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.product || '';
    const productList = await prisma.product.findMany({
        where: {
            Name: {
                contains: query,
            },
        },
    });

    return (
        <div className="w-full flex flex-wrap gap-4">
            {
                productList.map((product, idx) => (
                    <OrderCard id={product.Id} name={product.Name} price={product.Price} key={idx} />
                ))
            }
        </div>
    )
}