"use client"

import { confirmPayment } from "@/actions/actions";

interface orderID {
    id: string;
}

export default function ConfirmPaymentButton({ id }: orderID) {
    const handleConfirmPayment = (id: string) => {
        confirmPayment(id);
    };

    return (
        <button onClick={() => handleConfirmPayment(id)} className="bg-green-300 w-[30%] mx-auto mt-5 p-1 cursor-pointer hover:bg-green-400">
            confirm
        </button>
    )
};