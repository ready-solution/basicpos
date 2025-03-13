// import { addToCart } from "@/actions/actions";
import Link from "next/link";
import { addToCart } from "@/actions/actions";
import ModalCard from "./modalOrderCard";
import { FaThList } from "react-icons/fa";

type Product = {
    Id: number;
    Name: string;
    Slug: string;
    Price: number;
    Enabled: boolean;
    Stock: number;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
}

type Variant = {
    Id: number;
    Price: number;
    Stock: number;
    ProductId: number;
    Size: string | null;
    Color: string | null;
}

type ProductCardProps = {
    product: Product[];
    variant: Variant[];
};

export default async function ProductCard({ product, variant }: ProductCardProps) {
    return (
        <div className="w-full flex flex-wrap gap-3">
            {product.map((x) => {
                const productVariants = variant.filter((v) => v.ProductId === x.Id);
                const hasVariant = productVariants.length > 0;

                return (
                    <div className="w-1/6 min-w-[140px]" key={x.Id}>
                        {hasVariant ? (
                            // If product has a variant, show Link instead of Add to Cart
                            // <Link href={`/order/${x.Id}`} target="_blank" className="text-sm w-full">
                            //     <div className="bg-zinc-100 hover:bg-zinc-200 p-2 flex flex-col items-start">
                            //         <p>{x.Name}</p>
                            //         <div className="flex justify-between w-full items-end">
                            //             <p>{x.Price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                            //             <FaThList  size={10} />
                            //         </div>
                            //     </div>
                            // </Link>
                            <ModalCard product={x} variant={productVariants} />
                        ) : (
                            // If product has NO variant, show Add to Cart form
                            <form action={addToCart} >
                                <input className="hidden" type="text" name="productId" value={x.Id} readOnly />
                                <input className="hidden" type="number" name="quantity" value={1} readOnly />
                                <button className="w-full text-sm bg-stone-700 hover:bg-stone-800 active:bg-amber-200 cursor-pointer" type="submit">
                                    <div className="p-2 flex flex-col items-start text-stone-100">
                                        <h3>{x.Name}</h3>
                                        <p>{x.Price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                                    </div>
                                </button>
                            </form>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

