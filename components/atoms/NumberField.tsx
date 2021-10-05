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
            <div className="flex justify-between">
                <label className="text-sm text-white">
                    {label || ""}
                    {required && <span className="text-red-500">*</span>}
                </label>
                {error && <p className="fsio-field-error">{error}</p>}
            </div>
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
