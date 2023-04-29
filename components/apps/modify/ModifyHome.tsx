import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import Modifier, { ModifierPreset } from "lib/modify/Modifier";
import Button from "components/atoms/Button";
import FunscriptInfo from "components/atoms/FunscriptInfo";
import ButtonIcon from "components/atoms/ButtonIcon";
import FunscriptDropzone from "components/molecules/FunscriptDropzone";
import FunscriptHeatmap from "components/molecules/FunscriptHeatmap";
import { Funscript } from "lib/funscript-utils/types";
import ButtonLink from "components/atoms/ButtonLink";
import FunscriptExplorer from "../../organisms/FunscriptExplorer";
import ModifierBlock from "./ModifierBlock";

const ModifyHome = ({
    modifiers,
    preset,
    onAddModifier,
    onOpenPresets,
    onSavePreset,
    onEditModifier,
    onDeleteModifier,
    onResetModifier,
    onModifierUp,
    onModifierDown,
    rawFunscript,
    onAddRawFunscript,
    modifiedFunscript,
    downloadFile,
    active,
    error,
}: {
    modifiers: Modifier[];
    preset: ModifierPreset | null;
    onAddModifier: () => void;
    onOpenPresets: () => void;
    onSavePreset: () => void;
    onEditModifier: (index: number) => void;
    onDeleteModifier: (modifier: Modifier) => void;
    onResetModifier: (modifier: Modifier) => void;
    onModifierUp: (index: number) => void;
    onModifierDown: (index: number) => void;
    rawFunscript: Funscript | null;
    onAddRawFunscript: (funscript: Funscript) => void;
    modifiedFunscript: Funscript | null;
    downloadFile: { url: string; filename: string } | null;
    active: boolean;
    error?: string;
}): JSX.Element => {
    const [heatmapUrl, setHeatmapUrl] = useState("");

    return (
        <div
            className="relative w-full"
            style={{
                left: active ? "0" : "calc(-100% - 16px)",
                transition: "all 0.5s",
            }}
        >
            <div className="mb-4">
                <FunscriptDropzone
                    className="h-16"
                    value={rawFunscript}
                    onChange={(filename, script) => onAddRawFunscript(script)}
                />
                {rawFunscript && <FunscriptInfo funscript={rawFunscript} />}
            </div>
            <div className="flex flex-col items-center">
                {preset && <p className="text-xl">Preset: {preset.name}</p>}
                {modifiers.map((modifier, index) => (
                    <ModifierBlock
                        key={`Modifier_${modifier.id}`}
                        modifier={modifier}
                        onOpen={() => {
                            onEditModifier(index);
                        }}
                        onDelete={() => onDeleteModifier(modifier)}
                        onUp={() => onModifierUp(index)}
                        onDown={() => onModifierDown(index)}
                        onReset={() => onResetModifier(modifier)}
                        isFirst={index === 0}
                        isLast={index === modifiers.length - 1}
                    />
                ))}
            </div>
            <div className="w-full flex justify-center mt-4 mb-4 gap-4">
                {modifiers.length === 0 ? (
                    <>
                        <Button onClick={onAddModifier}>Add your first modifier</Button>
                        <Button onClick={onOpenPresets}>Or choose a modifier preset</Button>
                    </>
                ) : (
                    <ButtonIcon onClick={onAddModifier}>
                        <MdAdd />
                    </ButtonIcon>
                )}
            </div>
            {error && (
                <p className="text-neutral-900 bg-red-500 rounded font-bold text-sm w-full grid place-items-center p-2 my-2 text-center">
                    {error}
                </p>
            )}
            {modifiedFunscript && downloadFile && (
                <div className="mb-4">
                    <FunscriptHeatmap
                        className="w-full h-16 left-0 top-0 z-0"
                        funscript={modifiedFunscript}
                        onDataUrlChange={setHeatmapUrl}
                    />
                    <FunscriptInfo funscript={modifiedFunscript} />
                </div>
            )}
            <div className="flex justify-center gap-4 mb-4">
                {modifiedFunscript && downloadFile && (
                    <ButtonLink href={downloadFile.url} download={downloadFile.filename}>
                        Save {modifiers.length > 0 ? "modified" : "cleaned"} script
                    </ButtonLink>
                )}
                {heatmapUrl && downloadFile && (
                    <ButtonLink
                        href={heatmapUrl}
                        download={downloadFile.filename.replace("_MODIFIED.funscript", ".png")}
                    >
                        Save heatmap
                    </ButtonLink>
                )}
                {modifiers.length > 0 && (
                    <Button onClick={onSavePreset}>Save modifier preset</Button>
                )}
            </div>
            {rawFunscript && !modifiedFunscript && <FunscriptExplorer funscript={rawFunscript} />}
            {rawFunscript && modifiedFunscript && (
                <FunscriptExplorer funscript={rawFunscript} compareFunscript={modifiedFunscript} />
            )}
        </div>
    );
};

export default ModifyHome;
