import { MdKeyboardArrowLeft } from "react-icons/md";
import ButtonIcon from "components/atoms/ButtonIcon";
import { ModifierPreset } from "lib/modify/Modifier";

const ModifyPresetSelect = ({
    presets,
    onConfirm,
    onCancel,
    active,
}: {
    presets: ModifierPreset[];
    onConfirm: (index: number) => void;
    onCancel: () => void;
    active: boolean;
}): JSX.Element => {
    const cancel = () => {
        onCancel();
    };

    return (
        <div
            className="absolute w-full"
            style={{
                top: 0,
                left: active ? "0" : "100vw",
                transition: "all 0.5s",
            }}
        >
            {presets.length <= 0 ? (
                <>
                    <div className="flex gap-4 items-center mb-4">
                        <ButtonIcon onClick={cancel}>
                            <MdKeyboardArrowLeft />
                        </ButtonIcon>
                        <h1 className="text-2xl">Select Modifier Preset</h1>
                    </div>
                    <p className="mt-8 text-xl">You haven&apos;t created any presets!</p>
                    <p className="italic text-neutral-500">
                        You can save a preset after adding some in the main modify app. Note that
                        presets are saved to browser storage, so using the site in incognito mode,
                        or disabling cookies, will prevent you from being able to save modifier
                        presets
                    </p>
                </>
            ) : (
                <>
                    <div className="flex gap-4 items-center mb-4">
                        <ButtonIcon onClick={cancel}>
                            <MdKeyboardArrowLeft />
                        </ButtonIcon>
                    </div>
                    <h1 className="text-2xl">Select Modifier Preset</h1>
                    <div className="">
                        {presets.map((preset, i) => (
                            <div
                                key={preset.name}
                                className="text-lg flex gap-4 justify-between bg-primary-400 text-black rounded px-2 py-1 cursor-pointer hover:bg-primary-500"
                                onClick={() => onConfirm(i)}
                            >
                                <p>{preset.name}</p>
                                <p>
                                    {preset.modifiers.length} Modifier
                                    {preset.modifiers.length === 1 ? "" : "s"}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ModifyPresetSelect;
