"use client"

import { productStockChange } from "@/actions/actions";
import { mainProductPriceChange } from "@/actions/actions";

interface ProductDetail {
    Id: number;
    Stock: number;
    Name: string;
    Slug: string;
    Price: number;
    Enabled: boolean;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
    Variants: {
        Stock: number;
        Id: number;
        Price: number;
        ProductId: number;
        Size: string | null;
        Color: string | null;
    }[];
}

interface StockChangeInputProps {
    product: ProductDetail;
}

export default function StockChangeInput({ product }: StockChangeInputProps) {
    const handleProductStockChange = (id: number, stock: number) => {
        productStockChange(id, stock);
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value.replace(/[^\d]/g, ''), 10); // Remove non-numeric characters
        e.target.value = formatPrice(value); // Format the value when the user leaves the input
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // Remove currency formatting so the user can input a number
        const value = e.target.value.replace(/[^\d]/g, '');
        e.target.value = value; // Show only raw numeric value
    };

    const handlePriceChange = (id: number, price: number) => {
        mainProductPriceChange(id, price);
    };

    return (
        <div className="w-full mt-5 flex gap-5">
            {/* Stock Input */}
            <div className="w-full">
                <label htmlFor="stockValue" className="block text-xs font-medium text-gray-700 mb-2">
                    Stock
                </label>
                <input
                    id="stockValue"
                    type="number"
                    defaultValue={product?.Stock}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            const newStock = parseInt(input.value, 10);
                            handleProductStockChange(product?.Id, newStock);
                        }
                    }}
                    className="text-center w-full p-1 border border-gray-300"
                />
            </div>

            {/* Price Input */}
            <div className="w-full">
                <label htmlFor="priceValue" className="block text-xs font-medium text-gray-700 mb-2">
                    Price
                </label>
                <input
                    id="priceValue"
                    type="text"
                    defaultValue={formatPrice(product.Price)} // Format the price as IDR initially
                    onBlur={handleBlur} // Format when input loses focus
                    onFocus={handleFocus} // Remove formatting when focused
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            const rawValue = input.value.replace(/[^\d]/g, ''); // Get the raw number without formatting
                            const newPrice = parseInt(rawValue, 10);
                            handlePriceChange(product?.Id, newPrice); // Call the price change handler
                        }
                    }}
                    className="text-center w-full p-1 border border-gray-300"
                />
            </div>
        </div>
    );
}
