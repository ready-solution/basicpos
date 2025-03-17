import prisma from "@/lib/db";
import Link from "next/link";
import { addProduct } from "@/actions/actions";
import ExcelUpload from "./components/excelUpload";
import AddProduct from "../components/addProduct";
import ProductTable from "../components/productTable";

export default async function ProductPage(props: {
    searchParams?: Promise<{
        product?: string;
        category?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const productQuery = searchParams?.product || '';

    const productList = await prisma.product.findMany({
        where: {
            AND: [
                {
                    Name: {
                        contains: productQuery,
                    }
                }
            ],
        },
        include: {
            Variants: true
        }
    });

    // const productVariant = await prisma.productVariant.findMany({});
    const categoryList = await prisma.category.findMany();

    const categoryMap = categoryList.reduce((map, category) => {
        map[category.Id] = category.Name;
        return map;
    }, {} as Record<number, string>);

    return (
        <div className="bg-zinc-100 w-full min-h-screen p-5">
            <div className="w-[50vw] mx-auto flex gap-5">
                <Link href="/product/batch" className="bg-zinc-600 p-2 text-white hover:bg-zinc-800 px-4 text-sm">
                    Batch upload
                </Link>
                <Link href="/product/manual" className="bg-zinc-600 p-2 text-white hover:bg-zinc-800 px-4 text-sm">
                    Manual upload
                </Link>
                <Link href={'/product/categories'} className="bg-zinc-600 p-2 text-white hover:bg-zinc-800 px-4 text-sm">
                    Category List
                </Link>
            </div>

            {/* Product List Section */}
            <ProductTable productList={productList} categoryMap={categoryMap} />

        </div>
    );
}