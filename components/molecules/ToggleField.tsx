import FieldHeader from "../atoms/FieldHeader";
import Toggle from "../atoms/Toggle";

const ToggleField = ({
    value,
    onChange,
    label,
    error,
    required,
    disabled,
    className,
}: {
    value: boolean;
    onChange: (val: boolean) => void;
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
            <Toggle value={value} disabled={disabled} onChange={onChange} />
        </div>
    );
};

export default ToggleField;
