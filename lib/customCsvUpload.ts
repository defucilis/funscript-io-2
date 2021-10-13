import { Funscript } from "./funscript-utils/types";

export const testProcessFunscript = async (
    funscript: Funscript,
    filename?: string
): Promise<string> => {
    const url = "/api/uploadCsv";
    const response = await fetch(url, {
        method: "post",
        body: JSON.stringify({
            funscript,
            filename,
        }),
    });
    const newUrl = await response.json();
    return newUrl.url;
};
