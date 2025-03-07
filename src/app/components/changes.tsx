"use client"

import { useState } from "react";

interface TotalPayment {
    total: number;
}

export default function Changes({total}: TotalPayment) {
    const [pay, setPay] = useState(0);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPay(Number(e.target.value))
    };

    const changes = pay - total;

    return(
        <div className="w-full">
            <input type="number" onChange={(e) => handleChanges(e)} className="bg-white w-full p-2" placeholder="customer cash" />
            <p>Return : {changes <= 0 ? "" : changes}</p>
        </div>
    )
}