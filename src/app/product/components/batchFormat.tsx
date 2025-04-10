'use client';

import { Workbook } from 'exceljs';

type Props = {
    categories: {
        Id: number;
        Name: string;
        Slug: string;
    }[];
};

export default function FormatDownload({ categories }: Props) {
    const handleDownload = async () => {
        const workbook = new Workbook();

        // Sheet 1: FillHere
        const fillSheet = workbook.addWorksheet('FillHere');
        fillSheet.addRow([
            'name',
            'price',
            'stock',
            'enabled',
            'categoryId',
            'size',
            'color',
            'vprice',
            'vstock',
        ]);

        // Sheet 2: CategoryList
        const categorySheet = workbook.addWorksheet('CategoryList');
        categorySheet.addRow(['id', 'category']);
        categories.forEach((cat) => {
            categorySheet.addRow([cat.Id, cat.Name]);
        });

        // Sheet 3: Example
        const exampleSheet = workbook.addWorksheet('Example');
        exampleSheet.addRow([
            'name',
            'price',
            'stock',
            'enabled',
            'categoryId',
            'size',
            'color',
            'vprice',
            'vstock',
        ]);
        exampleSheet.addRow([
            'PRODUCT NAME',
            'PRODUCT PRICE - FILL IF NO VARIANT',
            'PRODUCT STOCK - FILL IF NO VARIANT',
            'yes / no',
            'Check sheet-2 to see category id',
            'PRODUCT SIZE',
            'PRODUCT COLOR',
            'VARIANT PRICE',
            'VARIANT STOCK',
        ]);
        exampleSheet.addRow([
            'Basic Shirt',
            0,             // price
            0,             // stock
            'yes',         // enabled
            1,             // categoryId
            'S',           // size
            'White',       // color
            200000,        // vprice
            25,            // vstock
        ]);
        exampleSheet.addRow([
            'Basic Shirt',
            0,
            0,
            'yes',
            1,
            'M',
            'White',
            150000,
            30,
        ]);
        exampleSheet.addRow([
            'Basic Shirt',
            0,
            0,
            'yes',
            1,
            'L',
            'White',
            600000,
            30,
        ]);
        exampleSheet.addRow([
            'Plain White Tshirt',
            500000,
            100,
            'yes',
            1,
            '',
            '',
            '',
            '',
        ]);
        exampleSheet.addRow([
            'Converse Black',
            700000,
            200,
            'yes',
            3,
            '',
            '',
            '',
            '',
        ]);
        exampleSheet.addRow([
            'Levis Jeans',
            650000,
            75,
            'yes',
            2,
            '',
            '',
            '',
            '',
        ]);
        // Export the file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'POS_Upload_Format.xlsx';
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className="w-[200px] px-4 py-2 rounded text-white text-sm bg-zinc-700 hover:bg-zinc-800 cursor-pointer"
        >
            Download Format
        </button>
    );
}
