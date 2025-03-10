import prisma from '@/lib/db';
import { Params } from 'next/dist/server/request/params';
import ReceiptPDF from '../components/receipt';

export default async function TransactionIdPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: {
            Id: id as string,
        },
        include: {
            OrderDetails: true
        }
    });

    const orderDetails = await prisma.orderDetail.findMany({
        where: {
            OrderId: order?.Id
        }
    });

    return (
        <div className='w-full p-5' id='elemet-to-print'>
            <ReceiptPDF />
        </div>
    )
}