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
                    <p className="font-medium mb-3">{product.Name}</p>
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
                    onClick={handleModalClose} // Close the modal when clicking on the background
                >
                    <motion.div
                        initial={{ opacity: 0.2, y: 500 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 1000, damping: 40 }}
                    >
                        <div
                            className="bg-white p-6 w-[400px] shadow-lg"
                            onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up to the background
                        >
                            <div className="flex flex-col justify-between pb-5 border-b mb-5">
                                <h1 className="font-medium text-lg">{selectedProduct.Name}</h1>
                                <p className="text-xl font-semibold">
                                    {selectedProduct.Price.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })}
                                </p>
                            </div>

                            {/* Add to Cart Form */}
                            <form action={addToCart} className="flex flex-col gap-3 text-sm pb-5">
                                <input type="hidden" name="productId" value={selectedProduct.Id} readOnly />
                                <input type="hidden" name="quantity" value={1} readOnly />

                                {/* Size Selection */}
                                {uniqueSizes.length > 0 && (
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-2">Size:</label>
                                        <select
                                            name="size"
                                            className="w-full p-3 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
                                            onChange={handleSizeChange}
                                            value={selectedSize ?? ""}
                                        >
                                            <option value="">Select Size</option>
                                            {uniqueSizes.map((size, index) => (
                                                <option key={index} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Color Selection */}
                                {uniqueColors.length > 0 && (
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-2">Color:</label>
                                        <select
                                            name="color"
                                            className="w-full p-3 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
                                            onChange={handleColorChange}
                                            value={selectedColor ?? ""}
                                        >
                                            {uniqueColors.map((color, index) => {
                                                const isDisabled = !availableColors.includes(color);
                                                return (
                                                    <option key={index} value={color} disabled={isDisabled}>
                                                        {color}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}

                                <button
                                    className={`w-full py-3 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold focus:outline-none transition-colors duration-200 ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : ""
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