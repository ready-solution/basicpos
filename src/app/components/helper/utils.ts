export function objectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            formData.set(key, JSON.stringify(obj[key]));
        } else {
            formData.set(key, obj[key]);
        }
    }
    return formData;
}
