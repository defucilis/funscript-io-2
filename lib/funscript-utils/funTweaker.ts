import { Action, Funscript } from "./types";
import { getSpeed, roundAction } from "./utils";

/**
 * Adds a fixed time offset to all actions in a funscript
 * @param  {Funscript} funscript - The funscript to offset
 * @param  options - The offset to apply, in milliseconds (default 0)
 * @returns The offset funscript
 */
export const getOffsetScript = (
    funscript: Funscript,
    options: {
        offset?: number;
    }
): Funscript => {
    const offset = options.offset || 0;

    if (offset < -1 * funscript.actions.slice(-1)[0].at) return funscript;

    return {
        ...funscript,
        actions: funscript.actions
            .map((action: Action) => {
                return { ...action, at: action.at + offset };
            })
            .filter((action: Action) => action.at >= 0)
            .map(roundAction),
    };
};
/**
 * Remaps all funscript positions to a newly defined range
 * @param  {Funscript} funscript - The funscript to remap
 * @param  options - The new minimum and maximum positions (default 0 -> 100)
 * @returns The remapped funscript
 */
export const getRemappedScript = (
    funscript: Funscript,
    options: {
        min?: number;
        max?: number;
    }
): Funscript => {
    const min = options.min || 0;
    const max = options.max || 100;

    let currentMin = 100;
    let currentMax = 0;
    funscript.actions.forEach(action => {
        currentMin = Math.min(currentMin, action.pos);
        currentMax = Math.max(currentMax, action.pos);
    });

    return {
        ...funscript,
        actions: funscript.actions
            .map(action => {
                const newPos =
                    min + ((action.pos - currentMin) / (currentMax - currentMin)) * (max - min);
                return { ...action, pos: newPos };
            })
            .map(roundAction),
    };
};
/**
 * Limits a funscript's position values to ensure that it doesn't exceed a given maximum speed value
 * @param  funscript - The funscript to limit
 * @param  options - The time, in milliseconds, it takes for the device to complete one full movement (one-direction). Known device values are included as string options "launch" and "handy" (default "handy")
 * @returns The limited funscript
 */
export const getLimitedScript = (
    funscript: Funscript,
    options: {
        devicePreset?: "custom" | "launch" | "handy";
        customSpeed?: number;
    }
): Funscript => {
    if (!funscript || !funscript.actions || funscript.actions.length === 0) return funscript;

    const devicePreset = options.devicePreset || "handy";
    const customSpeed = options.customSpeed || 0;

    let maxSpeedValue = 0;
    switch (devicePreset) {
        case "launch":
            maxSpeedValue = 377;
            break;
        case "handy":
            maxSpeedValue = 432;
            break;
        default:
            maxSpeedValue = customSpeed;
            break;
    }

    const newActions: Action[] = [funscript.actions[0]];
    for (let i = 1; i < funscript.actions.length; i++) {
        const action = funscript.actions[i];
        const lastAction = newActions[i - 1];
        const actionSpeed = getSpeed(action, lastAction);
        if (actionSpeed <= maxSpeedValue) {
            newActions.push(action);
            continue;
        }

        let newPos = action.pos;
        if (action.pos < lastAction.pos) {
            newPos = lastAction.pos - (maxSpeedValue * (action.at - lastAction.at)) / 1000;
        } else {
            newPos = lastAction.pos + (maxSpeedValue * (action.at - lastAction.at)) / 1000;
        }
        newActions.push({ ...action, pos: newPos });
    }
    return { ...funscript, actions: newActions.map(roundAction) };
};

/**
 *
 * @param {Funscript} funscript - The funscript to limit
 * @param options - The new metadata values to add - all default to empty strings. Note that performers and tags are comma-separated
 * @returns The funscript with metadata applied
 */
export const getMetadataScript = (
    funscript: Funscript,
    options: {
        creator?: string;
        description?: string;
        license?: string;
        notes?: string;
        performers?: string;
        script_url?: string;
        tags?: string;
        title?: string;
        scriptType?: string;
        video_url?: string;
    }
): Funscript => {
    const creator = options.creator || "";
    const description = options.description || "";
    const license = options.license || "";
    const notes = options.notes || "";
    const performers = options.performers || "";
    const scriptUrl = options.script_url || "";
    const tags = options.tags || "";
    const title = options.title || "";
    const type = options.scriptType || "";
    const videoUrl = options.video_url || "";

    const metadata = {
        creator,
        description,
        license,
        notes,
        performers: performers ? performers.split(",").map(performer => performer.trim()) : [],
        script_url: scriptUrl,
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        title,
        type,
        video_url: videoUrl,
    };
    return { ...funscript, metadata };
};

/**
 * Applies a custom function to directly modify the actions array.
 * Note that this function makes use of eval without any checking, so you MUST do your own security checking before making use of this function.
 * The function text should accept an array of actions ({at: number, pos: number}) and return an identically typed array.
 * @param funscript The funscript to modify
 * @param options The function text (as plain javascript) modifying the actions array.
 * @returns The modified funscript, or the original funscript if anything goes wrong.
 */
export const getCustomFunctionScript = (
    funscript: Funscript,
    options: {
        functionText?: string;
    },
    onError?: (error: string) => void
): Funscript => {
    const functionText = options.functionText || null;

    if (!functionText) {
        if (onError) onError("No function text provided");
        return funscript;
    }

    let transformActions: any = null;
    let newActions: any[] = [];
    try {
        transformActions = eval(functionText);
    } catch {
        if (onError) onError("Failed to get valid function from your script");
        return funscript;
    }
    try {
        newActions = transformActions(funscript.actions);
        if (!Array.isArray(newActions)) {
            if (onError) onError("Your function didn't return an array");
            return funscript;
        }

        let isValid = true;
        for (let i = 0; i < newActions.length; i++) {
            const action = newActions[i];

            const keys = Object.keys(action);
            if (keys.length !== 2) {
                isValid = false;
                console.error("1", action);
                break;
            }
            if (keys[0] !== "pos" && keys[0] !== "at") {
                isValid = false;
                console.error("2", action);
                break;
            }
            if (keys[1] !== "pos" && keys[1] !== "at") {
                isValid = false;
                console.error("3", action);
                break;
            }
            if (isNaN(action[keys[0]]) || isNaN(action[keys[1]])) {
                isValid = false;
                console.error("4", action);
                break;
            }
        }
        if (!isValid) {
            if (onError) onError("One or more of the Actions in your returned array was invalid");
            return funscript;
        }
        return { ...funscript, actions: newActions };
    } catch {
        if (onError) onError("Failed to transform actions using your script");
        return funscript;
    }
};
