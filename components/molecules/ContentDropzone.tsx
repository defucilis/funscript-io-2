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

        switch (extension) {
            case "mp4":
            case "webm":
                onChange({
                    url: URL.createObjectURL(files[0]),
                    name: files[0].name,
                    type: "video",
                });
                break;
            case "mp3":
            case "m4a":
            case "ogg":
                onChange({
                    url: URL.createObjectURL(files[0]),
                    name: files[0].name,
                    type: "audio",
                });
                break;
            default:
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
                accept: {
                    "video/mp4": [".mp4"],
                    "video/webm": [".webm"],
                    "audio/mp3": [".mp3"],
                    "audio/mp4": [".m4a"],
                    "audio/ogg": [".ogg"],
                },
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
                {!value && <p>Drop an audio or video file here</p>}
                {(error || localError) && (
                    <p className="text-red-300 text-sm">{error || localError}</p>
                )}
            </div>
        </Dropzone>
    );
};

export default ContentDropzone;
