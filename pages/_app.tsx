import { Router } from "next/router";
import Head from "next/head";
import { AppProps } from "next/dist/shared/lib/router/router";
import React, { ReactNode } from "react";
import NProgress from "nprogress";
import { HandyProvider } from "lib/thehandy-react";

import "nprogress/nprogress.css";

import "../styles/app.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps): ReactNode {
    return (
        <HandyProvider verbose={true}>
            <Head>
                <title>Funscript.io</title>
            </Head>
            <Component {...pageProps} />
        </HandyProvider>
    );
}

export default MyApp;
