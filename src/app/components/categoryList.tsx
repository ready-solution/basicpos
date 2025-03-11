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

        // Replace the current URL with the updated one without refreshing the page
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-6 w-full">
            <Link
                href='/order'
                className="shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
            >
                All
            </Link>
            {
                categories.map((cat, idx) => (
                    <button
                        key={idx} onClick={() => handleCategoryClick(cat.Slug)}
                        className="shrink-0 border border-transparent p-3 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {cat.Name}
                    </button>
                ))
            }
        </div>
    )
}