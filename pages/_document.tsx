import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <title>Funscript.io</title>
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
