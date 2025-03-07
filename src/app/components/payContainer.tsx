"use client"
import { useState } from "react";
import PaymentButton from "./payButton";

export default function PayContainer() {
    const [paymentMethod, setPaymentMethod] = useState("");

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    };

    return (
        <div className="w-full bg-purple-200">
            {/* add radio option here: "CASH", "DEBIT", "CREDIT", QRIS */}
            <div className="pt-2 border-t-1">
                <h3 className="text-sm font-medium px-2 py-3">Select Payment Method</h3>

                {/* Radio buttons for payment options */}
                <div className="flex space-x-4 bg-pink-100 justify-center">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="payment"
                            value="CASH"
                            checked={paymentMethod === "CASH"}
                            onChange={handlePaymentChange}
                            className="mr-2"
                        />
                        Cash
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="payment"
                            value="DEBIT"
                            checked={paymentMethod === "DEBIT"}
                            onChange={handlePaymentChange}
                            className="mr-2"
                        />
                        Debit
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="payment"
                            value="CREDIT"
                            checked={paymentMethod === "CREDIT"}
                            onChange={handlePaymentChange}
                            className="mr-2"
                        />
                        Credit
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="payment"
                            value="QRIS"
                            checked={paymentMethod === "QRIS"}
                            onChange={handlePaymentChange}
                            className="mr-2"
                        />
                        QRIS
                    </label>
                </div>
            </div>
            {/* <div className="flex justify-center p-2"> */}
                {/* <button className="p-2 bg-green-200 w-full hover:bg-green-400 hover:text-white rounded-md cursor-pointer">payment</button> */}
                <PaymentButton payMethod={paymentMethod} />
            {/* </div> */}
        </div>
    )
}