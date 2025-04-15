import prisma from "@/lib/db";
import OrderCard from "../components/orderCard";

export const dynamic = "force-dynamic";

export default async function OrderPage({
    searchParams,
}: {
    searchParams?: any;
}) {
    const { product = '', category = '' } = await searchParams || {};

    let categoryId: number | undefined;

    if (category) {
        const found = await prisma.category.findUnique({
            where: {
                Slug: category,
            },
        });

        if (found) {
            categoryId = found.Id;
        }
    }

    const productList = await prisma.product.findMany({
        where: {
            AND: [
                {
                    Name: {
                        contains: product,
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
    );
}