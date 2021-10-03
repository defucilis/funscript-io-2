import { AppProps } from "next/dist/shared/lib/router/router";
import React, { ReactNode } from "react";
import { HandyProvider } from "lib/thehandy-react";
import "../styles/app.css";

function MyApp({ Component, pageProps }: AppProps): ReactNode {
    return (
        <HandyProvider verbose={true}>
            <Component {...pageProps} />
        </HandyProvider>
    );
}

export default MyApp;
