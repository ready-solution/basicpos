import prisma from "@/lib/db";
import OrderCard from "../components/orderCard";

export default async function OrderPage(props: {
    searchParams?: Promise<{
        product?: string;
        category?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const productQuery = searchParams?.product || '';
    const categoryQuery = searchParams?.category || '';
    let categoryId: number | undefined;

    if (categoryQuery) {
        const category = await prisma.category.findUnique({
            where: {
                Slug: categoryQuery,
            },
        });

        if (category) {
            categoryId = category.Id;
        }
    }

    const productList = await prisma.product.findMany({
        where: {
            AND: [
                {
                    Name: {
                        contains: productQuery,
                    },
                },
                ...(categoryId ? [{ categoryId: categoryId }] : []),
            ],
        },
    });

    const productVariant = await prisma.productVariant.findMany({});
    
    return (
        <div className="w-full flex flex-wrap gap-4">
            {/* {
                productList.map((product, idx) => (
                    <OrderCard id={product.Id} name={product.Name} price={product.Price} key={idx} />
                ))
            } */}
            <OrderCard product={productList} variant={productVariant} />
        </div>
    )
}