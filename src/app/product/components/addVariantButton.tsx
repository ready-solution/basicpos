"use client";

import { useState } from "react";
import AddVariantForm from "./addVariantForm";

export default function AddVariantButton({ productId }: { productId: number }) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Variant
                </button>
            )}

            {showForm && <AddVariantForm productId={productId} />}
        </div>
    );
}
