"use client";

import ExcelJS from 'exceljs';
import { useState } from "react";
import Link from 'next/link';
import FormatDownload from './batchFormat';
import { excelProduct } from "@/actions/actions";
import { BiArrowBack } from "react-icons/bi";

type Props = {
    categoryList: {
        Id: number;
        Name: string;
        Slug: string;
    }[];
};

export default function ExcelUpload({ categoryList }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setError(null);
        }
    };

    const handleFileUpload = async () => {
        if (!file) return setError("No file selected");
        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(reader.result as ArrayBuffer);

                const worksheet = workbook.worksheets[0];
                const data: any[] = [];
                const firstRow = worksheet.getRow(1);
                const columns = firstRow?.values && Array.isArray(firstRow.values) && firstRow.values.length > 1
                    ? firstRow.values.slice(1)
                    : [];

                if (!columns.length) return setError("Invalid header row (columns missing). ");

                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber > 1) {
                        const rowData: Record<string, any> = {};
                        columns.forEach((col: any, idx: number) => {
                            if (col) rowData[col] = row.getCell(idx + 1).value;
                        });
                        data.push(rowData);
                    }
                });

                const grouped: Record<string, any> = {};
                data.forEach(item => {
                    const name = item.name;
                    if (!grouped[name]) grouped[name] = {
                        name,
                        price: item.price,
                        stock: item.stock,
                        enabled: item.enabled === "yes",
                        categoryId: item.categoryId,
                        variants: []
                    };

                    if (item.size && item.color) grouped[name].variants.push({
                        size: item.size,
                        color: item.color,
                        vprice: item.vprice || item.price,
                        vstock: item.vstock || item.stock
                    });
                });

                setJsonData(Object.values(grouped));
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            setError("Error reading the file");
            console.error(err);
        }
    };

    const handleExcelPost = () => {
        try {
            const groupedData: Record<string, any> = {};

            jsonData.forEach(item => {
                const name = item.name;
                if (!groupedData[name]) groupedData[name] = {
                    name,
                    price: item.price,
                    stock: item.stock,
                    enabled: item.enabled === true,
                    categoryId: item.categoryId,
                    variants: []
                };

                if (item.variants?.length > 0) {
                    item.variants.forEach((v: any) => groupedData[name].variants.push({
                        size: v.size,
                        color: v.color,
                        vprice: v.vprice || item.price,
                        vstock: v.vstock || item.stock
                    }));
                }
            });

            excelProduct(Object.values(groupedData));
            setFile(null);
            setJsonData([]);
        } catch (err) {
            setError("Error uploading to db");
            console.error(err);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto min-h-[90vh] p-6">
            <div className="flex items-center justify-between mb-6">
                <Link href="/product" className="flex items-center text-sm text-zinc-600 hover:text-zinc-800">
                    <BiArrowBack className="mr-1" /> Back
                </Link>
                <FormatDownload categories={categoryList} />
            </div>

            <div className="flex flex-wrap gap-2 mb-2 items-center">
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="flex-grow px-4 py-2 border bg-white text-sm rounded"
                />
                <button
                    onClick={jsonData.length === 0 ? handleFileUpload : handleExcelPost}
                    className={`px-4 py-2 rounded text-white text-sm ${jsonData.length === 0 ? 'bg-zinc-700 hover:bg-zinc-800' : 'bg-green-600 hover:bg-green-800'}`}
                >
                    {jsonData.length === 0 ? 'Process' : 'Upload'}
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {jsonData.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowPreview(prev => !prev)}
                        className="mb-2 text-sm text-zinc-600 hover:underline"
                    >
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>

                    {showPreview && (
                        <div className="border rounded shadow">
                            <div className="p-4 text-sm font-mono whitespace-pre-wrap text-gray-800 max-h-[400px] overflow-y-auto">
                                {JSON.stringify(jsonData, null, 2)}
                            </div>
                            <p className="text-xs text-gray-500 text-center py-2 border-t">Feel free to review before uploading.</p>
                        </div>
                    )}
                </div>
            )}

            {jsonData.length === 0 && (
                <div className="mt-10">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">Excel Format Example</h3>
                    <div className="overflow-x-auto">
                        <table className="text-xs w-full border border-gray-300">
                            <thead className="bg-zinc-200 text-gray-700">
                                <tr>
                                    {["name", "price", "stock", "enabled", "categoryId", "size", "color", "vprice", "vstock"].map(header => (
                                        <th key={header} className="border px-2 py-1">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className='bg-white'>
                                {[
                                    ["Basic Shirt", 0, 0, "yes", 1, "S", "White", 200000, 25],
                                    ["Basic Jeans", 150000, 0, "yes", 2, "M", "Blue", 150000, 30],
                                    ["Basic Shoe", 600000, 35, "yes", 3, "L", "Blue", 600000, 30]
                                ].map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j} className="border px-2 py-1">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        *If product has variants, price/stock will be taken from <strong>vprice</strong> and <strong>vstock</strong>. If not provided, it will fallback to main product price/stock.
                    </p>
                </div>
            )}
        </div>
    );
}
