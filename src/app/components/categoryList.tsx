"use client"
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
    Id: Number;
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

    const handleCategoryClick = (slug: string) => {
        const params = new URLSearchParams(searchParams);
        if (slug) {
            params.set('category', slug);
        } else {
            params.set('category', slug);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-full overflow-x-auto">
            {/* Buttons for larger screens */}
            <div className="hidden sm:flex gap-4 overflow-x-auto">
                <Link
                    href='/order'
                    className="shrink-0 border border-transparent py-2 text-sm font-medium text-gray-800 hover:text-orange-600 cursor-pointer"
                >
                    All
                </Link>
                {
                    categories.map((cat, idx) => (
                        <button
                            key={idx} onClick={() => handleCategoryClick(cat.Slug)}
                            className="shrink-0 border border-transparent py-2 text-sm font-medium text-gray-800 hover:text-orange-600 cursor-pointer"
                        >
                            {cat.Name}
                        </button>
                    ))
                }
            </div>

            <div className="sm:hidden">
                <select
                    onChange={(e) => handleCategoryClick(e.target.value)}
                    className="w-full p-3 text-sm font-medium text-gray-800 border border-gray-300 rounded-lg focus:outline-none"
                >
                    <option value="">All</option>
                    {
                        categories.map((cat, idx) => (
                            <option key={idx} value={cat.Slug}>
                                {cat.Name}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}