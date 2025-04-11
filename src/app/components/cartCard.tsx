"use client";

import { deleteFromCart, updateCartQty } from "@/actions/actions";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import AddDiscount from "./addDiscount";

interface CartCardProps {
    id: number;
    name: string;
    price: number;
    qty: number;
    discount: number;
    size?: string | null;
    color?: string | null;
}

export default function CartCard({ id, name, price, qty, discount, size, color }: CartCardProps) {
    const finalPrice = price - discount;
    const subtotal = finalPrice * qty;

    const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQty = parseInt(e.target.value) || 1;
        updateCartQty(id, newQty);
    };

    return (
        <motion.div
            initial={{ opacity: 0.5, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
        >
            <div className="flex flex-col gap-2 bg-white border border-zinc-700 p-3 rounded-md hover:bg-zinc-50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                    <div className="w-full sm:w-2/3">
                        <p className="font-medium text-sm text-gray-800">{name}</p>
                        {(size || color) ? (
                            <p className="text-xs text-gray-600 italic">
                                Variant:
                                {size && <span className="font-medium"> Size {size}</span>}
                                {color && <span className="font-medium"> Color {color}</span>}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 italic">-</p>
                        )}
                    </div>

                    <div className="w-full sm:w-1/3 text-right text-sm mt-2 sm:mt-0">
                        {discount > 0 ? (
                            <>
                                <p className="line-through text-xs text-gray-500">
                                    {price.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    })}
                                </p>
                                <p className="text-xs text-red-600 font-semibold">
                                    - {discount.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    })}
                                </p>
                                <p className="font-semibold text-gray-800">
                                    {finalPrice.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    })}
                                </p>
                            </>
                        ) : (
                            <p className="font-semibold text-gray-800">
                                {price.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                })}
                            </p>
                        )}
                        
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <AddDiscount id={id} discount={discount} />
                        <input
                            type="number"
                            min={1}
                            value={qty}
                            onChange={handleQtyChange}
                            className="w-12 text-center text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            style={{
                                WebkitAppearance: "none",
                                MozAppearance: "textfield",
                                appearance: "textfield",
                            }}
                        />
                    </div>
                    <button
                        title="Remove from cart"
                        onClick={() => deleteFromCart(id)}
                        className="p-2 rounded-full hover:text-red-600 transition-colors"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
