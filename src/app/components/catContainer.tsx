import prisma from "@/lib/db"
import Link from "next/link";

export default async function CatCont() {
    const categories = await prisma.category.findMany();

    return (
        <div className="space-x-3 bg-orange-200">
            <Link href={'/order'} className="hover:bg-green-100 p-2">All</Link>
            {
                categories.map((cat, idx) => (
                    <Link
                        href={`/order/${cat.Id}`}
                        key={idx}
                        className="hover:bg-green-100 p-2"
                    >
                        {cat.Name}
                    </Link>
                ))
            }
        </div>
    )
}