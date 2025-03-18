// ProductDetailPage.tsx - Server Component
import prisma from "@/lib/db";
import { Params } from "next/dist/server/request/params";
import ProductDetailClient from "@/app/components/productDetailClient";
import CategorySelect from "../components/categorySelect";
import StockChangeInput from "../components/stockChange";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

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
            <Link href='/product' className='flex mt-4 items-center space-x-1 focus:outline-none text-zinc-600 hover:text-zinc-800 hover:font-medium'>
                <BiArrowBack className='text-lg' />
                <span className='text-sm p-0'>Back</span>
            </Link>
            <div className="max-w-4xl mx-auto bg-white px-6 py-8 border">
                <h1 className="text-xl font-semibold text-gray-800">{productDetail?.Name}</h1>
                <CategorySelect
                    categories={category}
                    defaultValue={productDetail?.categoryId}
                />
                {/* Conditionally render based on variants */}
                {productDetail && productDetail.Variants.length === 0 && (
                    <StockChangeInput product={productDetail} />
                )}

                {productDetail && productDetail.Variants.length > 0 && (
                    <ProductDetailClient variants={productDetail?.Variants || []} />
                )}
            </div>
        </div>
    );
}
