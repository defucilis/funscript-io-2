import { FileRejection } from "react-dropzone";
import { useState } from "react";
import Dropzone from "components/atoms/Dropzone";

export type PlayableContent = {
    url: string;
    name: string;
    type: "video" | "audio";
};

const ContentDropzone = ({
    className,
    value,
    onChange,
    error,
    onError,
    maxSize,
}: {
    className?: string;
    value: PlayableContent | null;
    onChange: (newContent: PlayableContent | null) => void;
    error?: string;
    onError?: (error: string) => void;
    accept?: string[];
    maxSize?: number;
}): JSX.Element => {
    const [localError, setLocalError] = useState("");

    const acceptFiles = (files: File[]) => {
        setLocalError("");
        const split = files[0].name.split(".");
        const extension = split.pop();

        if (extension === "mp4") {
            onChange({
                url: URL.createObjectURL(files[0]),
                name: files[0].name,
                type: "video",
            });
        } else if (extension === "mp3") {
            onChange({
                url: URL.createObjectURL(files[0]),
                name: files[0].name,
                type: "audio",
            });
        } else {
            setLocalError("Unsupported filetype");
        }
    };

    const rejectFiles = (rejections: FileRejection[]) => {
        if (onError) onError(rejections[0].errors[0].message);
        setLocalError(rejections[0].errors[0].message);
    };

    return (
        <Dropzone
            className={className}
            options={{
                accept: [".mp4", ".mp3"],
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
                {value && <p>{value.name}</p>}
                {!value && <p>Drop a .mp4 or .mp3 here</p>}
                {(error || localError) && (
                    <p className="text-red-300 text-sm">{error || localError}</p>
                )}
            </div>
        </Dropzone>
    );
};

export default ContentDropzone;
