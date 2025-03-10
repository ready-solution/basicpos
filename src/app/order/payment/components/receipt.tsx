"use client"

import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"
import { PDFViewer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    section: {
        marginBottom: 10,
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
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    itemText: {
        fontSize: 12,
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
});

const items = [
    { name: 'T-Shirt', qty: 2, price: 150000 },
    { name: 'Jeans', qty: 1, price: 200000 },
    { name: 'Jacket', qty: 1, price: 300000 },
];

const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);

export default function ReceiptPDF() {
    return (
        <PDFViewer style={{ width: '100%', height: '100vh' }}>
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Store Information */}
                    <View style={styles.storeInfo}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Store Name</Text>
                        <Text>1234 Main St, City, Country</Text>
                        <Text>Phone: +1 234 567 890</Text>
                        <Text>Email: store@example.com</Text>
                    </View>

                    {/* Receipt Title */}
                    <Text style={styles.title}>Receipt</Text>

                    {/* Purchased Items */}
                    <View style={styles.section}>
                        {items.map((item, index) => (
                            <View style={styles.itemRow} key={index}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Text style={styles.itemText}>x{item.qty}</Text>
                                <Text style={styles.itemText}>{item.price.toLocaleString()}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Total */}
                    <View style={styles.totalRow}>
                        <Text>Total:</Text>
                        <Text>{total.toLocaleString()}</Text>
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