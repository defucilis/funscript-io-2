import { NextApiRequest, NextApiResponse } from "next";
import { Funscript } from "lib/funscript-utils/types";
import firebase from "lib/firebase";
import { convertFunscriptToCsv } from "lib/funscript-utils/funConverter";

const writeFile = (bucket: any, path: string, data: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const file = bucket.file(path);
        try {
            const stream = bucket.file(path).createWriteStream({
                contentType: "text/plain",
            });
            stream.on("error", (err: any) => reject(err));
            stream.on("finish", () => {
                file.makePublic().then(() => {
                    resolve(file.publicUrl());
                });
            });
            stream.end(data);
        } catch (error: any) {
            reject(error);
        }
    });
};

const processFunscript = async (filename: string, funscript: Funscript): Promise<string> => {
    if (!firebase.database || !firebase.storage) throw new Error("Firebase failed to initialize");

    const d = new Date();
    const dayName = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const uniqueName = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
    const bucket = firebase.storage.bucket();
    try {
        await writeFile(bucket, `hoard/${filename}`, JSON.stringify(funscript));
        const csv = convertFunscriptToCsv(funscript)
            .map(d => d.join(","))
            .join("\n");
        const url = await writeFile(bucket, `csv/${dayName}/${uniqueName}.csv`, csv);
        if (!url) throw new Error("Failed to get public URL");
        return url;
    } catch (error: any) {
        console.error("Failed to write file:", error);
        throw error;
    }
};
export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const body = JSON.parse(req.body);
        const filename = body.filename || new Date().valueOf().toString();
        let funscript: Funscript | undefined = undefined;
        try {
            funscript = body.funscript;
            if (!funscript || !funscript.actions || funscript.actions.length === 0) {
                res.status(400).json({
                    result: "failed",
                    error: "No/invalid funscript provided",
                });
                return;
            }
        } catch {
            res.status(400).json({
                result: "failed",
                error: "No/invalid funscript provided",
            });
            return;
        }
        const url = await processFunscript(filename, funscript);
        res.status(200).json({
            result: "success",
            url,
        });
        return;
    } catch (error: any) {
        console.error("Failed to process funscript ", error.message);
        res.status(500).json({
            result: "failed",
            error: error.message,
        });
    }
};
