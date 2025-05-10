"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdDiscount } from "react-icons/md";
import { addDiscount } from "@/actions/actions";
import { motion } from "framer-motion";

interface ItemProps {
    id: number;
    discount: number;
}

export default function AddDiscount({ id, discount }: ItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [off, setOff] = useState(discount);

    const toggleModal = () => setIsModalOpen(prev => !prev);
    const closeModal = () => setIsModalOpen(false);

    const handleDiscountValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, "");
        setOff(value ? Number(value) : 0);
    };

    const updateDiscount = () => {
        addDiscount(id, off.toString());
        closeModal();
        toast.success("Discount applied!");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") updateDiscount();
    };

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };

        if (isModalOpen) {
            document.addEventListener("keydown", handleEscKey);
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [isModalOpen]);

    useEffect(() => {
        setOff(discount);
    }, [discount]);

    return (
        <div>
            <button
                type="button"
                title="Add Discount"
                onClick={toggleModal}
                className="p-2 rounded-full hover:text-emerald-400 transition duration-150 cursor-pointer"
            >
                <MdDiscount size={20} />
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50"
                    onClick={closeModal}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white shadow-lg border rounded p-6 w-full max-w-md"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold text-center border-b pb-4 mb-6">Add Discount</h2>

                        <div className="flex flex-col gap-4">
                            <label htmlFor="discount" className="text-sm text-gray-700">Enter discount amount (IDR)</label>
                            <input
                                id="discount"
                                type="number"
                                value={off > 0 ? off : ""}
                                onChange={handleDiscountValue}
                                onKeyDown={handleKeyDown}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                placeholder="e.g. 10000"
                                min={0}
                            />

                            {off > 0 && (
                                <span className="text-xs text-gray-500">
                                    You’re setting: <strong>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(off)}</strong>
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={updateDiscount}
                                className="mt-4 bg-zinc-800 hover:bg-zinc-900 text-white py-2 rounded transition cursor-pointer"
                            >
                                Apply Discount
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
