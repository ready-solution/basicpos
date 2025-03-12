import Link from "next/link";

export default function PayContainer() {

    return (
        <Link href="/order/payment" className="p-2 bg-green-600 w-full hover:bg-green-800 active:bg-green-700 hover:text-white rounded-md cursor-pointer">
            <p className="text-center text-white">Proceed</p>
        </Link>
    )
}