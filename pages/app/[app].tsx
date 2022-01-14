import { useRouter } from "next/dist/client/router";
import Layout from "components/layout/Layout";
import AppList from "components/apps/AppList";
import AppManual from "components/apps/AppManual";
import AppRandom from "components/apps/AppRandom";
import AppCycler from "components/apps/AppCycler";
import AppModify from "components/apps/AppModify";
import AppCreate from "components/apps/AppCreate";
import AppPlay from "components/apps/AppPlay";

const GetApp = (app: string) => {
    switch (app) {
        case "play":
            return <AppPlay />;
        case "manual":
            return <AppManual />;
        case "random":
            return <AppRandom />;
        case "cycler":
            return <AppCycler />;
        case "modify":
            return <AppModify />;
        case "create":
            return <AppCreate />;
        case "list":
            return <AppList />;
        case "debug":
            return <AppList />;
    }

    return null;
};

export const AppRouter = (): JSX.Element => {
    const router = useRouter();

    return <Layout>{GetApp(router.query.app as string)}</Layout>;
};

export default AppRouter;
