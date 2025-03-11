// import { addToCart } from "@/actions/actions";
import Link from "next/link";
import { addToCart } from "@/actions/actions";

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
        <div className="w-full flex flex-wrap gap-4">
            {product.map((x) => {
                // Check if this product has any variants
                const productVariants = variant.filter((v) => v.ProductId === x.Id);
                const hasVariant = productVariants.length > 0;

                return (
                    <div className="w-[170px]" key={x.Id}>
                        {hasVariant ? (
                            // If product has a variant, show Link instead of Add to Cart
                            <Link href={`/order/${x.Id}`} target="_blank" className="bg-red-100">
                                <div className="bg-blue-100 hover:bg-blue-200 rounded-md p-2">
                                    <p>{x.Name}</p>
                                    <p>{x.Price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                                </div>
                            </Link>
                        ) : (
                            // If product has NO variant, show Add to Cart form
                            <form action={addToCart} className="bg-yellow-100">
                                <input className="hidden" type="text" name="productId" value={x.Id} readOnly />
                                <input className="hidden" type="number" name="quantity" value={1} readOnly />
                                <button className="border-1 w-full rounded-sm p-2 text-sm bg-teal-50 hover:bg-amber-100 active:bg-amber-200 cursor-pointer" type="submit">
                                    <h3>{x.Name}</h3>
                                    <p>{x.Price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                                </button>
                            </form>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

