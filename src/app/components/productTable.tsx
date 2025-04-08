"use client"

import { useState } from "react";
import Link from "next/link";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";
import Search from "../order/components/search";
import { productEnabled, deleteProduct } from "@/actions/actions";
import { button, div } from "framer-motion/client";

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
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // To keep track of selected rows
    const [selectAll, setSelectAll] = useState(false); // To handle "Select All" checkbox

    const handleProductEnabled = (id: number) => {
        // Handle enabling/disabling product
        productEnabled(id)
    };

    const handleDeleteProducts = () => {
        deleteProduct(Array.from(selectedRows))
            .then(response => {
                alert(response.message); // Now you can access message after promise is resolved
            })
            .catch(error => {
                alert(`Error deleting product ${error}`); // Handle errors if any
            });
    };    

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

    // Handle selecting/deselecting a row
    const handleRowSelection = (id: number) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(id)) {
            newSelectedRows.delete(id);
        } else {
            newSelectedRows.add(id);
        }
        setSelectedRows(newSelectedRows);
        setSelectAll(newSelectedRows.size === currentProducts.length);
    };

    // Handle "Select All" checkbox
    const handleSelectAll = () => {
        const newSelectedRows = new Set<number>();
        if (!selectAll) {
            currentProducts.forEach(product => {
                newSelectedRows.add(product.Id);
            });
        }
        setSelectedRows(newSelectedRows);
        setSelectAll(!selectAll);
    };

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
        <div className="w-[50vw] h-[90%] mx-auto mt-5 flex flex-col">
            {/* Search Bar */}
            <div className="flex flex-row mb-4">
                <Search placeholder="search a product..." />
                <div className="flex">
                    {
                        selectedRows.size > 0 && ( // Check if there are selected rows
                            <div>
                                <button className="bg-blue-200" onClick={handleDeleteProducts}>Delete</button>
                            </div>
                        )
                    }

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
            </div>
            <div className="h-[500px] flex flex-col justify-between">
                <div>
                    {/* Table */}
                    <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right bg-zinc-200">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Name</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Category</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium">Price</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-center">Stock</th>
                                <th
                                    className="whitespace-nowrap px-4 py-2 font-medium cursor-pointer text-center"
                                    onClick={toggleSortOrder}
                                >
                                    Enabled {sortOrder === "asc" ? "↑" : "↓"}
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentProducts.map((x) => (
                                <tr key={x.Id}>
                                    <td className="whitespace-nowrap px-4 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.has(x.Id)}
                                            onChange={() => handleRowSelection(x.Id)}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        <Link href={`/product/${x.Slug}`} className="hover:text-zinc-400 active:text-zinc-800 text-gray-600">
                                            {x.Name} {x.Variants[0] ? '**' : ''}
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
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                                        {x.Stock}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center flex justify-center">
                                        <button
                                            onClick={() => handleProductEnabled(x.Id)}
                                            className={`relative inline-flex items-center h-5 cursor-pointer rounded-full w-8 ${x.Enabled ? 'bg-zinc-600' : 'bg-gray-300'}`}
                                        >
                                            <span
                                                className={`absolute inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${x.Enabled ? 'translate-x-4' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleDeleteProduct(x.Id)}
                                            className="text-red-600 hover:text-red-800 text-xs cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </div>
    );
}
