"use client";

import { addProduct } from "@/actions/actions";
import { useState } from "react";
import ExcelUpload from "../product/components/excelUpload";
import prisma from "@/lib/db";

interface Category {
    Id: number;
    Name: string;
    Slug: string;
}

export default function AddProduct({ categoryList }: { categoryList: Category[] }) {
    const [isManual, setIsManual] = useState(true);

    // Toggle method to switch between manual input and excel
    const toggleInputMethod = () => {
        setIsManual((prev) => !prev);
    };

    return (
        <div className="">
            {/* Button to toggle between manual input and Excel upload */}
            <div className="flex justify-start mb-6">
                <button
                    onClick={toggleInputMethod}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    {isManual ? "Switch to Excel Upload" : "Switch to Manual Input"}
                </button>
            </div>

            {/* Conditional Rendering: Show Manual Input Form or Excel Upload */}
            {isManual ? (
                <div className="space-y-4 bg-white p-5">
                    <h2 className="text-lg font-semibold text-gray-800">Manual Product Input</h2>
                    <form action={addProduct} className="space-y-3">
                        <div className="flex gap-5">
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

                        <div className="flex gap-5">
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
                                {categoryList.map((category) => (
                                    <option key={category.Id} value={category.Id}>
                                        {category.Name}
                                    </option>
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
            ) : (
                <ExcelUpload categoryList={categoryList} />
            )}
        </div>
    )
}