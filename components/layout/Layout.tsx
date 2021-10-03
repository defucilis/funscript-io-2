import React, { ReactNode, useState } from "react";
import Head from "next/head";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <div className="container mx-auto">{children}</div>
                </main>
            </div>
        </>
    );
};

export default Layout;
