// Updated HistoryTable with consistent input sizes and layout separation for search and date filters in 1 row, 4 columns
"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { TiArrowLeft, TiArrowRight } from "react-icons/ti";

interface Order {
    Id: string;
    InvoiceNo: string;
    createdAt: Date;
    PaymentType: string;
    SubTotal: number;
    DiscItemTotal: number;
    Total: number;
    Status: string;
}

interface HistoryTableProps {
    orderlist: Order[];
}

export default function HistoryTable({ orderlist }: HistoryTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchInvoice, setSearchInvoice] = useState<string>("");
    const [searchPayment, setSearchPayment] = useState<string>("");

    useEffect(() => {
        setCurrentPage(1);
    }, [startDate, endDate, searchInvoice, searchPayment]);

    const filteredOrders = orderlist.filter((order) => {
        const created = new Date(order.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (
            (!start || created >= start) &&
            (!end || created <= new Date(end.setHours(23, 59, 59, 999))) &&
            order.InvoiceNo.toLowerCase().includes(searchInvoice.toLowerCase()) &&
            order.PaymentType.toLowerCase().includes(searchPayment.toLowerCase())
        );
    });

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const goToNextPage = () => {
        if (currentPage < Math.ceil(filteredOrders.length / itemsPerPage)) {
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
        <div className="max-w-6xl mx-auto p-6 min-h-[90vh] flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold text-zinc-800 mb-4">Order History</h2>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Search Invoice No</label>
                        <input
                            type="text"
                            value={searchInvoice}
                            onChange={(e) => setSearchInvoice(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:ring-2 focus:ring-zinc-500 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Search Payment Type</label>
                        <input
                            type="text"
                            value={searchPayment}
                            onChange={(e) => setSearchPayment(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:ring-2 focus:ring-zinc-500 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Date From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:ring-2 focus:ring-zinc-500 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Date To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:ring-2 focus:ring-zinc-500 w-full"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto bg-white shadow-sm rounded border border-gray-200">
                    <table className="min-w-full text-sm">
                        <thead className="bg-zinc-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">Invoice No</th>
                                <th className="px-4 py-2 text-left font-medium">Date</th>
                                <th className="px-4 py-2 text-left font-medium">Payment Type</th>
                                <th className="px-4 py-2 text-right font-medium">Sub Total</th>
                                <th className="px-4 py-2 text-right font-medium">Discount</th>
                                <th className="px-4 py-2 text-right font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentOrders.map((x) => (
                                <tr key={x.Id}>
                                    <td className="px-4 py-2 font-medium text-blue-700">
                                        <Link href={`/payment/${x.Id}`}>{x.InvoiceNo}</Link>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {new Date(x.createdAt).toLocaleString("en-GB", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">{x.PaymentType}</td>
                                    <td className="px-4 py-2 text-right text-gray-700">
                                        {x.SubTotal.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        })}
                                    </td>
                                    <td className="px-4 py-2 text-right text-gray-700">
                                        {x.DiscItemTotal.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        })}
                                    </td>
                                    <td className="px-4 py-2 text-right text-gray-800 font-semibold">
                                        {x.Total.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center items-center mt-10 space-x-4">
                <button
                    className="p-2 rounded-full bg-gray-200 hover:bg-zinc-600 hover:text-white disabled:opacity-50"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                >
                    <TiArrowLeft size={20} />
                </button>
                {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }, (_, i) => (
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
                    disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
                >
                    <TiArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}