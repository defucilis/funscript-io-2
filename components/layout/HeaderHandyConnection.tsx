import { useCallback, useEffect, useState } from "react";
import { MdReport, MdSync, MdWifiTethering } from "react-icons/md";
import useHandy from "lib/thehandy-react";

const HeaderHandyConnection = (): JSX.Element => {
    const { handy } = useHandy();
    const [expanded, setExpanded] = useState(false);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connectionKey, setConnectionKey] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const checkConnection = async () => {
            if (!handy) return;
            if (!handy.connectionKey || handy.connectionKey !== "") return;
            setLoading(true);
            try {
                const connected = await handy.getConnected();
                if (!connected) {
                    setConnected(false);
                } else {
                    await handy.getStatus();
                    setConnected(true);
                }
            } catch {
                setConnected(false);
            }

            setLoading(false);
        };

        if (!handy) return;

        if (handy.connectionKey) setConnectionKey(handy.connectionKey);
        else handy.connectionKey = connectionKey;
        checkConnection();
    }, [handy]);

    const tryConnect = useCallback(() => {
        const tryConnect = async () => {
            if (!handy) return;
            if (!connectionKey || connectionKey === "") return;

            handy.connectionKey = connectionKey;

            setLoading(true);
            setError("");

            for (let i = 0; i < 10; i++) {
                try {
                    const result = await handy.getConnected();
                    if (result) {
                        await handy.getStatus();
                        setLoading(false);
                        setConnected(true);
                        return;
                    }
                } catch {
                    continue;
                }
            }
            setLoading(false);
            setConnected(false);
            setError(
                "Failed to connect. Ensure you have the connection key correct and that your Handy is online"
            );
        };

        if (!handy) return;
        tryConnect();
    }, [handy, connectionKey]);

    const disconnect = useCallback(() => {
        if (!handy) return;

        setConnected(false);
        handy.connectionKey = "";
        setConnectionKey("");
    }, [handy]);

    return (
        <>
            <div
                className={`grid place-items-center h-full cursor-pointer border-l border-neutral-700 pl-5 ${
                    expanded ? "bg-neutral-900" : "bg-transparent"
                } -mr-5 pr-5 -my-2 py-2`}
                onClick={() => setExpanded(!expanded)}
            >
                {connected ? (
                    <MdWifiTethering className="text-2xl text-green-400" />
                ) : loading ? (
                    <MdSync className="text-2xl text-yellow-400 animate-spin" />
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
                    value={connectionKey}
                    onChange={e => {
                        setConnectionKey(e.target.value);
                    }}
                />
                {connected ? (
                    <button
                        className="bg-red-900 grid place-items-center text-white font-bold rounded px-4 mt-2"
                        onClick={disconnect}
                    >
                        Disconnect
                    </button>
                ) : loading ? (
                    <button
                        className="bg-neutral-800 grid place-items-center text-white font-bold rounded px-4 mt-2"
                        onClick={tryConnect}
                        disabled={true}
                    >
                        Connecting
                    </button>
                ) : (
                    <button
                        className="bg-green-800 grid place-items-center text-white font-bold rounded px-4 mt-2"
                        onClick={tryConnect}
                    >
                        Connect
                    </button>
                )}
                {error && <p className="text-red-300 text-sm leading-none mt-2">{error}</p>}
            </div>
        </>
    );
};

export default HeaderHandyConnection;
