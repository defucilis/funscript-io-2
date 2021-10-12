import NumberField from "components/molecules/NumberField";
import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsRandomizer = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    modifier,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col my-4 gap-4">
            <p className="text-neutral-500 italic leading-none">
                Applies random offsets to time and position values in a script, to create variety.
            </p>
            <NumberField
                label="Time Jitter (ms)"
                value={ModifierOperations.getNumber(modifier, "timeJitter")}
                onChange={value => onSetValue("timeJitter", value)}
            />
            <NumberField
                label="Position Jitter (%)"
                value={ModifierOperations.getNumber(modifier, "positionJitter")}
                onChange={value => onSetValue("positionJitter", value)}
            />
        </div>
    );
};

export default ModifierControlsRandomizer;
