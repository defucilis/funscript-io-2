import FieldHeader from "../atoms/FieldHeader";

const SelectField = ({
    value,
    onChange,
    options,
    label,
    error,
    required,
    disabled,
    className,
}: {
    value: number;
    onChange: (val: number) => void;
    options: { value: number; label: string }[];
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
            <select
                value={value}
                disabled={disabled}
                className={`${disabled ? "fsio-field-text-disabled" : "fsio-field-text"}`}
                onChange={e => onChange(Number(e.target.value))}
            >
                {options.map((option, index) => (
                    <option value={option.value} key={"select_" + index + "_" + option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
