import { getRemappedScript } from "lib/funscript-utils/funTweaker";
import { Funscript } from "lib/funscript-utils/types";
import Modifier from "./Modifier";

export default class ModifierRemapper extends Modifier {
    public min = 0;
    public max = 100;

    public apply(funscript: Funscript): Funscript {
        return getRemappedScript(this.prepare(funscript), this.min, this.max);
    }

    public toString(): string {
        return "Range = " + this.min + "-" + this.max;
    }

    public reset(): void {
        this.min = 0;
        this.max = 0;
    }
}
