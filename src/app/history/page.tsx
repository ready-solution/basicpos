import prisma from "@/lib/db";
import Link from "next/link";
import HistoryTable from "../components/historyTable";

export default async function HistoryPage() {
    const orderlist = await prisma.order.findMany();
    return (
        <div className="w-full max-h-[100vh] bg-zinc-100">
            <HistoryTable orderlist={orderlist} />
        </div>
    )
}