import React, { useState, useEffect } from "react";
import Modifier, { ModifierOperations, ModifierPreset, createModifier } from "lib/modify/Modifier";
import { Funscript } from "lib/funscript-utils/types";
import { addFunscriptMetadata } from "lib/funscript-utils/funConverter";
import ModifyHome from "./modify/ModifyHome";
import ModifyAdd from "./modify/ModifyAdd";
import ModifyEdit from "./modify/ModifyEdit";
import ModifyPresetSelect from "./modify/ModifyPresetSelect";
import ModifyPresetSave from "./modify/ModifyPresetSave";

const AppModify = (): JSX.Element => {
    const [presets, setPresets] = useState<ModifierPreset[]>([]);
    const [presetIndex, setPresetIndex] = useState(-1);
    const [modifiers, setModifiers] = useState<Modifier[]>([]);
    const [addingModifier, setAddingModifier] = useState(false);
    const [editingModifier, setEditingModifier] = useState<Modifier | null>(null);
    const [editingModifierIndex, setEditingModifierIndex] = useState(-1);
    const [selectingPreset, setSelectingPreset] = useState(false);
    const [savingPreset, setSavingPreset] = useState(false);
    const [rawFunscript, setRawFunscript] = useState<Funscript | null>(null);
    const [modifiedFunscript, setModifiedFunscript] = useState<Funscript | null>(null);
    const [downloadFile, setDownloadFile] = useState<{ url: string; filename: string } | null>(
        null
    );
    const [error, setError] = useState("");

    const addNewModifier = (modifier: Modifier): void => {
        if (modifier) setModifiers(cur => [...cur, modifier]);
        setAddingModifier(false);
    };

    const startEditingModifier = (index: number): void => {
        setEditingModifierIndex(index);
        setEditingModifier(modifiers[index]);
    };

    useEffect(() => {
        const presets = window.localStorage.getItem("modifierPresets");
        if (!presets) {
            setPresets([]);
            return;
        }
        setPresets(JSON.parse(presets));
    }, []);

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
                    return modifier.operation(acc, modifier.options);
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
                <ModifyHome
                    modifiers={modifiers}
                    preset={presetIndex === -1 ? null : presets[presetIndex]}
                    onAddModifier={() => setAddingModifier(true)}
                    onOpenPresets={() => setSelectingPreset(true)}
                    onSavePreset={() => setSavingPreset(true)}
                    onEditModifier={index => startEditingModifier(index)}
                    onDeleteModifier={modifier =>
                        setModifiers(cur => cur.filter(m => m.id !== modifier.id))
                    }
                    onResetModifier={modifier =>
                        setModifiers(cur =>
                            cur.map(m =>
                                m.id === modifier.id ? ModifierOperations.reset(modifier) : m
                            )
                        )
                    }
                    onModifierUp={index =>
                        setModifiers(cur => ModifierOperations.reorder(cur, index, -1))
                    }
                    onModifierDown={index =>
                        setModifiers(cur => ModifierOperations.reorder(cur, index, 1))
                    }
                    rawFunscript={rawFunscript}
                    onAddRawFunscript={setRawFunscript}
                    modifiedFunscript={modifiedFunscript}
                    downloadFile={downloadFile}
                    active={
                        !addingModifier && !editingModifier && !selectingPreset && !savingPreset
                    }
                    error={error}
                />
                <ModifyAdd
                    onConfirm={addNewModifier}
                    onCancel={() => setAddingModifier(false)}
                    onError={setError}
                    active={addingModifier}
                />
                <ModifyEdit
                    modifier={editingModifier}
                    index={editingModifierIndex}
                    onConfirm={(modifier, index) => {
                        setModifiers(cur => cur.map((m, i) => (i === index ? modifier : m)));
                        setEditingModifier(null);
                        setEditingModifierIndex(-1);
                    }}
                    onCancel={() => {
                        setEditingModifier(null);
                        setEditingModifierIndex(-1);
                    }}
                    active={!!editingModifier}
                />
                <ModifyPresetSelect
                    presets={presets}
                    onConfirm={presetIndex => {
                        const newModifiers = presets[presetIndex].modifiers.map(modifierData => {
                            const modifier = createModifier(modifierData.type, modifierData.id);
                            modifier.options = modifierData.options;
                            modifier.defaultOptions = modifierData.defaultOptions;
                            return modifier;
                        });
                        setModifiers(newModifiers);
                        setPresetIndex(presetIndex);
                        setSelectingPreset(false);
                    }}
                    onCancel={() => {
                        setSelectingPreset(false);
                    }}
                    active={!!selectingPreset}
                />
                <ModifyPresetSave
                    presets={presets}
                    modifiers={modifiers}
                    presetIndex={presetIndex}
                    onOverwrite={newPresets => {
                        setPresets(newPresets);
                        window.localStorage.setItem("modifierPresets", JSON.stringify(newPresets));
                        setSavingPreset(false);
                    }}
                    onSaveAsNew={newPresets => {
                        setPresets(newPresets);
                        setPresetIndex(newPresets.length - 1);
                        window.localStorage.setItem("modifierPresets", JSON.stringify(newPresets));
                        setSavingPreset(false);
                    }}
                    onCancel={() => {
                        setSavingPreset(false);
                    }}
                    active={!!savingPreset}
                />
            </div>
        </div>
    );
};

export default AppModify;
