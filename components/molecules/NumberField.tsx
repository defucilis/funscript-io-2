import FieldHeader from "../atoms/FieldHeader";

const NumberField = ({
    value,
    onChange,
    label,
    error,
    placeholder,
    required,
    disabled,
    className,
}: {
    value: number;
    onChange: (val: number) => void;
    label?: string;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}): JSX.Element => {
    return (
        <div className={`fsio-field-wrapper ${className || ""}`}>
            <FieldHeader label={label} required={required} error={error} />
            <input
                type="number"
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                placeholder={placeholder || ""}
                disabled={disabled}
                className={`${disabled ? "fsio-field-text-disabled" : "fsio-field-text"}`}
            />
        </div>
    );
};

export default NumberField;
