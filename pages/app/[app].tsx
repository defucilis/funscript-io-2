import { useRouter } from "next/dist/client/router";
import Layout from "components/layout/Layout";
import AppDebug from "components/apps/AppDebug";
import useHandy from "lib/thehandy-react";
import Handy from "lib/thehandy";
import AppManual from "components/apps/AppManual";
import AppRandom from "components/apps/AppRandom";
import AppCycler from "components/apps/AppCycler";
import AppModify from "components/apps/AppModify";

const GetApp = (app: string, handy: Handy) => {
    switch (app) {
        // case "play":
        //     return <MdOndemandVideo className={iconClassName} />;
        case "manual":
            return <AppManual handy={handy} />;
        case "random":
            return <AppRandom handy={handy} />;
        case "cycler":
            return <AppCycler handy={handy} />;
        case "modify":
            return <AppModify />;
        // case "create":
        //     return <MdTimeline className={iconClassName} />;
        case "debug":
            return <AppDebug handy={handy} />;
    }

    return null;
};

export const AppRouter = (): JSX.Element => {
    const router = useRouter();
    const { handy } = useHandy();

    if (!handy)
        return (
            <Layout>
                <p>Loading...</p>
            </Layout>
        );

    return <Layout>{GetApp(router.query.app as string, handy)}</Layout>;
};

export default AppRouter;
