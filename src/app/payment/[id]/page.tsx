import prisma from '@/lib/db';
import { Params } from 'next/dist/server/request/params';
import Receipt from '../components/receipt';

export default async function TransactionIdPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: {
            Id: id as string,
        },
        include: {
            OrderDetails: {
                include: {
                    Product: true,
                    Variant: true,
                }
            }
        }
    });

    const storeName = process.env.STORE_NAME;
    const storeAddress = process.env.STORE_ADDRESS;
    const storeContact = process.env.STORE_CONTACT;

    if (!order) {
        return <div >not found</div>;
    }

    return (
        <div className='w-full' id='element-to-print'>
            <Receipt order={order} storeName={storeName} storeAddress={storeAddress} storeContact={storeContact} />
        </div>
    )
}