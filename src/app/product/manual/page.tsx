import { addProduct } from "@/actions/actions";
import prisma from "@/lib/db";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import VariantForm from "./components/variantForm";

export default async function ManualUploadPage() {
    const categoryList = await prisma.category.findMany();
    const productList = await prisma.product.findMany({ where: { Available: true } });

    return (
        <div className="w-full max-h-screen overflow-y-auto bg-zinc-100 py-10 px-4 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <Link href="/product" className="flex items-center text-zinc-600 hover:text-zinc-800 mb-6">
                    <BiArrowBack className="mr-1 text-lg" />
                    <span className="text-sm">Back</span>
                </Link>

                <div className="bg-white shadow-sm border border-gray-200 rounded p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Product</h2>

                    <form action={addProduct} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="ProductName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="product"
                                    id="ProductName"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-zinc-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="ProductPrice" className="block text-sm font-medium text-gray-700 mb-1">Product Price (IDR)</label>
                                <input
                                    type="number"
                                    name="price"
                                    id="ProductPrice"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-zinc-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="ProductCategory" className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                                <select
                                    name="category"
                                    id="ProductCategory"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-zinc-500"
                                >
                                    {categoryList.map((category) => (
                                        <option key={category.Id} value={category.Id}>
                                            {category.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="ProductEnabled" className="block text-sm font-medium text-gray-700 mb-1">Enabled</label>
                                <select
                                    name="enabled"
                                    id="ProductEnabled"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-zinc-500"
                                >
                                    <option value="true">Enable</option>
                                    <option value="false">Hide</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="ProductStock" className="block text-sm font-medium text-gray-700 mb-1">Product Stock</label>
                            <input
                                type="number"
                                name="stock"
                                id="ProductStock"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-2 py-2 bg-zinc-700 text-white text-sm rounded hover:bg-zinc-800 transition"
                        >
                            Add Product
                        </button>
                    </form>
                </div>

                {/* <VariantForm products={productList} /> */}
            </div>
        </div>
    );
}
