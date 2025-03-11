import prisma from "@/lib/db";
import Link from "next/link";
import CategoryList from "./categoryList";

export default async function CatCont() {
    const categories = await prisma.category.findMany();

    return (
        <div className="overflow-x-auto">

            <div className="border-b border-gray-200">
                {/* <nav className="flex flex-wrap gap-6 w-full">
                    <Link
                        href='/order'
                        className="shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        All
                    </Link>
                    {
                        categories.map((cat, idx) => (
                            <Link
                                href={`/order/${cat.Id}`}
                                key={idx}
                                className="shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                {cat.Name}
                            </Link>
                        ))
                    }
                </nav> */}
                <CategoryList categories={categories} />
            </div>
        </div>
    )
}
