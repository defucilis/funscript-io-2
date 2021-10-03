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
    onError?: (error: string) => void;
}

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
    reorder: <T extends any>(array: T[], from: number, increment: number): T[] => {
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
