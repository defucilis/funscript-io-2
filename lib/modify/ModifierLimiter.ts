import { getLimitedScript } from "lib/funscript-utils/funTweaker";
import { Funscript } from "lib/funscript-utils/types";
import Modifier from "./Modifier";

export default class ModifierLimiter extends Modifier {
    public maxSpeed: number | "launch" | "handy" = "handy";

    public apply(funscript: Funscript): Funscript {
        return getLimitedScript(this.prepare(funscript), this.maxSpeed);
    }

    public toString(): string {
        return typeof this.maxSpeed === "number"
            ? `maxSpeed: ${this.maxSpeed}`
            : `${this.maxSpeed}`;
    }

    public reset(): void {
        this.maxSpeed = "handy";
    }
}
