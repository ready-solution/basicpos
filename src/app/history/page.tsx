import prisma from "@/lib/db";
import Link from "next/link";
import HistoryTable from "../components/historyTable";

export default async function HistoryPage() {
    const orderlist = await prisma.order.findMany();
    return (
        <div className="w-full max-h-[100vh] bg-zinc-100">
            <HistoryTable orderlist={orderlist} />
        </div>
        // <div className="w-full max-h-[100vh] overflow-y-auto bg-zinc-100 p-5">
        //     <div className="overflow-x-auto">
        //         <table className="w-[50vw] mx-auto divide-y-2 divide-gray-200 bg-white text-sm">
        //             <thead className="ltr:text-left rtl:text-right">
        //                 <tr>
        //                     <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Invoice No</th>
        //                     <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date</th>
        //                     <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Payment Type</th>
        //                     <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Sub Total</th>
        //                     <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Total Discount</th>
        //                     <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Total</th>
        //                     <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
        //                 </tr>
        //             </thead>

        //             <tbody className="divide-y divide-gray-200">
        //                 {
        //                     orderlist.map((x, y) => (
        //                         <tr key={y}>
        //                             <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
        //                                 <Link href={`/payment/${x.Id}`}>
        //                                     {x.InvoiceNo}
        //                                 </Link>
        //                             </td>
        //                             <td className="whitespace-nowrap px-4 py-2 text-gray-700">
        //                                 {new Date(x.createdAt).toLocaleDateString('en-GB', {
        //                                     year: 'numeric',
        //                                     month: 'short',
        //                                     day: 'numeric',
        //                                 })}
        //                             </td>
        //                             <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.PaymentType}</td>
        //                             <td className="whitespace-nowrap px-4 py-2 text-gray-700">
        //                                 {new Intl.NumberFormat('id-ID', {
        //                                     style: 'currency',
        //                                     currency: 'IDR',
        //                                     minimumFractionDigits: 0, // Ensures no decimals
        //                                     maximumFractionDigits: 0, // Ensures no decimals
        //                                 }).format(x.SubTotal)}
        //                             </td>
        //                             <td className="whitespace-nowrap px-4 py-2 text-gray-700">
        //                                 {new Intl.NumberFormat('id-ID', {
        //                                     style: 'currency',
        //                                     currency: 'IDR',
        //                                     minimumFractionDigits: 0, // Ensures no decimals
        //                                     maximumFractionDigits: 0, // Ensures no decimals
        //                                 }).format(x.DiscItemTotal)}
        //                             </td>
        //                             <td className="whitespace-nowrap px-4 py-2 text-gray-700">
        //                                 {new Intl.NumberFormat('id-ID', {
        //                                     style: 'currency',
        //                                     currency: 'IDR',
        //                                     minimumFractionDigits: 0, // Ensures no decimals
        //                                     maximumFractionDigits: 0, // Ensures no decimals
        //                                 }).format(x.Total)}
        //                             </td>
        //                             <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.Status}</td>
        //                         </tr>
        //                     ))
        //                 }
        //             </tbody>
        //         </table>
        //     </div>
        // </div>
    )
}