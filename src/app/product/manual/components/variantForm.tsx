"use client";

import { div } from "framer-motion/client";
import { useState } from "react";

type product = {
    Id: number;
    Name: string;
    Slug: string;
    Price: number;
    Enabled: boolean;
    Stock: number;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
}

type products = {
    products: product[];
}
export default function VariantForm({ products }: products) {
    const [varOpt, setVarOpt] = useState(1);
    const handleAddOpt = () => {
        setVarOpt(varOpt + 1)
    };

    return (
        <div className="space-y-4 p-5 w-[480px] mt-5 mb-10">
            <h2 className="text-lg font-semibold text-gray-800">Add Variant</h2>

            <form action={''} className="space-y-3">
                <div className="w-full">
                    <label htmlFor="ProductCategory" className="block text-xs font-medium text-gray-700 mb-2">Product Category</label>
                    <select
                        name="product"
                        id="productOption"
                        className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        required
                    >
                        {products.map((product) => (
                            <option key={product.Id} value={product.Id}>
                                {product.Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-5">
                    <div className="w-full">
                        <label htmlFor="ProductColor" className="block text-xs font-medium text-gray-700 mb-2">Color</label>
                        <input
                            className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                            type="text"
                            name="color"
                            id="ProductColor"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="ProductSize" className="block text-xs font-medium text-gray-700 mb-2">Size</label>
                        <input
                            className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                            type="number"
                            name="size"
                            id="ProductSize"
                            required
                        />
                    </div>
                </div>
                <div className="w-full" >
                    <label htmlFor="ProductStock" className="block text-xs font-medium text-gray-700 mb-2">Stock</label>
                    <input
                        className="w-full bg-white px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        type="number"
                        name="size"
                        id="ProductStock"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full mt-2 py-2 bg-zinc-600 text-white hover:bg-zinc-800 cursor-pointer focus:outline-none text-sm"
                >
                    Add Variant
                </button>
            </form>
        </div>
    )
}