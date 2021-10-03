import React from "react";
import packageJson from "package.json";
import SidebarLink from "./SidebarLink";

const Sidebar = ({ pathname, open }: { pathname: string; open: boolean }): JSX.Element => {
    return (
        <div
            className={`bg-neutral-800 flex-col justify-between w-full md:w-auto lg:w-60 flex absolute md:relative min-h-mobilemain md:min-h-main ${
                open ? "-left-0" : "-left-full"
            } md:left-0 transition-all md:transition-none`}
        >
            <div className="flex flex-col">
                <ul>
                    <li>
                        <SidebarLink pathname={pathname} path="" label="Home" />
                    </li>
                    <li>
                        <SidebarLink pathname={pathname} path="search" label="Advanced search" />
                    </li>
                    <li>
                        <SidebarLink pathname={pathname} path="categories" label="Categories" />
                    </li>
                    <li>
                        <SidebarLink pathname={pathname} path="trending" label="New & trending" />
                    </li>
                    <li>
                        <SidebarLink pathname={pathname} path="creators" label="Creators" />
                    </li>
                </ul>
                <hr className="border-neutral-700" />
                <ul>
                    <li>
                        <SidebarLink pathname={pathname} path="play" label="Play local script" />
                    </li>
                    <li>
                        <SidebarLink pathname={pathname} path="manual" label="Manual mode" />
                    </li>
                    <li>
                        <SidebarLink pathname={pathname} path="auto" label="Auto mode" />
                    </li>
                    <li>
                        <SidebarLink pathname={pathname} path="modify" label="Modify script" />
                    </li>
                    <li>
                        <SidebarLink pathname={pathname} path="create" label="Create script" />
                    </li>
                </ul>
                <hr className="border-neutral-700" />
            </div>
            <ul>
                <li>
                    <hr className="border-neutral-700" />
                    <SidebarLink pathname={pathname} path="changelog" label="Changelog" />
                    <hr className="border-neutral-700" />
                    <div className="my-2 px-4 flex-col hidden lg:flex">
                        <span className="text-neutral-500 text-sm">
                            Funscript.io Version {packageJson.version}
                        </span>
                        <span className="text-neutral-500 text-sm">&copy; FunscriptIO 2021</span>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
