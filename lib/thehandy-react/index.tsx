import React, { useState, useContext, createContext, ReactNode, useCallback } from "react";
import {
    HampState,
    HandyInfo,
    HandyMode,
    HandySettings,
    HandyStatus,
    HsspState,
} from "lib/thehandy/types";
import Handy from "../thehandy";

const reactHandyContext = createContext<UseHandy | null>(null);

/** Context provider for the Handy - wrap your app in it! */
const HandyProvider = ({
    verbose,
    children,
}: {
    verbose?: boolean;
    children: ReactNode;
}): JSX.Element => {
    const reactContext = useHandyReact(verbose);
    return <reactHandyContext.Provider value={reactContext}>{children}</reactHandyContext.Provider>;
};

const useHandy = (): UseHandy => {
    const context = useContext(reactHandyContext);
    if (!context)
        throw new Error(
            "For some reason, Handy context isn't initialized! This shouldn't happen..."
        );
    return context;
};

interface UseHandy {
    /** Updates the connection status, mode and state of the Handy */
    refresh: () => Promise<void>;
    /** The most recently-set connection key */
    connectionKey: string;
    /** Sets the connection key of the Handy, and makes sure that it can be used to connect */
    connect: (connectionKey: string) => Promise<boolean>;
    /** Clears the connection key of the Handy */
    disconnect: () => Promise<void>;
    /** Internal state of the Handy - note that this can become out-of-sync if other apps are simultaneously controlling the Handy */
    handyState: HandyState;
    /** Most recently-occurred error arising from commands sent to the Handy */
    error: string;
    /** Whether a command is currently waiting to execute on the Handy */
    loading: boolean;
    /** Gets the mode the Handy is currently in */
    getMode: () => Promise<HandyMode>;
    /** Sets the Handy to a new mode. */
    sendMode: (mode: HandyMode) => Promise<void>;
    /** Determines whether the Handy is currently connected or not */
    getConnected: () => Promise<boolean>;
    /** Returns information about the device; hardware version, firmware version, firmware status, firmware branch and device model. */
    getInfo: () => Promise<HandyInfo | undefined>;
    /** Returns min and mix slider position */
    getSettings: () => Promise<HandySettings>;
    /** A convenient endpoint for fetching the current mode of the device and the state within the current mode. For modes with a single state, the returned state value will always be 0. For modes with multiple states, see the schema definition for possible values. */
    getStatus: () => Promise<{ mode: HandyMode; state: number }>;
    /** Starts HAMP movement - puts the Handy in HAMP mode first, if it isn't already in HAMP mode. */
    sendHampStart: () => Promise<void>;
    /** Stops HAMP movement - puts the Handy in HAMP mode first, if it isn't already in HAMP mode. */
    sendHampStop: () => Promise<void>;
    /** Sets the current HAMP state - an alternative to sendHampStart and sendHampStop. Puts the Handy in HAMP mode first, if it isn't already in HAMP mode */
    sendHampState: (state: HampState) => Promise<void>;
    /** Gets the current HAMP state - puts the Handy in HAMP mode first, if it isn't already in HAMP mode */
    getHampState: () => Promise<HampState>;
    /** Gets the current HAMP velocity, from 0 - 100 - putes the handy in HAMP mode first, if it isn't already in HAMP mode */
    getHampVelocity: () => Promise<number>;
    /** Sets the current HAMP velocity, from 0 - 100 - putes the handy in HAMP mode first, if it isn't already in HAMP mode */
    sendHampVelocity: (velocity: number) => Promise<void>;
    /** Sets the next absolute position (xa) of the device, and the absolute velocity (va) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    sendHdspXaVa: (
        positionAbsolute: number,
        velocityAbsolute: number,
        stopOnTarget?: boolean
    ) => Promise<void>;
    /** Sets the next percent position (xp) of the device, and the absolute velocity (va) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    sendHdspXpVa: (
        positionPercentage: number,
        velocityAbsolute: number,
        stopOnTarget?: boolean
    ) => Promise<void>;
    /** Sets the next percent position (xp) of the device, and the percent velocity (vp) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    sendHdspXpVp: (
        positionPercentage: number,
        velocityPercentage: number,
        stopOnTarget?: boolean
    ) => Promise<void>;
    /** Sets the next absolute position (xa) of the device, and the time (t) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    sendHdspXaT: (
        positionAbsolute: number,
        durationMilliseconds: number,
        stopOnTarget?: boolean
    ) => Promise<void>;
    /** Sets the next percent position (xp) of the device, and the time (t) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    sendHdspXpT: (
        positionPercentage: number,
        durationMilliseconds: number,
        stopOnTarget?: boolean
    ) => Promise<void>;
    /** Starts HSSP playback, if a script has already been prepared. Can be used to skip to a timecode in ms from the start of the script. Pass in an estimated server time to ensure proper sync. Puts the handy in HSSP mode, if it isn't already in HSSP mode. */
    sendHsspPlay: (playbackPosition?: number, serverTime?: number) => Promise<void>;
    /** Stops HSSP playback, if a script has already been prepared. Puts the handy in HSSP mode, if it isn't already in HSSP mode. */
    sendHsspStop: () => Promise<void>;
    /** Setup script synchronization by providing the device with an URL from where the script can be downloaded. The device need to be able to access the URL for setup to work. If the sha-256 value of the script is provided, the device will only download the script if it can not be found in the device cache. Puts the Handy in HSSP mode, if it isn't already in HSSP mode */
    sendHsspSetup: (url: string, sha256?: string) => Promise<void>;
    /** Determines whether the Handy has HSSP loop turned on. Puts the Handy in HSSP mode, if it isn't already in HSSP mode. */
    getHsspLoop: (loop: boolean) => Promise<boolean>;
    /** Enables or disables loop mode in HSSP. Puts the Handy in HSSP mode, if it isn't already in HSSP mode */
    sendHsspLoop: (loop: boolean) => Promise<void>;
    /** Returns the current HSSP state. Puts the Handy in HSSP mode, if it isn't already in HSSP mode. */
    getHsspState: () => Promise<HsspState>;
    /** Get the current time of the device. When the device and the server time is synchronized, this will be the server time estimated by the device. */
    getHstpTime: () => Promise<number>;
    /** Gets the current manual offset of the Handy in milliseconds. Negative values mean that the script will be delayed, positive values mean that the script will be advanced. */
    getHstpOffset: () => Promise<number>;
    /** Sets the current manual offset of the Handy in milliseconds. Negative values mean that the script will be delayed, positive values mean that the script will be advanced. */
    sendHstpOffset: (offset: number) => Promise<void>;
    /** Gets the current round-trip delay from the Handy to the server and back, in milliseconds. Used for synchronization. */
    getHstpRtd: () => Promise<number>;
    /** Syncronizes the device with the server clock and calculates the round-trip-delay between the device and the server. As far as I can tell, this just doesn't work. I suggest using getServerTimeOffset instead. */
    getHstpSync: (syncCount?: number, outliers?: number) => Promise<{ time: number; rtd: number }>;
    /** Gets the min and max slide positions from 0 - 100 */
    getSlideSettings: () => Promise<{ min: number; max: number }>;
    /** Gets the current position of the slider in mm from the bottom position */
    getSlidePositionAbsolute: () => Promise<number>;
    /** Sets the min and max slide positions from 0 - 100 */
    sendSlideSettings: (min: number, max: number) => Promise<void>;
    /** Sets the min slide position, from 0 - 100. If fixed is true, then the device will attempt to maintain the same distance between min and max */
    sendSlideMin: (min: number, fixed?: boolean) => Promise<void>;
    /** Sets the max slide position, from 0 - 100. If fixed is true, then the device will attempt to maintain the same distance between min and max */
    sendSlideMax: (max: number, fixed?: boolean) => Promise<void>;
    /** Gets the offset, in milliseconds, between the Handy and the HandyFeeling servers. Updates estimatedServerTimeOffset */
    getServerTimeOffset: (
        trips?: number,
        onProgress?: (progress: number) => void
    ) => Promise<number>;
}

interface HandyState {
    /** Whether the Handy is currently connected, to the best of its knowledge */
    connected: boolean;
    /** Hardware and Firmware info of the Handy. Undefined until you call getInfo */
    info?: HandyInfo | undefined;
    /** Current mode of the Handy. Not guaranteed to be accurate as this may change from other sources than this API */
    currentMode: HandyMode;
    /** Whether HAMP is currently running. Updated when calling setHampStart or setHampStop. Not guaranteed to be accurate as this may change from other sources than this API */
    hampState: HampState;
    /** Current HAMP velocity, from 0 to 100. Updated when calling setHampVelocity. Not guaranteed to be accurate as this may change from other sources than this API */
    hampVelocity: number;
    /** Current target HDSP position of the slider. Updated when calling any of the setHdsp methods. Not guaranteed to be accurate as this may change from other sources than this API */
    hdspPosition: number;
    /** HSSP playing state. Set when calling setHsspPlay or setHsspStop. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspState: HsspState;
    /** Whether HSSP loop is turned on. Set when calling setHsspLoop. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspLoop: boolean;
    /** URL of prepared CSV file for HDSP playback. Set when calling setHsspSetup. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspPreparedUrl: string;
    /** Estimated server time. Only really valid immediately after calling getHstpSync. */
    hstpTime: number;
    /** Server-time offset of the Handy. Set when calling getServerTimeOffset. Not guaranteed to be accurate as this may change from other sources than this API */
    hstpOffset: number;
    /** Round-trip delay from the Handy to the server and back, in milliseconds. Updated when calling getHstpRtd. */
    hstpRtd: number;
    /** The estimated offset time between the Handy and the server - updated by calling getServerTimeOffset */
    estimatedServerTimeOffset: number;
    /** Min slide position of the Handy, used in all modes. Set when calling setSlideSettings. Not guaranteed to be accurate as this may change from other sources than this API */
    slideMin: number;
    /** Max slide position of the Handy, used in all modes. Set when calling setSlideSettings. Not guaranteed to be accurate as this may change from other sources than this API */
    slideMax: number;
    /** The physical position of the slider in mm from the bottom. Updated when calling getSlidePositionAbsolute. Obviously, any movement after this point will make this value useless */
    slidePositionAbsolute: number;
}

/** Context consumer for the Handy provider. Provides access to the Handy and its internal state. */
const useHandyReact = (verbose?: boolean): UseHandy => {
    const [handy] = useState<Handy>(new Handy(!!verbose));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [connectionKey, setConnectionKey] = useState("");
    const [handyState, setHandyState] = useState<HandyState>({
        connected: false,
        info: undefined,
        currentMode: HandyMode.unknown,
        hampState: HampState.stopped,
        hampVelocity: 0,
        hdspPosition: 0,
        hsspState: HsspState.needSetup,
        hsspLoop: false,
        hsspPreparedUrl: "",
        hstpTime: 0,
        hstpOffset: 0,
        hstpRtd: 0,
        estimatedServerTimeOffset: 0,
        slideMin: 0,
        slideMax: 0,
        slidePositionAbsolute: 0,
    });

    const refresh = useCallback(async (): Promise<void> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return;
        }
        setConnectionKey(handy.connectionKey);

        //get firmware info and such
        await getInfo();

        //get slide settings
        await getSettings();

        //get mode and status
        const { mode } = await getStatus();
        if (mode === HandyMode.hamp) {
            //get hamp-specific stuff
            await getHampVelocity();
        } else if (mode === HandyMode.hssp) {
            //get hssp specific stuff
            await getHsspLoop();
        }

        //get round trip delay
        //await getHstpRtd();

        //get timing offset
        //await getHstpOffset();
    }, [handy]);

    const getMode = useCallback(async (): Promise<HandyMode> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.currentMode;
        }
        setLoading(true);
        try {
            const result = await handy.getMode();
            setHandyState(cur => ({ ...cur, currentMode: result, connected: true }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.currentMode;
    }, [handy, handyState.currentMode]);

    const sendMode = useCallback(
        async (mode: HandyMode): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setMode(mode);
                setHandyState(cur => ({ ...cur, currentMode: mode, connected: true }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const getConnected = useCallback(async (): Promise<boolean> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return false;
        }
        try {
            const result = await handy.getConnected();
            setHandyState(cur => ({ ...cur, connected: result }));
            return true;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
            return handy.connected;
        }
    }, [handy]);

    const connect = useCallback(
        async (connectionKey: string): Promise<boolean> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return false;
            }
            handy.connectionKey = connectionKey;
            setConnectionKey(connectionKey);
            return await getConnected();
        },
        [handy, getConnected]
    );

    const disconnect = useCallback(async (): Promise<void> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return;
        }
        handy.connectionKey = "";
        setConnectionKey("");
        setHandyState(cur => ({ ...cur, connected: false }));
    }, [handy, getConnected]);

    const getInfo = useCallback(async (): Promise<HandyInfo | undefined> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.info;
        }
        setLoading(true);
        try {
            const result = await handy.getInfo();
            setHandyState(cur => ({ ...cur, info: result, connected: true }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.info;
    }, [handy, handyState.info]);

    const getSettings = useCallback(async (): Promise<HandySettings> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return {
                slideMin: handyState.slideMin,
                slideMax: handyState.slideMax,
            };
        }
        setLoading(true);
        try {
            const result = await handy.getSettings();
            setHandyState(cur => ({
                ...cur,
                slideMin: result.slideMin,
                slideMax: result.slideMax,
                connected: true,
            }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return {
            slideMin: handyState.slideMin,
            slideMax: handyState.slideMax,
        };
    }, [handy, handyState.slideMin, handyState.slideMax]);

    const getStatus = useCallback(async (): Promise<HandyStatus> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return {
                mode: handyState.currentMode,
                state:
                    handyState.currentMode === HandyMode.hamp
                        ? handyState.hampState
                        : handyState.currentMode === HandyMode.hssp
                        ? handyState.hsspState
                        : 0,
            };
        }
        setLoading(true);
        try {
            const result = await handy.getStatus();
            if (result.mode === HandyMode.hamp) {
                setHandyState(cur => ({
                    ...cur,
                    currentMode: result.mode,
                    hampState: result.state,
                    connected: true,
                }));
            } else if (result.mode === HandyMode.hssp) {
                setHandyState(cur => ({
                    ...cur,
                    currentMode: result.mode,
                    hsspState: result.state,
                    connected: true,
                }));
            } else {
                setHandyState(cur => ({ ...cur, currentMode: result.mode, connected: true }));
            }
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return {
            mode: handyState.currentMode,
            state:
                handyState.currentMode === HandyMode.hamp
                    ? handyState.hampState
                    : handyState.currentMode === HandyMode.hssp
                    ? handyState.hsspState
                    : 0,
        };
    }, [handy, handyState.currentMode, handyState.hampState, handyState.hsspState]);

    const sendHampStart = useCallback(async (): Promise<void> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return;
        }
        setLoading(true);
        try {
            await handy.setHampStart();
            setHandyState(cur => ({ ...cur, hampState: HampState.moving, connected: true }));
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({
                ...cur,
                currentMode: HandyMode.hamp,
                connected: handy.connected,
            }));
        }
        setLoading(false);
    }, [handy]);

    const sendHampStop = useCallback(async (): Promise<void> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return;
        }
        setLoading(true);
        try {
            await handy.setHampStop();
            setHandyState(cur => ({ ...cur, hampState: HampState.stopped, connected: true }));
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({
                ...cur,
                currentMode: HandyMode.hamp,
                connected: handy.connected,
            }));
        }
        setLoading(false);
    }, [handy]);

    const sendHampState = useCallback(
        async (state: HampState): Promise<void> => {
            setError("");
            if (state === HampState.moving) {
                await sendHampStart();
            } else {
                await sendHampStop();
            }
        },
        [handy, sendHampStart, sendHampStop]
    );

    const getHampState = useCallback(async (): Promise<HampState> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.hampState;
        }
        setLoading(true);
        try {
            const result = await handy.getHampState();
            setHandyState(cur => ({ ...cur, hampState: result.state, connected: true }));
            setLoading(false);
            return result.state;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({
                ...cur,
                currentMode: HandyMode.hamp,
                connected: handy.connected,
            }));
        }
        setLoading(false);
        return handyState.hampState;
    }, [handy, handyState.hampState]);

    const getHampVelocity = useCallback(async (): Promise<number> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.hampVelocity;
        }
        setLoading(true);
        try {
            const result = await handy.getHampVelocity();
            setHandyState(cur => ({
                ...cur,
                currentMode: HandyMode.hamp,
                hampVelocity: result,
                connected: true,
            }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.hampVelocity;
    }, [handy, handyState.hampVelocity]);

    const sendHampVelocity = useCallback(
        async (velocity: number): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setError("");
            setLoading(true);
            try {
                await handy.setHampVelocity(velocity);
                setHandyState(cur => ({
                    ...cur,
                    currentMode: HandyMode.hamp,
                    hampVelocity: velocity,
                    connected: true,
                }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const sendHdspXaVa = useCallback(
        async (
            positionAbsolute: number,
            velocityAbsolute: number,
            stopOnTarget?: boolean
        ): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHdspXaVa(positionAbsolute, velocityAbsolute, stopOnTarget);
                setHandyState(cur => ({ ...cur, currentMode: HandyMode.hdsp, connected: true }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const sendHdspXpVa = useCallback(
        async (
            positionPercentage: number,
            velocityAbsolute: number,
            stopOnTarget?: boolean
        ): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHdspXpVa(positionPercentage, velocityAbsolute, stopOnTarget);
                setHandyState(cur => ({ ...cur, currentMode: HandyMode.hdsp, connected: true }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const sendHdspXpVp = useCallback(
        async (
            positionPercentage: number,
            velocityPercentage: number,
            stopOnTarget?: boolean
        ): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHdspXpVp(positionPercentage, velocityPercentage, stopOnTarget);
                setHandyState(cur => ({ ...cur, currentMode: HandyMode.hdsp, connected: true }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const sendHdspXaT = useCallback(
        async (
            positionAbsolute: number,
            durationMilliseconds: number,
            stopOnTarget?: boolean
        ): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHdspXaT(positionAbsolute, durationMilliseconds, stopOnTarget);
                setHandyState(cur => ({ ...cur, currentMode: HandyMode.hdsp, connected: true }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const sendHdspXpT = useCallback(
        async (
            positionPercentage: number,
            durationMilliseconds: number,
            stopOnTarget?: boolean
        ): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHdspXpT(positionPercentage, durationMilliseconds, stopOnTarget);
                setHandyState(cur => ({ ...cur, currentMode: HandyMode.hdsp, connected: true }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const sendHsspPlay = useCallback(
        async (playbackPosition?: number, serverTime?: number): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHsspPlay(playbackPosition, serverTime);
                setHandyState(cur => ({
                    ...cur,
                    currentMode: HandyMode.hssp,
                    hsspState: HsspState.playing,
                    connected: true,
                }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const sendHsspStop = useCallback(async (): Promise<void> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return;
        }
        setLoading(true);
        try {
            await handy.setHsspStop();
            setHandyState(cur => ({
                ...cur,
                currentMode: HandyMode.hssp,
                hsspState: HsspState.stopped,
                connected: true,
            }));
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
    }, [handy]);

    const sendHsspSetup = useCallback(
        async (url: string, sha256?: string): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHsspSetup(url, sha256);
                setHandyState(cur => ({
                    ...cur,
                    currentMode: HandyMode.hssp,
                    hsspState: HsspState.stopped,
                    connected: true,
                }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const getHsspLoop = useCallback(async (): Promise<boolean> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.hsspLoop;
        }
        setLoading(true);
        try {
            const result = await handy.getHsspLoop();
            setHandyState(cur => ({
                ...cur,
                currentMode: HandyMode.hssp,
                hsspLoop: result,
                connected: true,
            }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.hsspLoop;
    }, [handy, handyState.hsspLoop]);

    const sendHsspLoop = useCallback(
        async (loop: boolean): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHsspLoop(loop);
                setHandyState(cur => ({
                    ...cur,
                    currentMode: HandyMode.hssp,
                    hsspLoop: loop,
                    connected: true,
                }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const getHsspState = useCallback(async (): Promise<HsspState> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.hsspState;
        }
        setLoading(true);
        try {
            const result = await handy.getHsspState();
            setHandyState(cur => ({
                ...cur,
                currentMode: HandyMode.hssp,
                hsspState: result,
                connected: true,
            }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.hsspState;
    }, [handy, handyState.hsspState]);

    const getHstpTime = useCallback(async (): Promise<number> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.hstpTime;
        }
        setLoading(true);
        try {
            const result = await handy.getHstpTime();
            setHandyState(cur => ({ ...cur, hstpTime: result, connected: true }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.hstpTime;
    }, [handy, handyState.hstpTime]);

    const getHstpOffset = useCallback(async (): Promise<number> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.hstpOffset;
        }
        setLoading(true);
        try {
            const result = await handy.getHstpOffset();
            setHandyState(cur => ({ ...cur, hstpOffset: result, connected: true }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.hstpOffset;
    }, [handy, handyState.hstpOffset]);

    const sendHstpOffset = useCallback(
        async (offset: number): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setHstpoffset(offset);
                setHandyState(cur => ({ ...cur, hstpOffset: offset, connected: true }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const getHstpRtd = useCallback(async (): Promise<number> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.hstpRtd;
        }
        setLoading(true);
        try {
            const result = await handy.getHstpRtd();
            setHandyState(cur => ({ ...cur, hstpRtd: result, connected: true }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.hstpRtd;
    }, [handy, handyState.hstpRtd]);

    const getHstpSync = useCallback(
        async (syncCount = 30, outliers = 6): Promise<{ time: number; rtd: number }> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return {
                    rtd: handyState.hstpRtd,
                    time: 0,
                };
            }
            setLoading(true);
            try {
                const result = await handy.getHstpSync(syncCount, outliers);
                setHandyState(cur => ({ ...cur, hstpRtd: result.rtd, connected: true }));
                setLoading(false);
                return result;
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
            return {
                rtd: handyState.hstpRtd,
                time: 0,
            };
        },
        [handy, handyState.hstpRtd]
    );

    const getSlideSettings = useCallback(async (): Promise<{ min: number; max: number }> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return {
                min: handyState.slideMin,
                max: handyState.slideMax,
            };
        }
        setLoading(true);
        try {
            const result = await handy.getSlideSettings();
            setHandyState(cur => ({
                ...cur,
                slideMin: result.min,
                slideMax: result.max,
                connected: true,
            }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return {
            min: handyState.slideMin,
            max: handyState.slideMax,
        };
    }, [handy, handyState.slideMin, handyState.slideMax]);

    const getSlidePositionAbsolute = useCallback(async (): Promise<number> => {
        setError("");
        if (!handy) {
            setError("Handy not initialized");
            return handyState.slidePositionAbsolute;
        }
        setLoading(true);
        try {
            const result = await handy.getSlidePositionAbsolute();
            setHandyState(cur => ({ ...cur, slidePositionAbsolute: result, connected: true }));
            setLoading(false);
            return result;
        } catch (error: any) {
            setError(error.message);
            setHandyState(cur => ({ ...cur, connected: handy.connected }));
        }
        setLoading(false);
        return handyState.slidePositionAbsolute;
    }, [handy, handyState.slidePositionAbsolute]);

    const sendSlideSettings = useCallback(
        async (min: number, max: number): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setSlideSettings(min, max);
                setHandyState(cur => ({ ...cur, slideMin: min, slideMax: max, connected: true }));
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy]
    );

    const sendSlideMin = useCallback(
        async (min: number, fixed = false): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setSlideMin(min);
                if (fixed) {
                    const offset = min - handyState.slideMin;
                    const newMax = Math.max(0, Math.min(100, handyState.slideMax + offset));
                    setHandyState(cur => ({
                        ...cur,
                        slideMin: min,
                        slideMax: newMax,
                        connected: true,
                    }));
                } else {
                    setHandyState(cur => ({ ...cur, slideMin: min, connected: true }));
                }
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy, handyState.slideMin, handyState.slideMax]
    );

    const sendSlideMax = useCallback(
        async (max: number, fixed = false): Promise<void> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return;
            }
            setLoading(true);
            try {
                await handy.setSlideMax(max);
                if (fixed) {
                    const offset = max - handyState.slideMax;
                    const newMin = Math.max(0, Math.min(100, handyState.slideMin + offset));
                    setHandyState(cur => ({
                        ...cur,
                        slideMax: max,
                        slideMin: newMin,
                        connected: true,
                    }));
                } else {
                    setHandyState(cur => ({ ...cur, slideMax: max, connected: true }));
                }
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
        },
        [handy, handyState.slideMin, handyState.slideMax]
    );

    const getServerTimeOffset = useCallback(
        async (trips = 30, onProgress?: (progress: number) => void): Promise<number> => {
            setError("");
            if (!handy) {
                setError("Handy not initialized");
                return handyState.estimatedServerTimeOffset;
            }
            setLoading(true);
            try {
                const result = await handy.getServerTimeOffset(trips, onProgress);
                setHandyState(cur => ({
                    ...cur,
                    estimatedServerTimeOffset: result,
                    connected: true,
                }));
                setLoading(false);
                return result;
            } catch (error: any) {
                setError(error.message);
                setHandyState(cur => ({ ...cur, connected: handy.connected }));
            }
            setLoading(false);
            return handyState.estimatedServerTimeOffset;
        },
        [handy, handyState.estimatedServerTimeOffset]
    );

    return {
        error,
        loading,
        handyState,
        refresh,
        connect,
        disconnect,
        connectionKey,
        getMode,
        sendMode,
        getConnected,
        getInfo,
        getSettings,
        getStatus,
        sendHampStart,
        sendHampStop,
        sendHampState,
        getHampState,
        getHampVelocity,
        sendHampVelocity,
        sendHdspXaVa,
        sendHdspXpVa,
        sendHdspXpVp,
        sendHdspXaT,
        sendHdspXpT,
        sendHsspPlay,
        sendHsspStop,
        sendHsspSetup,
        getHsspLoop,
        sendHsspLoop,
        getHsspState,
        getHstpTime,
        getHstpOffset,
        sendHstpOffset,
        getHstpRtd,
        getHstpSync,
        getSlideSettings,
        getSlidePositionAbsolute,
        sendSlideSettings,
        sendSlideMin,
        sendSlideMax,
        getServerTimeOffset,
    };
};

export { HandyProvider };
export default useHandy;
