"use client";

import { TbCheck, TbX } from "react-icons/tb";
import { useState } from "react";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import Link from "next/link";
import Search from "../order/components/search";

export default function ProductTable({
    productList,
    categoryMap
}: {
    productList: any[];
    categoryMap: Record<number, string>;
}) {
    // State for search, sorting, filtering, and pagination
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterCategory, setFilterCategory] = useState<number | "all">("all");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Items per page

    // Filter products based on search and category
    const filteredProducts = productList.filter((product) => {
        const matchesCategory = filterCategory === "all" || product.categoryId === filterCategory;
        return matchesCategory;
    });

    // Sort the filtered products
    const sortedProducts = filteredProducts.sort((a, b) => {
        const comparison = a.Name.localeCompare(b.Name);
        return sortOrder === "asc" ? comparison : -comparison;
    });

    // Pagination: Calculate the slice of products to display
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Toggle sorting order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // Handle page change
    const goToNextPage = () => {
        if (currentPage < Math.ceil(sortedProducts.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="w-[50vw] h-[90%] mx-auto mt-5 flex flex-col justify-between">
            {/* Search Bar */}
            <div>
                {/* <input
                    type="text"
                    placeholder="Search products..."
                    className="mb-4 text-sm px-4 mr-3 py-2 border border-gray-300 bg-white w-[480px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                /> */}
                <div className="flex flex-row">
                    <Search placeholder="search a product..." />


                    {/* Filter by Category */}
                    <select
                        className="mb-4 px-4 text-sm py-2 border border-gray-300 bg-zinc-600 text-white cursor-pointer hover:bg-zinc-800"
                        onChange={(e) => setFilterCategory(Number(e.target.value) || "all")}
                        value={filterCategory}
                    >
                        <option value="all">All Categories</option>
                        {Object.keys(categoryMap).map((categoryId) => (
                            <option key={categoryId} value={categoryId}>
                                {categoryMap[Number(categoryId)]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="">
                    {/* Table */}
                    <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right bg-zinc-200">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium ">Name</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium ">
                                    Category
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium ">Price</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-center">Stock</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Variant</th>
                                <th
                                    className="whitespace-nowrap px-4 py-2 font-medium  cursor-pointer text-center"
                                    onClick={toggleSortOrder}
                                >
                                    Enabled {sortOrder === "asc" ? "↑" : "↓"}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentProducts.map((x, y) => (
                                <tr key={y}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        <Link href={`/product/${x.Slug}`} className="hover:text-zinc-400 active:text-zinc-800 text-gray-600">
                                            {x.Name}
                                        </Link>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {categoryMap[x.categoryId]}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {x.Price.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{x.Stock}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{x.Variants[0]? <TbCheck /> : <TbX />}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center flex justify-center">
                                        {x.Enabled ? <TbCheck /> : <TbX />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="p-1 bg-gray-300 rounded-full hover:bg-zinc-800 hover:text-white cursor-pointer"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                >
                    <TiArrowLeft size={30} />
                </button>
                <div className="flex space-x-2">
                    {Array.from({ length: Math.ceil(sortedProducts.length / itemsPerPage) }, (_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-2 rounded-full text-xs ${currentPage === i + 1 ? "bg-zinc-600 hover:bg-zinc-800 text-white" : "bg-gray-200"}`}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button
                    className="p-1 bg-gray-300 rounded-full hover:bg-zinc-800 hover:text-white cursor-pointer"
                    onClick={goToNextPage}
                    disabled={currentPage === Math.ceil(sortedProducts.length / itemsPerPage)}
                >
                    <TiArrowRight size={30} />
                </button>
            </div>
        </div>
    );
}
