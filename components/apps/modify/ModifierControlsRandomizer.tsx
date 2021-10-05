import Modifier from "lib/modify/Modifier";

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
            <p>The randomizer is coming soon, I promise!</p>
        </div>
    );
};

export default ModifierControlsRandomizer;
