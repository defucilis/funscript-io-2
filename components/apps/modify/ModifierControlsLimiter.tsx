import SelectField from "components/molecules/SelectField";
import NumberField from "components/molecules/NumberField";
import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const devicePresets = ["handy", "launch", "custom"];

const ModifierControlsLimiter = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-4 my-4">
            <p className="text-neutral-500 italic leading-none">
                Changes position values to ensure that all actions within a script are below a speed
                threshold. Useful to ensure a script will function on a particular device.
            </p>
            <SelectField
                label="Device Mode"
                value={devicePresets.indexOf(
                    ModifierOperations.getString(modifier, "devicePreset")
                )}
                onChange={value => onSetValue("devicePreset", devicePresets[value])}
                options={[
                    { label: "Handy", value: 0 },
                    { label: "Launch", value: 1 },
                    { label: "Custom", value: 2 },
                ]}
            />
            {ModifierOperations.getString(modifier, "devicePreset") === "custom" && (
                <NumberField
                    label="Max Speed"
                    value={ModifierOperations.getNumber(modifier, "customSpeed")}
                    onChange={value => onSetValue("customSpeed", value)}
                />
            )}
        </div>
    );
};

export default ModifierControlsLimiter;
