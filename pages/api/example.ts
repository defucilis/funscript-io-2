import { NextApiRequest, NextApiResponse } from "next";

const doWork = async (url: string) => {
    const output = await fetch(url);
    const json = await output.text();
    return json;
};
export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const output = await doWork("https://www.google.com");
        res.statusCode = 200;
        res.json({ pageContents: output });
    } catch (error: any) {
        console.error("Failed to do work ", error.message);
        res.statusCode = error.statusCode || 200;
        res.json({ error: error.message });
    }
};
