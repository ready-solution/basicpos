"use client"
import Link from "next/link";
import { FaMoneyCheckAlt, FaHistory, FaTshirt, FaDesktop } from "react-icons/fa";
import { usePathname } from "next/navigation";

const routes = [
    {
        name: "Order",
        url: "/order",
        icon: <FaMoneyCheckAlt size={'20'} />,
    },
    {
        name: "History",
        url: "/history",
        icon: <FaHistory size={'20'} />,
    },
    {
        name: "Product",
        url: "/product",
        icon: <FaTshirt size={'20'} />,
    },
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: <FaDesktop size={'20'} />,
    },
]
export default function Nav() {
    const pathname = usePathname();
    return (
        <div className="flex flex-col px-2 space-y-2 py-5 h-[100vh] bg-zinc-100">
            {
                routes.map((route, idx) => (
                    <Link href={route.url} key={idx} className={`p-1 hover:text-orange-600 ${pathname === route.url ? 'text-orange-600' : ''}`}>
                        <div className="flex flex-row">
                            {route.icon}
                            <div className="hidden md:flex pl-3 justify-center">
                                <div className="w-full h-full flex items-center">
                                    <p className="text-sm">{route.name}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}