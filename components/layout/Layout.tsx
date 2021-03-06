import React, { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [router]);

    return (
        <>
            <Head>
                <title>Funscript.io</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header open={menuOpen} onToggleOpen={() => setMenuOpen(!menuOpen)} />
            <div className="flex w-full">
                <Sidebar open={menuOpen} />
                <main className="pt-4 px-4 min-h-mobilemain md:min-h-main bg-neutral-900 text-white flex-grow">
                    <div className="container mx-auto h-full">{children}</div>
                </main>
            </div>
        </>
    );
};

export default Layout;
