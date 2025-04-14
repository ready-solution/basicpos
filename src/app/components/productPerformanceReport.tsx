"use client";

import { useMemo, useState, useEffect } from "react";

type OrderDetail = {
    ProductId: number;
    Qty: number;
    TotalPrice: number;
    Order: {
        createdAt: Date;
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

type Product = {
    Id: number;
    Name: string;
    Slug: string;
    categoryId: number;
    Available: boolean;
};

type Props = {
    orderDetails: OrderDetail[];
    categories: Category[];
    products: Product[];
};

export default function ProductPerformanceReport({ orderDetails, categories, products }: Props) {
    const [range, setRange] = useState<"daily" | "weekly" | "monthly">("daily");
    const [categoryId, setCategoryId] = useState<number | "all">("all");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
        const sales: Record<number, { qty: number; revenue: number }> = {};
        filtered.forEach((detail) => {
            if (!sales[detail.ProductId]) {
                sales[detail.ProductId] = { qty: 0, revenue: 0 };
            }
            sales[detail.ProductId].qty += detail.Qty;
            sales[detail.ProductId].revenue += detail.TotalPrice;
        });

        return products
            .filter(product => {
                const hadSales = !!sales[product.Id];
                return product.Available || hadSales;
            })
            .map(product => {
                const sale = sales[product.Id] || { qty: 0, revenue: 0 };
                const category = categories.find(c => c.Id === product.categoryId)?.Name || "-";

                return {
                    name: product.Name,
                    slug: product.Slug,
                    category,
                    qty: sale.qty,
                    revenue: sale.revenue,
                    available: product.Available,
                };
            });
    }, [filtered, products, categories]);


    const bestQty = Math.max(...productMap.map(p => p.qty));
    const sortedProducts = productMap
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.qty - a.qty);

    const totalPages = Math.ceil(sortedProducts.length / pageSize);
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const formatIDR = (num: number) =>
        num.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

    useEffect(() => {
        setCurrentPage(1);
    }, [range, categoryId, search, pageSize]);

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-6xl mx-auto my-8">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-zinc-800">Product Performance</h2>
                <div className="flex items-center gap-2 flex-wrap">
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

            <div className="flex items-center justify-between my-4 text-sm">
                <div className="flex items-center gap-2">
                    <label>Show</label>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(parseInt(e.target.value))}
                        className="border rounded px-2 py-1"
                    >
                        {[5, 10, 20, 30].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    <span>entries</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
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
                    {paginatedProducts.map((p, i) => (
                        <tr
                            key={i}
                            className={`border-t hover:bg-zinc-50 ${!p.available ? "bg-red-100" : ""}`}
                        >
                            <td className="px-4 py-2 font-medium">
                                {p.name}
                                {p.qty === bestQty ? <span className="ml-2 text-green-600 text-xs">Best Seller</span> : null}
                                {p.qty < 3 && p.qty !== bestQty ? <span className="ml-2 text-orange-500 text-xs">Slow Moving</span> : null}
                                {!p.available ? <span className="ml-2 text-red-600 text-xs">(Deleted)</span> : null}
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
