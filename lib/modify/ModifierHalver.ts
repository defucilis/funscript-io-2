import { getHalfSpeedScript } from "lib/funscript-utils/funHalver";
import { Funscript } from "lib/funscript-utils/types";
import Modifier from "./Modifier";

export default class ModifierHalver extends Modifier {
    public removeShortPauses?: boolean;
    public shortPauseDuration?: number;
    public matchFirstDownstroke?: boolean;
    public matchGroupEndPosition?: boolean;
    public resetAfterPause?: boolean;
    public debugMode?: boolean;

    public apply(funscript: Funscript): Funscript {
        return getHalfSpeedScript(this.prepare(funscript), {
            removeShortPauses: this.removeShortPauses,
            shortPauseDuration: this.shortPauseDuration,
            matchFirstDownstroke: this.matchFirstDownstroke,
            matchGroupEndPosition: this.matchGroupEndPosition,
            resetAfterPause: this.resetAfterPause,
            debugMode: this.debugMode,
        });
    }

    public toString(): string {
        const options = {
            removeShortPauses: this.removeShortPauses,
            shortPauseDuration: this.shortPauseDuration,
            matchFirstDownstroke: this.matchFirstDownstroke,
            matchGroupEndPosition: this.matchGroupEndPosition,
            resetAfterPause: this.resetAfterPause,
            debugMode: this.debugMode,
        };
        return Object.keys(options)
            .filter((key: string) => {
                const o: any = options;
                !!o[key];
            })
            .map(key => {
                const o: any = options;
                return o[key] === true ? key : `${key}=${o[key]}`;
            })
            .join(", ");
    }

    public reset(): void {
        this.removeShortPauses = undefined;
        this.shortPauseDuration = undefined;
        this.matchFirstDownstroke = undefined;
        this.matchGroupEndPosition = undefined;
        this.resetAfterPause = undefined;
        this.debugMode = undefined;
    }
}
