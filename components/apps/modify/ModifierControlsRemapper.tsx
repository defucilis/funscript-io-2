import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsRemapper = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-4 my-4">
            <div className="flex gap-4">
                <label>Min</label>
                <input
                    type="number"
                    value={ModifierOperations.getNumber(modifier, "min")}
                    onChange={e => onSetValue("min", parseInt(e.target.value))}
                    className="bg-neutral-700 text-white p-1 rounded"
                />
            </div>
            <div className="flex gap-4">
                <label>Max</label>
                <input
                    type="number"
                    value={ModifierOperations.getNumber(modifier, "max")}
                    onChange={e => onSetValue("max", parseInt(e.target.value))}
                    className="bg-neutral-700 text-white p-1 rounded"
                />
            </div>
        </div>
    );
};

export default ModifierControlsRemapper;
