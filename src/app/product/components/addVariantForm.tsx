"use client";

import { useState } from "react";
import { addVariants } from "@/actions/actions";

interface SizeInput {
    size: string;
    price: number;
    stock: number;
}

interface ColorVariant {
    color: string;
    sizes: SizeInput[];
}

export default function AddVariantForm({ productId }: { productId: number }) {
    const [variants, setVariants] = useState<ColorVariant[]>([]);
    const [newColor, setNewColor] = useState("");

    const addColor = () => {
        if (!newColor.trim()) return;
        setVariants([...variants, { color: newColor.trim(), sizes: [] }]);
        setNewColor("");
    };

    const addSize = (colorIndex: number) => {
        const newVariants = [...variants];
        newVariants[colorIndex].sizes.push({ size: "", price: 0, stock: 0 });
        setVariants(newVariants);
    };

    const updateSizeField = (
        colorIndex: number,
        sizeIndex: number,
        field: keyof SizeInput,
        value: string
    ) => {
        const newVariants = [...variants];
        if (field === "size") {
            newVariants[colorIndex].sizes[sizeIndex][field] = value;
        } else {
            newVariants[colorIndex].sizes[sizeIndex][field] = parseFloat(value);
        }
        setVariants(newVariants);
    };

    const handleSubmit = async (formData: FormData) => {
        const flatVariants = variants.flatMap((variant) =>
            variant.sizes.map((s) => ({
                Color: variant.color,
                Size: s.size,
                Price: s.price,
                Stock: s.stock,
            }))
        );

        formData.set("productId", String(productId));
        formData.set("variants", JSON.stringify(flatVariants));

        await addVariants(formData);
    };

    const removeSize = (colorIndex: number, sizeIndex: number) => {
        const newVariants = [...variants];
        newVariants[colorIndex].sizes.splice(sizeIndex, 1);
        setVariants(newVariants);
    };

    const removeColor = (colorIndex: number) => {
        const newVariants = [...variants];
        newVariants.splice(colorIndex, 1);
        setVariants(newVariants);
    };

    return (
        <form
            action={handleSubmit}
            className="space-y-6 mt-6"
            onKeyDown={(e) => {
                if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
                    e.preventDefault();
                }
            }}
        >
            <h2 className="text-lg font-semibold text-gray-800">Add Product Variants</h2>

            {/* Add new color */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Enter color (e.g., Red)"
                    className="border px-2 py-1 rounded text-sm w-40"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                />
                <button
                    type="button"
                    onClick={addColor}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    Add Color
                </button>
            </div>

            {/* Variant list */}
            {variants.map((variant, colorIndex) => (
                <div key={colorIndex} className="bg-gray-100 p-4 rounded border border-gray-200 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-semibold text-gray-800">Color: {variant.color}</h3>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => addSize(colorIndex)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                + Add Size
                            </button>
                            <button
                                type="button"
                                onClick={() => removeColor(colorIndex)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Remove Color
                            </button>
                        </div>
                    </div>

                    {variant.sizes.map((size, sizeIndex) => (
                        <div
                            key={sizeIndex}
                            className="grid grid-cols-4 gap-4 items-end mb-4 p-3 bg-white border border-gray-300 rounded"
                        >
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-600 mb-1">Size</label>
                                <input
                                    type="text"
                                    placeholder="e.g., M"
                                    className="border px-2 py-1 rounded text-sm"
                                    value={size.size}
                                    onChange={(e) =>
                                        updateSizeField(colorIndex, sizeIndex, "size", e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-600 mb-1">Price</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 300000"
                                    className="border px-2 py-1 rounded text-sm"
                                    value={size.price}
                                    onChange={(e) =>
                                        updateSizeField(colorIndex, sizeIndex, "price", e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-600 mb-1">Stock</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 50"
                                    className="border px-2 py-1 rounded text-sm"
                                    value={size.stock}
                                    onChange={(e) =>
                                        updateSizeField(colorIndex, sizeIndex, "stock", e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex justify-start mt-5">
                                <button
                                    type="button"
                                    onClick={() => removeSize(colorIndex, sizeIndex)}
                                    className="text-xs text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* Submit */}
            {variants.length > 0 && (
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Submit Variants
                </button>
            )}
        </form>
    );
}
