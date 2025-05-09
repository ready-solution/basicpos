"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { addToCart } from "@/actions/actions";
import ModalCard from "./modalOrderCard";
import { FaThList } from "react-icons/fa";

type Product = {
    Id: number;
    Name: string;
    Slug: string;
    Price: number;
    Enabled: boolean;
    Stock: number;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
};

type Variant = {
    Id: number;
    Price: number;
    Stock: number;
    ProductId: number;
    Size: string | null;
    Color: string | null;
};

type ProductCardProps = {
    product: Product[];
    variant: Variant[];
};

export default function ProductCard({ product, variant }: ProductCardProps) {
    const handleAddToCart = async (productId: number) => {
        const formData = new FormData();
        formData.append("productId", productId.toString());
        formData.append("quantity", "1");

        const result = await addToCart(formData);

        if (!result.success) {
            toast.error(result.error || "Failed to add to cart");
            return;
        }
    };


    return (
        <div className="w-full flex flex-wrap gap-3">
            {product.map((x) => {
                const productVariants = variant.filter((v) => v.ProductId === x.Id);
                const hasVariant = productVariants.length > 0;

                return (
                    <div className="w-1/6 min-w-[190px]" key={x.Id}>
                        {hasVariant ? (
                            <ModalCard product={x} variant={productVariants} />
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleAddToCart(x.Id)}
                                className="w-full text-sm bg-white border-1 shadow-zinc-600 shadow-sm hover:bg-slate-300 active:bg-slate-200 cursor-pointer disabled:opacity-60"
                            >
                                <div className="p-2 flex flex-col items-start">
                                    <h3
                                        className="font-medium mb-3 truncate hover:overflow-visible hover:whitespace-normal"
                                        title={x.Name}
                                    >
                                        {x.Name.split('').slice(0, 15).join('')}
                                        {x.Name.length > 15 && '...'}
                                    </h3>
                                    <div className="w-full flex justify-between items-end">
                                        <p>{x.Price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                                        <p className={`text-xs ${x.Stock < 5 ? "text-orange-500" : "text-gray-500"} mt-1`}>Stock: {x.Stock}</p>
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}