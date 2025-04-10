"use client";

import { useState, useEffect } from "react";

interface Variant {
    Id: number;
    Size: string | null;
    Color: string | null;
    Stock: number;
    Price: number;
}

interface ProductDetailClientProps {
    variants: Variant[];
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ variants }) => {
    const colorVariants = [...new Set(variants.filter(variant => variant.Color).map(variant => variant.Color))];

    const [selectedColor, setSelectedColor] = useState<string>(colorVariants[0] || "");

    // Handle color selection
    const handleColorClick = (color: string) => {
        setSelectedColor(color);
    };

    return (
        <div className="mt-6 space-y-3">
            <div>
                <h2 className="text-md font-medium text-gray-600">Available Variants</h2>

                {/* Color variants as buttons */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">Colors</h3>
                    <div className="flex space-x-2 mt-2">
                        {colorVariants.map((color, index) => (
                            <button
                                key={index}
                                onClick={() => handleColorClick(color ? color : '')}
                                className={`px-4 py-2 text-xs cursor-pointer font-semibold transition-colors ${selectedColor === color
                                    ? "bg-zinc-800 text-white border-2 border-gray-800"
                                    : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sizes section */}
                {selectedColor && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-500">Sizes</h3>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {variants
                                .filter(variant => variant.Color === selectedColor)
                                .map((variant) => (
                                    variant.Size && (
                                        <div
                                            key={variant.Id}
                                            className="border border-gray-200 p-3 rounded text-sm text-gray-800"
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailClient;
