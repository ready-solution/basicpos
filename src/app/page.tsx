import Link from "next/link";

export default function Home() {
  const storeName = process.env.STORE_NAME;
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-zinc-100">
      <Link href="/order" className="py-2 px-4 bg-zinc-800 text-white rounded">Start new order</Link>
    </div>
  );
}