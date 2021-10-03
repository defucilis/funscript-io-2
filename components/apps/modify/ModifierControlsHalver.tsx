import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsHalver = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    console.log(modifier);
    return (
        <div className="flex flex-col gap-4 my-4">
            <div className="flex gap-4">
                <label>Reset After Pause</label>
                <input
                    type="checkbox"
                    checked={ModifierOperations.getBoolean(modifier, "resetAfterPause")}
                    onChange={e => onSetValue("resetAfterPause", e.target.checked)}
                />
            </div>
            <div className="flex gap-4">
                <label>Remove Short Pauses</label>
                <input
                    type="checkbox"
                    checked={ModifierOperations.getBoolean(modifier, "removeShortPauses")}
                    onChange={e => onSetValue("removeShortPauses", e.target.checked)}
                />
            </div>
            <div className="flex gap-4">
                <label>Short Pause Duration</label>
                <input
                    type="number"
                    value={ModifierOperations.getNumber(modifier, "shortPauseDuration")}
                    onChange={e => onSetValue("shortPauseDuration", parseInt(e.target.value))}
                    className="bg-neutral-700 text-white p-1 rounded"
                />
            </div>
            <div className="flex gap-4">
                <label>Match First Downstroke</label>
                <input
                    type="checkbox"
                    checked={ModifierOperations.getBoolean(modifier, "matchFirstDownstroke")}
                    onChange={e => onSetValue("matchFirstDownstroke", e.target.checked)}
                />
            </div>
            <div className="flex gap-4">
                <label>Match Group End Position</label>
                <input
                    type="checkbox"
                    checked={ModifierOperations.getBoolean(modifier, "matchGroupEndPosition")}
                    onChange={e => onSetValue("matchGroupEndPosition", e.target.checked)}
                />
            </div>
        </div>
    );
};

export default ModifierControlsHalver;
