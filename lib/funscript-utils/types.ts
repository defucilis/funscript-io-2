export interface Funscript {
    actions: Action[];
    metadata?: FunscriptMetadata;
}

export interface FunscriptMetadata {
    duration?: number;
    average_speed?: number;
    creator?: string;
    description?: string;
    license?: string;
    notes?: string;
    performers?: string[];
    script_url?: string;
    tags?: string[];
    title?: string;
    type?: string;
    video_url?: string;
}

export interface Action {
    at: number;
    pos: number;
    subActions?: Action[];
    type?: "first" | "last" | "pause" | "prepause" | "apex";
}
