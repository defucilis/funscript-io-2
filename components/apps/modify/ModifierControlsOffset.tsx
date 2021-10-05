import NumberField from "components/atoms/NumberField";
import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsOffset = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-4 my-4">
            <p className="text-neutral-500 italic leading-none">
                Add a fixed time offset to all actions in a script to ensure proper synchronization
            </p>
            <NumberField
                label="Offset Amount (ms)"
                value={ModifierOperations.getNumber(modifier, "offset")}
                onChange={value => onSetValue("offset", value)}
            />
        </div>
    );
};

export default ModifierControlsOffset;
