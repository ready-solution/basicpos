import prisma from "@/lib/db"

export default async function HistoryPage() {
    const orderlist = await prisma.order.findMany();
    return (
        <div className="w-full bg-teal-100 p-5">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Invoice No</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Payment Type</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Sub Total</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Total Discount</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Total</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Updated Date</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Printed</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Emailed</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {
                            orderlist.map((x, y) => (
                                <tr>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{x.InvoiceNo}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {new Date(x.createdAt).toLocaleDateString('en-GB', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.PaymentType}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.SubTotal}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.DiscItemTotal}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.Total}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.Status}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {new Date(x.updatedAt).toLocaleDateString('en-GB', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.isPrint}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{x.isEmail}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}