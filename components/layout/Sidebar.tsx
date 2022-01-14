import React from "react";
import packageJson from "package.json";
import SidebarLink from "./SidebarLink";

const Sidebar = ({ open }: { open: boolean }): JSX.Element => {
    return (
        <div
            className={`bg-neutral-800 flex-col justify-between w-full md:w-auto lg:w-60 flex absolute md:relative min-h-mobilemain md:min-h-main z-40 ${
                open ? "-left-0" : "-left-full"
            } md:left-0 transition-all md:transition-none`}
        >
            <div className="flex flex-col">
                <ul>
                    <li>
                        <SidebarLink path="" label="Home" />
                    </li>
                    {/* <li>
                        <SidebarLink path="search" label="Advanced search" />
                    </li>
                    <li>
                        <SidebarLink path="categories" label="Categories" />
                    </li>
                    <li>
                        <SidebarLink path="trending" label="New & trending" />
                    </li>
                    <li>
                        <SidebarLink path="creators" label="Creators" />
                    </li> */}
                </ul>
                <hr className="border-neutral-900 my-1" />
                <ul>
                    <li>
                        <SidebarLink path="app/play" label="Play local script" />
                    </li>
                    <li>
                        <SidebarLink path="app/manual" label="Manual mode" />
                    </li>
                    <li>
                        <SidebarLink path="app/random" label="Random mode" />
                    </li>
                    <li>
                        <SidebarLink path="app/cycler" label="Cycler mode" />
                    </li>
                    <li>
                        <SidebarLink path="app/modify" label="Modify script" />
                    </li>
                    <li>
                        <SidebarLink path="app/list" label="List scripts" />
                    </li>
                    {/* <li>
                        <SidebarLink path="app/create" label="Create script" />
                    </li> */}
                    {/* <li>
                        <SidebarLink path="app/debug" label="Debug Mode" />
                    </li> */}
                </ul>
                <hr className="border-neutral-900 my-1" />
            </div>
            <div>
                <hr className="border-neutral-900 my-1" />
                <ul>
                    <li>
                        <SidebarLink
                            path="https://github.com/defucilis/funscript-io"
                            label="GitHub repository"
                        />
                        <SidebarLink
                            path="https://discuss.eroscripts.com/t/funscript-io-a-website-for-playing-modifying-and-generating-funscripts/20624"
                            label="EroScripts thread"
                        />
                        <SidebarLink path="changelog" label="Changelog" />
                    </li>
                </ul>
                <hr className="border-neutral-900 my-1" />
                <ul>
                    <li>
                        <div className="my-2 px-4 flex-col hidden lg:flex">
                            <span className="text-neutral-500 text-sm">
                                Funscript.io Version {packageJson.version}
                            </span>
                            <span className="text-neutral-500 text-sm">
                                &copy; Funscript.io 2021
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
