import React, { useCallback, useEffect, useRef, useState } from "react";
import Mathf from "lib/Mathf";

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

const Slider = ({
    label,
    valueUnit,
    zeroValue,
    min,
    max,
    value,
    onChange,
    onStartEdit,
    onStopEdit,
    className,
    disabled,
    vertical,
    ticks = 4,
}: {
    label?: string;
    valueUnit?: string;
    zeroValue?: string;
    min: number;
    max: number;
    value: number;
    onChange: (val: number) => void;
    onStartEdit?: () => void;
    onStopEdit?: () => void;
    className?: string;
    disabled?: boolean;
    vertical?: boolean;
    ticks?: number;
}): JSX.Element => {
    const trackDiv = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

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
            onChange(val);
        },
        [onChange, trackDiv, dragging]
    );

    useEffect(() => {
        const handleMouseUp = () => {
            setDragging(false);
            if (onStopEdit) onStopEdit();
        };

        if (!trackDiv.current) return;
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
            document.addEventListener("touchend", handleMouseUp);
        };
    }, [dragging, trackDiv, onStopEdit]);

    return (
        <div className={`flex flex-col select-none  ${vertical ? "h-full" : "w-full"}`}>
            {!vertical && (
                <div className="flex justify-between text-sm">
                    {label ? <p>{label}</p> : <div />}
                    <p>
                        {zeroValue && value === min
                            ? zeroValue
                            : `${Math.round(value)}${valueUnit || ""}`}
                    </p>
                </div>
            )}
            <div
                className={`relative grid place-items-center ${
                    vertical ? "w-6 h-full" : "w-full h-6"
                } ${ticks && ticks > 0 ? (vertical ? "mr-4" : "mb-4") : ""} ${className || ""}`}
            >
                <div
                    ref={trackDiv}
                    className={`relative z-10 bg-neutral-500 rounded cursor-pointer ${
                        vertical ? "h-full w-2" : "h-2 w-full"
                    }`}
                    style={{
                        backgroundImage: `linear-gradient(${vertical ? "to top" : "to right"}, ${
                            disabled ? "rgb(200,200,200)" : "rgb(244,63,94)"
                        } ${getPercentage(value, true)}%, rgba(0, 0, 0, 0) ${getPercentage(
                            value,
                            true
                        )}% 100%)`,
                    }}
                    onMouseDown={(e: React.MouseEvent) => {
                        setDragging(true && !disabled);
                        if (onStartEdit && !disabled) onStartEdit();
                        handleMouse(e, false);
                    }}
                />
                <div
                    className={`absolute z-10 rounded-full h-6 w-6 cursor-pointer shadow-md border-2 ${
                        disabled
                            ? "bg-neutral-500 border-neutral-900"
                            : "bg-primary-500 border-primary-900"
                    }`}
                    style={{
                        left: vertical
                            ? undefined
                            : `calc(${(value - min) / (max - min)} * (100% - 1.5rem))`,
                        bottom: vertical
                            ? `calc(${(value - min) / (max - min)} * (100% - 1.5rem))`
                            : undefined,
                    }}
                    onMouseDown={() => {
                        setDragging(true && !disabled);
                        if (onStartEdit && !disabled) onStartEdit();
                    }}
                    onTouchStart={() => {
                        setDragging(true && !disabled);
                        if (onStartEdit && !disabled) onStartEdit();
                    }}
                />
                {ticks && ticks > 0 && (
                    <div
                        className={`absolute w-full h-full left-0 bottom-0.5 flex justify-between z-0 text-neutral-500 ${
                            vertical ? "flex-col pl-1" : "pl-2"
                        }`}
                    >
                        {Array.from(Array(ticks + 2)).map((_, i) => {
                            const value = Mathf.lerp(
                                min,
                                max,
                                vertical ? 1.0 - i / (ticks + 1) : i / (ticks + 1)
                            );
                            return (
                                <div
                                    className={`flex items-center ${vertical ? "" : "flex-col"}`}
                                    key={"slider_" + i}
                                >
                                    <span>{vertical ? "—" : "|"}</span>
                                    <span>{Math.round(value)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Slider;
