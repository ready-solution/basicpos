"use client";

import { useMemo, useState } from "react";

type Order = {
    Total: number;
    createdAt: Date;
    PaymentType: string;
};

export default function TotalSalesContainer({ orders }: { orders: Order[] }) {
    const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");

    const filteredOrders = useMemo(() => {
        const now = new Date();
        return orders.filter(order => {
            const created = new Date(order.createdAt);
            if (range === "daily") {
                return (
                    created.getDate() === now.getDate() &&
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                );
            } else if (range === "weekly") {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                return created >= startOfWeek && created <= now;
            } else if (range === "monthly") {
                return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                );
            }
            return false;
        });
    }, [range, orders]);

    const totalSales = filteredOrders.reduce((sum, o) => sum + o.Total, 0);
    const totalOrders = filteredOrders.length;
    const avgTransaction = totalOrders > 0 ? totalSales / totalOrders : 0;

    const paymentBreakdown = useMemo(() => {
        const result: Record<string, { total: number; count: number }> = {};
        filteredOrders.forEach((order) => {
            if (!result[order.PaymentType]) {
                result[order.PaymentType] = { total: 0, count: 0 };
            }
            result[order.PaymentType].total += order.Total;
            result[order.PaymentType].count += 1;
        });
        return Object.entries(result).map(([method, data]) => ({
            method,
            ...data,
        }));
    }, [filteredOrders]);

    const formatIDR = (num: number) =>
        num.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-6xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-zinc-800">Sales Report</h2>
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                    <option value="daily">Today</option>
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-zinc-800">
                <div className="bg-zinc-100 p-4 rounded shadow-sm">
                    <p>Total Sales</p>
                    <p className="font-semibold text-lg">{formatIDR(totalSales)}</p>
                </div>
                <div className="bg-zinc-100 p-4 rounded shadow-sm">
                    <p>Total Orders</p>
                    <p className="font-semibold text-lg">{totalOrders}</p>
                </div>
                <div className="bg-zinc-100 p-4 rounded shadow-sm">
                    <p>Average Transaction</p>
                    <p className="font-semibold text-lg">{formatIDR(avgTransaction)}</p>
                </div>
            </div>

            {paymentBreakdown.length > 0 && (
                <div className="mt-6">
                    <p className="text-sm font-medium mb-2 text-zinc-700">Breakdown by Payment Method</p>
                    <ul className="space-y-1 text-sm">
                        {paymentBreakdown.map((pm, index) => (
                            <li key={index} className="flex justify-between border-b py-1">
                                <span>{pm.method}</span>
                                <span>
                                    {formatIDR(pm.total)} ({pm.count})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}