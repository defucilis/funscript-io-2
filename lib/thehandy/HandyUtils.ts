import { CsvUploadResponse } from "./types";

export default class HandyUtils {
    static async uploadCsv(csv: File, filename?: string): Promise<CsvUploadResponse> {
        const url = "https://www.handyfeeling.com/api/sync/upload";
        if (!filename) filename = "script_" + new Date().valueOf() + ".csv";
        const formData = new FormData();
        formData.append("syncFile", csv, filename);
        const response = await fetch(url, {
            method: "post",
            body: formData,
        });
        const newUrl = await response.json();
        return newUrl;
    }
}
