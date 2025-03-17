// ProductDetailPage.tsx - Server Component
import prisma from "@/lib/db";
import { Params } from "next/dist/server/request/params";
import ProductDetailClient from "@/app/components/productDetailClient";
import CategorySelect from "../components/categorySelect";

export default async function ProductDetailPage({ params }: { params: Params }) {
    const { slug } = await params;

    // Fetch product details, including its variants
    const productDetail = await prisma.product.findUnique({
        where: {
            Slug: slug as string,
        },
        include: {
            Variants: true,
        },
    });

    const category = await prisma.category.findMany();

    return (
        <div className="w-full p-5 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white px-6 py-8 border">
                <h1 className="text-xl font-semibold text-gray-800">{productDetail?.Name}</h1>
                <CategorySelect
                    categories={category}
                    defaultValue={productDetail?.categoryId}
                />
                {/* Pass data to the client component */}
                <ProductDetailClient variants={productDetail?.Variants || []} />
            </div>
        </div>
    );
}
