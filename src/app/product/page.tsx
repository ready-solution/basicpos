import prisma from "@/lib/db";
import { addProduct } from "@/actions/actions";
import ExcelUpload from "./components/excelUpload";

export default async function ProductPage() {
    const productList = await prisma.product.findMany();
    const categoryList = await prisma.category.findMany();

    return (
        <div className="bg-green-200 w-full p-5">
            <ExcelUpload />
            <div className="bg-yellow-100 w-[600px] mx-auto">
                <form action={addProduct} className="flex flex-col space-y-2 p-5">
                    <label htmlFor="ProductName" className="block text-xs font-medium text-gray-700">Product Name</label>
                    <input className="bg-white" type="text" name="product" id="ProductName" />

                    <label htmlFor="ProductPrice" className="block text-xs font-medium text-gray-700">Product Price</label>
                    <input className="bg-white" type="number" name="price" id="ProductPrice" />

                    <label htmlFor="ProductStatus" className="block text-xs font-medium text-gray-700">Product Status</label>
                    <select name="status" id="ProductStatus" className="bg-white">
                        <option value="ready">Ready</option>
                        <option value="oos">Out of Stock</option>
                    </select>

                    <label htmlFor="ProductEnabled" className="block text-xs font-medium text-gray-700">Enabled</label>
                    <select name="enabled" id="ProductEnabled" className="bg-white">
                        <option value="true">Enable</option>
                        <option value="false">Hide</option>
                    </select>

                    <label htmlFor="ProductCategory" className="block text-xs font-medium text-gray-700">Product Category</label>
                    <select name="category" id="ProductCategory" className="bg-white">
                        {
                            categoryList.map((x, y) => (
                                <option key={y} value={x.Id}>
                                    {x.Name}
                                </option>
                            ))
                        }
                    </select>

                    <button type="submit" className="bg-green-100 hover:bg-green-200 cursor-pointer">
                        Submit
                    </button>
                </form>

            </div>

            <div className="bg-yellow-100 w-[600px] mx-auto">
                {
                    productList.map((x, y) => (
                        <div key={y}>
                            <p>{x.Name}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}