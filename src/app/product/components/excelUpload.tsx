"use client"

import ExcelJS from 'exceljs';
import { useState } from "react";
import Link from 'next/link';
import { excelProduct } from "@/actions/actions";
import { BiArrowBack } from "react-icons/bi";

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

                        // Group products by name and add variants
                        const groupedData: Record<string, any> = {};

                        data.forEach(item => {
                            const productName = item.name;

                            // If the product doesn't exist in the groupedData, initialize it
                            if (!groupedData[productName]) {
                                groupedData[productName] = {
                                    name: item.name,
                                    price: item.price,
                                    stock: item.stock,
                                    enabled: item.enabled === "yes", // Convert "yes" to boolean
                                    categoryId: item.categoryId,
                                    variants: [] // Initialize variants as an empty array
                                };
                            }

                            // If size and color are provided, treat it as a variant
                            if (item.size && item.color) {
                                groupedData[productName].variants.push({
                                    size: item.size,
                                    color: item.color,
                                    vprice: item.vprice || item.price, // Use main product price if no variant price
                                    vstock: item.vstock || item.stock // Use main product stock if no variant stock
                                });
                            }
                        });

                        // Flatten the grouped data into an array
                        const plainJsonData = Object.values(groupedData);

                        setJsonData(plainJsonData); // Set the grouped data for preview
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

    interface Variant {
        size: string;
        color: string;
        vprice: number;
        vstock: number;
    }
    
    const handleExcelPost = () => {
        try {
            const groupedData: Record<string, any> = {}; // To store the grouped products
    
            // Group products and variants
            jsonData.forEach(item => {
                const productName = item.name;
    
                // If the product doesn't exist in the groupedData, initialize it
                if (!groupedData[productName]) {
                    groupedData[productName] = {
                        name: item.name,
                        price: item.price,
                        stock: item.stock,
                        enabled: item.enabled === true, // Ensure boolean conversion for enabled
                        categoryId: item.categoryId,
                        variants: [] // Initialize variants as an empty array
                    };
                }
    
                // Loop through the variants if they exist in the item
                if (item.variants && item.variants.length > 0) {
                    item.variants.forEach((variant: Variant) => {
                        // Add the variant data to the variants array for the product
                        groupedData[productName].variants.push({
                            size: variant.size,
                            color: variant.color,
                            vprice: variant.vprice || item.price, // Use main product price if no variant price
                            vstock: variant.vstock || item.stock // Use main product stock if no variant stock
                        });
                    });
                }
    
                // Debug log to check the current product and its variants
                console.log(`Processed item: ${productName}`, groupedData[productName]);
            });
    
            // Flatten the grouped data into an array
            const plainJsonData = Object.values(groupedData); // Convert groupedData object into an array
    
            // Debug log to see the final structure of the grouped data
            console.log("Final grouped data:", JSON.stringify(plainJsonData, null, 2));
    
            // Pass the formatted data to the action function
            excelProduct(plainJsonData);
    
            setFile(null);
            setJsonData([]);
        } catch (err) {
            setError("Error uploading to db");
            console.error(err);
        }
    };    

    return (
        <div className="bg-zinc-100 w-full p-5 h-full overflow-x-auto">
            <div className='w-full flex'>
                <Link href='/product' className='flex items-center space-x-1 focus:outline-none text-zinc-600 hover:text-zinc-800 hover:font-medium'>
                    <BiArrowBack className='text-lg' />
                    <span className='text-sm p-0'>Back</span>
                </Link>

                <div className="flex w-[480px] mx-auto space-x-2">
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="w-4/5 px-4 py-3 border bg-white border-gray-300 focus:outline-none text-sm"
                    />
                    <div className="flex w-1/5">
                        {/* Process File Button */}
                        {jsonData.length === 0 && (
                            <button
                                onClick={handleFileUpload}
                                className="w-full py-3 bg-zinc-600 hover:bg-zinc-800 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition-all"
                            >
                                Process
                            </button>
                        )}

                        {/* Upload to Database Button */}
                        {jsonData.length > 0 && (
                            <button
                                className="w-full py-3 bg-zinc-600 text-white hover:bg-zinc-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                                onClick={handleExcelPost}
                            >
                                Upload
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* JSON Preview Section */}
            {jsonData.length > 0 && (
                <div className="w-[480px] mx-auto mt-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">Preview</h3>
                    <pre className="bg-zinc-950 text-gray-200 max-h-[80vh] p-4 text-xs overflow-y-auto">
                        {JSON.stringify(jsonData, null, 2)}
                    </pre>
                    <p className='py-2 text-zinc-500 text-center'>Please check and make sure your data is correct.</p>
                </div>
            )}
        </div>
    )
}
