import type { Metadata } from "next";
import CatCont from "../components/catContainer";
import CartContainer from "../components/cartContainer";
import TotalContainer from "../components/totalContainer";
import { Suspense } from "react";

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
            <div className="bg-cyan-100 flex-3 p-5 space-y-5">
                <CatCont />
                <Suspense>
                    {children}
                </Suspense>
            </div>
            <div className="flex-1 flex flex-col p-5">
                <div className="bg-blue-50 flex-1">
                    <p>
                        Current Order
                    </p>
                </div>
                <CartContainer></CartContainer>
                <TotalContainer></TotalContainer>
            </div>
        </div>
    );
}
