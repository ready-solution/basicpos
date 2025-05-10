import prisma from "@/lib/db";
import HistoryTable from "../components/historyTable";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
    const orderlist = await prisma.order.findMany();
    return (
        <div className="w-full max-h-[100vh] bg-zinc-100">
            <HistoryTable orderlist={orderlist} />
        </div>
    )
}