"use client"
import Link from "next/link";
import { useState } from "react";
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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Items per page

    // Filter by date
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    // Pagination: Calculate the slice of orders to display
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    // const currentOrders = orderlist.slice(indexOfFirstOrder, indexOfLastOrder);
    const filteredOrders = orderlist.filter((order) => {
        const created = new Date(order.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (
            (!start || created >= start) &&
            (!end || created <= new Date(end.setHours(23, 59, 59, 999)))
        );
    });

    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);


    // Handle page change
    const goToNextPage = () => {
        if (currentPage < Math.ceil(orderlist.length / itemsPerPage)) {
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
        <div className="w-[90vw] mx-auto min-h-full overflow-y-auto p-5">
            <div className="flex w-[55vw] justify-end items-center gap-3 mb-6 pr-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="startDate" className="text-sm text-gray-700">Start:</label>
                    <input
                        type="date"
                        id="startDate"
                        className="text-sm border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="endDate" className="text-sm text-gray-700">End:</label>
                    <input
                        type="date"
                        id="endDate"
                        className="text-sm border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto h-[70vh] flex flex-col justify-between">

                <table className="w-[55vw] mx-auto divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right bg-zinc-200">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Invoice No</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Payment Type</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Sub Total</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Total Discount</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Total</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {currentOrders.map((x, y) => (
                            <tr key={y}>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    <Link href={`/payment/${x.Id}`}>
                                        {x.InvoiceNo}
                                    </Link>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {new Date(x.createdAt).toLocaleString('en-GB', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.PaymentType}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(x.SubTotal)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(x.DiscItemTotal)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(x.Total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex w-[50vw] mx-auto justify-between items-center mt-4">
                    <button
                        className="p-1 bg-gray-300 rounded-full hover:bg-zinc-800 hover:text-white cursor-pointer"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                    >
                        <TiArrowLeft size={30} />
                    </button>
                    <div className="flex space-x-2">
                        {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }, (_, i) => (
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
                        disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
                    >
                        <TiArrowRight size={30} />
                    </button>
                </div>
            </div>
        </div>
    );
}
