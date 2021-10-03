import React, { useCallback, useEffect, useRef, useState } from "react";

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

const MinMaxSlider = ({
    min,
    max,
    valueMin,
    valueMax,
    onChangeMin,
    onChangeMax,
    onStartEditMin,
    onStartEditMax,
    onStopEditMin,
    onStopEditMax,
    className,
    disabled,
    vertical,
}: {
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    onChangeMin: (val: number) => void;
    onChangeMax: (val: number) => void;
    onStartEditMin?: () => void;
    onStartEditMax?: () => void;
    onStopEditMin?: () => void;
    onStopEditMax?: () => void;
    className?: string;
    disabled?: boolean;
    vertical?: boolean;
}): JSX.Element => {
    const trackDiv = useRef<HTMLDivElement>(null);
    const [draggingMin, setDraggingMin] = useState(false);
    const [draggingMax, setDraggingMax] = useState(false);

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
            onChangeMin(val);
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
            onChangeMax(val);
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
        if (Math.abs(val - valueMin) < Math.abs(val - valueMax)) {
            onChangeMin(val);
            setDraggingMin(true);
            if (onStartEditMin && !disabled) onStartEditMin();
            dragMin(e);
        } else {
            onChangeMax(val);
            setDraggingMax(true);
            if (onStartEditMax && !disabled) onStartEditMax();
            dragMax(e);
        }
    };

    useEffect(() => {
        const handleMouseUp = () => {
            if (draggingMin && onStopEditMin) onStopEditMin();
            setDraggingMin(false);
            if (draggingMax && onStopEditMax) onStopEditMax();
            setDraggingMax(false);
        };

        if (!trackDiv.current) return;
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
            document.addEventListener("touchend", handleMouseUp);
        };
    }, [draggingMin, draggingMax, trackDiv]);

    return (
        <div
            className={`relative select-none grid place-items-center ${
                vertical ? "h-full w-6" : "h-6 w-full"
            } ${className || ""}`}
        >
            <div
                ref={trackDiv}
                className={`bg-neutral-500 rounded cursor-pointer ${
                    vertical ? "h-full w-2" : "h-2 w-full"
                }`}
                style={{
                    backgroundImage: `linear-gradient(${
                        vertical ? "to top" : "to right"
                    }, rgba(0,0,0,0) ${getPercentage(valueMin, true)}%, ${
                        disabled ? "rgb(200,200,200)" : "rgb(244,63,94)"
                    } ${getPercentage(valueMin, true)}% ${getPercentage(
                        valueMax,
                        true
                    )}%, rgba(0,0,0,0) ${getPercentage(valueMax, true)}%)`,
                }}
                onMouseDown={handleMouseClicked}
            />
            <div
                className={`absolute rounded-full h-6 w-6 cursor-pointer shadow-md border-2 ${
                    disabled
                        ? "bg-neutral-500 border-neutral-900"
                        : "bg-primary-500 border-primary-900"
                }`}
                style={{
                    left: vertical
                        ? undefined
                        : `calc(${(valueMin - min) / (max - min)} * (100% - 1.5rem))`,
                    bottom: vertical
                        ? `calc(${(valueMin - min) / (max - min)} * (100% - 1.5rem))`
                        : undefined,
                }}
                onMouseDown={() => {
                    setDraggingMin(true && !disabled);
                    if (onStartEditMin && !disabled) onStartEditMin();
                }}
                onTouchStart={() => {
                    setDraggingMin(true && !disabled);
                    if (onStartEditMin && !disabled) onStartEditMin();
                }}
            />
            <div
                className={`absolute rounded-full h-6 w-6 cursor-pointer shadow-md border-2 ${
                    disabled
                        ? "bg-neutral-500 border-neutral-900"
                        : "bg-primary-500 border-primary-900"
                }`}
                style={{
                    left: vertical
                        ? undefined
                        : `calc(${(valueMax - min) / (max - min)} * (100% - 1.5rem))`,
                    bottom: vertical
                        ? `calc(${(valueMax - min) / (max - min)} * (100% - 1.5rem))`
                        : undefined,
                }}
                onMouseDown={() => {
                    setDraggingMax(true && !disabled);
                    if (onStartEditMax && !disabled) onStartEditMax();
                }}
                onTouchStart={() => {
                    setDraggingMax(true && !disabled);
                    if (onStartEditMax && !disabled) onStartEditMax();
                }}
            />
        </div>
    );
};

export default MinMaxSlider;
