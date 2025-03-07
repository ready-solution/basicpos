import { payment } from "@/actions/actions";

interface paymentType {
    payMethod: string;
}


export default function PaymentButton({ payMethod }: paymentType) {
    return (
        <div className="w-full">
            <form action={payment}>
                <input type="text" value={payMethod} name="payment" className="hidden" readOnly />
                <button
                    className={`p-2 w-full rounded-md cursor-pointer ${payMethod ? 'bg-green-200 hover:bg-green-400 hover:text-white' : 'bg-gray-300 cursor-not-allowed'}`}
                    disabled={!payMethod} type="submit">
                    payment
                </button>
            </form>
        </div>
    )
}