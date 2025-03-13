"use client"

import { useState } from "react";

interface TotalPayment {
    total: number;
}

export default function Changes({ total }: TotalPayment) {
    const [pay, setPay] = useState(0);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-numeric characters except for a leading '0'
        let value = e.target.value.replace(/[^\d]/g, "");

        // If the input is empty or starts with multiple zeros, we ensure it's formatted correctly
        if (value === "") {
            setPay(0);
        } else {
            // Set the pay value as a number without any formatting
            setPay(Number(value));
        }
    };

    // Format the number as IDR without decimal
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0, // No decimals
        }).format(amount);
    };

    const changes = pay - total;

    return (
        <div className="w-[30%] mx-auto space-y-2">
            <label className="text-sm">Customer cash</label>
            <input
                type="text"
                value={formatCurrency(pay)} // Display formatted value
                onChange={handleChanges} // Handle changes as user types
                className="bg-zinc-100 border w-full p-2"
                placeholder="customer cash"
                // Prevent user from inputting non-numeric characters
                onInput={(e) => e.preventDefault()}
            />
            <div className="w-full flex justify-between">
                <p>Return: </p>
                <p>{changes <= 0 ? "" : formatCurrency(changes)}</p>
            </div>
        </div>
    );
}
