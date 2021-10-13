import React, { useCallback, useEffect, useRef, useState } from "react";
import useInterval from "lib/hooks/useInterval";

const isMouseEvent = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): e is MouseEvent => {
    return (e as MouseEvent).clientX !== undefined;
};
const isTouchEvent = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): e is TouchEvent => {
    return (e as TouchEvent).touches !== undefined;
};

export type SliderBaseProps = {
    interval?: number;
    min?: number;
    max?: number;
    disabled?: boolean;
    className?: string;
    vertical?: boolean;
    trackSize?: string | number;
    knobSize?: string | number;
    activeColor?: string;
    inactiveColor?: string;
};

export type SliderProps = SliderBaseProps & {
    value: number;
    onChange?: (val: number) => void;
    onIntervalChange?: (val: number) => void;
    onStartEdit?: () => void;
    onStopEdit?: () => void;
};

const Slider = ({
    value,
    onChange,
    onIntervalChange,
    onStartEdit,
    onStopEdit,
    interval = 500,
    min = 0,
    max = 1,
    disabled = false,
    className = "",
    vertical = false,
    trackSize = "0.5rem",
    knobSize = "1.5rem",
    activeColor = "rgb(251,113,133)",
    inactiveColor = "rgb(200,200,200)",
}: SliderProps): JSX.Element => {
    const trackDiv = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

    const [lastSentValue, setLastSentValue] = useState<number>(-100000);
    const [active, setActive] = useState(false);

    const getPercentage = useCallback(
        (val: number, round = false): number => {
            const percentage = (val - min) / (max - min);
            return round ? Math.round(percentage * 100) : percentage;
        },
        [min, max]
    );

    const handleMouse = useCallback(
        (
            e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
            needsDragging = true
        ) => {
            if ((!dragging && needsDragging) || !trackDiv.current) return;

            let rawPos = 0;
            if (isMouseEvent(e)) {
                rawPos = vertical ? e.clientY : e.clientX;
            } else if (isTouchEvent(e)) {
                rawPos = vertical ? e.touches[0].clientY : e.touches[0].clientX;
            }

            const rect = trackDiv.current.getBoundingClientRect();
            const pos = rawPos - ((vertical ? rect.top : rect.left) + 16 * 0.75);
            const percent = Math.min(
                1,
                Math.max(0, pos / ((vertical ? rect.height : rect.width) - 16 * 1.5))
            );
            const val = (vertical ? 1.0 - percent : percent) * (max - min) + min;
            if (onChange) onChange(val);
        },
        [onChange, trackDiv, dragging]
    );

    const trySendValue = useCallback(() => {
        if (lastSentValue !== value) {
            if (onIntervalChange) onIntervalChange(value);
            setLastSentValue(value);
        }
    }, [value, lastSentValue, onChange, onIntervalChange]);

    const startEditing = () => {
        setActive(true);
        if (onStartEdit) onStartEdit();
    };
    const stopEditing = useCallback(() => {
        setActive(false);
        trySendValue();
        if (onStopEdit) onStopEdit();
    }, [trySendValue, onStopEdit]);

    useEffect(() => {
        const handleMouseUp = () => {
            setDragging(false);
            stopEditing();
        };
        if (dragging) {
            document.addEventListener("mousemove", handleMouse);
            document.addEventListener("touchmove", handleMouse);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouse);
            document.removeEventListener("touchmove", handleMouse);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchend", handleMouseUp);
        };
    }, [dragging, stopEditing]);

    useInterval(
        () => {
            if (active && onIntervalChange) {
                trySendValue();
            }
        },
        onIntervalChange && interval ? interval : 10000000
    );

    return (
        <div
            className={`flex flex-col select-none  ${vertical ? "h-full" : "w-full"} ${
                className || ""
            }`}
        >
            <div
                className={`relative grid place-items-center ${
                    vertical ? "w-6 h-full" : "w-full h-6"
                }`}
            >
                <div
                    ref={trackDiv}
                    className={`relative z-10 bg-neutral-500 rounded cursor-pointer ${
                        vertical ? `h-full` : `w-full`
                    }`}
                    style={{
                        backgroundImage: `linear-gradient(${vertical ? "to top" : "to right"}, ${
                            disabled ? inactiveColor : activeColor
                        } ${getPercentage(value, true)}%, rgba(0, 0, 0, 0) ${getPercentage(
                            value,
                            true
                        )}% 100%)`,
                        height: vertical ? undefined : trackSize,
                        width: vertical ? trackSize : undefined,
                    }}
                    onMouseDown={(e: React.MouseEvent) => {
                        setDragging(true && !disabled);
                        if (!disabled) startEditing();
                        handleMouse(e, false);
                    }}
                />
                <div
                    className={`absolute z-10 rounded-full cursor-pointer shadow-md`}
                    style={{
                        left: vertical
                            ? undefined
                            : `calc(${(value - min) / (max - min)} * (100% - ${knobSize}))`,
                        bottom: vertical
                            ? `calc(${(value - min) / (max - min)} * (100% - ${knobSize}))`
                            : undefined,
                        width: knobSize,
                        height: knobSize,
                        backgroundColor: disabled ? inactiveColor : activeColor,
                    }}
                    onMouseDown={() => {
                        setDragging(true && !disabled);
                        if (!disabled) startEditing();
                    }}
                    onTouchStart={() => {
                        setDragging(true && !disabled);
                        if (!disabled) startEditing();
                    }}
                />
            </div>
        </div>
    );
};

export default Slider;
