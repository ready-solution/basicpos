"use client"

import { clearCart } from "@/actions/actions";

type cartId = {
    id: string;
}

export default function ClearCartButton({id}: cartId) {
    const handleClearCart = (id: string) => {
        clearCart(id);
    };

    return (
        <button className="cursor-pointer hover:text-red-400" onClick={() => handleClearCart(id)}>
            Clear cart
        </button>
    )
}