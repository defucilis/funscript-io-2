import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { FaGithub, FaHome } from "react-icons/fa";
import {
    MdExplore,
    MdOndemandVideo,
    MdTune,
    MdTimeline,
    MdList,
    MdError,
    MdGamepad,
    MdMemory,
    MdChangeHistory,
    MdWhatshot,
    MdPeople,
} from "react-icons/md";
import EroScriptsIcon from "./EroScriptsIcon";

const GetIcon = (path: string): JSX.Element => {
    const iconClassName = "text-white text-3xl";

    switch (path) {
        case "":
            return <FaHome className={iconClassName} />;
        case "home":
            return <FaHome className={iconClassName} />;
        case "search":
            return <MdExplore className={iconClassName} />;
        case "categories":
            return <MdList className={iconClassName} />;
        case "trending":
            return <MdWhatshot className={iconClassName} />;
        case "creators":
            return <MdPeople className={iconClassName} />;
        case "app/play":
            return <MdOndemandVideo className={iconClassName} />;
        case "app/manual":
            return <MdGamepad className={iconClassName} />;
        case "app/auto":
            return <MdMemory className={iconClassName} />;
        case "app/modify":
            return <MdTune className={iconClassName} />;
        case "app/create":
            return <MdTimeline className={iconClassName} />;
        case "changelog":
            return <MdChangeHistory className={iconClassName} />;
    }
    
    if(path.includes("github")) return <FaGithub className={iconClassName} />;
    if(path.includes("eroscripts")) return <EroScriptsIcon className={iconClassName} />;

    return <MdError className={iconClassName} />;
};

const SidebarLink = ({
    path,
    label,
}: {
    path: string;
    label: string;
}): JSX.Element => {
    const router = useRouter();
    const fullPath = router.pathname.includes("app/") ? "/app/" + String(router.query.app) : router.pathname;
    return (
        <Link href={path.includes("://") ? path : `/${path}`}>
            <a
                className={`flex items-center py-2 px-4 gap-4 hover:bg-neutral-700 ${
                    fullPath === `/${path}` ? "bg-neutral-900 shadow-inner" : "bg-transparent"
                } transition-all`}
            >
                {GetIcon(path)}
                <span className="text-white inline md:hidden lg:inline">{label}</span>
            </a>
        </Link>
    );
};

export default SidebarLink;
