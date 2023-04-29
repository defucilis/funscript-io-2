import React, { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Button from "components/atoms/Button";
import ButtonIcon from "components/atoms/ButtonIcon";
import SelectField from "components/molecules/SelectField";
import Modifier, { ModifierType, ModifierOperations, createModifier } from "lib/modify/Modifier";
import ModifierControls from "./ModifierControls";

const ModifyAdd = ({
    onConfirm,
    onCancel,
    onError,
    active,
}: {
    onConfirm: (newModifier: Modifier) => void;
    onCancel: () => void;
    onError: (error: string) => void;
    active: boolean;
}): JSX.Element => {
    const [modifierType, setModifierType] = useState<ModifierType | 0>(0);
    const [newModifier, setNewModifier] = useState<Modifier | null>(null);
    const [nextId, setNextId] = useState(0);

    const confirm = () => {
        if (!newModifier) return;

        onConfirm(newModifier);
        setNewModifier(null);
        setModifierType(0);
    };

    const cancel = () => {
        setModifierType(0);
        setNewModifier(null);
        onCancel();
    };

    const createNewModifier = (type: ModifierType | 0): void => {
        setModifierType(type);

        if (type === 0) {
            setNewModifier(null);
            return;
        }

        setNewModifier(createModifier(type, nextId, onError));
        setNextId(cur => cur + 1);
    };

    return (
        <div
            className="absolute w-full"
            style={{
                top: 0,
                left: active ? "0" : "100%",
                transition: "all 0.5s",
            }}
        >
            <div className="flex gap-4 items-center mb-4">
                <ButtonIcon onClick={cancel}>
                    <MdKeyboardArrowLeft />
                </ButtonIcon>
                <h1 className="text-2xl">Add modifier</h1>
            </div>
            <SelectField
                value={modifierType}
                onChange={createNewModifier}
                options={[
                    { value: 0, label: "Select Modifier Type" },
                    { value: ModifierType.Offset, label: "Offset" },
                    { value: ModifierType.Halver, label: "Halver" },
                    { value: ModifierType.Doubler, label: "Doubler" },
                    { value: ModifierType.Limiter, label: "Limiter" },
                    { value: ModifierType.Remapper, label: "Remapper" },
                    { value: ModifierType.Randomizer, label: "Randomizer" },
                    { value: ModifierType.Metadata, label: "Metadata" },
                    { value: ModifierType.Custom, label: "Custom" },
                ]}
            />
            {newModifier && modifierType !== 0 && (
                <ModifierControls
                    modifier={newModifier}
                    onSetValue={(key, value) => {
                        setNewModifier(ModifierOperations.setValue(newModifier, key, value));
                    }}
                />
            )}
            {newModifier && (
                <Button onClick={confirm} className="bg-green-700">
                    Confirm
                </Button>
            )}
        </div>
    );
};

export default ModifyAdd;
