import { MdReport, MdWifiTethering } from "react-icons/md";

const HeaderHandyConnection = (): JSX.Element => {
    const connected = false;

    return (
        <div className="relative text-2xl grid place-items-center h-full cursor-pointer border-l border-neutral-700 pl-4">
            {connected ? (
                <MdWifiTethering className="text-green-400" />
            ) : (
                <MdReport className="text-red-400" />
            )}
            {/* <div className="absolute right-0 top-0 bg-neutral-800 border border-neutral-600">
                <h1>Hello</h1>
            </div> */}
        </div>
    );
};

export default HeaderHandyConnection;
