// ProductPage - Unified layout with consistent design for Product Table
import prisma from "@/lib/db";
import Link from "next/link";
import ProductTable from "../components/productTable";

export default async function ProductPage(props: {
    searchParams?: Promise<{
        product?: string;
        category?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const productQuery = searchParams?.product || "";

    const productList = await prisma.product.findMany({
        where: {
            AND: [
                {
                    Name: {
                        contains: productQuery,
                    },
                    Available: true,
                },
            ],
        },
        include: {
            Variants: true,
        },
    });

    const categoryList = await prisma.category.findMany();
    const categoryMap = categoryList.reduce((map: any, category: any) => {
        map[category.Id] = category.Name;
        return map;
    }, {} as Record<number, string>);

    return (
        <div className="min-h-screen w-full bg-zinc-100 px-6 py-10">
            <div className="mx-auto w-full max-w-[1200px] space-y-6">
                {/* Header Section */}
                <div className="flex flex-wrap justify-between">
                    <h1 className="text-xl font-semibold text-zinc-800">Product Management</h1>
                    <div className="flex gap-2">
                        <Link
                            href="/product/batch"
                            className="rounded bg-zinc-700 px-4 py-2 text-sm text-white shadow hover:bg-zinc-900"
                        >
                            Batch Upload
                        </Link>
                        <Link
                            href="/product/manual"
                            className="rounded bg-zinc-700 px-4 py-2 text-sm text-white shadow hover:bg-zinc-900"
                        >
                            Manual Upload
                        </Link>
                        <Link
                            href="/product/categories"
                            className="rounded bg-zinc-700 px-4 py-2 text-sm text-white shadow hover:bg-zinc-900"
                        >
                            Category List
                        </Link>
                    </div>
                </div>

                {/* Product Table Section */}
                <div className="">
                    <ProductTable productList={productList} categoryMap={categoryMap} />
                </div>
            </div>
        </div>
    );
}
