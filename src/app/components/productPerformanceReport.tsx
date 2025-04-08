"use client";

import { useMemo, useState } from "react";

type OrderDetail = {
    ProductId: number;
    Qty: number;
    TotalPrice: number;
    Order: {
        createdAt: Date; // ISO date string
    };
    Product: {
        Name: string;
        Slug: string;
        categoryId: number;
        Category: {
            Name: string;
        };
    };
};

type Category = {
    Id: number;
    Name: string;
};

type Props = {
    orderDetails: OrderDetail[];
    categories: Category[];
};

export default function ProductPerformanceReport({ orderDetails, categories }: Props) {
    const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");
    const [categoryId, setCategoryId] = useState<number | "all">("all");
    const [search, setSearch] = useState("");

    const now = new Date();
    const filtered = useMemo(() => {
        return orderDetails.filter((detail) => {
            const created = new Date(detail.Order.createdAt);

            const inDateRange =
                range === "daily"
                    ? created.toDateString() === now.toDateString()
                    : range === "weekly"
                        ? created >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
                        : created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();

            const inCategory = categoryId === "all" || detail.Product.categoryId === categoryId;

            return inDateRange && inCategory;
        });
    }, [orderDetails, range, categoryId]);

    const productMap = useMemo(() => {
        const map: Record<number, {
            name: string;
            slug: string;
            category: string;
            qty: number;
            revenue: number;
        }> = {};

        filtered.forEach((detail) => {
            const pid = detail.ProductId;
            if (!map[pid]) {
                map[pid] = {
                    name: detail.Product.Name,
                    slug: detail.Product.Slug,
                    category: detail.Product.Category.Name,
                    qty: 0,
                    revenue: 0,
                };
            }
            map[pid].qty += detail.Qty;
            map[pid].revenue += detail.TotalPrice;
        });

        return Object.values(map);
    }, [filtered]);

    const bestQty = Math.max(...productMap.map(p => p.qty));
    const sortedProducts = productMap
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.revenue - a.revenue);

    const formatIDR = (num: number) =>
        num.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-6xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-zinc-800">Product Performance</h2>
                <div className="flex items-center gap-2">
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value as any)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="daily">Today</option>
                        <option value="weekly">This Week</option>
                        <option value="monthly">This Month</option>
                    </select>

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1"
                    />
                </div>
            </div>

            <table className="w-full text-sm text-left border">
                <thead className="bg-zinc-100 text-zinc-700">
                    <tr>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2 text-right">Qty Sold</th>
                        <th className="px-4 py-2 text-right">Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProducts.map((p, i) => (
                        <tr key={i} className="border-t hover:bg-zinc-50">
                            <td className="px-4 py-2 font-medium">
                                {p.name} {p.qty === bestQty ? <span className="ml-2 text-green-600 text-xs">Best Seller</span> : null}
                                {p.qty < 3 && p.qty !== bestQty ? <span className="ml-2 text-orange-500 text-xs">Slow Moving</span> : null}
                            </td>
                            <td className="px-4 py-2">{p.category}</td>
                            <td className="px-4 py-2 text-right">{p.qty}</td>
                            <td className="px-4 py-2 text-right">{formatIDR(p.revenue)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}