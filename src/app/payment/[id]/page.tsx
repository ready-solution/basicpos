import prisma from '@/lib/db';
import Receipt from '../components/receipt';

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params; // ← safest across environments

    const order = await prisma.order.findUnique({
        where: {
            Id: id,
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
        return <div>not found</div>;
    }

    return (
        <div className='w-full' id='element-to-print'>
            <Receipt
                order={order}
                storeName={storeName}
                storeAddress={storeAddress}
                storeContact={storeContact}
            />
        </div>
    );
}