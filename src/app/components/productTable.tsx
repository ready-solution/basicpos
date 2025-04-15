"use client";

import { useState } from "react";
import Link from "next/link";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import Search from "../order/components/search";
import { productEnabled, deleteProduct } from "@/actions/actions";

export default function ProductTable({
    productList,
    categoryMap,
}: {
    productList: any[];
    categoryMap: Record<number, string>;
}) {
    const [sortBy, setSortBy] = useState<"name" | "enabled">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterCategory, setFilterCategory] = useState<number | "all">("all");
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleProductEnabled = (id: number) => productEnabled(id);

    const handleDeleteProducts = () => {
        deleteProduct(Array.from(selectedRows))
            .then((res) => alert(res.message))
            .catch((err) => alert(`Error deleting product ${err}`));
    };

    const toggleSortOrder = (column: "name" | "enabled") => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const filteredProducts = productList.filter(
        (product) => filterCategory === "all" || product.categoryId === filterCategory
    );

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortBy === "name") {
            const comparison = a.Name.localeCompare(b.Name);
            return sortOrder === "asc" ? comparison : -comparison;
        } else {
            const comparison = (a.Enabled === b.Enabled ? 0 : a.Enabled ? 1 : -1);
            return sortOrder === "asc" ? comparison : -comparison;
        }
    });

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirst, indexOfLast);

    const handleRowSelection = (id: number) => {
        const updated = new Set(selectedRows);
        updated.has(id) ? updated.delete(id) : updated.add(id);
        setSelectedRows(updated);
        setSelectAll(updated.size === currentProducts.length);
    };

    const handleSelectAll = () => {
        const updated = new Set<number>();
        if (!selectAll) currentProducts.forEach((p) => updated.add(p.Id));
        setSelectedRows(updated);
        setSelectAll(!selectAll);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () => {
        const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto min-h-[calc(100vh-180px)] flex flex-col justify-between">
            <div>
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                    <div className="w-2/3">
                        <Search placeholder="Search a product..." />
                    </div>
                    <div className="flex gap-2">
                        {selectedRows.size > 0 && (
                            <button
                                onClick={handleDeleteProducts}
                                className="rounded bg-zinc-600 px-4 py-2 text-sm text-white hover:bg-zinc-800 cursor-pointer"
                            >
                                Delete
                            </button>
                        )}
                        <select
                            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded shadow-sm"
                            onChange={(e) => setFilterCategory(Number(e.target.value) || "all")}
                            value={filterCategory}
                        >
                            <option value="all">All Categories</option>
                            {Object.entries(categoryMap).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white shadow-sm rounded border border-gray-200">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-zinc-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-2">
                                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                                </th>
                                <th
                                    className="px-4 py-2 cursor-pointer font-medium"
                                    onClick={() => toggleSortOrder("name")}
                                >
                                    Name {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="px-4 py-2 font-medium">Category</th>
                                <th className="px-4 py-2 font-medium">Price</th>
                                <th className="px-4 py-2 text-center font-medium">Stock</th>
                                <th
                                    className="px-4 py-2 text-center font-medium cursor-pointer"
                                    onClick={() => toggleSortOrder("enabled")}
                                >
                                    Enabled {sortBy === "enabled" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-white divide-gray-100">
                            {currentProducts.map((x) => (
                                <tr key={x.Id} className="hover:bg-zinc-50">
                                    <td className="px-4 py-2 text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.has(x.Id)}
                                            onChange={() => handleRowSelection(x.Id)}
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-gray-700">
                                        <Link href={`/product/${x.Slug}`} className="hover:underline">
                                            {x.Name} {x.Variants[0] ? "**" : ""}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {categoryMap[x.categoryId]}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {x.Price.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        })}
                                    </td>
                                    <td className="px-4 py-2 text-center text-gray-600">
                                        {x.Variants?.length > 0
                                            ? x.Variants.reduce((sum: number, v: any) => sum + (v.Stock || 0), 0)
                                            : x.Stock}
                                    </td>
                                    <td className="px-4 py-2 text-center text-gray-600">
                                        <button
                                            onClick={() => handleProductEnabled(x.Id)}
                                            className={`relative cursor-pointer inline-flex items-center h-5 w-8 rounded-full transition ${x.Enabled ? "bg-emerald-800" : "bg-gray-300"}`}
                                        >
                                            <span
                                                className={`absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white transition-transform ${x.Enabled ? "translate-x-3" : "translate-x-0"}`}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-10 space-x-4">
                <button
                    className="p-2 rounded-full bg-gray-200 hover:bg-zinc-600 hover:text-white disabled:opacity-50"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                >
                    <TiArrowLeft size={20} />
                </button>
                {Array.from({ length: Math.ceil(sortedProducts.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors duration-200 ${currentPage === i + 1
                            ? "bg-zinc-700 text-white"
                            : "bg-gray-100 hover:bg-zinc-200"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="p-2 rounded-full bg-gray-200 hover:bg-zinc-600 hover:text-white disabled:opacity-50"
                    onClick={goToNextPage}
                    disabled={currentPage === Math.ceil(sortedProducts.length / itemsPerPage)}
                >
                    <TiArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
