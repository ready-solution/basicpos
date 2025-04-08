import { addCategory } from "@/actions/actions";

export default function AddCategoryInput() {
    return (
        <div className="w-full flex justify-center py-5">
            <form action={addCategory}>
                <input
                    name="category"
                    title="category"
                    type="text"
                    className="bg-white p-2 w-[480px]"
                    placeholder="Add category"
                />
                <button type="submit" className="hidden">Submit</button>
            </form>
        </div>
    );
}