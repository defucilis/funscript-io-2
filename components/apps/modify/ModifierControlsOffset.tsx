import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsOffset = ({
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
                <label>Offset Amount (ms)</label>
                <input
                    type="number"
                    value={ModifierOperations.getNumber(modifier, "offsetAmount")}
                    onChange={e => onSetValue("offsetAmount", parseInt(e.target.value))}
                    className="bg-neutral-700 text-white p-1 rounded"
                />
            </div>
        </div>
    );
};

export default ModifierControlsOffset;
