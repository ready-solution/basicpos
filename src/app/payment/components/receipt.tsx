"use client"

import { Page, Text, View, Document, StyleSheet, } from "@react-pdf/renderer"
import { PDFViewer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 40,
        paddingVertical: 10,
        fontSize: 10,
        fontFamily: 'Courier',
    },
    section: {
        marginBottom: 10,
        marginTop: 20
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
        marginBottom: 5,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: 10,
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
        marginVertical: 4,
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
    },
    variant: {
        fontSize: 9,
        color: 'grey'
    },
    invoiceNo: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 3,
        fontSize: 12
    },
    cancelledText: {
        textDecoration: 'line-through',
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
    Variant: Variant | null;
};

type Variant = {
    Id: number;
    ProductId: number;
    Size: string | null;
    Color: string | null;
    Price: number;
    Stock: number;
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
    const { Id, InvoiceNo, SubTotal, DiscItemTotal, Total, Status, isPrint, isEmail, createdAt, updatedAt, OrderDetails } = order;


    return (
        <PDFViewer style={{ width: '100%', height: '100%' }}>
            <Document>
                <Page
                    size={{ width: 298.5, height: order.OrderDetails.length * 30 + 280 }}
                    style={styles.page}
                >
                    {/* Store Information */}
                    <View style={styles.storeInfo}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                            {storeName}
                        </Text>
                        <Text style={styles.smallText}>{storeAddress}</Text>
                        <Text style={styles.smallText}>{storeContact}</Text>
                    </View>

                    <View style={styles.invoiceNo}>
                        <Text style={Status.toLowerCase() === "cancelled" ? styles.cancelledText : undefined}>
                            {InvoiceNo}
                        </Text>
                    </View>
                    <View style={styles.line}></View>

                    {/* Purchased Items */}
                    <View style={styles.section}>
                        {order.OrderDetails.map((item, index) => (
                            <View style={styles.flexBox} key={index}>
                                <View>
                                    <Text style={styles.itemText}>x{item.Qty} {item.Product.Name}</Text>
                                    {/* Display variant if available */}
                                    {item.Variant && (
                                        <Text style={styles.variant}>
                                            {item.Variant.Size ? `Size: ${item.Variant.Size}` : ''}{item.Variant.Color ? ` | Color: ${item.Variant.Color}` : ''}
                                        </Text>
                                    )}
                                </View>

                                <View>
                                    <Text style={styles.itemText}>
                                        {(item.Price * item.Qty).toLocaleString('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}
                                    </Text>
                                    {/* Display discount if available */}
                                    {item.Discount > 0 && (
                                        <Text style={styles.itemText}>
                                            - {item.Discount.toLocaleString('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.line}></View>

                    <View style={styles.totalRow}>
                        <Text>Subtotal:</Text>
                        <Text>{SubTotal.toLocaleString()}</Text>
                    </View>

                    {/* Conditional Discount Row */}
                    {DiscItemTotal > 0 && (
                        <View style={styles.totalRow}>
                            <Text>Discount:</Text>
                            <Text>- {DiscItemTotal.toLocaleString()}</Text>
                        </View>
                    )}

                    {/* Total */}
                    <View style={styles.totalRow}>
                        <Text>Total:</Text>
                        <Text>{Total.toLocaleString()}</Text>
                    </View>

                    {/* Footer */}
                    <Text style={styles.footer}>
                        Thanks for choosing us! We can't wait to see you again. Happy shopping!
                    </Text>
                </Page>
            </Document>
        </PDFViewer>
    )
}