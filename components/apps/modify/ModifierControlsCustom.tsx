import Modifier, { ModifierOperations } from "lib/modify/Modifier";
import CodeEditorField from "components/molecules/CodeEditorField";

const ModifierControlsCustom = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-4 my-4">
            <p className="text-neutral-500 italic leading-none">
                {
                    "Input your own javascript function that takes in an array of Actions and returns a transformed array to be applied to the funscript."
                }
            </p>
            <p className="text-neutral-500 italic leading-none">
                <span className="text-red-500 font-bold animate-pulse">IMPORTANT: </span>
                {"This is code that will run on YOUR computer!"}
                <br />
                {
                    "This code can do anything a website would do, including (but not limited to) download malicious files, redirect you to malicious websites, play audio or video, or change the contents of this webpage."
                }
                <br />
                {
                    "Only run code from a source that you trust, or code that you understand. Ideally both."
                }
                <br />
                {"A poorly-written function may also break this webpage and require a refresh."}
            </p>
            <CodeEditorField
                label="Custom Function"
                value={ModifierOperations.getString(modifier, "functionText")}
                onChange={value => onSetValue("functionText", value)}
                height={32}
            />
            <p className="text-neutral-500 italic leading-none">
                {"Technical info:"}
                <br />
                {
                    "The textbox should contain a single function signature that takes in an array of actions in the format {at: number, pos: number} and outputs an identically typed array. An example function has been provided."
                }
                <br />
                {
                    "You don't need to worry about rounding or sorting the output, that will be done automatically before the final funscript can be downloaded."
                }
            </p>
        </div>
    );
};

export default ModifierControlsCustom;
