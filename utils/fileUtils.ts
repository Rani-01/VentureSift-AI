
/**
 * Converts a File object into a Base64 encoded string.
 * This is necessary for embedding file content in the Gemini API request.
 * @param file - The File object to convert.
 * @returns A promise that resolves with the Base64 encoded string (without the data URL prefix).
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix e.g. "data:image/png;base64,"
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
};
