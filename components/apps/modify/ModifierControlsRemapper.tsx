import NumberField from "components/atoms/NumberField";
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
            <p className="text-neutral-500 italic leading-none">
                Changes the minimum and maximum position values of a script to new values.
            </p>
            <NumberField
                label="Min Position"
                value={ModifierOperations.getNumber(modifier, "min")}
                onChange={value => onSetValue("min", value)}
            />
            <NumberField
                label="Max Position"
                value={ModifierOperations.getNumber(modifier, "max")}
                onChange={value => onSetValue("max", value)}
            />
        </div>
    );
};

export default ModifierControlsRemapper;
