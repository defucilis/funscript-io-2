import FieldHeader from "components/atoms/FieldHeader";

const TextField = ({
    value,
    onChange,
    label,
    error,
    placeholder,
    required,
    disabled,
    className,
}: {
    value: string;
    onChange: (val: string) => void;
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
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder || ""}
                disabled={disabled}
                className={`${disabled ? "fsio-field-text-disabled" : "fsio-field-text"}`}
            />
        </div>
    );
};

export default TextField;
