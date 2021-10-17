import {
    GenericResult,
    SetModeResult,
    SetHampStateResult,
    SetHdspResult,
    HsspSetupResult,
    HandyInfo,
    HandySettings,
    HandyStatus,
    SlideInfo,
    HandyMode,
    HsspState,
    HampState,
} from "./types";

const baseUrl = "https://www.handyfeeling.com/api/handy/v2/";

/** Class to connect to, control and track the internal state of a Handy using the HandyFeeling API V2 */
class Handy {
    private _connectionKey: string;

    /** If true, will log all HTTP requests to the console */
    verbose: boolean;

    /** Whether the Handy is currecntly connected. Updated whenever a request succeeds (or fails), or when getConnected is called. */
    connected = false;
    /** Hardware and Firmware info of the Handy. Undefined until you call getInfo */
    info: HandyInfo | undefined = undefined;
    /** Current mode of the Handy. Not guaranteed to be accurate as this may change from other sources than this API */
    currentMode: HandyMode = HandyMode.unknown;

    /** Whether HAMP is currently running. Updated when calling setHampStart or setHampStop. Not guaranteed to be accurate as this may change from other sources than this API */
    hampState: HampState = HampState.stopped;
    /** Current HAMP velocity, from 0 to 100. Updated when calling setHampVelocity. Not guaranteed to be accurate as this may change from other sources than this API */
    hampVelocity = 0;

    /** Current target HDSP position of the slider. Updated when calling any of the setHdsp methods. Not guaranteed to be accurate as this may change from other sources than this API */
    hdspPosition = 0;

    /** HSSP playing state. Set when calling setHsspPlay or setHsspStop. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspState: HsspState = HsspState.needSetup;
    /** Whether HSSP loop is turned on. Set when calling setHsspLoop. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspLoop = false;
    /** URL of prepared CSV file for HDSP playback. Set when calling setHsspSetup. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspPreparedUrl = "";

    /** Estimated server time. Only really valid immediately after calling getHstpSync. */
    hstpTime = 0;
    /** Server-time offset of the Handy. Set when calling getServerTimeOffset. Not guaranteed to be accurate as this may change from other sources than this API */
    hstpOffset = 0;
    /** Round-trip delay from the Handy to the server and back, in milliseconds. Updated when calling getHstpRtd. */
    hstpRtd = 0;
    /** The estimated offset time between the Handy and the server - updated by calling getServerTimeOffset */
    estimatedServerTimeOffset = 0;

    /** Min slide position of the Handy, used in all modes. Set when calling setSlideSettings. Not guaranteed to be accurate as this may change from other sources than this API */
    slideMin = 0;
    /** Max slide position of the Handy, used in all modes. Set when calling setSlideSettings. Not guaranteed to be accurate as this may change from other sources than this API */
    slideMax = 0;
    /** The physical position of the slider in mm from the bottom. Updated when calling getSlidePositionAbsolute. Obviously, any movement after this point will make this value useless */
    slidePositionAbsolute = 0;

    constructor(verbose = false) {
        this._connectionKey = "";
        this.verbose = verbose;
    }

    /** Current connection key. Backed up to localStorage, when possible */
    get connectionKey(): string {
        if (this._connectionKey === "" && typeof window !== "undefined") {
            this._connectionKey = localStorage.getItem("connectionKey") || "";
        }
        return this._connectionKey;
    }
    set connectionKey(connectionKey: string) {
        this._connectionKey = connectionKey;

        if (typeof window !== "undefined") {
            localStorage.setItem("connectionKey", connectionKey);
        } else throw new Error("Can only write connection key to localStorage on client-side!");
    }

    //---------------------------------------------
    //                  BASE
    //---------------------------------------------

    /** Gets the mode the Handy is currently in */
    async getMode(): Promise<HandyMode> {
        const json: { result: GenericResult; mode: HandyMode; state: 1 | 2 } = await this.getJson(
            "mode"
        );
        this.currentMode = json.mode;
        this.connected = true;
        return json.mode;
    }

    /** Sets the Handy to a new mode. */
    async setMode(mode: HandyMode): Promise<SetModeResult> {
        const json: { result: SetModeResult } = await this.putJson("mode", { mode });
        this.currentMode = mode;
        this.connected = true;
        return json.result;
    }

    /** Determines whether the Handy is currently connected or not */
    async getConnected(): Promise<boolean> {
        try {
            const json = await this.getJson("connected");
            this.connected = !!json.connected;
            return !!json.connected;
        } catch {
            return false;
        }
    }

    /** Returns information about the device; hardware version, firmware version, firmware status, firmware branch and device model. */
    async getInfo(): Promise<HandyInfo> {
        const json: HandyInfo = await this.getJson("info");
        this.connected = true;
        return json;
    }

    /** Returns min and mix slider position */
    async getSettings(): Promise<HandySettings> {
        const json: HandySettings = await this.getJson("settings");
        this.slideMin = json.slideMin;
        this.slideMax = json.slideMax;
        this.connected = true;
        return json;
    }

    /** A convenient endpoint for fetching the current mode of the device and the state within the current mode. For modes with a single state, the returned state value will always be 0. For modes with multiple states, see the schema definition for possible values. */
    async getStatus(): Promise<HandyStatus> {
        const json: HandyStatus = await this.getJson("status");

        this.currentMode = json.mode;
        switch (json.mode) {
            case 0:
                this.hampState = json.state;
                break;
            case 1:
                this.hsspState = json.state;
                break;
        }
        this.connected = true;
        return json;
    }

    //---------------------------------------------
    //                  HAMP
    //---------------------------------------------

    /** Starts HAMP movement - puts the Handy in HAMP mode first, if it isn't already in HAMP mode. */
    async setHampStart(): Promise<SetHampStateResult> {
        if (this.currentMode !== HandyMode.hamp) await this.setMode(HandyMode.hamp);
        const json: { result: SetHampStateResult } = await this.putJson("hamp/start", {});

        this.hampState = HampState.moving;
        this.connected = true;
        return json.result;
    }

    /** Stops HAMP movement - puts the Handy in HAMP mode first, if it isn't already in HAMP mode. */
    async setHampStop(): Promise<SetHampStateResult> {
        if (this.currentMode !== HandyMode.hamp) await this.setMode(HandyMode.hamp);
        const json: { result: SetHampStateResult } = await this.putJson("hamp/stop", {});
        this.hampState = HampState.stopped;

        this.connected = true;
        return json.result;
    }

    /** Gets the current HAMP state - puts the Handy in HAMP mode first, if it isn't already in HAMP mode */
    async getHampState(): Promise<{ result: GenericResult; state: HampState }> {
        if (this.currentMode !== HandyMode.hamp) await this.setMode(HandyMode.hamp);
        const json: { result: GenericResult; state: HampState } = await this.getJson("hamp/state");

        this.hampState = json.state;
        this.connected = true;
        return json;
    }

    /** Gets the current HAMP velocity, from 0 - 100 - putes the handy in HAMP mode first, if it isn't already in HAMP mode */
    async getHampVelocity(): Promise<number> {
        if (this.currentMode !== HandyMode.hamp) await this.setMode(HandyMode.hamp);

        const json: { result: GenericResult; velocity: number } = await this.getJson(
            "hamp/velocity"
        );

        this.hampVelocity = json.velocity;
        this.connected = true;
        return json.velocity;
    }

    /** Sets the current HAMP velocity, from 0 - 100 - putes the handy in HAMP mode first, if it isn't already in HAMP mode */
    async setHampVelocity(velocity: number): Promise<GenericResult> {
        velocity = Math.min(100, Math.max(0, velocity));

        if (this.currentMode !== HandyMode.hamp || this.hampState == HampState.stopped)
            await this.setHampStart();
        const json: { result: GenericResult } = await this.putJson("hamp/velocity", { velocity });

        this.hampVelocity = velocity;
        this.connected = true;
        return json.result;
    }

    //---------------------------------------------
    //                  HDSP
    //---------------------------------------------

    /** Sets the next absolute position (xa) of the device, and the absolute velocity (va) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    async setHdspXaVa(
        positionAbsolute: number,
        velocityAbsolute: number,
        stopOnTarget?: boolean
    ): Promise<SetHdspResult> {
        positionAbsolute = Math.min(110, Math.max(0, positionAbsolute));
        velocityAbsolute = Math.min(400, Math.max(-400, velocityAbsolute));

        if (this.currentMode !== HandyMode.hdsp) await this.setMode(HandyMode.hdsp);
        const json = await this.putJson("hdsp/xava", {
            position: positionAbsolute,
            velocity: velocityAbsolute,
            stopOnTarget: !!stopOnTarget,
        });

        this.hdspPosition = positionAbsolute / 110;
        this.connected = true;
        return json.result;
    }

    /** Sets the next percent position (xp) of the device, and the absolute velocity (va) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    async setHdspXpVa(
        positionPercentage: number,
        velocityAbsolute: number,
        stopOnTarget?: boolean
    ): Promise<SetHdspResult> {
        positionPercentage = Math.min(100, Math.max(0, positionPercentage));
        velocityAbsolute = Math.min(400, Math.max(-400, velocityAbsolute));

        if (this.currentMode !== HandyMode.hdsp) await this.setMode(HandyMode.hdsp);
        const json = await this.putJson("hdsp/xpva", {
            position: positionPercentage,
            velocity: velocityAbsolute,
            stopOnTarget: !!stopOnTarget,
        });

        this.hdspPosition = positionPercentage;
        this.connected = true;
        return json.result;
    }

    /** Sets the next percent position (xp) of the device, and the percent velocity (vp) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    async setHdspXpVp(
        positionPercentage: number,
        velocityPercentage: number,
        stopOnTarget?: boolean
    ): Promise<SetHdspResult> {
        positionPercentage = Math.min(100, Math.max(0, positionPercentage));
        velocityPercentage = Math.min(100, Math.max(-100, velocityPercentage));

        if (this.currentMode !== HandyMode.hdsp) await this.setMode(HandyMode.hdsp);
        const json: { result: SetHdspResult } = await this.putJson("hdsp/xpvp", {
            position: positionPercentage,
            velocity: velocityPercentage,
            stopOnTarget: !!stopOnTarget,
        });

        this.hdspPosition = positionPercentage;
        this.connected = true;
        return json.result;
    }

    /** Sets the next absolute position (xa) of the device, and the time (t) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    async setHdspXaT(
        positionAbsolute: number,
        durationMilliseconds: number,
        stopOnTarget?: boolean
    ): Promise<SetHdspResult> {
        positionAbsolute = Math.min(110, Math.max(0, positionAbsolute));
        durationMilliseconds = Math.max(0, durationMilliseconds);

        if (this.currentMode !== HandyMode.hdsp) await this.setMode(HandyMode.hdsp);
        const json: { result: SetHdspResult } = await this.putJson("hdsp/xat", {
            position: positionAbsolute,
            duration: Math.round(durationMilliseconds),
            stopOnTarget: !!stopOnTarget,
        });

        this.hdspPosition = positionAbsolute / 110;
        this.connected = true;
        return json.result;
    }

    /** Sets the next percent position (xp) of the device, and the time (t) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    async setHdspXpT(
        positionPercentage: number,
        durationMilliseconds: number,
        stopOnTarget?: boolean
    ): Promise<SetHdspResult> {
        positionPercentage = Math.min(100, Math.max(0, positionPercentage));
        durationMilliseconds = Math.max(0, durationMilliseconds);

        if (this.currentMode !== HandyMode.hdsp) await this.setMode(HandyMode.hdsp);
        const json: { result: SetHdspResult } = await this.putJson("hdsp/xpt", {
            position: positionPercentage,
            duration: Math.round(durationMilliseconds),
            stopOnTarget: !!stopOnTarget,
        });

        this.hdspPosition = positionPercentage;
        this.connected = true;
        return json.result;
    }

    //---------------------------------------------
    //                  HSSP
    //---------------------------------------------

    /** Starts HSSP playback, if a script has already been prepared. Can be used to skip to a timecode in ms from the start of the script. Pass in an estimated server time to ensure proper sync. Puts the handy in HSSP mode, if it isn't already in HSSP mode. */
    async setHsspPlay(playbackPosition?: number, serverTime?: number): Promise<GenericResult> {
        if (this.currentMode !== HandyMode.hssp) await this.setMode(HandyMode.hssp);
        if (this.hsspState == HsspState.needSetup)
            throw new Error("Need to setup the Handy with a script before calling HSSP Play!");

        const json: { result: GenericResult } = await this.putJson("hssp/play", {
            estimatedServerTime: Math.round(serverTime || new Date().valueOf() + this.hstpOffset),
            startTime: Math.round(playbackPosition || 0),
        });

        this.hsspState = HsspState.playing;
        this.connected = true;
        return json.result;
    }

    /** Stops HSSP playback, if a script has already been prepared. Puts the handy in HSSP mode, if it isn't already in HSSP mode. */
    async setHsspStop(): Promise<GenericResult> {
        if (this.currentMode !== HandyMode.hssp) await this.setMode(HandyMode.hssp);
        if (this.hsspState == HsspState.needSetup)
            throw new Error("Need to setup the Handy with a script before calling HSSP Stop!");

        const json: { result: GenericResult } = await this.putJson("hssp/stop", {});

        this.hsspState = HsspState.stopped;
        this.connected = true;
        return json.result;
    }

    /** Setup script synchronization by providing the device with an URL from where the script can be downloaded. The device need to be able to access the URL for setup to work. If the sha-256 value of the script is provided, the device will only download the script if it can not be found in the device cache. Puts the Handy in HSSP mode, if it isn't already in HSSP mode */
    async setHsspSetup(url: string, sha256?: string): Promise<HsspSetupResult> {
        if (this.currentMode !== HandyMode.hssp) await this.setMode(HandyMode.hssp);

        const data: { url: string; sha256?: string } = {
            url: encodeURI(url),
        };
        if (sha256) data.sha256 = sha256;
        const json: { result: HsspSetupResult } = await this.putJson("hssp/setup", data);

        this.hsspPreparedUrl = url;
        this.connected = true;
        return json.result;
    }

    /** Determines whether the Handy has HSSP loop turned on. Puts the Handy in HSSP mode, if it isn't already in HSSP mode. */
    async getHsspLoop(): Promise<boolean> {
        if (this.currentMode !== HandyMode.hssp) await this.setMode(HandyMode.hssp);

        const json: { result: GenericResult; activated: boolean } = await this.getJson("hssp/loop");

        this.hsspLoop = json.activated;
        this.connected = true;
        return json.activated;
    }

    /** Enables or disables loop mode in HSSP. Puts the Handy in HSSP mode, if it isn't already in HSSP mode */
    async setHsspLoop(loop: boolean): Promise<GenericResult> {
        if (this.currentMode !== HandyMode.hssp) await this.setMode(HandyMode.hssp);

        const json: { result: GenericResult } = await this.putJson("hssp/loop", {
            activated: loop,
        });

        this.hsspLoop = loop;
        this.connected = true;
        return json.result;
    }

    /** Returns the current HSSP state. Puts the Handy in HSSP mode, if it isn't already in HSSP mode. */
    async getHsspState(): Promise<HsspState> {
        if (this.currentMode !== HandyMode.hssp) await this.setMode(HandyMode.hssp);

        const json: { result: GenericResult; state: HsspState } = await this.getJson("hssp/state");

        this.hsspState = json.state;
        this.connected = true;
        return json.state;
    }

    //---------------------------------------------
    //                  HSTP
    //---------------------------------------------
    /** Get the current time of the device. When the device and the server time is synchronized, this will be the server time estimated by the device. */
    async getHstpTime(): Promise<number> {
        const json: { result: GenericResult; time: number } = await this.getJson("hstp/time");
        this.hstpTime = json.time;
        this.connected = true;
        return json.time;
    }

    /** Gets the current manual offset of the Handy in milliseconds. Negative values mean that the script will be delayed, positive values mean that the script will be advanced. */
    async getHstpOffset(): Promise<number> {
        const json: { result: GenericResult; offset: number } = await this.getJson("hstp/offset");
        this.hstpOffset = json.offset;
        this.connected = true;
        return json.offset;
    }

    /** Sets the current manual offset of the Handy in milliseconds. Negative values mean that the script will be delayed, positive values mean that the script will be advanced. */
    async setHstpoffset(offset: number): Promise<GenericResult> {
        const json: { result: GenericResult } = await this.putJson("hstp/offset", {
            offset: Math.round(offset),
        });
        this.hstpOffset = offset;
        this.connected = true;
        return json.result;
    }

    /** Gets the current round-trip delay from the Handy to the server and back, in milliseconds. Used for synchronization. */
    async getHstpRtd(): Promise<number> {
        const json: { result: GenericResult; rtd: number } = await this.getJson("hstp/rtd");
        this.hstpRtd = json.rtd;
        this.connected = true;
        return json.rtd;
    }

    /** Syncronizes the device with the server clock and calculates the round-trip-delay between the device and the server. As far as I can tell, this just doesn't work. I suggest using getServerTimeOffset instead. */
    async getHstpSync(
        syncCount = 30,
        outliers = 6
    ): Promise<GenericResult & { time: number; rtd: number }> {
        const json: GenericResult & { time: number; rtd: number } = await this.getJson(
            "hstp/sync",
            {
                syncCount: Math.round(syncCount).toString(),
                outliers: Math.round(outliers).toString(),
            }
        );
        this.hstpRtd = json.rtd;
        this.connected = true;
        return json;
    }

    //---------------------------------------------
    //                  SLIDE
    //---------------------------------------------
    /** Gets the min and max slide positions from 0 - 100 */
    async getSlideSettings(): Promise<SlideInfo> {
        const json: SlideInfo = await this.getJson("slide");
        this.slideMin = json.min;
        this.slideMax = json.max;
        this.connected = true;
        return json;
    }

    /** Gets the current position of the slider in mm from the bottom position */
    async getSlidePositionAbsolute(): Promise<number> {
        const json: { result: GenericResult; position: number } = await this.getJson(
            "slide/position/absolute"
        );
        this.slidePositionAbsolute = json.position;
        this.connected = true;
        return json.position;
    }

    /** Sets the min and max slide positions from 0 - 100 */
    async setSlideSettings(min: number, max: number): Promise<GenericResult> {
        //flip if they're reversed
        if (min > max) {
            const temp = max;
            max = min;
            min = temp;
        }
        const json = await this.putJson("slide", { min, max });
        this.slideMin = min;
        this.slideMax = max;
        this.connected = true;
        return json.result;
    }

    /** Sets the min slide position, from 0 - 100. If fixed is true, then the device will attempt to maintain the same distance between min and max */
    async setSlideMin(min: number, fixed = false): Promise<GenericResult> {
        min = Math.max(0, Math.min(100, min));

        const json: { result: GenericResult } = await this.putJson("slide", {
            min,
            fixed: fixed || false,
        });

        const offset = min - this.slideMin;
        this.slideMin = min;
        if (fixed) {
            this.slideMax += offset;
            this.slideMax = Math.max(0, Math.min(100, this.slideMax));
        }
        this.connected = true;
        return json.result;
    }

    /** Sets the max slide position, from 0 - 100. If fixed is true, then the device will attempt to maintain the same distance between min and max */
    async setSlideMax(max: number, fixed = false): Promise<GenericResult> {
        max = Math.max(0, Math.min(100, max));

        const json: { result: GenericResult } = await this.putJson("slide", {
            max,
            fixed: fixed || false,
        });

        const offset = max - this.slideMax;
        this.slideMax = max;
        if (fixed) {
            this.slideMin += offset;
            this.slideMin = Math.max(0, Math.min(100, this.slideMin));
        }
        this.connected = true;
        return json.result;
    }

    //---------------------------------------------
    //                  TIMESYNC
    //---------------------------------------------
    /** Gets the current time on the HandyFeeling server */
    async getServerTime(): Promise<number> {
        const json = await this.getJson("servertime");
        return json.serverTime;
    }

    /** Gets the offset, in milliseconds, between the Handy and the HandyFeeling servers. Updates estimatedServerTimeOffset */
    async getServerTimeOffset(
        trips = 30,
        onProgress?: (progress: number) => void
    ): Promise<number> {
        //don't count the first one
        await this.getServerTime();

        let offsets = [];
        for (let i = 0; i < trips; i++) {
            const startTime = new Date().valueOf();
            const serverTime = await this.getServerTime();
            const endTime = new Date().valueOf();

            const rtd = endTime - startTime;
            const estimatedServerTime = serverTime + rtd / 2;
            const offset = estimatedServerTime - endTime;

            offsets.push(offset);
            if (onProgress) onProgress(i / trips);
        }

        //discard all readings more than one standard deviation from the mean, to reduce error
        const mean = offsets.reduce((acc, offset) => acc + offset, 0) / offsets.length;
        const errors = offsets.map(offset => Math.pow(offset - mean, 2));
        const sd = Math.sqrt(errors.reduce((acc, offset) => acc + offset, 0) / errors.length);
        offsets = offsets.filter(offset => Math.abs(offset - mean) < sd);

        //get average offset
        const offsetAggregate = offsets.reduce((acc, offset) => acc + offset) / offsets.length;
        this.estimatedServerTimeOffset = offsetAggregate;
        return this.estimatedServerTimeOffset;
    }

    //---------------------------------------------
    //                  UTILS
    //---------------------------------------------
    private enforceConnectionKey(): void {
        if (!this.connectionKey) {
            this.connected = false;
            throw new Error("connection key not set");
        }
    }

    private getUrl(cmd: string): string {
        return baseUrl + cmd;
    }

    private async catchHttpErrors(response: Response): Promise<any> {
        if (response.status === 400) throw new Error("Bad request");
        if (response.status === 502) {
            this.connected = false;
            throw new Error("Machine not connected");
        }
        if (response.status === 504) {
            this.connected = false;
            throw new Error("Machine timeout");
        }
        const json = await response.json();
        if (json.result === -1) throw new Error("Unknown response error");
        if (json.error) {
            if (json.error.code == 1000 || json.error.code == 1001 || json.error.code == 1002) {
                this.connected = false;
            } else if (json.error.code) {
                this.connected = true;
            }
            throw new Error(json.error.message);
        }
        return json;
    }

    private async getJson(path: string, params?: { [key: string]: string }): Promise<any> {
        this.enforceConnectionKey();
        let url = this.getUrl(path);
        if (params) {
            url +=
                "?" +
                Object.keys(params)
                    .map(key => key + "=" + params[key])
                    .join("&");
        }
        // eslint-disable-next-line no-console
        if (this.verbose) console.group("GET " + url);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Connection-Key": this.connectionKey,
            },
        });

        const json = await this.catchHttpErrors(response);
        if (this.verbose) {
            console.log("Response for GET " + url + ": ", json);
            // eslint-disable-next-line no-console
            console.groupEnd();
        }
        return json;
    }

    private async putJson(path: string, data: unknown): Promise<any> {
        this.enforceConnectionKey();
        const url = this.getUrl(path);
        // eslint-disable-next-line no-console
        if (this.verbose) console.group("PUT " + url, data);
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "X-Connection-Key": this.connectionKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const json = await this.catchHttpErrors(response);
        if (this.verbose) {
            console.log("Response for PUT " + url + ": ", json);
            // eslint-disable-next-line no-console
            console.groupEnd();
        }
        return json;
    }
}

export default Handy;
