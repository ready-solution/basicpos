import prisma from '@/lib/db';
import { Params } from 'next/dist/server/request/params';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    return (
        <div className='w-full p-5'>
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text>Section #1</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Section #2</Text>
                    </View>
                </Page>
            </Document>
        </div>
    )
}
