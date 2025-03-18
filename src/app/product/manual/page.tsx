import { addProduct } from "@/actions/actions";
import prisma from "@/lib/db";
import Link from "next/link";
import { div } from "framer-motion/client";
import VariantForm from "./components/variantForm";
import { BiArrowBack } from "react-icons/bi";


export default async function ManualUploadPage() {
    const categoryList = await prisma.category.findMany();
    const productList = await prisma.product.findMany();

    return (
        <div className="w-full max-h-[100vh] overflow-x-auto bg-zinc-100 flex flex-col items-center">
            <div className="w-full px-5 mt-10">
                <Link href='/product' className='flex items-center space-x-1 focus:outline-none text-zinc-600 hover:text-zinc-800 hover:font-medium'>
                    <BiArrowBack className='text-lg' />
                    <span className='text-sm p-0'>Back</span>
                </Link>
            </div>
            <div className="space-y-4 p-5 w-[480px]">
                <h2 className="text-lg font-semibold text-gray-800">Add Product</h2>
                <form action={addProduct} className="space-y-3">
                    <div className="flex gap-5">
                        <div className="w-full">
                            <label htmlFor="ProductName" className="block text-xs font-medium text-gray-700 mb-2">Product Name</label>
                            <input
                                className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                type="text"
                                name="product"
                                id="ProductName"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="ProductPrice" className="block text-xs font-medium text-gray-700 mb-2">Product Price (IDR)</label>
                            <input
                                className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                type="number"
                                name="price"
                                id="ProductPrice"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="w-full">
                            <label htmlFor="ProductCategory" className="block text-xs font-medium text-gray-700 mb-2">Product Category</label>
                            <select
                                name="category"
                                id="ProductCategory"
                                className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                required
                            >
                                {categoryList.map((category) => (
                                    <option key={category.Id} value={category.Id}>
                                        {category.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full">
                            <label htmlFor="ProductEnabled" className="block text-xs font-medium text-gray-700 mb-2">Enabled</label>
                            <select
                                name="enabled"
                                id="ProductEnabled"
                                className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                required
                            >
                                <option value="true">Enable</option>
                                <option value="false">Hide</option>
                            </select>
                        </div>
                    </div>


                    <div className="w-full">
                        <label htmlFor="ProductStock" className="block text-xs font-medium text-gray-700 mb-2">Product Stock</label>
                        <input
                            className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                            type="number"
                            name="stock"
                            id="ProductStock"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 py-2 bg-zinc-600 text-white hover:bg-zinc-800 cursor-pointer focus:outline-none text-sm"
                    >
                        Add Product
                    </button>
                </form>
            </div>

            <VariantForm products={productList} />
        </div>
    )
}