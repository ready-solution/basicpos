import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Link href="/order" className="p-2 bg-zinc-100 rounded-md">Start new order</Link>
    </div>
  );
}