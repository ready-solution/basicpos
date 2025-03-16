import { payment } from "@/actions/actions";

interface paymentType {
    payMethod: string;
}


export default function PaymentButton({ payMethod }: paymentType) {
    return (
        <div className="w-full">
            <form action={payment} className="w-[30%] mx-auto">
                <input type="text" value={payMethod} name="payment" className="hidden" readOnly />
                <button
                    className={`p-2 w-full mx-auto rounded-md cursor-pointer ${payMethod ? 'bg-green-600 hover:bg-green-800 text-white' : 'bg-gray-300 cursor-not-allowed text-gray-600'}`}
                    disabled={!payMethod} type="submit">
                    Payment
                </button>
            </form>
        </div>
    )
}