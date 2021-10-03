import { getOffsetScript } from "lib/funscript-utils/funTweaker";
import { Funscript } from "lib/funscript-utils/types";
import Modifier from "./Modifier";

export default class ModifierOffset extends Modifier {
    public offsetAmount = 0;

    public apply(funscript: Funscript): Funscript {
        return getOffsetScript(this.prepare(funscript), this.offsetAmount);
    }

    public toString(): string {
        return "Amount = " + this.offsetAmount;
    }

    public reset(): void {
        this.offsetAmount = 0;
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const SetModifierOffsetValue = (
    modifier: Modifier,
    key: string,
    value: any
): ModifierOffset => {
    if (key === "offsetAmount" && typeof value === "number")
        (modifier as ModifierOffset).offsetAmount = value;
    return modifier as ModifierOffset;
};
