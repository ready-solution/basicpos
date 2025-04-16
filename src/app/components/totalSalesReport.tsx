"use client";

import { useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LineChart,
    Line,
} from "recharts";

interface Order {
    Total: number;
    createdAt: Date;
    PaymentType: string;
    Status: string;
}

export default function TotalSalesContainer({ orders }: { orders: Order[] }) {
    const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");

    const now = new Date();

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const created = new Date(order.createdAt);
            const isInRange =
                range === "daily"
                    ? created.getDate() === now.getDate() &&
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                    : range === "weekly"
                        ? created >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()) && created <= now
                        : created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            return isInRange && order.Status.toLowerCase() !== "cancelled";
        });
    }, [range, orders]);

    const cancelledCount = useMemo(() => {
        return orders.filter((order) => {
            const created = new Date(order.createdAt);
            const isInRange =
                range === "daily"
                    ? created.getDate() === now.getDate() &&
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                    : range === "weekly"
                        ? created >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()) && created <= now
                        : created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            return isInRange && order.Status.toLowerCase() === "cancelled";
        }).length;
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

    const salesTrend = useMemo(() => {
        const map = new Map<string, number>();
        filteredOrders.forEach((order) => {
            const date = new Date(order.createdAt).toLocaleDateString("id-ID");
            map.set(date, (map.get(date) || 0) + order.Total);
        });
        return Array.from(map.entries()).map(([date, total]) => ({ date, total }));
    }, [filteredOrders]);

    const formatIDR = (num: number) =>
        num.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-6xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-zinc-800 mb-6">
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
                <div className="bg-zinc-100 p-4 rounded shadow-sm">
                    <p>Cancelled Orders</p>
                    <p className="font-semibold text-lg">{cancelledCount}</p>
                </div>
            </div>

            {range !== "daily" && salesTrend.length > 0 && (
                <div className="mb-8">
                    <p className="text-sm font-medium mb-3 text-zinc-700">Sales Trend</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={salesTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip formatter={(value) => formatIDR(value as number)} />
                            <Line type="monotone" dataKey="total" stroke="#4B5563" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {paymentBreakdown.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium mb-3 text-zinc-700">Payment Method Breakdown (by Total)</p>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={paymentBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="method" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip formatter={(value) => formatIDR(value as number)} labelStyle={{ fontWeight: 600 }} />
                                <Bar dataKey="total" fill="#4B5563" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-3 text-zinc-700">Payment Frequency (by Count)</p>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={paymentBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="method" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip labelStyle={{ fontWeight: 600 }} />
                                <Bar dataKey="count" fill="#6B7280" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}