const baseUrl = "https://scripts01.handyfeeling.com/api/script/v0/";

export default class HandyUtils {
    /** Takes a CSV file and uploads it to the publicly-provided Handy server, to obtain a URL that can be sent to the Handy */
    static async uploadCsv(csv: File, filename?: string): Promise<string> {
        const url = baseUrl + "temp/upload";
        if (!filename) filename = "script_" + new Date().valueOf() + ".csv";
        const formData = new FormData();
        formData.append("file", csv, filename);
        const response = await fetch(url, {
            method: "post",
            body: formData,
        });
        const newUrl = (await response.json()).url;
        return newUrl;
    }
}
