import { useRef, useCallback } from "react";

const CodeEditorField = ({
    value,
    onChange,
    label,
    error,
    placeholder,
    required,
    disabled,
    className,
    height,
}: {
    value: string;
    onChange: (val: string) => void;
    label?: string;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    height: number;
}): JSX.Element => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleKey = useCallback(
        (e: React.KeyboardEvent) => {
            if (!textAreaRef.current) return;
            if (e.key !== "Tab") return;

            e.preventDefault();
            const start = textAreaRef.current.selectionStart;
            const end = textAreaRef.current.selectionEnd;
            textAreaRef.current.value =
                textAreaRef.current.value.substring(0, start) +
                "    " +
                textAreaRef.current.value.substring(end);
            textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + 4;
            onChange(textAreaRef.current.value);
        },
        [textAreaRef]
    );

    return (
        <div className={`fsio-field-wrapper ${className || ""}`}>
            <div className="flex justify-between">
                <label className="text-sm text-white">
                    {label || ""}
                    {required && <span className="text-red-500">*</span>}
                </label>
                {error && <p className="fsio-field-error">{error}</p>}
            </div>
            <textarea
                ref={textAreaRef}
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={handleKey}
                placeholder={placeholder || ""}
                disabled={disabled}
                className={`${
                    disabled ? "fsio-field-text-disabled" : "fsio-field-text"
                } resize-none h-${height} font-mono text-sm`}
            />
        </div>
    );
};

export default CodeEditorField;
