import React, { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Button from "components/atoms/Button";
import IconButton from "components/atoms/IconButton";
import SelectField from "components/atoms/SelectField";
import Modifier, { ModifierType, ModifierOperations } from "lib/modify/Modifier";
import { getHalfSpeedScript } from "lib/funscript-utils/funHalver";
import {
    getOffsetScript,
    getLimitedScript,
    getRemappedScript,
    getMetadataScript,
    getCustomFunctionScript,
} from "lib/funscript-utils/funTweaker";
import ModifierControls from "./ModifierControls";

const defaultFunction = `actions => {
    //applies a 100ms offset to all actions
    return actions.map(action => ({...action, at: action.at + 100}));
}`;

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

        switch (type) {
            case ModifierType.Offset:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getOffsetScript,
                    ...ModifierOperations.getOptions({
                        offset: 0,
                    }),
                });
                break;
            case ModifierType.Halver:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getHalfSpeedScript,
                    ...ModifierOperations.getOptions({
                        resetAfterPause: false,
                        removeShortPauses: true,
                        shortPauseDuration: 2000,
                        matchFirstDownstroke: false,
                        matchGroupEndPosition: true,
                    }),
                });
                break;
            case ModifierType.Doubler:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getOffsetScript,
                    ...ModifierOperations.getOptions({}),
                });
                break;
            case ModifierType.Limiter:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getLimitedScript,
                    ...ModifierOperations.getOptions({
                        devicePreset: "handy",
                        maxSpeed: 0,
                    }),
                });
                break;
            case ModifierType.Randomizer:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getOffsetScript,
                    ...ModifierOperations.getOptions({}),
                });
                break;
            case ModifierType.Remapper:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getRemappedScript,
                    ...ModifierOperations.getOptions({
                        min: 0,
                        max: 100,
                    }),
                });
                break;
            case ModifierType.Metadata:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getMetadataScript,
                    ...ModifierOperations.getOptions({}),
                });
                break;
            case ModifierType.Custom:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getCustomFunctionScript,
                    ...ModifierOperations.getOptions({ functionText: defaultFunction }),
                    onError: error => onError("Error in custom function block: " + error),
                });
                break;
            default:
                throw new Error("Invalid value " + type + " for ModifierType!");
        }
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
                <IconButton onClick={cancel}>
                    <MdKeyboardArrowLeft />
                </IconButton>
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
            {newModifier &&
                newModifier.type !== ModifierType.Randomizer &&
                newModifier.type !== ModifierType.Doubler && (
                    <Button onClick={confirm} className="bg-green-700">
                        Confirm
                    </Button>
                )}
        </div>
    );
};

export default ModifyAdd;
