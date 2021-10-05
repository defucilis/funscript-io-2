import React, { useState, useEffect } from "react";
import { MdAdd, MdKeyboardArrowLeft } from "react-icons/md";
import Modifier, { ModifierOperations, ModifierType } from "lib/modify/Modifier";
import { getHalfSpeedScript } from "lib/funscript-utils/funHalver";
import {
    getCustomFunctionScript,
    getLimitedScript,
    getMetadataScript,
    getOffsetScript,
    getRemappedScript,
} from "lib/funscript-utils/funTweaker";
import FunscriptDropzone from "components/molecules/FunscriptDropzone";
import FunscriptHeatmap from "components/molecules/FunscriptHeatmap";
import { Funscript } from "lib/funscript-utils/types";
import { addFunscriptMetadata } from "lib/funscript-utils/funConverter";
import SelectField from "components/atoms/SelectField";
import IconButton from "components/atoms/IconButton";
import Button from "components/atoms/Button";
import FunscriptInfo from "components/atoms/FunscriptInfo";
import ModifierControls from "./modify/ModifierControls";
import ModifierBlock from "./modify/ModifierBlock";

const defaultFunction = `actions => {
    //applies a 100ms offset to all actions
    return actions.map(action => ({...action, at: action.at + 100}));
}`;

const AppModify = (): JSX.Element => {
    const [modifiers, setModifiers] = useState<Modifier[]>([]);
    const [addingModifier, setAddingModifier] = useState(false);
    const [editingModifier, setEditingModifier] = useState(-1);
    const [newModifier, setNewModifier] = useState<Modifier | null>(null);
    const [nextId, setNextId] = useState(0);
    const [newModifierType, setNewModifierType] = useState<ModifierType | 0>(0);
    const [rawFunscript, setRawFunscript] = useState<Funscript | null>(null);
    const [modifiedFunscript, setModifiedFunscript] = useState<Funscript | null>(null);
    const [downloadFile, setDownloadFile] = useState<{ url: string; filename: string } | null>(
        null
    );
    const [error, setError] = useState("");

    const handleError = (error: string) => {
        setError(error);
    };

    const createNewModifier = (type: ModifierType | 0): void => {
        setNewModifierType(type);

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
                    onError: error => handleError("Error in custom function block: " + error),
                });
                break;
            default:
                throw new Error("Invalid value " + type + " for ModifierType!");
        }
        setNextId(cur => cur + 1);
    };

    const addNewModifier = (): void => {
        if (!newModifier) return;
        setModifiers(cur => [...cur, newModifier]);
        setNewModifier(null);
        setAddingModifier(false);
        setNewModifierType(0);
    };

    useEffect(() => {
        setError("");
        if (!rawFunscript) {
            setModifiedFunscript(null);
            return;
        }
        if (modifiers.length === 0) {
            setModifiedFunscript(rawFunscript);
            return;
        }

        setModifiedFunscript(
            addFunscriptMetadata(
                modifiers.reduce((acc, modifier) => {
                    return modifier.operation(acc, modifier.options, modifier.onError);
                }, rawFunscript)
            )
        );
    }, [modifiers, rawFunscript]);

    useEffect(() => {
        if (!modifiedFunscript) {
            setDownloadFile(null);
            return;
        }

        const newFilename =
            (modifiedFunscript.metadata?.title || "Unnamed script") + "_MODIFIED.funscript";
        setDownloadFile({
            url: window.URL.createObjectURL(new Blob([JSON.stringify(modifiedFunscript)])),
            filename: newFilename,
        });
    }, [modifiedFunscript]);

    return (
        <div>
            <div className="relative w-full overflow-x-hidden overflow-y-visible min-h-mobilemain md:min-h-main">
                <div
                    className="relative w-full"
                    style={{
                        left: addingModifier || editingModifier >= 0 ? "-100vw" : "0",
                        transition: "all 0.5s",
                    }}
                >
                    <div className="mb-4">
                        <FunscriptDropzone
                            className="h-16"
                            value={rawFunscript}
                            onChange={setRawFunscript}
                        />
                        {rawFunscript && <FunscriptInfo funscript={rawFunscript} />}
                    </div>
                    <div className="flex flex-col gap-4 items-center">
                        {modifiers.map((modifier, index) => (
                            <ModifierBlock
                                key={`Modifier_${modifier.id}`}
                                modifier={modifier}
                                onOpen={() => {
                                    setNewModifier(modifier);
                                    setEditingModifier(index);
                                }}
                                onDelete={() =>
                                    setModifiers(cur => cur.filter(m => m.id !== modifier.id))
                                }
                                onUp={() =>
                                    setModifiers(cur => ModifierOperations.reorder(cur, index, -1))
                                }
                                onDown={() =>
                                    setModifiers(cur => ModifierOperations.reorder(cur, index, 1))
                                }
                                onReset={() =>
                                    setModifiers(cur =>
                                        cur.map(m =>
                                            m.id === modifier.id
                                                ? ModifierOperations.reset(modifier)
                                                : m
                                        )
                                    )
                                }
                                isFirst={index === 0}
                                isLast={index === modifiers.length - 1}
                            />
                        ))}
                    </div>
                    <div className="w-full flex justify-center mt-4">
                        {modifiers.length === 0 ? (
                            <Button onClick={() => setAddingModifier(true)}>
                                Add your first modifier
                            </Button>
                        ) : (
                            <IconButton onClick={() => setAddingModifier(true)}>
                                <MdAdd />
                            </IconButton>
                        )}
                    </div>
                    {error && (
                        <p className="text-neutral-900 bg-red-500 rounded font-bold text-sm w-full grid place-items-center p-2 my-2 text-center">
                            {error}
                        </p>
                    )}
                    {modifiedFunscript && downloadFile && modifiers.length > 0 && (
                        <>
                            <a
                                href={downloadFile.url}
                                download={downloadFile.filename}
                                className="h-16 mt-4 relative block"
                            >
                                <div className="relative w-full h-full">
                                    <div className="relative z-10 bg-black bg-opacity-20 grid place-items-center w-full h-full">
                                        Save modified script
                                    </div>
                                    <FunscriptHeatmap
                                        className="absolute w-full h-full left-0 top-0 z-0"
                                        funscript={modifiedFunscript}
                                    />
                                </div>
                            </a>
                            <FunscriptInfo funscript={modifiedFunscript} />
                        </>
                    )}
                </div>
                <div
                    className="absolute w-full"
                    style={{
                        top: 0,
                        left: addingModifier ? "0" : "100vw",
                        transition: "all 0.5s",
                    }}
                >
                    <div className="flex gap-4 items-center mb-4">
                        <IconButton
                            onClick={() => {
                                setAddingModifier(false);
                                setNewModifierType(0);
                            }}
                        >
                            <MdKeyboardArrowLeft />
                        </IconButton>
                        <h1 className="text-2xl">Add modifier</h1>
                    </div>
                    <SelectField
                        value={newModifierType}
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
                    {newModifier && newModifierType !== 0 && (
                        <ModifierControls
                            modifier={newModifier}
                            onSetValue={(key, value) => {
                                setNewModifier(
                                    ModifierOperations.setValue(newModifier, key, value)
                                );
                            }}
                        />
                    )}
                    {newModifier &&
                        newModifier.type !== ModifierType.Randomizer &&
                        newModifier.type !== ModifierType.Doubler && (
                            <Button onClick={() => addNewModifier()} className="bg-green-700">
                                Confirm
                            </Button>
                        )}
                </div>
                <div
                    className="absolute w-full"
                    style={{
                        top: 0,
                        left: editingModifier >= 0 ? "0" : "100vw",
                        transition: "all 0.5s",
                    }}
                >
                    {newModifier && (
                        <>
                            <div className="flex gap-4 items-center mb-4">
                                <IconButton
                                    onClick={() => {
                                        setEditingModifier(-1);
                                        setNewModifierType(0);
                                    }}
                                >
                                    <MdKeyboardArrowLeft />
                                </IconButton>
                                <h1 className="text-2xl">
                                    {ModifierType[newModifier.type]} #{newModifier.id}
                                </h1>
                            </div>
                            <ModifierControls
                                modifier={newModifier}
                                onSetValue={(key, value) => {
                                    const newMod = ModifierOperations.setValue(
                                        newModifier,
                                        key,
                                        value
                                    );
                                    setNewModifier(newMod);
                                    setModifiers(cur =>
                                        cur.map(m => (m.id === newModifier.id ? newMod : m))
                                    );
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppModify;
