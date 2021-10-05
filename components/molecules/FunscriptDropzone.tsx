import { FileRejection } from "react-dropzone";
import { useState } from "react";
import Dropzone from "components/atoms/Dropzone";
import { Funscript } from "lib/funscript-utils/types";
import { convertCsvToFunscript, getFunscriptFromString } from "lib/funscript-utils/funConverter";
import FunscriptHeatmap from "./FunscriptHeatmap";

const FunscriptDropzone = ({
    className,
    value,
    onChange,
    error,
    onError,
    maxSize,
}: {
    className?: string;
    value: Funscript | null;
    onChange: (newScript: Funscript) => void;
    error?: string;
    onError?: (error: string) => void;
    accept?: string[];
    maxSize?: number;
}): JSX.Element => {
    const [localError, setLocalError] = useState("");

    const acceptFiles = (files: File[]) => {
        setLocalError("");
        const split = files[0].name.split(".");
        const name = split[0];
        const extension = split.pop();
        const reader = new FileReader();

        reader.onloadend = async (e: ProgressEvent<FileReader>) => {
            if (!e.target) return;
            const resultString = String(e.target.result);
            if (extension === "funscript") {
                const newFunscript = getFunscriptFromString(resultString);
                if (!newFunscript.metadata?.title) {
                    if (!newFunscript.metadata) newFunscript.metadata = { title: name };
                    else newFunscript.metadata.title = name;
                }
                onChange(newFunscript);
            } else if (extension === "csv") {
                const newFunscript = convertCsvToFunscript(resultString, name);
                onChange(newFunscript);
            } else {
                throw new Error("invalid type for script file");
            }
        };
        reader.readAsText(files[0]);
    };

    const rejectFiles = (rejections: FileRejection[]) => {
        if (onError) onError(rejections[0].errors[0].message);
        setLocalError(rejections[0].errors[0].message);
    };

    return (
        <Dropzone
            className={className}
            options={{
                accept: [".funscript", ".csv"],
                maxSize,
                onDropAccepted: acceptFiles,
                onDropRejected: rejectFiles,
                multiple: false,
            }}
        >
            <div
                className={`relative z-10 grid place-items-center w-full h-full ${
                    value ? "bg-black bg-opacity-30" : ""
                }`}
            >
                {value && (
                    <p>
                        {value.metadata?.title || "Unnamed Funscript"} ({value.actions.length}{" "}
                        actions)
                    </p>
                )}
                {!value && <p>Drop a .funscript or .csv here</p>}
                {(error || localError) && (
                    <p className="text-red-300 text-sm">{error || localError}</p>
                )}
            </div>
            {value && (
                <FunscriptHeatmap
                    className="absolute w-full h-full left-0 top-0 z-0"
                    funscript={value}
                />
            )}
        </Dropzone>
    );
};

export default FunscriptDropzone;
