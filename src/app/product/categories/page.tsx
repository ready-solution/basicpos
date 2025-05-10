import prisma from "@/lib/db";
import { addCategory } from "@/actions/actions";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { CategoryBatchUpload } from "../components/categoryBatchUpload";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const categoryList = await prisma.category.findMany({
        include: {
            products: {
                where: {
                    Available: true,
                },
            },
        },
    });

    return (
        <div className="w-full bg-zinc-100">
            <div className="max-w-2xl mx-auto min-h-[90vh] p-6">
                <div className="flex items-center mb-6">
                    <Link href="/product" className="flex items-center text-sm text-zinc-600 hover:text-zinc-800">
                        <BiArrowBack className="mr-1" /> Back
                    </Link>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">Manage Categories</h2>

                {/* Add Category Form */}
                <form action={addCategory} className="flex gap-3 mb-6">
                    <input
                        type="text"
                        name="category"
                        placeholder="Enter category name"
                        className="flex-grow px-4 py-2 border bg-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 text-sm bg-zinc-700 hover:bg-zinc-800 text-white rounded cursor-pointer"
                    >
                        Add Category
                    </button>
                </form>

                {/* Category Table */}
                <div className="overflow-x-auto border rounded shadow bg-white">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-zinc-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 font-medium">ID</th>
                                <th className="px-4 py-2 font-medium">Category</th>
                                <th className="px-4 py-2 font-medium text-center">Products</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categoryList.map((x: any) => (
                                <tr key={x.Id}>
                                    <td className="px-4 py-2 text-gray-900 font-medium">{x.Id}</td>
                                    <td className="px-4 py-2 text-gray-700">{x.Name}</td>
                                    <td className="px-4 py-2 text-center text-gray-900">{x.products.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <CategoryBatchUpload />
            </div>
        </div>
    );
}
