import { useCallback, useState } from "react";
import useInterval from "lib/hooks/useInterval";
import MinMaxSlider from "components/atoms/MinMaxSlider";

const RateLimitedMinMaxSlider = ({
    label,
    valueUnit,
    className,
    valueMin,
    valueMax,
    min,
    max,
    onChangeMin,
    onChangeMax,
    onLimitedChangeMin,
    onLimitedChangeMax,
    disabled,
    vertical,
    ticks,
}: {
    label?: string;
    valueUnit?: string;
    className?: string;
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    onChangeMin: (value: number) => void;
    onChangeMax: (value: number) => void;
    onLimitedChangeMin?: (value: number) => void;
    onLimitedChangeMax?: (value: number) => void;
    disabled?: boolean;
    vertical?: boolean;
    ticks?: number;
}): JSX.Element => {
    const [lastSentValueMin, setLastSentValueMin] = useState<number>(-100000);
    const [lastSentValueMax, setLastSentValueMax] = useState<number>(-100000);
    const [activeMin, setActiveMin] = useState(false);
    const [activeMax, setActiveMax] = useState(false);

    useInterval(() => {
        if (activeMin) trySendValueMin();
        if (activeMax) trySendValueMax();
    }, 500);

    const trySendValueMin = useCallback(() => {
        if (Math.round(lastSentValueMin) !== Math.round(valueMin)) {
            if (onLimitedChangeMin) onLimitedChangeMin(Math.round(valueMin));
            setLastSentValueMin(valueMin);
        }
    }, [valueMin, lastSentValueMin, onChangeMin, onLimitedChangeMin]);

    const trySendValueMax = useCallback(() => {
        if (Math.round(lastSentValueMax) !== Math.round(valueMax)) {
            if (onLimitedChangeMax) onLimitedChangeMax(Math.round(valueMax));
            setLastSentValueMax(valueMax);
        }
    }, [valueMax, lastSentValueMax, onChangeMax, onLimitedChangeMax]);

    const startEditingMin = () => setActiveMin(true);
    const stopEditingMin = useCallback(() => {
        setActiveMin(false);
        trySendValueMin();
    }, [trySendValueMin, valueMin]);

    const startEditingMax = () => setActiveMax(true);
    const stopEditingMax = useCallback(() => {
        setActiveMax(false);
        trySendValueMax();
    }, [trySendValueMax, valueMax]);

    return (
        <MinMaxSlider
            label={label}
            valueUnit={valueUnit}
            className={className || ""}
            min={min}
            max={max}
            valueMin={valueMin}
            valueMax={valueMax}
            onChangeMin={e => onChangeMin(e)}
            onChangeMax={e => onChangeMax(e)}
            onStartEditMin={startEditingMin}
            onStartEditMax={startEditingMax}
            onStopEditMin={stopEditingMin}
            onStopEditMax={stopEditingMax}
            disabled={disabled || false}
            vertical={vertical || false}
            ticks={ticks}
        />
    );
};

export default RateLimitedMinMaxSlider;
