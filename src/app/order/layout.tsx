import type { Metadata } from "next";
import CatCont from "../components/catContainer";
import CartContainer from "../components/cartContainer";
import TotalContainer from "../components/totalContainer";
import ClearCart from "../components/clearCart";
import { Suspense } from "react";
import Search from "./components/search";

export const metadata: Metadata = {
    title: "Order"
};

export default function OrderLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="w-full min-h-screen flex">
            <div className="flex-3 px-5 space-y-5">
                <Search placeholder="search products.." />
                <CatCont />
                <Suspense>
                    {children}
                </Suspense>
            </div>
            <div className="hidden lg:flex flex-1 flex-col p-5 bg-zinc-100">
                <div className="w-full pb-5 flex justify-between">
                    <p className="text-lg font-medium">
                        Current Order
                    </p>
                    <ClearCart />
                </div>
                <CartContainer></CartContainer>
                <TotalContainer></TotalContainer>
            </div>
        </div>
    );
}
