import prisma from "@/lib/db";
import TotalSalesContainer from "../components/totalSalesReport";
import ProductPerformanceReport from "../components/productPerformanceReport";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const orders = await prisma.order.findMany({
        select: {
            Total: true,
            createdAt: true,
            PaymentType: true,
            Status: true
        },
    });

    const orderDetails = await prisma.orderDetail.findMany({
        select: {
            ProductId: true,
            Qty: true,
            TotalPrice: true,
            Order: {
                select: {
                    createdAt: true,
                    Status: true,
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

    const products = await prisma.product.findMany();

    return (
        <div className="w-full max-h-screen overflow-y-auto bg-zinc-100 p-4">
            <TotalSalesContainer orders={orders} />
            <ProductPerformanceReport orderDetails={orderDetails} categories={categories} products={products} />
        </div>
    );
}