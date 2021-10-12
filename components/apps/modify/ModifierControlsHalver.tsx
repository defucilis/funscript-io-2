import NumberField from "components/molecules/NumberField";
import ToggleField from "components/molecules/ToggleField";
import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsHalver = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col my-4 gap-4">
            <p className="text-neutral-500 italic leading-none">
                Halves the speed of a script without sacrificing sync by changing each up+down
                stroke into a single up or down stroke.
            </p>
            <ToggleField
                label="Reset After Pause"
                value={ModifierOperations.getBoolean(modifier, "resetAfterPause")}
                onChange={value => onSetValue("resetAfterPause", value)}
            />
            <ToggleField
                label="Remove Short Pauses"
                value={ModifierOperations.getBoolean(modifier, "removeShortPauses")}
                onChange={value => onSetValue("removeShortPauses", value)}
            />
            <NumberField
                label="Short Pause Duration"
                value={ModifierOperations.getNumber(modifier, "shortPauseDuration")}
                onChange={value => onSetValue("shortPauseDuration", value)}
            />
            <ToggleField
                label="Match First Downstroke"
                value={ModifierOperations.getBoolean(modifier, "matchFirstDownstroke")}
                onChange={value => onSetValue("matchFirstDownstroke", value)}
            />
            <ToggleField
                label="Match Group End Position"
                value={ModifierOperations.getBoolean(modifier, "matchGroupEndPosition")}
                onChange={value => onSetValue("matchGroupEndPosition", value)}
            />
        </div>
    );
};

export default ModifierControlsHalver;
