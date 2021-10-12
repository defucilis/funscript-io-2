import FieldHeader from "../atoms/FieldHeader";

const TextAreaField = ({
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
    return (
        <div className={`fsio-field-wrapper ${className || ""}`}>
            <FieldHeader label={label} required={required} error={error} />
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder || ""}
                disabled={disabled}
                className={`${
                    disabled ? "fsio-field-text-disabled" : "fsio-field-text"
                } resize-none h-${height}`}
            />
        </div>
    );
};

export default TextAreaField;
