import { addToCart } from "@/actions/actions";

export default async function ProductCard({ id, name, price }: { id: number; name: string; price: number }) {

    return (
        <div className="w-[170px]">
            <form action={addToCart} className="bg-yellow-100">
                <input className="hidden" type="text" name="productId" value={id} readOnly/>
                <input className="hidden" type="number" name="quantity" value={1} readOnly/>
                <button className="border-1 w-full rounded-sm p-2 text-sm bg-teal-50 hover:bg-amber-100 active:bg-amber-200 cursor-pointer" type="submit">
                    <h3>{name}</h3>
                    <p>{price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                </button>
            </form>
        </div>
    );
}
