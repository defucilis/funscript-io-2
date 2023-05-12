import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UAParser } from "ua-parser-js";

const Analytics = (): JSX.Element => {
    const router = useRouter();

    const checkSend = async () => {
        const hasCookie = document.cookie.match("funscriptio-visitor");

        const ua = new UAParser();
        const site = "V2";
        const browser = ua.getBrowser().name;
        const os = ua.getOS().name;
        const referrer = document.referrer.replace("https://", "").split("/")[0];
        //replace page slashes with semicolons
        const page = window.location.pathname.replace(/\//g, ";");

        if (process.env.NODE_ENV !== "production") {
            return;
        }

        if (!hasCookie) {
            //we create this temporary 6-hour cookie so that more pageviews
            //in the same browser don't count as a whole new site visitor
            //note that there is nothing actually stored in this cookie, it's
            //just there to tell the browser that this is a single session!
            const cookieContents = "privacy-always";
            const expiry = new Date(new Date().valueOf() + 3600000); //expires in 6 hours
            document.cookie = `funscriptio-visitor=${cookieContents};expires=${expiry.toUTCString()};path=/;SameSite=Lax;Secure`;
            await axios(
                `/api/analytics?event=visit&site=${site}&browser=${browser}&os=${os}&referrer=${referrer}&page=${page}`
            );
        } else {
            await axios(`/api/analytics?event=pageview&site=${site}&page=${page}`);
        }
    };

    useEffect(() => {
        checkSend();
    }, []);

    useEffect(() => {
        router.events.on("routeChangeComplete", checkSend);
        return () => {
            router.events.off("routeChangeComplete", checkSend);
        };
    }, [router]);

    return <></>;
};

export default Analytics;
