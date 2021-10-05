import React, { useState , useEffect } from "react";
import { MdAdd } from "react-icons/md";
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
import ModifierBlock from "./modify/ModifierBlock";
import ModifierControls from "./modify/ModifierControls";

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

    const handleError = (error: string) => {
        console.error(error);
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
                    ...ModifierOperations.getOptions({}),
                });
                break;
            case ModifierType.Halver:
                setNewModifier({
                    type,
                    id: nextId,
                    operation: getHalfSpeedScript,
                    ...ModifierOperations.getOptions({
                        removeShortPauses: true,
                        shortPauseDuration: 2000,
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
                    ...ModifierOperations.getOptions({ devicePreset: "handy" }),
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
                    ...ModifierOperations.getOptions({ min: 0, max: 100 }),
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
                    ...ModifierOperations.getOptions({ customFunction: defaultFunction }),
                    onError: handleError,
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
                    <FunscriptDropzone
                        className="h-16 mb-5"
                        value={rawFunscript}
                        onChange={setRawFunscript}
                    />
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
                        <button
                            onClick={() => setAddingModifier(true)}
                            className={`bg-neutral-600 text-white rounded grid place-items-center ${
                                modifiers.length === 0 ? "px-4 py-2 text-2xl" : "text-4xl "
                            }`}
                        >
                            {modifiers.length === 0 ? "Add your first modifier" : <MdAdd />}
                        </button>
                    </div>
                    {modifiedFunscript && downloadFile && (
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
                    <button
                        onClick={() => {
                            setAddingModifier(false);
                            setNewModifierType(0);
                        }}
                    >
                        Cancel
                    </button>
                    <h1>Add modifier</h1>
                    <select
                        value={newModifierType}
                        onChange={e => createNewModifier(Number(e.target.value))}
                        className="bg-neutral-700"
                    >
                        <option value="0">Select Modifier Type</option>
                        <option value={ModifierType.Offset}>Offset</option>
                        <option value={ModifierType.Halver}>Halver</option>
                        <option value={ModifierType.Doubler}>Doubler</option>
                        <option value={ModifierType.Limiter}>Limiter</option>
                        <option value={ModifierType.Remapper}>Remapper</option>
                        <option value={ModifierType.Randomizer}>Randomizer</option>
                        <option value={ModifierType.Metadata}>Metadata</option>
                        <option value={ModifierType.Custom}>Custom</option>
                    </select>
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
                    <button disabled={!newModifier} onClick={() => addNewModifier()}>
                        Confirm
                    </button>
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
                            <h1>{ModifierType[newModifier.type]}</h1>
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
                    <button
                        onClick={() => {
                            setEditingModifier(-1);
                            setNewModifierType(0);
                        }}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppModify;
