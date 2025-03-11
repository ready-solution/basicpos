import { Params } from "next/dist/server/request/params";
import prisma from "@/lib/db";
import { addToCart } from "@/actions/actions";

export default async function OrderIdPage({ params }: { params: Params }) {
    const { id } = await params;
    
    // Fetch product details
    const productList = await prisma.product.findUnique({
        where: { Id: Number(id) }
    });

    // Fetch product variants
    const productVariants = await prisma.productVariant.findMany({
        where: { ProductId: Number(id) }
    });

    // Extract unique colors and sizes, ensuring non-null values
    const uniqueColors = [...new Set(productVariants.map(v => v.Color ?? ""))].filter(c => c !== "");
    const uniqueSizes = [...new Set(productVariants.map(v => v.Size ?? ""))].filter(s => s !== "");

    return (
        <div className="w-[50%] mx-auto flex flex-col gap-4 bg-sky-300 p-4 rounded-md">

            {/* Product Info */}
            <div className="flex justify-between">
                <h1 className="text-lg font-bold">{productList?.Name}</h1>
                <p className="text-lg">Rp {productList?.Price.toLocaleString('id-ID')}</p>
            </div>

            {/* Add to Cart Form */}
            <form action={addToCart} className="flex flex-col gap-2">
                <input type="hidden" name="productId" value={id} readOnly />
                <input type="hidden" name="quantity" value={1} readOnly />

                {/* Size Selection */}
                {uniqueSizes.length > 0 && (
                    <div>
                        <label className="block font-semibold">Size:</label>
                        <select name="size" className="w-full p-2 border rounded-md">
                            {uniqueSizes.map((size, index) => (
                                <option key={index} value={size} defaultValue={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Color Selection */}
                {uniqueColors.length > 0 && (
                    <div>
                        <label className="block font-semibold">Color:</label>
                        <select name="color" className="w-full p-2 border rounded-md">
                            {uniqueColors.map((color, index) => (
                                <option key={index} value={color} defaultValue={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Submit Button */}
                <button className="border w-full rounded-sm p-2 text-sm bg-teal-50 hover:bg-amber-100 active:bg-amber-200 cursor-pointer" type="submit">
                    Add to Cart
                </button>
            </form>
        </div>
    );
}
