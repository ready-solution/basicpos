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
                    Enabled: true,
                    Available: true,
                },
                ...(categoryId ? [{ categoryId: categoryId }] : []),
            ],
        },
        include: {
            Variants: true,
        },
    });

    const productVariant = await prisma.productVariant.findMany({});
    
    return (
        <div className="w-full flex flex-wrap gap-4">
            <OrderCard product={productList} variant={productVariant} />
        </div>
    )
}