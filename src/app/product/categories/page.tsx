import prisma from "@/lib/db";
import { addCategory } from "@/actions/actions";

export default async function CategoriesPage() {
    const categoryList = await prisma.category.findMany({
        include: {
            products: true,
        },
    });

    return (
        <div className="w-full bg-zinc-100">
            {/* Input to add category */}
            <div className="w-full text-center mt-5 mb-4">
                <form action={addCategory} className="flex justify-center items-center gap-2">
                    <input
                        type="text"
                        name="category"
                        placeholder="Enter category name"
                        className="px-4 py-2 border rounded-md"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Add Category
                    </button>
                </form>
            </div>

            {/* Table to display categories */}
            <table className="w-[280px] mx-auto divide-y-2 divide-gray-200 bg-white text-sm mt-5 shadow-md">
                <thead className="ltr:text-left rtl:text-right">
                    <tr>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Category</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Product Count</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {
                        categoryList.map((x) => (
                            <tr key={x.Id}>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{x.Id}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.Name}</td>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{x.products.length}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}
