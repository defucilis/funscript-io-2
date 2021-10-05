import { ReactNode } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

const Dropzone = ({
    children,
    options,
    className,
}: {
    children: ReactNode;
    options?: DropzoneOptions;
    className?: string;
}): JSX.Element => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone(options);

    return (
        <div
            className={`relative border-2 border-primary-400 border-dashed rounded grid place-items-center w-full ${
                isDragActive ? "bg-primary-400 bg-opacity-20" : ""
            } ${className || ""}`}
            {...getRootProps()}
            style={{
                transition: "all 0.3s",
            }}
        >
            <input {...getInputProps()} />
            {children}
        </div>
    );
};

export default Dropzone;
