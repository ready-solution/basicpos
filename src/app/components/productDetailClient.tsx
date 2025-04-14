"use client";

import { useState } from "react";
import { addVariants, updateVariant } from "@/actions/actions";
import { objectToFormData } from "./helper/utils";

interface Variant {
    Id: number;
    ProductId: number;
    Size: string | null;
    Color: string | null;
    Stock: number;
    Price: number;
}

interface ProductDetailClientProps {
    variants: Variant[];
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ variants }) => {
    const colorVariants = [...new Set(variants.filter(v => v.Color).map(v => v.Color))];

    const [selectedColor, setSelectedColor] = useState<string>(colorVariants[0] || "");
    const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
    const [showAddSizeForm, setShowAddSizeForm] = useState(false);
    const [showAddColorForm, setShowAddColorForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddingColor, setIsAddingColor] = useState(false);

    const handleColorClick = (color: string) => {
        setSelectedColor(color);
        setShowAddSizeForm(false);
    };

    const handleAddSize = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const newVariant = {
            ProductId: variants[0].ProductId,
            Color: selectedColor,
            Size: formData.get("size") as string,
            Price: parseFloat(formData.get("price") as string),
            Stock: parseInt(formData.get("stock") as string),
        };

        try {
            await addVariants(objectToFormData({
                productId: newVariant.ProductId,
                variants: [newVariant],
            }));
            location.reload();
        } catch (err) {
            alert("Failed to add size.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddColor = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsAddingColor(true);

        const formData = new FormData(e.currentTarget);
        const newVariant = {
            ProductId: variants[0].ProductId,
            Color: formData.get("color") as string,
            Size: formData.get("size") as string,
            Price: parseFloat(formData.get("price") as string),
            Stock: parseInt(formData.get("stock") as string),
        };

        try {
            await addVariants(objectToFormData({
                productId: newVariant.ProductId,
                variants: [newVariant],
            }));
            location.reload();
        } catch (err) {
            alert("Failed to add color.");
        } finally {
            setIsAddingColor(false);
        }
    };

    const handleEditVariant = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await updateVariant(formData);
            setEditingVariant(null);
            // location.reload();
        } catch (err) {
            alert("Failed to update variant.");
        }
    };

    return (
        <div className="space-y-3">
            <h2 className="text-md font-medium text-gray-600">Available Variants</h2>

            {/* Color Buttons */}
            <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Colors</h3>
                <div className="flex space-x-2 mt-2 flex-wrap">
                    {colorVariants.map((color, index) => (
                        <button
                            key={index}
                            onClick={() => handleColorClick(color!)}
                            className={`px-4 py-2 text-xs font-semibold transition-colors rounded ${selectedColor === color
                                ? "bg-zinc-800 text-white border-2 border-gray-800"
                                : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {color}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowAddColorForm(true)}
                        className="px-4 py-2 text-xs font-semibold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded"
                    >
                        + Add Color
                    </button>
                </div>

                {/* Add Color Form */}
                {showAddColorForm && (
                    <form
                        onSubmit={handleAddColor}
                        className="grid grid-cols-4 gap-4 mt-4 bg-gray-50 p-4 rounded border w-full max-w-4xl"
                    >
                        <div>
                            <label className="block text-xs text-gray-500">Color</label>
                            <input name="color" type="text" required className="w-full border px-2 py-1 rounded" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">First Size</label>
                            <input name="size" type="text" required className="w-full border px-2 py-1 rounded" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Price</label>
                            <input name="price" type="number" required className="w-full border px-2 py-1 rounded" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Stock</label>
                            <input name="stock" type="number" required className="w-full border px-2 py-1 rounded" />
                        </div>
                        <div className="col-span-4 flex justify-end gap-3 mt-2">
                            <button
                                type="submit"
                                disabled={isAddingColor}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                            >
                                {isAddingColor ? "Adding..." : "Add Color"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddColorForm(false)}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Sizes */}
            {selectedColor && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-500">Sizes</h3>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {variants
                            .filter(v => v.Color === selectedColor)
                            .map(variant => (
                                variant.Size && (
                                    <div
                                        key={variant.Id}
                                        onClick={() => setEditingVariant(variant)}
                                        className="border border-gray-200 p-3 rounded text-sm text-gray-800 cursor-pointer hover:border-blue-400 transition"
                                    >
                                        <p className="font-semibold mb-1">{variant.Size}</p>
                                        <p className="text-gray-500">Stock: {variant.Stock}</p>
                                        <p className="text-gray-700 font-medium">
                                            {variant.Price.toLocaleString("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}
                                        </p>
                                    </div>
                                )
                            ))}
                    </div>

                    <button
                        onClick={() => setShowAddSizeForm(true)}
                        className="text-sm mt-4 text-blue-600 hover:underline"
                    >
                        + Add Size to {selectedColor}
                    </button>

                    {showAddSizeForm && (
                        <form
                            onSubmit={handleAddSize}
                            className="grid grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded border"
                        >
                            <div>
                                <label className="block text-xs text-gray-500">Size</label>
                                <input name="size" type="text" required className="w-full border px-2 py-1 rounded" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Price</label>
                                <input name="price" type="number" required className="w-full border px-2 py-1 rounded" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500">Stock</label>
                                <input name="stock" type="number" required className="w-full border px-2 py-1 rounded" />
                            </div>
                            <div className="col-span-3 flex gap-2 justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                >
                                    {isSubmitting ? "Adding..." : "Add"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddSizeForm(false)}
                                    className="text-sm text-gray-600 hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Edit Variant Modal */}
            {editingVariant && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setEditingVariant(null)}
                    onKeyDown={(e) => e.key === "Escape" && setEditingVariant(null)}
                    tabIndex={-1}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-6 rounded shadow-xl w-full max-w-md relative transition duration-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Edit Variant</h3>

                        <form className="space-y-5" onSubmit={handleEditVariant}>
                            <input type="hidden" name="variantId" value={editingVariant.Id} />
                            <input type="hidden" name="productId" value={editingVariant.ProductId} />

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">SIZE</label>
                                <input
                                    type="text"
                                    name="size"
                                    defaultValue={editingVariant.Size || ""}
                                    className="w-full border px-3 py-2 rounded text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">PRICE</label>
                                <input
                                    type="number"
                                    name="price"
                                    defaultValue={editingVariant.Price}
                                    className="w-full border px-3 py-2 rounded text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">STOCK</label>
                                <input
                                    type="number"
                                    name="stock"
                                    defaultValue={editingVariant.Stock}
                                    className="w-full border px-3 py-2 rounded text-sm"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-2 rounded font-semibold text-sm"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductDetailClient;