"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
    Id: number;
    Name: string;
    Slug: string;
};

type CategoryListProps = {
    categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentCategory = searchParams.get("category");

    const handleCategoryClick = (slug: string) => {
        if (slug === currentCategory) return; // avoid unnecessary rerender

        const params = new URLSearchParams(searchParams);
        if (slug) {
            params.set("category", slug);
        } else {
            params.delete("category");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-full bg-zinc-200 px-1">
            <div className="hidden sm:flex overflow-x-auto no-scrollbar gap-1 py-2 px-1">
                <button
                    onClick={() => handleCategoryClick("")}
                    className={`shrink-0 rounded px-4 py-2 text-sm font-medium border transition-all cursor-pointer
                        ${!currentCategory ? "bg-zinc-700 text-white" : "text-gray-800 hover:bg-zinc-600 hover:text-white"}`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.Id}
                        onClick={() => handleCategoryClick(cat.Slug)}
                        className={`shrink-0 rounded px-4 py-2 text-sm font-medium border transition-all cursor-pointer
                            ${currentCategory === cat.Slug ? "bg-zinc-700 text-white" : "text-gray-800 hover:bg-zinc-600 hover:text-white"}`}
                    >
                        {cat.Name}
                    </button>
                ))}
            </div>

            {/* Mobile dropdown */}
            <div className="sm:hidden p-2">
                <select
                    onChange={(e) => handleCategoryClick(e.target.value)}
                    value={currentCategory || ""}
                    className="w-full border border-zinc-700 text-sm rounded px-2 py-2 bg-white text-gray-800"
                >
                    <option value="">All</option>
                    {categories.map((cat) => (
                        <option key={cat.Id} value={cat.Slug}>
                            {cat.Name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
