import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,400;0,700;1,100;1,400;1,700&family=JetBrains+Mono"
                        rel="stylesheet"
                    />
                </Head>
                <body style={{ marginTop: 0, marginBottom: 0 }}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
