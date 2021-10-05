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
            <div className="flex justify-between">
                <label className="text-sm text-white">
                    {label || ""}
                    {required && <span className="text-red-500">*</span>}
                </label>
                {error && <p className="fsio-field-error">{error}</p>}
            </div>
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
