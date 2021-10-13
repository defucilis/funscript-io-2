import { CsvUploadResponse } from "./types";

export default class HandyUtils {
    /** Takes a CSV file and uploads it to the publicly-provided Handy server, to obtain a URL that can be sent to the Handy */
    static async uploadCsv(csv: File, filename?: string): Promise<CsvUploadResponse> {
        const url = "https://www.handyfeeling.com/api/sync/upload?local=true";
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
