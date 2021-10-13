import React, { useCallback, useEffect, useRef, useState } from "react";
import useInterval from "lib/hooks/useInterval";
import { SliderBaseProps } from "./Slider";

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

export type SliderMinMaxProps = SliderBaseProps & {
    valueMin: number;
    onChangeMin?: (val: number) => void;
    onIntervalChangeMin?: (val: number) => void;
    onStartEditMin?: () => void;
    onStopEditMin?: () => void;
    valueMax: number;
    onChangeMax?: (val: number) => void;
    onIntervalChangeMax?: (val: number) => void;
    onStartEditMax?: () => void;
    onStopEditMax?: () => void;
};

const SliderMinMax = ({
    valueMin,
    onChangeMin,
    onIntervalChangeMin,
    onStartEditMin,
    onStopEditMin,
    valueMax,
    onChangeMax,
    onIntervalChangeMax,
    onStartEditMax,
    onStopEditMax,
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
}: SliderMinMaxProps): JSX.Element => {
    const trackDiv = useRef<HTMLDivElement>(null);
    const [draggingMin, setDraggingMin] = useState(false);
    const [draggingMax, setDraggingMax] = useState(false);
    const [lastSentValueMin, setLastSentValueMin] = useState<number>(-100000);
    const [activeMin, setActiveMin] = useState(false);
    const [lastSentValueMax, setLastSentValueMax] = useState<number>(-100000);
    const [activeMax, setActiveMax] = useState(false);

    const getPercentage = useCallback(
        (val: number, round = false): number => {
            const percentage = (val - min) / (max - min);
            return round ? Math.round(percentage * 100) : percentage;
        },
        [min, max]
    );

    const getValFromPos = useCallback(
        (pos: number) => {
            if (!trackDiv.current) return 0;

            const rect = trackDiv.current.getBoundingClientRect();
            const p = pos - ((vertical ? rect.top : rect.left) + 16 * 0.75);
            const percent = Math.min(
                1,
                Math.max(0, p / ((vertical ? rect.height : rect.width) - 16 * 1.5))
            );
            return (vertical ? 1.0 - percent : percent) * (max - min) + min;
        },
        [trackDiv]
    );

    const getPos = (e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent) => {
        let rawPos = 0;
        if (isMouseEvent(e)) {
            rawPos = vertical ? e.clientY : e.clientX;
        } else if (isTouchEvent(e)) {
            rawPos = vertical ? e.touches[0].clientY : e.touches[0].clientX;
        }
        return rawPos;
    };

    const dragMin = useCallback(
        (
            e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent,
            needsDragging = true
        ) => {
            if (!trackDiv.current) return;
            if (needsDragging && !draggingMin) return;
            const val = Math.min(getValFromPos(getPos(e)), valueMax - Math.abs(max - min) * 0.005);
            if (onChangeMin) onChangeMin(val);
        },
        [onChangeMin, trackDiv, draggingMin]
    );

    const dragMax = useCallback(
        (
            e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent,
            needsDragging = true
        ) => {
            if (!trackDiv.current) return;
            if (needsDragging && !draggingMax) return;
            const val = Math.max(getValFromPos(getPos(e)), valueMin + Math.abs(max - min) * 0.005);
            if (onChangeMax) onChangeMax(val);
        },
        [onChangeMax, trackDiv, draggingMax]
    );

    const handleMouse = useCallback(
        (
            e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent,
            needsDragging = true
        ) => {
            dragMin(e, needsDragging);
            dragMax(e, needsDragging);
        },
        [dragMin, dragMax]
    );

    const handleMouseClicked = (e: React.MouseEvent | React.TouchEvent) => {
        if (!trackDiv.current) return;
        if (disabled) return;

        const val = getValFromPos(getPos(e));
        const minDiff = Math.abs(val - valueMin);
        const maxDiff = Math.abs(val - valueMax);
        if (minDiff < maxDiff) {
            if (onChangeMin) onChangeMin(val);
            setDraggingMin(true);
            setDraggingMax(false);
            if (onStartEditMin && !disabled) onStartEditMin();
            dragMin(e);
        } else {
            if (onChangeMax) onChangeMax(val);
            setDraggingMin(false);
            setDraggingMax(true);
            if (onStartEditMax && !disabled) onStartEditMax();
            dragMax(e);
        }
    };

    const trySendValueMin = useCallback(() => {
        if (lastSentValueMin !== valueMin) {
            if (onIntervalChangeMin) onIntervalChangeMin(valueMin);
            setLastSentValueMin(valueMin);
        }
    }, [valueMin, lastSentValueMin, onChangeMin, onIntervalChangeMin]);

    const startEditingMin = () => {
        setActiveMin(true);
        if (onStartEditMin) onStartEditMin();
    };
    const stopEditingMin = useCallback(() => {
        setActiveMin(false);
        trySendValueMin();
        if (onStopEditMin) onStopEditMin();
    }, [trySendValueMin, onStopEditMin]);

    const trySendValueMax = useCallback(() => {
        if (lastSentValueMax !== valueMax) {
            if (onIntervalChangeMax) onIntervalChangeMax(valueMax);
            setLastSentValueMax(valueMax);
        }
    }, [valueMax, lastSentValueMax, onChangeMax, onIntervalChangeMax]);

    const startEditingMax = () => {
        setActiveMax(true);
        if (onStartEditMax) onStartEditMax();
    };
    const stopEditingMax = useCallback(() => {
        setActiveMax(false);
        trySendValueMax();
        if (onStopEditMax) onStopEditMax();
    }, [trySendValueMax, onStopEditMax]);

    useEffect(() => {
        const handleMouseUp = () => {
            if (draggingMin) stopEditingMin();
            setDraggingMin(false);
            if (draggingMax) stopEditingMax();
            setDraggingMax(false);
        };

        if (draggingMin || draggingMax) {
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
    }, [draggingMin, draggingMax, stopEditingMin, stopEditingMax]);

    useInterval(
        () => {
            if (activeMax && onIntervalChangeMax) {
                trySendValueMax();
            }
        },
        onIntervalChangeMax && interval ? interval : 10000000
    );

    useInterval(
        () => {
            if (activeMin && onIntervalChangeMin) {
                trySendValueMin();
            }
        },
        onIntervalChangeMin && interval ? interval : 10000000
    );

    return (
        <div
            className={`relative select-none grid place-items-center ${
                vertical ? "h-full w-6" : "h-6 w-full"
            } ${className || ""}`}
        >
            <div
                ref={trackDiv}
                className={`relative z-10 bg-neutral-500 rounded cursor-pointer ${
                    vertical ? "h-full" : "w-full"
                }`}
                style={{
                    backgroundImage: `linear-gradient(${
                        vertical ? "to top" : "to right"
                    }, rgba(0,0,0,0) ${getPercentage(valueMin, true)}%, ${
                        disabled ? inactiveColor : activeColor
                    } ${getPercentage(valueMin, true)}% ${getPercentage(
                        valueMax,
                        true
                    )}%, rgba(0,0,0,0) ${getPercentage(valueMax, true)}%)`,
                    height: vertical ? undefined : trackSize,
                    width: vertical ? trackSize : undefined,
                }}
                onMouseDown={handleMouseClicked}
            />
            <div
                className={`absolute z-10 rounded-full cursor-pointer shadow-md`}
                style={{
                    left: vertical
                        ? undefined
                        : `calc(${(valueMin - min) / (max - min)} * (100% - ${knobSize}))`,
                    bottom: vertical
                        ? `calc(${(valueMin - min) / (max - min)} * (100% - ${knobSize}))`
                        : undefined,
                    width: knobSize,
                    height: knobSize,
                    backgroundColor: disabled ? inactiveColor : activeColor,
                }}
                onMouseDown={() => {
                    setDraggingMin(true && !disabled);
                    if (!disabled) startEditingMin();
                }}
                onTouchStart={() => {
                    setDraggingMin(true && !disabled);
                    if (!disabled) startEditingMin();
                }}
            />
            <div
                className={`absolute z-10 rounded-full cursor-pointer shadow-md`}
                style={{
                    left: vertical
                        ? undefined
                        : `calc(${(valueMax - min) / (max - min)} * (100% - ${knobSize}))`,
                    bottom: vertical
                        ? `calc(${(valueMax - min) / (max - min)} * (100% - ${knobSize}))`
                        : undefined,
                    width: knobSize,
                    height: knobSize,
                    backgroundColor: disabled ? inactiveColor : activeColor,
                }}
                onMouseDown={() => {
                    setDraggingMax(true && !disabled);
                    if (!disabled) startEditingMax();
                }}
                onTouchStart={() => {
                    setDraggingMax(true && !disabled);
                    if (!disabled) startEditingMax();
                }}
            />
        </div>
    );
};

export default SliderMinMax;
