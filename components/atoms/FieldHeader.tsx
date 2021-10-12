const FieldHeader = ({
    label,
    required,
    error,
}: {
    label?: string;
    required?: boolean;
    error?: string;
}): JSX.Element => {
    return (
        <div className="flex justify-between">
            <label className="text-sm text-white">
                {label || ""}
                {required && <span className="text-red-500">*</span>}
            </label>
            {error && <p className="fsio-field-error">{error}</p>}
        </div>
    );
};

export default FieldHeader;
