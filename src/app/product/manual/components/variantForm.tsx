"use client";

import { useState } from "react";

type Product = {
    Id: number;
    Name: string;
    Slug: string;
    Price: number;
    Enabled: boolean;
    Stock: number;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
};

type VariantFormProps = {
    products: Product[];
};

export default function VariantForm({ products }: VariantFormProps) {
    const [varOpt, setVarOpt] = useState(1);

    const handleAddOpt = () => {
        setVarOpt(varOpt + 1);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-10">
            <div className="bg-white shadow-sm border border-gray-200 rounded p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Variant</h2>

                <form action={""} className="space-y-5">
                    <div>
                        <label htmlFor="productOption" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <select
                            name="product"
                            id="productOption"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-zinc-500"
                            required
                        >
                            {products.map((product) => (
                                <option key={product.Id} value={product.Id}>
                                    {product.Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="ProductColor" className="block text-sm font-medium text-gray-700 mb-1">
                                Color
                            </label>
                            <input
                                type="text"
                                name="color"
                                id="ProductColor"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="ProductSize" className="block text-sm font-medium text-gray-700 mb-1">
                                Size
                            </label>
                            <input
                                type="text"
                                name="size"
                                id="ProductSize"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-zinc-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="ProductStock" className="block text-sm font-medium text-gray-700 mb-1">
                            Variant Stock
                        </label>
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
                        Add Variant
                    </button>
                </form>
            </div>
        </div>
    );
}
