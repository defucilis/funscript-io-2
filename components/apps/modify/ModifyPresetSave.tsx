import { MdKeyboardArrowLeft } from "react-icons/md";
import { useState } from "react";
import ButtonIcon from "components/atoms/ButtonIcon";
import Modifier, { ModifierPreset, ModifierType } from "lib/modify/Modifier";
import Button from "components/atoms/Button";
import TextField from "components/molecules/TextField";

const ModifyPresetSave = ({
    presets,
    modifiers,
    presetIndex,
    onSaveAsNew,
    onOverwrite,
    onCancel,
    active,
}: {
    presets: ModifierPreset[];
    modifiers: Modifier[];
    presetIndex: number;
    onSaveAsNew: (newPresets: ModifierPreset[]) => void;
    onOverwrite: (newPresets: ModifierPreset[]) => void;
    onCancel: () => void;
    active: boolean;
}): JSX.Element => {
    const [name, setName] = useState(presetIndex !== -1 ? presets[presetIndex].name : "");

    const cancel = () => {
        onCancel();
    };

    const saveAsNew = () => {
        if (!name) return;
        onSaveAsNew([...presets, { name, modifiers }]);
    };

    const overwrite = () => {
        if (!name) return;
        if (presetIndex === -1) return;
        onOverwrite(presets.map((p, i) => (i === presetIndex ? { name, modifiers } : p)));
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
            {modifiers.length <= 0 ? (
                <>
                    <div className="flex gap-4 items-center mb-4">
                        <ButtonIcon onClick={cancel}>
                            <MdKeyboardArrowLeft />
                        </ButtonIcon>
                        <h1 className="text-2xl">Save Preset</h1>
                    </div>
                    <p className="mt-8 text-xl">There are no modifiers in the stack!</p>
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
                    <h1 className="text-2xl">Save Preset</h1>
                    <div className="">
                        <TextField label="Preset Name" value={name} onChange={setName} />
                        {modifiers.map(modifier => (
                            <p key={modifier.id}>
                                {ModifierType[modifier.type]} #{modifier.id}
                            </p>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        {presetIndex !== -1 && (
                            <Button
                                onClick={overwrite}
                                className="bg-green-700"
                                disabled={name === ""}
                            >
                                Overwrite
                            </Button>
                        )}
                        <Button onClick={saveAsNew} className="bg-green-700" disabled={name === ""}>
                            {presetIndex === -1 ? "Save" : "Save as New"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ModifyPresetSave;
