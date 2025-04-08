"use client";

import { FaThList } from "react-icons/fa";
import { useState } from "react";
import { addToCart } from "@/actions/actions";
import { motion } from "framer-motion";

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
}

type Variant = {
    Id: number;
    Price: number;
    Stock: number;
    ProductId: number;
    Size: string | null;
    Color: string | null;
}

type ProductCardProps = {
    product: Product;
    variant: Variant[];
};

export default function ModalCard({ product, variant }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const handleModalOpen = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const uniqueColors = [...new Set(variant.map(v => v.Color ?? ""))].filter(c => c !== "");
    const uniqueSizes = [...new Set(variant.map(v => v.Size ?? ""))].filter(s => s !== "");

    const availableColors = uniqueColors.filter((color) =>
        variant.some((v) => v.Color === color && v.Size === selectedSize)
    );

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSize(event.target.value);
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedColor(event.target.value);
    };

    const isButtonDisabled = !selectedSize || !selectedColor;

    return (
        <div>
            <div className="text-sm w-full cursor-pointer" onClick={() => handleModalOpen(product)}>
                <div className="bg-white shadow-zinc-600 shadow-sm hover:bg-slate-300 p-2 flex flex-col items-start border-1">
                    <h3
                        className="font-medium mb-3 truncate hover:overflow-visible hover:whitespace-normal"
                        title={product.Name}
                    >
                        {product.Name.split('').slice(0, 15).join('')}
                        {product.Name.split('').length > 15 && '...'}
                    </h3>
                    <div className="flex justify-between w-full items-end">
                        <p>
                            {product.Price.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </p>
                        <FaThList size={10} />
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-xs"
                    onClick={handleModalClose}
                >
                    <motion.div
                        initial={{ opacity: 0.2, y: 500 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 1000, damping: 40 }}
                    >
                        <div
                            className="bg-white p-6 w-[400px] shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col justify-between pb-5 border-b mb-5">
                                <h1 className="font-medium text-lg">{selectedProduct.Name}</h1>
                                <p className="text-xl font-semibold">
                                    {selectedProduct.Price.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            </div>

                            {/* Add to Cart Form */}
                            <form action={addToCart} className="flex flex-col gap-4 text-sm pb-5">
                                <input type="hidden" name="productId" value={selectedProduct.Id} readOnly />
                                <input type="hidden" name="quantity" value={1} readOnly />

                                {/* Size Selection */}
                                {uniqueSizes.length > 0 && (
                                    <div>
                                        <label className="block font-medium text-gray-800 mb-1">Size:</label>
                                        <select
                                            name="size"
                                            className="w-full p-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm"
                                            onChange={handleSizeChange}
                                            value={selectedSize ?? ""}
                                        >
                                            <option value="">Select Size</option>
                                            {uniqueSizes.map((size, index) => {
                                                const matchingVariants = variant.filter(v => v.Size === size);
                                                const totalStock = matchingVariants.reduce((sum, v) => sum + (v.Stock || 0), 0);
                                                return (
                                                    <option key={index} value={size} disabled={totalStock === 0}>
                                                        {size}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}

                                {/* Color Selection */}
                                {uniqueColors.length > 0 && (
                                    <div>
                                        <label className="block font-medium text-gray-800 mb-1">Color:</label>
                                        <select
                                            name="color"
                                            className="w-full p-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm"
                                            onChange={handleColorChange}
                                            value={selectedColor ?? ""}
                                        >
                                            <option value="">Select Color</option>
                                            {uniqueColors.map((color, index) => {
                                                const matchingVariant = variant.find(v => v.Color === color && v.Size === selectedSize);
                                                const stock = matchingVariant?.Stock ?? 0;
                                                const isDisabled = !availableColors.includes(color) || stock <= 0;
                                                return (
                                                    <option key={index} value={color} disabled={isDisabled}>
                                                        {color} {stock > 0 ? `(${stock} left)` : "(Out of stock)"}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    className={`w-full py-3 rounded text-white font-semibold text-sm transition-colors duration-200
                                            ${isButtonDisabled
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-zinc-800 hover:bg-zinc-900 active:bg-black"
                                        }`}
                                    type="submit"
                                    disabled={isButtonDisabled}
                                >
                                    Add to Cart
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
