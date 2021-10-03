import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsLimiter = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-4 my-4">
            <div className="flex gap-4">
                <label>Device Mode</label>
                <select
                    value={ModifierOperations.getString(modifier, "devicePreset")}
                    onChange={e => onSetValue("devicePreset", e.target.value)}
                    className="bg-neutral-700 text-white p-1 rounded"
                >
                    <option value="handy">Handy</option>
                    <option value="launch">Launch</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            {ModifierOperations.getString(modifier, "devicePreset") === "custom" && (
                <div className="flex gap-4">
                    <label>Max Speed</label>
                    <input
                        type="number"
                        value={ModifierOperations.getNumber(modifier, "customSpeed")}
                        onChange={e => onSetValue("customSpeed", parseInt(e.target.value))}
                        className="bg-neutral-700 text-white p-1 rounded"
                    />
                </div>
            )}
        </div>
    );
};

export default ModifierControlsLimiter;
