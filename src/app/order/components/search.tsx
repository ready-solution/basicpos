"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation";

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
        <div>
            <div className="w-full flex justify-center space-x-5 mx-auto">
                <input
                    type="text"
                    className="bg-white p-2 w-[60%]"
                    placeholder={placeholder}
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>
        </div>
    )
}