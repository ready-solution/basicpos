"use client"

// import * as XLSX from "xlsx";
import ExcelJS from 'exceljs';
import { useState } from "react";
import { excelProduct } from "@/actions/actions";

export default function ExcelUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setError(null);  // Reset error when a new file is selected
        }
    };

    const handleFileUpload = async () => {
        if (file) {
            try {
                const reader = new FileReader();
                reader.onload = async () => {
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(reader.result as ArrayBuffer); // Load Excel file

                    const worksheet = workbook.worksheets[0]; // Get the first sheet
                    const data: any[] = [];

                    // Check if the first row exists and get column names from row 1
                    const firstRow = worksheet.getRow(1);
                    const columns = firstRow && firstRow.values && Array.isArray(firstRow.values) && firstRow.values.length > 1
                        ? firstRow.values.slice(1)  // Slice starting from index 1 to skip the empty cell
                        : [];


                    // Check if columns are valid (not null, undefined, or empty array)
                    if (columns.length > 0) {
                        // Start processing from row 2
                        worksheet.eachRow((row, rowNumber) => {
                            if (rowNumber > 1) { // Skip header row (row 1)
                                const rowData: Record<string, any> = {};
                                columns.forEach((col: any, idx: number) => {
                                    if (col) {
                                        rowData[col] = row.getCell(idx + 1).value; // Map the column to the value in the row
                                    }
                                });
                                data.push(rowData);
                            }
                        });

                        setJsonData(data); // Set the parsed data as JSON
                    } else {
                        setError("Invalid header row (columns missing).");
                    }
                };
                reader.readAsArrayBuffer(file); // Read file as an ArrayBuffer
            } catch (err) {
                setError("Error reading the file");
                console.error(err);
            }
        } else {
            setError("No file selected");
        }
    };

    const handleExcelPost = () => {
        try {
            const plainJsonData = jsonData.map(item => ({
                name: item.name,
                price: item.price,
                status: item.status,
                enabled: item.enabled === 1,
                categoryid: item.categoryid,
            }));

            excelProduct(plainJsonData);
            setFile(null)
            setJsonData([])
        }
        catch (err) {
            setError("error uploading to db")
        }
    }


    return (
        <div className="bg-yellow-100 w-[600px] mx-auto">
            <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="bg-white p-2 border"
            />
            <button
                onClick={handleFileUpload}
                className="bg-blue-100 hover:bg-blue-200 cursor-pointer mt-2 p-2"
            >
                Process File
            </button>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            {jsonData.length > 0 && (
                <div className="bg-yellow-100 w-[600px] mx-auto mt-5 p-5">
                    <h3 className="text-lg font-medium">Preview JSON Data</h3>
                    <pre className="bg-gray-100 p-3 text-xs overflow-auto">
                        {JSON.stringify(jsonData, null, 2)}
                    </pre>
                </div>
            )}
            <button className="bg-blue-100 hover:bg-blue-200 cursor-pointer mt-2 p-2" onClick={() => handleExcelPost()}>upload to db</button>
        </div>
    )
}