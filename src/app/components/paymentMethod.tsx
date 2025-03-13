"use client"

import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function PaymentMethod() {
    const [paymentMethod, setPaymentMethod] = useState("");
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaymentMethod(e.target.value);
        const params = new URLSearchParams(searchParams);
        params.set('method', e.target.value);
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col w-[30%] border-t-1 mx-auto space-y-2 justify-center pt-2">
            <select
                id="payment-method"
                value={paymentMethod}
                onChange={handlePaymentChange}
                className="border p-2 bg-zinc-100 text-stone-700"
            >
                <option value="">Select payment method</option>
                <option value="CASH">Cash</option>
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
                <option value="QRIS">QRIS</option>
            </select>
        </div>
    )
}
