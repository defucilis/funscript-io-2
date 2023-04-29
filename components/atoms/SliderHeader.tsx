import { roundNumber } from "lib/text";

const SliderHeader = ({
    className = "",
    label = "",
    value,
    valueUnit = "",
    valuePrefix = "",
    valueOverride = undefined,
    min = 0,
    max = 1,
    showValue = true,
    minValueDisplay = "",
    maxValueDisplay = "",
    decimalPlaces = 0,
    vertical = false,
}: {
    className?: string;
    label?: string;
    value: number | [number, number];
    valuePrefix?: string;
    valueUnit?: string;
    valueOverride?: string;
    min?: number;
    max?: number;
    showValue?: boolean;
    minValueDisplay?: string;
    maxValueDisplay?: string;
    decimalPlaces?: number;
    vertical?: boolean;
}): JSX.Element | null => {
    if (!(vertical || showValue || label)) return null;

    const getDisplayValue = (val: number): string => {
        if(valueOverride != null) return valueOverride;
        if (val === min && minValueDisplay) return minValueDisplay;
        if (val === max && maxValueDisplay) return maxValueDisplay;
        return (valuePrefix || "") + roundNumber(val, decimalPlaces) + (valueUnit || "");
    };

    return (
        <div className={`flex justify-between text-sm ${className}`}>
            {label ? <p>{label}</p> : <div />}
            {showValue && (
                <p className="whitespace-nowrap">
                    {typeof value === "number"
                        ? getDisplayValue(value)
                        : getDisplayValue(value[0]) + " - " + getDisplayValue(value[1])}
                </p>
            )}
        </div>
    );
};

export default SliderHeader;
