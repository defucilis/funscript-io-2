import Modifier from "lib/modify/Modifier";

const ModifierControlsDoubler = ({
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
                Doubles the speed of a script without sacrificing sync by changing each up or down
                stroke into an up+down stroke.
            </p>
            <p>The doubler is coming soon, I promise!</p>
        </div>
    );
};

export default ModifierControlsDoubler;
