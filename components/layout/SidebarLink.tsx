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
    MdChangeHistory,
    MdWhatshot,
    MdPeople,
    MdCode,
    MdShuffle,
    MdRepeat,
} from "react-icons/md";
import EroScriptsIcon from "../atoms/EroScriptsIcon";

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
        case "app/random":
            return <MdShuffle className={iconClassName} />;
        case "app/cycler":
            return <MdRepeat className={iconClassName} />;
        case "app/modify":
            return <MdTune className={iconClassName} />;
        case "app/create":
            return <MdTimeline className={iconClassName} />;
        case "app/debug":
            return <MdCode className={iconClassName} />;
        case "changelog":
            return <MdChangeHistory className={iconClassName} />;
    }

    if (path.includes("github")) return <FaGithub className={iconClassName} />;
    if (path.includes("eroscripts")) return <EroScriptsIcon className={iconClassName} />;

    return <MdError className={iconClassName} />;
};

const SidebarLink = ({ path, label }: { path: string; label: string }): JSX.Element => {
    const router = useRouter();
    const fullPath = router.pathname.includes("app/")
        ? "/app/" + String(router.query.app)
        : router.pathname;
    return (
        <Link href={path.includes("://") ? path : `/${path}`}>
            <a
                className={`flex items-center py-2 px-4 gap-4 hover:bg-neutral-700 ${
                    fullPath === `/${path}`
                        ? "bg-neutral-900 shadow-inner border-b border-neutral-700"
                        : "bg-transparent"
                } transition-all`}
                target={path.includes("://") ? "_blank" : ""}
            >
                {GetIcon(path)}
                <span className="text-white inline md:hidden lg:inline">{label}</span>
            </a>
        </Link>
    );
};

export default SidebarLink;
