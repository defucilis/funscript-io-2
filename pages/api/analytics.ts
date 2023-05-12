import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const getDateString = () => {
    const year: string = new Date().getFullYear().toString();
    let month: number | string = new Date().getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day: number | string = new Date().getDate();
    if (day < 10) day = "0" + day;
    return `${year}-${month}-${day}`;
};

function initMiddleware(middleware: any) {
    return (req: any, res: any) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result: any) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
}

const cors = initMiddleware(
    Cors({
        methods: ["GET"],
        origin: ["funscript.io", "beta.funscript.io", "www.funscript.io", "www.beta.funscript.io"],
    })
);

const increment = { ".sv": { increment: 1 } };

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    await cors(req, res);

    const site = (req.query.site || "") as string;
    const eventType = (req.query.event || "") as string;
    const page = (req.query.page || "") as string;
    const browser = (req.query.browser || "") as string;
    const os = (req.query.os || "") as string;
    const referrer = (req.query.referrer || "noreferrer") as string;
    const dayString = getDateString();
    console.log({ eventType, page, browser, os, referrer, dayString });

    if (eventType === "visit") {
        await axios.put(
            `${process.env.FIREBASE_DATABASE_URL}/analytics/${site}/visits/total.json`,
            increment
        );
        await axios.put(
            `${process.env.FIREBASE_DATABASE_URL}/analytics/${site}/visits/${dayString}.json`,
            increment
        );
        await axios.put(
            `${process.env.FIREBASE_DATABASE_URL}/analytics/${site}/browsers/${browser}.json`,
            increment
        );
        await axios.put(
            `${process.env.FIREBASE_DATABASE_URL}/analytics/${site}/systems/${os}.json`,
            increment
        );
        await axios.put(
            `${process.env.FIREBASE_DATABASE_URL}/analytics/${site}/referrers/${referrer}.json`,
            increment
        );
    }
    await axios.put(
        `${process.env.FIREBASE_DATABASE_URL}/analytics/${site}/pages/${page}.json`,
        increment
    );

    res.status(200).json({ result: "success" });
};
