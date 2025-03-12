"use client"

import React, { useState, useEffect } from "react";
import { MdDiscount } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { addDiscount } from "@/actions/actions";

interface itemProps {
    id: number;
    discount: number;
}

export default function AddDiscount({ id, discount }: itemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility
    const [off, setOff] = useState("");

    const handleModal = () => {
        if (isModalOpen == true) {
            setIsModalOpen(false)
        } else {
            setIsModalOpen(true)
        }
    };

    const handleDiscountValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOff(e.target.value);
    };

    const updateDiscount = (id: number, amount: string) => {
        addDiscount(id, amount);
        setIsModalOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            updateDiscount(id, off);
        }
    };

    useEffect(() => {
        // Close the modal if Esc key is pressed
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleModal(); // Close the modal
            }
        };

        // Add event listener when modal is open
        if (isModalOpen) {
            document.addEventListener("keydown", handleEscKey);
        }

        // Cleanup event listener on component unmount or when modal is closed
        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [isModalOpen, handleModal]);

    return (
        <div>
            <button onClick={() => handleModal()} className="p-2 rounded-full hover:text-yellow-600 cursor-pointer">
                <FaInfoCircle />
            </button>

            {/* MODAL */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-white/30 backdrop-blur-md shadow-xl">
                        <div className="bg-yellow-100 rounded-md p-6 w-1/3">
                            <h2 className="text-center font-medium pb-10">Add discount</h2>
                            <div className="space-y-5 flex flex-col">
                                <input
                                    onChange={(e) => handleDiscountValue(e)} onKeyDown={handleKeyDown}
                                    defaultValue={discount > 0 ? discount : ""}
                                    type="number" name="discount"
                                    className="bg-white px-3 py-2 appearance-none" />
                                <div className="flex flex-col space-y-2 pt-5">
                                    <button onClick={() => updateDiscount(id, off)} className="bg-green-300 hover:bg-green-400 p-3 cursor-pointer">add</button>
                                    <button onClick={() => handleModal()} className="bg-blue-100 hover:bg-blue-200 cursor-pointer p-3">close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}