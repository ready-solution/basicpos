"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('product', term);
        } else {
            params.delete('product');
        }
        replace(`${pathname}?${params.toString()}`);
    }
    return (
        <div className="w-full flex justify-center">
            <div className="relative sm:w-[100%] md:w-[60%] lg:max-w-[500px]">
                <input
                    type="text"
                    className="bg-zinc-100 text-zinc-700 p-2 pl-10 w-full rounded-b-2xl focus:outline-none focus:ring-1 focus:ring-orange-600"
                    placeholder={placeholder}
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('product')?.toString()}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            </div>
        </div>
    )
}