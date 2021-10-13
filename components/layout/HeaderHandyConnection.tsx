import { useEffect, useState } from "react";
import { MdReport, MdWifiTethering } from "react-icons/md";
import { AiOutlineSync } from "react-icons/ai";
import useHandy from "lib/thehandy-react";
import { HampState, HandyMode, HsspState } from "lib/thehandy/types";

const HeaderHandyConnection = (): JSX.Element => {
    const { refresh, connectionKey, loading, connect, disconnect, handyState } = useHandy();
    const [initialized, setInitialized] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [newConnectionKey, setNewConnectionKey] = useState(connectionKey);

    useEffect(() => {
        if (!refresh) return;

        if (!initialized) {
            refresh();
            setInitialized(true);
        }
    }, [refresh, initialized]);

    useEffect(() => setNewConnectionKey(connectionKey), [connectionKey]);

    return (
        <>
            <div
                className={`grid place-items-center h-full cursor-pointer border-l border-neutral-700 pl-5 ${
                    expanded ? "bg-neutral-900" : "bg-transparent"
                } -mr-5 pr-5 -my-2 py-2`}
                onClick={() => setExpanded(!expanded)}
            >
                {handyState.connected ? (
                    <MdWifiTethering className="text-2xl text-green-400" />
                ) : loading ? (
                    <AiOutlineSync className="text-2xl text-yellow-400 animate-spin" />
                ) : (
                    <MdReport className="text-2xl text-red-400" />
                )}
            </div>
            <div
                className={`${
                    expanded ? "absolute" : "hidden"
                } right-0 top-main bg-neutral-900 w-72 shadow-lg p-5 z-50`}
            >
                <h2 className="text-white text-xl mb-2">Connect your Handy</h2>
                <label className="text-sm text-white m-0">Connection Key</label>
                <input
                    type="text"
                    className="w-full bg-neutral-700 rounded px-2 text-white"
                    value={newConnectionKey}
                    onChange={e => {
                        setNewConnectionKey(e.target.value);
                    }}
                />
                {handyState.connected ? (
                    <button
                        className="bg-red-900 grid place-items-center text-white font-bold rounded px-4 mt-2"
                        onClick={disconnect}
                    >
                        Disconnect
                    </button>
                ) : loading ? (
                    <button
                        className="bg-neutral-800 grid place-items-center text-white font-bold rounded px-4 mt-2"
                        disabled={true}
                    >
                        Connecting
                    </button>
                ) : (
                    <button
                        className="bg-green-800 grid place-items-center text-white font-bold rounded px-4 mt-2"
                        onClick={() => connect(newConnectionKey)}
                    >
                        Connect
                    </button>
                )}
                {handyState.connected && (
                    <div className="text-white mt-4 grid grid-cols-2 w-2/3">
                        <p className="mb-2 font-bold">Slide</p>
                        <p>
                            {handyState.slideMin}% - {handyState.slideMax}%
                        </p>
                        <p className="font-bold">Mode</p>
                        <p>{HandyMode[handyState.currentMode]}</p>
                        {handyState.currentMode === HandyMode.hamp && (
                            <>
                                <p className="font-bold">Status</p>
                                <p>{HampState[handyState.hampState]}</p>
                                <p className="font-bold">Velocity</p>
                                <p>{handyState.hampVelocity}%</p>
                            </>
                        )}
                        {handyState.currentMode === HandyMode.hssp && (
                            <>
                                <p className="font-bold">Status</p>
                                <p>{HsspState[handyState.hsspState]}</p>
                                <p className="font-bold">Loop</p>
                                <p>{handyState.hsspLoop ? "On" : "Off"}</p>
                                <p className="font-bold">Offset</p>
                                <p>{handyState.hstpOffset} ms</p>
                                <p className="font-bold">RTD</p>
                                <p>{handyState.hstpRtd} ms</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default HeaderHandyConnection;
