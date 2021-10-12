import NumberField from "components/molecules/NumberField";
import ToggleField from "components/molecules/ToggleField";
import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsDoubler = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col my-4 gap-4">
            <p className="text-neutral-500 italic leading-none">
                Doubles the speed of a script without sacrificing sync by changing each up or down
                stroke into an up+down stroke.
            </p>
            <ToggleField
                label="Match Group End"
                value={ModifierOperations.getBoolean(modifier, "matchGroupEnd")}
                onChange={value => onSetValue("matchGroupEnd", value)}
            />
            <NumberField
                label="Short Pause Duration"
                value={ModifierOperations.getNumber(modifier, "shortPauseDuration")}
                onChange={value => onSetValue("shortPauseDuration", value)}
            />
        </div>
    );
};

export default ModifierControlsDoubler;
