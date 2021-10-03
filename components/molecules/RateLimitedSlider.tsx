import { useCallback, useState } from "react";
import useInterval from "lib/hooks/useInterval";
import Slider from "components/atoms/Slider";

const RateLimitedSlider = ({
    className,
    value,
    min,
    max,
    onChange,
    onLimitedChange,
    disabled,
    vertical,
}: {
    className?: string;
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    onLimitedChange?: (value: number) => void;
    disabled?: boolean;
    vertical?: boolean;
}): JSX.Element => {
    const [lastSentValue, setLastSentValue] = useState<number>(-100000);
    const [active, setActive] = useState(false);

    useInterval(() => {
        if (active) trySendValue();
    }, 500);

    const trySendValue = useCallback(() => {
        if (Math.round(lastSentValue) !== Math.round(value)) {
            if (onLimitedChange) onLimitedChange(Math.round(value));
            setLastSentValue(value);
        }
    }, [value, lastSentValue, onChange]);

    const startEditing = () => setActive(true);
    const stopEditing = () => {
        setActive(false);
        trySendValue();
    };

    return (
        <Slider
            className={className || ""}
            min={min}
            max={max}
            value={value}
            onChange={e => onChange(e)}
            onStartEdit={startEditing}
            onStopEdit={stopEditing}
            disabled={disabled || false}
            vertical={vertical || false}
        />
    );
};

export default RateLimitedSlider;
