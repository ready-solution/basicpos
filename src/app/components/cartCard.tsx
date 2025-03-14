"use client";

import { deleteFromCart, updateCartQty } from "@/actions/actions";
import { motion } from "framer-motion";
import { MdRemoveCircle } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import AddDiscount from "./addDiscount";

interface CartCardProps {
    id: number;
    name: string;
    price: number;
    qty: number;
    discount: number;
    size?: string | null;  // Optional size for variants
    color?: string | null; // Optional color for variants
}

export default function CartCard({ id, name, price, qty, discount, size, color }: CartCardProps) {
    const handleRemoveItem = (id: number) => {
        deleteFromCart(id);
    };
    const handleCartQty = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const newQty = parseInt(e.target.value);
        updateCartQty(id, newQty);
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0.5, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            >
                <div className="flex justify-between space-x-2 bg-white p-2 pr-2 text-sm rounded-sm shadow-md">

                    <div className="w-4/6 flex flex-col">
                        <p className="font-medium">{name}</p>

                        {/* Display Variant Info if Available */}
                        {(size || color) ? (
                            <p className="text-sm text-gray-600">
                                - {size && `Size: ${size}`} {color && ` | Color: ${color}`}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                -
                            </p>
                        )}

                        <div className="flex space-x-5">
                            <div>
                                {/* Display price with discount if applicable */}
                                {discount ? (
                                    <div>
                                        <div className="flex">
                                            <p className="font-medium line-through text-xs">
                                                {(price).toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })}
                                            </p>
                                            <p className="text-red-600 text-xs pl-3">
                                                - {
                                                    discount.toLocaleString('id-ID', {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    })
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {(price - discount).toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                ) : (
                                    <p className="font-medium">
                                        {price.toLocaleString('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quantity Input & Remove Button */}
                    <div className="flex w-2/6 justify-between items-center">
                        <AddDiscount id={id} discount={discount} />

                        <input
                            type="number" min={1}
                            onChange={(e) => handleCartQty(e, id)}
                            value={qty}
                            className="w-10 p-2 border-1 focus:outline-none"
                            style={{
                                WebkitAppearance: "none",
                                MozAppearance: "textfield",
                                appearance: "textfield"
                            }}
                        />

                        <button className=" p-2 rounded-full hover:text-red-600 cursor-pointer" onClick={() => handleRemoveItem(id)}>
                            <FaTrash />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
