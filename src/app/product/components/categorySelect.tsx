// CategorySelect.tsx - Client Component
"use client";

import { useState } from "react";

type Category = {
    Id: number;
    Name: string;
};

type CategorySelectProps = {
    categories: Category[];
    defaultValue: number | undefined;
};

export default function CategorySelect({ categories, defaultValue }: CategorySelectProps) {
    const [isEnabled, setIsEnabled] = useState(false); // Initially disabled
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(defaultValue);

    const handleToggle = () => {
        setIsEnabled((prev) => !prev);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(Number(e.target.value));
    };

    return (
        <div className="flex items-end space-x-4">
            <div className="w-full mt-5">
                <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-2">Product Category</label>
                <select
                    name="category"
                    id="category"
                    value={selectedCategory}
                    onChange={handleChange}
                    disabled={!isEnabled}
                    className={`w-full bg-zinc-200 px-4 ${isEnabled? "cursor-pointer" : "cursor-no-drop"} py-2 border border-zinc-300 focus:outline-none text-sm`}
                >
                    {categories.map((x) => (
                        <option value={x.Id} key={x.Id}>
                            {x.Name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={handleToggle}
                className={`py-2 px-4 w-[70px] text-white bg-zinc-600 hober:bg-zinc-800 font-semibold text-sm border focus:outline-none cursor-pointer`}
            >
                {isEnabled ? 'Lock' : 'Edit'}
            </button>
        </div>
    );
}
