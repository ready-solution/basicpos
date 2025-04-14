"use client";
import ExcelJS from "exceljs";
import { useState } from "react";
import { batchAddCategories } from "@/actions/actions";

export function CategoryBatchUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploaded = e.target.files?.[0];
        if (uploaded) {
            setFile(uploaded);
            setError(null);
        }
    };

    const handleProcess = async () => {
        if (!file) return setError("No file selected");
        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(reader.result as ArrayBuffer);
                const worksheet = workbook.worksheets[0];

                const names: string[] = [];
                worksheet.eachRow((row, index) => {
                    const value = row.getCell(1).value?.toString().trim();
                    if (value) names.push(value);
                });

                setJsonData(names);
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error(err);
            setError("Failed to read Excel file.");
        }
    };

    const handleUpload = () => {
        if (!jsonData.length) return;
        batchAddCategories(jsonData);
        setFile(null);
        setJsonData([]);
    };

    return (
        <div className="mt-10">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Batch Upload Categories</h3>
            <div className="flex gap-2 mb-2">
                <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="px-4 py-2 border bg-white rounded text-sm" />
                <button onClick={jsonData.length === 0 ? handleProcess : handleUpload} className={`px-4 py-2 text-sm rounded text-white ${jsonData.length === 0 ? "bg-zinc-700 hover:bg-zinc-800" : "bg-green-600 hover:bg-green-700"}`}>
                    {jsonData.length === 0 ? "Process" : "Upload"}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {jsonData.length > 0 && (
                <div className="text-sm text-gray-700">
                    <p className="mb-2">Preview:</p>
                    <ul className="list-disc pl-5">
                        {jsonData.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
}