import prisma from "@/lib/db";
import Link from "next/link";
import CategoryList from "./categoryList";

export default async function CatCont() {
    const categories = await prisma.category.findMany();

    return (
        <div className="w-full border-b border-zinc-500">
            <CategoryList categories={categories} />
        </div>
    )
}
