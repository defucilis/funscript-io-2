import {
    getOffsetScript,
    getLimitedScript,
    getRemappedScript,
    getMetadataScript,
    getCustomFunctionScript,
    getRandomizedScript,
} from "lib/funscript-utils/funTweaker";
import { getHalfSpeedScript } from "lib/funscript-utils/funHalver";
import { getDoubleSpeedScript } from "lib/funscript-utils/funDoubler";
import { Funscript } from "lib/funscript-utils/types";

export enum ModifierType {
    Offset = 1,
    Halver = 2,
    Doubler = 3,
    Limiter = 4,
    Randomizer = 5,
    Remapper = 6,
    Metadata = 7,
    Custom = 8,
}

export default interface Modifier {
    type: ModifierType;
    id: number;
    options: { [key: string]: boolean | string | number };
    defaultOptions: { [key: string]: number | boolean | string };
    operation: (
        funscript: Funscript,
        options: { [key: string]: boolean | string | number },
        onError?: (error: string) => void
    ) => Funscript;
}

export interface ModifierPreset {
    name: string;
    modifiers: Modifier[];
}

export const createModifier = (type: ModifierType, id: number, onError?: (err: string) => void) => {
    const defaultFunction = `actions => {
        //applies a 100ms offset to all actions
        return actions.map(action => ({...action, at: action.at + 100}));
    }`;

    switch (type) {
        case ModifierType.Offset:
            return {
                type,
                id,
                operation: getOffsetScript,
                ...ModifierOperations.getOptions({
                    offset: 0,
                }),
            };
        case ModifierType.Halver:
            return {
                type,
                id,
                operation: getHalfSpeedScript,
                ...ModifierOperations.getOptions({
                    resetAfterPause: false,
                    removeShortPauses: true,
                    shortPauseDuration: 2000,
                    matchFirstDownstroke: false,
                    matchGroupEndPosition: true,
                }),
            };
        case ModifierType.Doubler:
            return {
                type,
                id,
                operation: getDoubleSpeedScript,
                ...ModifierOperations.getOptions({
                    matchGroupEnd: true,
                    shortPauseDuration: 100,
                }),
            };
        case ModifierType.Limiter:
            return {
                type,
                id,
                operation: getLimitedScript,
                ...ModifierOperations.getOptions({
                    devicePreset: "handy",
                    maxSpeed: 0,
                }),
            };
        case ModifierType.Randomizer:
            return {
                type,
                id,
                operation: getRandomizedScript,
                ...ModifierOperations.getOptions({
                    positionJitter: 5,
                    timeJitter: 50,
                }),
            };
        case ModifierType.Remapper:
            return {
                type,
                id,
                operation: getRemappedScript,
                ...ModifierOperations.getOptions({
                    min: 0,
                    max: 100,
                }),
            };
        case ModifierType.Metadata:
            return {
                type,
                id,
                operation: getMetadataScript,
                ...ModifierOperations.getOptions({}),
            };
        case ModifierType.Custom:
            return {
                type,
                id,
                operation: (
                    funscript: Funscript,
                    options: Record<string, string | number | boolean>
                ) =>
                    getCustomFunctionScript(funscript, options, err => {
                        if (onError) onError("Error in custom function block: " + err);
                    }),
                ...ModifierOperations.getOptions({ functionText: defaultFunction }),
            };
        default:
            throw new Error("Invalid value " + type + " for ModifierType!");
    }
};

export const ModifierOperations = {
    reset: (modifier: Modifier): Modifier => ({
        ...modifier,
        options: { ...modifier.defaultOptions },
    }),
    toString: (modifier: Modifier): string => {
        const options = Object.keys(modifier.options)
            .filter(key => modifier.options[key] != null)
            .map(key => `${key}: ${modifier.options[key]}`);
        return options.join(", ");
    },
    getNumber: (modifier: Modifier, key: string): number => {
        if (typeof modifier.options[key] === "number") {
            return modifier.options[key] as number;
        }
        return 0;
    },
    getString: (modifier: Modifier, key: string): string => {
        if (typeof modifier.options[key] === "string") {
            return modifier.options[key] as string;
        }
        return "";
    },
    getBoolean: (modifier: Modifier, key: string): boolean => {
        if (typeof modifier.options[key] === "boolean") {
            return modifier.options[key] as boolean;
        }
        return false;
    },
    getOptions: (options: {
        [key: string]: number | boolean | string;
    }): {
        options: { [key: string]: number | boolean | string };
        defaultOptions: { [key: string]: number | boolean | string };
    } => {
        return {
            options,
            defaultOptions: options,
        };
    },
    setValue: (modifier: Modifier, key: string, value: number | string | boolean): Modifier => {
        return { ...modifier, options: { ...modifier.options, [key]: value } };
    },
    reorder: <T>(array: T[], from: number, increment: number): T[] => {
        if (increment === 0) return array;

        const output: T[] = [];
        const swapA = from;
        const swapB = from + increment;
        for (let i = 0; i < array.length; i++) {
            if (i === swapA) output.push(array[swapB]);
            else if (i === swapB) output.push(array[swapA]);
            else output.push(array[i]);
        }

        return output;
    },
    getTagline: (type: ModifierType): string => {
        switch (type) {
            case ModifierType.Offset:
                return "Applies a constant offset to all actions";
            case ModifierType.Halver:
                return "Halves the speed of the script without losing sync";
            case ModifierType.Doubler:
                return "Doubles the speed of the script without losing sync";
            case ModifierType.Limiter:
                return "Limits the maximum speed of the script";
            case ModifierType.Randomizer:
                return "Applies random offsets to script actions";
            case ModifierType.Remapper:
                return "Changes the min and max stroke positions of the script";
            case ModifierType.Metadata:
                return "Adds metadata to the script";
            case ModifierType.Custom:
                return "Applies a custom javascript function to the script";
        }
        return "";
    },
};
