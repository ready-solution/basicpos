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
    const handleRemoveItem = (id: number) => {
        deleteFromCart(id);
    };

    const handleCartQty = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const newQty = parseInt(e.target.value);
        updateCartQty(id, newQty);
    };

    const finalPrice = price - discount;

    return (
        <motion.div
            initial={{ opacity: 0.5, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        >
            <div className="flex flex-col space-y-2 bg-white p-3 rounded-md shadow-md hover:bg-zinc-50 transition-colors">
                <div className="flex justify-between">
                    <div className="w-2/3">
                        <p className="font-medium text-sm text-gray-800">{name}</p>
                        {(size || color) ? (
                            <p className="text-xs text-gray-600 italic">
                                Variant: {size && <span className="font-medium">Size {size}</span>} {color && `, Color ${color}`}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 italic">-</p>
                        )}
                    </div>

                    <div className="text-right text-sm w-1/3">
                        {discount ? (
                            <>
                                <p className="line-through text-xs text-gray-500">
                                    {price.toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0
                                    })}
                                </p>
                                <p className="text-xs text-red-600 font-semibold">
                                    - {discount.toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0
                                    })}
                                </p>
                                <p className="font-semibold text-gray-800">
                                    {finalPrice.toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0
                                    })}
                                </p>
                            </>
                        ) : (
                            <p className="font-semibold text-gray-800">
                                {price.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                })}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AddDiscount id={id} discount={discount} />
                        <input
                            type="number"
                            min={1}
                            value={qty}
                            onChange={(e) => handleCartQty(e, id)}
                            className="w-12 text-center text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                            style={{
                                WebkitAppearance: "none",
                                MozAppearance: "textfield",
                                appearance: "textfield"
                            }}
                        />
                    </div>
                    <button
                        className="p-2 rounded-full hover:text-red-600 transition-colors"
                        onClick={() => handleRemoveItem(id)}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
