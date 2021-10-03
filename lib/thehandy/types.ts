//---------------------------------------------
//                  GENERIC
//---------------------------------------------

export enum HandyMode {
    unknown = -1,
    hamp = 0,
    hssp = 1,
    hdsp = 2,
}

export enum GenericResult {
    error = -1,
    success = 0,
}

export enum SetModeResult {
    error = -1,
    successNewMode = 0,
    successSameMode = 1,
}

//---------------------------------------------
//                  HAMP
//---------------------------------------------

export enum SetHampStateResult {
    error = -1,
    successNewState = 0,
    successSameState = 1,
}

export enum HampState {
    stopped = 1,
    moving = 2,
}

//---------------------------------------------
//                  HDSP
//---------------------------------------------

export enum SetHdspResult {
    error = -3,
    successPositionReached = 0,
    successPositionNotReached = 1,
    successAlreadyAtPosition = 2,
    successInterrupted = 3,
}

//---------------------------------------------
//                  HSSP
//---------------------------------------------

export enum HsspSetupResult {
    usingCached = 0,
    downloaded = 1,
}

export enum HsspState {
    needSetup = 2,
    stopped = 3,
    playing = 4,
}

//---------------------------------------------
//                  INFO
//---------------------------------------------

export interface HandyInfo {
    fwVersion: string;
    fwStatus: HandyFirmwareStatus;
    hwVersion: string;
    model: string;
    branch: string;
}

export enum HandyFirmwareStatus {
    upToDate = 0,
    updateRequired = 1,
    updateAvailable = 2,
}

export interface HandySettings {
    slideMin: number;
    slideMax: number;
}

export interface HandyStatus {
    mode: HandyMode;
    state: number;
}

export interface SlideInfo {
    min: number;
    max: number;
}

export interface CsvUploadResponse {
    success: boolean;
    url: string;
    info?: string;
    filename?: string;
    size?: number;
    originalFile?: string;
}
