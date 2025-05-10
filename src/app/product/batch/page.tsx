import ExcelUpload from "../components/excelUpload";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BatchUploadPage() {
    const categoryList = await prisma.category.findMany();

    return (
        <div className="w-full bg-zinc-100">
            <ExcelUpload categoryList={categoryList} />
        </div>
    )
}