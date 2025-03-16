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
    // const categoryQuery = searchParams?.category || '';
    // let categoryId: number | undefined;

    // if (categoryQuery) {
    //     const categoryList = await prisma.category.findUnique({
    //         where: {
    //             Slug: categoryQuery,
    //         },
    //     });

    //     if (categoryList) {
    //         categoryId = categoryList.Id;
    //     }
    // }

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
    });

    const productVariant = await prisma.productVariant.findMany({});

    // const productList = await prisma.product.findMany();
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
            {/* <AddProduct categoryList={categoryList} /> */}
            {/* <div className="flex justify-between gap-10">
                <ExcelUpload />

                <div className="bg-white w-full shadow-md p-5 space-y-6 max-h-[500px]">
                    <h2 className="text-md font-semibold text-gray-800">New Product</h2>
                    <form action={addProduct} className="space-y-3">
                        <div className="flex justify-between space-x-5">
                            <div className="w-full">
                                <label htmlFor="ProductName" className="block text-xs font-medium text-gray-700 mb-2">Product Name</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                    type="text"
                                    name="product"
                                    id="ProductName"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label htmlFor="ProductPrice" className="block text-xs font-medium text-gray-700 mb-2">Product Price (IDR)</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                    type="number"
                                    name="price"
                                    id="ProductPrice"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-between space-x-5">
                            <div className="w-full">
                                <label htmlFor="ProductStatus" className="block text-xs font-medium text-gray-700 mb-2">Product Status</label>
                                <select
                                    name="status"
                                    id="ProductStatus"
                                    className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                    required
                                >
                                    <option value="ready">Ready</option>
                                    <option value="oos">Out of Stock</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label htmlFor="ProductEnabled" className="block text-xs font-medium text-gray-700 mb-2">Enabled</label>
                                <select
                                    name="enabled"
                                    id="ProductEnabled"
                                    className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                    required
                                >
                                    <option value="true">Enable</option>
                                    <option value="false">Hide</option>
                                </select>
                            </div>
                        </div>


                        <div>
                            <label htmlFor="ProductCategory" className="block text-xs font-medium text-gray-700 mb-2">Product Category</label>
                            <select
                                name="category"
                                id="ProductCategory"
                                className="w-full px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                required
                            >
                                {categoryList.map((x, y) => (
                                    <option key={y} value={x.Id}>{x.Name}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-teal-500 text-white rounded-md shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                            Add Product
                        </button>
                    </form>
                </div>
            </div> */}



            {/* Product List Section */}
            <ProductTable productList={productList} categoryMap={categoryMap} />

        </div>
    );
}
