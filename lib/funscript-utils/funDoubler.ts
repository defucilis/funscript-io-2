import { Action, Funscript } from "./types";
import { getActionGroups, roundAction } from "./utils";

const sign = (val: number) => {
    if (val === 0) return 0;
    return val > 0 ? 1 : -1;
};

export interface FunDoublerOptions {
    removeShortPauses?: boolean;
    shortPauseDuration?: number;
    matchFirstDownstroke?: boolean;
    matchGroupEndPosition?: boolean;
    resetAfterPause?: boolean;
    debugMode?: boolean;
}

/**
 * Takes in a group of actions and creates a double-speed version of that group, without losing cadence
 * @param  {Action[]} actionGroup - The group to double the speed of
 * @param  {FunDoublerOptions} options - Options to change the behaviour of the speed-doubling
 */
export const getDoubleSpeedGroup = (actionGroup: Action[], options: FunDoublerOptions): Action[] => {
    //Select 'apex' actions where the direction changes, and action pairs that represent a pause
    const keyActions: Action[] = [];
    let apexCount = 0;
    let filteredGroup = actionGroup.filter((action, i) => {
        if (i === 0) return true;
        if (i === actionGroup.length - 1) return true;

        //ignore actions that occur within a pause (there shouldn't be any, but just in case)
        const lastAction = actionGroup[i - 1];
        const nextAction = actionGroup[i + 1];
        return !(action.pos === lastAction.pos && action.pos === nextAction.pos);
    });
    if (options.removeShortPauses) {
        const newFilteredGroup: Action[] = [];
        const pauseTime =
            options.shortPauseDuration && options.shortPauseDuration > 0
                ? options.shortPauseDuration
                : 2000;
        filteredGroup.forEach((action, i) => {
            if (i === 0 || i === filteredGroup.length - 1) {
                newFilteredGroup.push(action);
                return;
            }
            const lastAction = actionGroup[i - 1];
            const nextAction = actionGroup[i + 1];

            //if the gap between to equal positions is less than 0.5 seconds (configurable?)
            if (action.pos === lastAction.pos && Math.abs(action.at - lastAction.at) < pauseTime) {
                newFilteredGroup.push({ at: (action.at + lastAction.at) * 0.5, pos: action.pos });
            } else if (
                action.pos === nextAction.pos &&
                Math.abs(action.at - nextAction.at) < pauseTime
            ) {
                //do nothing - we're going to combine them at the next action so we don't add it!
            } else {
                newFilteredGroup.push(action);
            }
        });
        filteredGroup = newFilteredGroup;
    }
    filteredGroup.forEach((action, i) => {
        //The first and last points in a group are always added
        if (i === 0) {
            keyActions.push({ ...action, subActions: [], type: "first" });
            return;
        }
        if (i === filteredGroup.length - 1) {
            //note - should this be a key action? Hard to know right now, need to test
            keyActions.push({ ...action, subActions: [], type: "last" });
            return;
        }

        const lastAction = filteredGroup[i - 1];
        const nextAction = filteredGroup[i + 1];

        //Add the actions on either side of a pause
        if (action.pos - lastAction.pos === 0) {
            keyActions.push({ ...action, subActions: [], type: "pause" });
            apexCount = 0;
            return;
        }
        if (action.pos - nextAction.pos === 0) {
            keyActions.push({ ...action, subActions: [], type: "prepause" });
            apexCount = 0;
            return;
        }

        if (options.matchFirstDownstroke && i === 1 && action.pos < lastAction.pos) {
            apexCount = 1;
        }

        //apex actions - add every second one (reset when at a pause)
        if (sign(action.pos - lastAction.pos) !== sign(nextAction.pos - action.pos)) {
            if (apexCount === 0) {
                const lastKeyAction = keyActions.slice(-1)[0];
                if (lastKeyAction.subActions) {
                    lastKeyAction.subActions = [...lastKeyAction.subActions, action];
                }
                apexCount++;
                return;
            } else {
                keyActions.push({ ...action, subActions: [], type: "apex" });
                apexCount = 0;
                return;
            }
        }

        const lastKeyAction = keyActions.slice(-1)[0];
        if (lastKeyAction.subActions) {
            lastKeyAction.subActions = [...lastKeyAction.subActions, action];
        }
    });

    let pos = options.resetAfterPause ? 100 : keyActions[0].pos;
    const finalActions: Action[] = [];
    keyActions.forEach((action, i) => {
        if (i === 0) {
            const outputAction: Action = { at: action.at, pos };
            if (options.debugMode) {
                outputAction.type = action.type;
                if (action.subActions && action.subActions.length > 0)
                    outputAction.subActions = action.subActions;
            }
            finalActions.push(outputAction);
            return;
        }

        const lastAction = keyActions[i - 1];

        const outputAction: Action = { at: 0, pos: 0 };
        if (action.type === "pause") {
            outputAction.at = action.at;
            outputAction.pos = action.pos;
        } else {
            if (lastAction.subActions) {
                const max = Math.max(...[...lastAction.subActions.map(a => a.pos), action.pos]);
                const min = Math.min(...[...lastAction.subActions.map(a => a.pos), action.pos]);
                const newPos = Math.abs(pos - min) > Math.abs(pos - max) ? min : max;

                outputAction.pos = newPos;
                pos = newPos;
            } else {
                outputAction.pos = action.pos;
            }

            outputAction.at = action.at;
        }

        if (options.debugMode) {
            outputAction.type = action.type;
            if (action.subActions && action.subActions.length > 0)
                outputAction.subActions = action.subActions;
        }
        finalActions.push(outputAction);
    });

    if (options.matchGroupEndPosition) {
        if (finalActions.slice(-1)[0].pos !== actionGroup.slice(-1)[0].pos) {
            const finalActionDuration = finalActions.slice(-1)[0].at - finalActions.slice(-2)[0].at;
            const outputAction: Action = { at: 0, pos: 0 };
            outputAction.pos = actionGroup.slice(-1)[0].pos;
            outputAction.at = finalActions.slice(-1)[0].at + finalActionDuration;

            if (options.debugMode) {
                finalActions.slice(-1)[0].type = "apex";

                outputAction.subActions = [];
                outputAction.type = "last";
            }
            finalActions.push(outputAction);
        }
    }

    return finalActions.map(action => ({
        ...action,
        pos: Math.round(action.pos),
        at: Math.round(action.at),
    }));
};
/**
 * Creates a double-speed version of a script without sacrificing cadence by turning every up or downstroke into a full up+down stroke
 * @param  {Funscript} script - The script to double the speed of
 * @param  {FunDoublerOptions} options - Options to configure how the doubling is done
 * @returns The half-speed funscript
 */
export const getDoubleSpeedScript = (script: Funscript, options: FunDoublerOptions): Funscript => {
    //onProgress("Loaded script with " + script.actions.length + " actions");
    const output: Funscript = { ...script };
    output.actions = [];

    //Split the source actions up into groups, separating two groups if 5x the last interval passes without any actions
    const orderedActions = script.actions.sort((a, b) => a.at - b.at);
    //Note that IF the first two actions are separated by more than five seconds, we manually add the first one and use the algorithm on the second onwards
    const longFirstWait = orderedActions[1].at - orderedActions[0].at > 5000;
    if (longFirstWait) output.actions.push(orderedActions[0]);
    const actionGroups = longFirstWait
        ? getActionGroups(orderedActions.slice(1))
        : getActionGroups(orderedActions);
    const slowerGroups = actionGroups.map(group => getDoubleSpeedGroup(group, options));

    //finally, we combine these slower groups into the final actions array
    slowerGroups.forEach(group => {
        group.forEach(action => {
            output.actions.push(action);
        });
    });

    //ensure that the durations match up by adding a pause at the end
    if (output.actions.slice(-1)[0].at !== script.actions.slice(-1)[0].at) {
        output.actions.push({
            at: script.actions.slice(-1)[0].at,
            pos: output.actions.slice(-1)[0].pos,
        });
    }
    //onProgress("Slowed down action groups, new action count is " + output.actions.length);
    output.actions = output.actions.map(roundAction);
    return output;
};
