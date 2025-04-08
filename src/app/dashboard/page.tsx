import prisma from "@/lib/db";
import TotalSalesContainer from "../components/totalSalesReport";
import ProductPerformanceReport from "../components/productPerformanceReport";

export default async function DashboardPage() {
    const orders = await prisma.order.findMany({
        select: {
            Total: true,
            createdAt: true,
            PaymentType: true
        },
    });

    const orderDetails = await prisma.orderDetail.findMany({
        select: {
            ProductId: true,
            Qty: true,
            TotalPrice: true,
            Order: {
                select: {
                    createdAt: true
                }
            },
            Product: {
                select: {
                    Name: true,
                    Slug: true,
                    categoryId: true,
                    Category: {
                        select: { Name: true }
                    }
                }
            }
        }
    });

    const categories = await prisma.category.findMany({
        select: {
            Id: true,
            Name: true,
        }
    });
    
    return (
        <div className="w-full bg-zinc-100 p-4">
            <TotalSalesContainer orders={orders} />
            <ProductPerformanceReport orderDetails={orderDetails} categories={categories} />
        </div>
    );
}