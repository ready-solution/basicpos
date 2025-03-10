import Link from "next/link"

const routes = [
    {
        name: "order",
        url: "/order"
    },
    {
        name: "history",
        url: "/history"
    },
    {
        name: "product",
        url: "/product"
    },
    {
        name: "dashboard",
        url: "/dashboard"
    },
]
export default function Nav() {
    return (
        <div className="bg-blue-100 flex flex-col space-y-2 p-2 h-[100vh] fixed left-0">
            {
                routes.map((route, idx) => (
                    <Link href={route.url} key={idx} className="bg-red-100 p-1 hover:bg-green-100">
                        {route.name}
                    </Link>
                ))
            }
        </div>
    )
}