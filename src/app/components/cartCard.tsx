"use client"

import { deleteFromCart, updateCartQty } from "@/actions/actions";
import { MdRemoveCircle } from "react-icons/md";
import AddDiscount from "./addDiscount";

interface CartCardProps {
    id: number;
    name: string;
    price: number;
    qty: number;
    discount: number;
}

export default function CartCard({ id, name, price, qty, discount }: CartCardProps) {
    const handleRemoveItem = (id: number) => {
        deleteFromCart(id);
    }
    const handleCartQty = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const newQty = parseInt(e.target.value);
        updateCartQty(id, newQty);
    }

    return (
        <div>
            <div className="flex justify-between space-x-2 bg-sky-200 p-2 rounded-lg">
                <AddDiscount id={id} discount={discount} />
                <div className="w-4/6 flex flex-col">
                    <p>
                        {name}
                    </p>
                    <div className="flex space-x-5">
                        <div className="">
                            {
                                discount ? (
                                    <div>
                                        <p className="text-orange-400 text-sm">
                                            {price.toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })} - {
                                                discount.toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })
                                            }
                                        </p>
                                        <p className="font-medium">{(price - discount).toLocaleString('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}</p>
                                    </div>
                                ) : (
                                    <p className="font-medium">
                                        {price.toLocaleString('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className=" flex w-2/6 justify-between items-center">
                    <input type="number" onChange={(e) => handleCartQty(e, id)} value={qty} className="w-13 bg-white p-2 border-1 rounded-md" />
                    <button className="text-red-500 p-2 rounded-full hover:bg-white cursor-pointer" onClick={() => handleRemoveItem(id)}>
                        <MdRemoveCircle />
                    </button>
                </div>
            </div>
        </div>
    )
}