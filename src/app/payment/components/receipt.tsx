"use client"

import { Page, Text, View, Document, StyleSheet, } from "@react-pdf/renderer"
import { PDFViewer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 50,
        paddingVertical: 10,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    section: {
        marginBottom: 10,
        // minHeight: 400,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    storeInfo: {
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
        paddingHorizontal: 30
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    itemText: {
        fontSize: 10,
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 10,
        fontWeight: 'bold',
    },
    footer: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 10,
        color: 'gray',
    },
    flexBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flexItem: {
        width: 140,
        backgroundColor: 'green'
    },
    smallText: {
        fontSize: 9
    },
    line: {
        height: 1,
        backgroundColor: '#000',
        marginBottom: 5,
        marginTop: 5,
    }
});

type Product = {
    Id: number;
    createdAt: Date;
    updatedAt: Date;
    Price: number;
    Name: string;
    Slug: string;
    Enabled: boolean;
    Stock: number;
    categoryId: number;
};

type OrderDetail = {
    Id: number;
    OrderId: string;
    ProductId: number;
    VariantId: number | null;
    Qty: number;
    Price: number;
    Discount: number;
    TotalPrice: number;
    Product: Product;
};

type Order = {
    Id: string;
    InvoiceNo: string;
    PaymentType: string;
    SubTotal: number;
    DiscItemTotal: number;
    Total: number;
    Status: string;
    isPrint: boolean;
    isEmail: boolean;
    createdAt: Date;
    updatedAt: Date;
    OrderDetails: OrderDetail[];
};

interface ReceiptProps {
    order: Order;
    storeName: string | undefined;
    storeAddress: string | undefined;
    storeContact: string | undefined;
}

export default function Receipt({ order, storeName, storeAddress, storeContact }: ReceiptProps) {
    const { Id, PaymentType, SubTotal, DiscItemTotal, Total, Status, isPrint, isEmail, createdAt, updatedAt, OrderDetails } = order;
    

    return (
        <PDFViewer style={{ width: '100%', height: '100%' }}>
            <Document>
                <Page size="A6" style={styles.page}>
                    {/* Store Information */}
                    <View style={styles.storeInfo}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            {storeName}
                        </Text>
                        <Text style={styles.smallText}>{storeAddress}</Text>
                        <Text style={styles.smallText}>{storeContact}</Text>
                    </View>

                    <View style={styles.line}></View>


                    {/* Purchased Items */}
                    <View style={styles.section}>
                        {order.OrderDetails.map((item, index) => (
                            <View style={styles.flexBox} key={index}>
                                <View><Text style={styles.itemText}>x{item.Qty} {item.Product.Name}</Text></View>
                                <View><Text style={styles.itemText}>{item.Price.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}</Text></View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.line}></View>

                    <View style={styles.totalRow}>
                        <Text>Subtotal:</Text>
                        <Text>{SubTotal.toLocaleString()}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text>Discount:</Text>
                        <Text>{DiscItemTotal.toLocaleString()}</Text>
                    </View>

                    {/* Total */}
                    <View style={styles.totalRow}>
                        <Text>Total:</Text>
                        <Text>{Total.toLocaleString()}</Text>
                    </View>

                    {/* Footer */}
                    <Text style={styles.footer}>
                        Thank you for shopping with us! Visit again soon.
                    </Text>
                </Page>
            </Document>
        </PDFViewer>
    )
}