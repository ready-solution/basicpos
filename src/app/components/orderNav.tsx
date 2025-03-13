"use client"

import Search from "../order/components/search";
import CatCont from "./catContainer";
import { usePathname } from "next/navigation";

export default function OrderNav() {
    const pathname = usePathname();

    return (
        <div className={`w-full space-y-5 ${pathname === "/order/payment" ? 'hidden' : ''}`}>
            <Search placeholder="search products.." />
            <CatCont />
        </div>
    )
}