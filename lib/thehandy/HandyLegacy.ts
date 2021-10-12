import {
    CommandResponse,
    CsvUploadResponse,
    HandyMode,
    ModeResponse,
    SetSpeedResponse,
    SetStrokeResponse,
    SettingsResponse,
    StatusResponse,
    SyncOffsetResponse,
    SyncPlayResponse,
    SyncPrepareResponse,
    VersionResponse,
} from "./typesLegacy";

const baseUrl = "https://www.handyfeeling.com/api/v1/";

/** Class to connect to and control a Handy using the HandyFeeling API V1 for devices with firmware v2.x. Will probably stop working eventually. And is no longer being suppoorted */
class Handy {
    _connectionKey: string;
    serverTimeOffset: number;

    constructor(connectionKey?: string) {
        if (connectionKey) {
            this._connectionKey = connectionKey;
            localStorage.setItem("connectionKey", connectionKey);
        } else {
            const storedConnectionKey = localStorage.getItem("connectionKey");
            if (storedConnectionKey) this._connectionKey = storedConnectionKey;
            else this._connectionKey = "";
        }
        this.serverTimeOffset = 0;
    }

    get connectionKey(): string {
        return this._connectionKey;
    }
    set connectionKey(connectionKey: string) {
        this._connectionKey = connectionKey;
        localStorage.setItem("connectionKey", connectionKey);
    }

    //---------------------------------------------
    //                  GET DATA
    //---------------------------------------------
    async setMode(mode: HandyMode): Promise<ModeResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("setMode") + "?mode=" + mode;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async toggleMode(mode: HandyMode): Promise<ModeResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("toggleMode") + "?mode=" + mode;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async setSpeed(speed: number, absolute?: boolean): Promise<SetSpeedResponse> {
        this.enforceConnectionKey();
        const type = absolute ? "mm/s" : "%";
        const url = this.getUrl("setSpeed") + "?speed=" + speed + "&type=" + type;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async setStroke(speed: number, absolute?: boolean): Promise<SetStrokeResponse> {
        this.enforceConnectionKey();
        const type = absolute ? "mm" : "%";
        const url = this.getUrl("setStroke") + "?stroke=" + speed + "&type=" + type;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async setStrokeZone(min: number, max: number): Promise<CommandResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("setStrokeZone") + "?min=" + min + "&max=" + max;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async stepSpeed(directionUp: boolean): Promise<SetSpeedResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("stepSpeed") + "?step=" + directionUp;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }
    async stepStroke(directionUp: boolean): Promise<SetStrokeResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("stepStroke") + "?step=" + directionUp;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    //---------------------------------------------
    //                  GET DATA
    //---------------------------------------------
    async getVersion(): Promise<VersionResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("getVersion");
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async getSettings(): Promise<SettingsResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("getSettings");
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async getStatus(): Promise<StatusResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("getStatus");
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    //---------------------------------------------
    //             SERVER TIME SYNC
    //---------------------------------------------
    async getServerTimeOffset(
        trips = 30,
        onProgress?: (progress: number) => void
    ): Promise<number> {
        this.enforceConnectionKey();
        const url = this.getUrl("getServerTime");

        //don't count the first one
        await (await fetch(url)).json();

        let offsets = [];
        for (let i = 0; i < trips; i++) {
            const startTime = new Date().valueOf();

            const response = await fetch(url);
            const json = await response.json();
            const endTime = new Date().valueOf();
            const rtd = endTime - startTime;
            const estimatedServerTime = Number(json.serverTime) + rtd / 2;
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
        this.serverTimeOffset = offsetAggregate;
        return this.serverTimeOffset;
    }

    //---------------------------------------------
    //                 VIDEO SYNC
    //---------------------------------------------
    async syncPrepare(
        scriptUrl: string,
        name?: string,
        size?: number
    ): Promise<SyncPrepareResponse> {
        this.enforceConnectionKey();
        let url = this.getUrl("syncPrepare") + "?url=" + scriptUrl + "&timeout=30000";
        if (name) url += "&name=" + name;
        if (size) url += "&size=" + size;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async syncPlay(play = true, time = 0): Promise<SyncPlayResponse> {
        this.enforceConnectionKey();
        const serverTime = Math.round(new Date().valueOf() + this.serverTimeOffset);
        const url =
            this.getUrl("syncPlay") +
            "?play=" +
            play +
            "&serverTime=" +
            serverTime +
            "&time=" +
            time;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async syncOffset(offset: number): Promise<SyncOffsetResponse> {
        this.enforceConnectionKey();
        const url = this.getUrl("syncOffset") + "?offset=" + offset;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async syncAdjustTimestamp(videoTimeSeconds: number, filter = 0.5): Promise<boolean> {
        this.enforceConnectionKey();
        const url =
            this.getUrl("syncAdjustTimestamp") +
            "?currentTime=" +
            videoTimeSeconds * 1000 +
            "&serverTime=" +
            Math.round(new Date().valueOf() + this.serverTimeOffset) +
            "&filter=" +
            filter;
        const response = await fetch(url);
        const json = await response.json();
        if (json.error) throw json;
        return json;
    }

    async uploadCsv(csv: File, filename?: string): Promise<CsvUploadResponse> {
        const url = "https://www.handyfeeling.com/api/sync/upload";
        if (!filename) filename = "script_" + new Date().valueOf() + ".csv";
        const formData = new FormData();
        formData.append("syncFile", csv, filename);
        const response = await fetch(url, {
            method: "post",
            body: formData,
        });
        const newUrl = await response.json();
        return newUrl;
    }

    //---------------------------------------------
    //                  UTILS
    //---------------------------------------------
    enforceConnectionKey(): void {
        if (!this.connectionKey) throw new Error("connection key not set");
    }

    getUrl(cmd: string): string {
        return baseUrl + this.connectionKey + "/" + cmd;
    }
}

export default Handy;
