import Image from "next/image";
import Layout from "components/layout/Layout";
import useDimensions from "lib/hooks/useDimensions";

export const Home = (): JSX.Element => {
    const { width, height } = useDimensions();

    return (
        <Layout>
            <div className="h-3/4 grid place-items-center">
                <div>
                    <div className="w-full text-center">
                        <Image
                            src="/logo512.png"
                            width={Math.min(width * 0.5, height * 0.25)}
                            height={Math.min(width * 0.5, height * 0.25)}
                        />
                    </div>
                    <h1 className="w-full text-center text-5xl font-bold">Funscript.io</h1>
                    <h3 className="w-full text-center text-xl leading-none mt-2">
                        {"Create Funscripts"}
                        <br />
                        {"Modify Funscripts"}
                        <br />
                        {"Enjoy Funscripts"}
                    </h3>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
