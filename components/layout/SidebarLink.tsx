import Link from "next/link";
import { FaHome } from "react-icons/fa";
import {
    MdExplore,
    MdWeb,
    MdFiberNew,
    MdPerson,
    MdOndemandVideo,
    MdTune,
    MdTimeline,
    MdList,
    MdError,
    MdGamepad,
    MdMemory,
} from "react-icons/md";

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
            return <MdWeb className={iconClassName} />;
        case "trending":
            return <MdFiberNew className={iconClassName} />;
        case "creators":
            return <MdPerson className={iconClassName} />;
        case "play":
            return <MdOndemandVideo className={iconClassName} />;
        case "manual":
            return <MdGamepad className={iconClassName} />;
        case "auto":
            return <MdMemory className={iconClassName} />;
        case "modify":
            return <MdTune className={iconClassName} />;
        case "create":
            return <MdTimeline className={iconClassName} />;
        case "changelog":
            return <MdList className={iconClassName} />;
        default:
            return <MdError className={iconClassName} />;
    }
};

const SidebarLink = ({
    pathname,
    path,
    label,
}: {
    pathname: string;
    path: string;
    label: string;
}): JSX.Element => {
    return (
        <Link href={`/${path}`}>
            <a
                className={`flex items-center py-2 px-4 gap-4 hover:bg-neutral-700 ${
                    pathname === `/${path}` ? "bg-neutral-900 shadow-inner" : "bg-transparent"
                } transition-all`}
            >
                {GetIcon(path)}
                <span className="text-white inline md:hidden lg:inline">{label}</span>
            </a>
        </Link>
    );
};

export default SidebarLink;
