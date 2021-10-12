const Toggle = ({
    value,
    onChange,
    disabled,
}: {
    value: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
}): JSX.Element => {
    return (
        <div
            className={`h-8 w-16 border rounded-full border-white border-opacity-20 relative bg-primary-400 cursor-pointer ${
                value ? "bg-opacity-100 border-opacity-80" : "bg-opacity-0 border-opacity-20"
            }`}
            style={{
                transition: "all 0.3s",
            }}
            onClick={() => (onChange ? (disabled ? null : onChange(!value)) : null)}
        >
            <div
                className={`rounded-full bg-white absolute`}
                style={{
                    height: "calc(100% - 0.5rem)",
                    width: "1.5rem",
                    top: "0.25rem",
                    transition: "all 0.3s",
                    left: value ? "calc(100% - 1.75rem)" : "0.25rem",
                }}
            ></div>
        </div>
    );
};

export default Toggle;
