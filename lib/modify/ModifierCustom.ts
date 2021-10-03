import { Funscript } from "lib/funscript-utils/types";
import Modifier from "./Modifier";

export default class ModifierLimiter extends Modifier {
    public functionText = `actions => {
    //applies a 100ms offset to all actions
    return actions.map(action => ({...action, at: action.at + 100}));
}`;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onError: (error: string) => void = () => {};

    public apply(funscript: Funscript): Funscript {
        let transformActions: any = null;
        let newActions: any[] = [];
        try {
            // eslint-disable-next-line
            transformActions = eval(this.functionText);
        } catch {
            this.onError("Failed to get valid function from your script");
            return funscript;
        }
        try {
            newActions = transformActions(funscript.actions);
            if (!Array.isArray(newActions)) {
                this.onError("Your function didn't return an array");
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
                this.onError("One or more of the Actions in your returned array was invalid");
                return funscript;
            }
            this.onError("");
            return this.prepare({ ...funscript, actions: newActions });
        } catch {
            this.onError("Failed to transform actions using your script");
            return funscript;
        }
    }

    public reset(): void {
        this.functionText = `actions => {
    //applies a 100ms offset to all actions
    return actions.map(action => ({...action, at: action.at + 100}));
}`;
    }
}
