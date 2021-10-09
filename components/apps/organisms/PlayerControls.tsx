import {
    MdFullscreen,
    MdFullscreenExit,
    MdPause,
    MdPlayArrow,
    MdVolumeDown,
    MdVolumeMute,
    MdVolumeUp,
    MdZoomIn,
    MdZoomOut,
} from "react-icons/md";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "components/atoms/Slider";
import { formatTime } from "lib/text";

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

const PlayerControls = ({
    className,
    playing,
    time,
    duration,
    volume,
    fullscreen,
    onPlay,
    onPause,
    onSeek,
    onSetVolume,
    onZoom,
    onEnterFullscreen,
    onLeaveFullscreen,
    showVolume = true,
    showZoom = false,
    showFullscreen = false,
    onMouseEnter,
    onMouseLeave,
}: {
    className?: string;
    playing: boolean;
    time: number;
    duration: number;
    volume: number;
    fullscreen?: boolean;
    onPlay?: () => void;
    onPause?: () => void;
    onSeek?: (time: number) => void;
    onSetVolume?: (volume: number) => void;
    onZoom?: (direction: -1 | 1) => void;
    onEnterFullscreen?: () => void;
    onLeaveFullscreen?: () => void;
    showVolume?: boolean;
    showZoom?: boolean;
    showFullscreen?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}): JSX.Element => {
    const trackDiv = useRef<HTMLDivElement>(null);
    const [cachedVolume, setCachedVolume] = useState(volume);
    const [hoverPosition, setHoverPosition] = useState(-1);
    const [hoveringVolume, setHoveringVolume] = useState(true);
    const [dragging, setDragging] = useState(false);

    const togglePlay = (): void => {
        if (playing && onPause) onPause();
        else if (!playing && onPlay) onPlay();
    };

    const changeVolume = (volume: number): void => {
        if (onSetVolume) onSetVolume(volume);
        if (volume === 0) setCachedVolume(1);
        else setCachedVolume(volume);
    };

    const zoom = (direction: -1 | 1): void => {
        if (onZoom) onZoom(direction);
    };

    const toggleFullscreen = (): void => {
        if (fullscreen && onLeaveFullscreen) onLeaveFullscreen();
        else if (!fullscreen && onEnterFullscreen) onEnterFullscreen();
    };

    const handleMouse = useCallback(
        (
            e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
            needsDragging = true
        ) => {
            if ((!dragging && needsDragging) || !trackDiv.current) return;

            let rawPos = 0;
            if (isMouseEvent(e)) {
                rawPos = e.clientX;
            } else if (isTouchEvent(e)) {
                rawPos = e.touches[0].clientX;
            }

            const rect = trackDiv.current.getBoundingClientRect();
            const pos = rawPos - (rect.left + 16 * 0.75);
            const percent = Math.min(1, Math.max(0, pos / (rect.width - 16 * 1.5)));
            const val = percent * duration;
            if (onSeek) onSeek(val);
        },
        [onSeek, trackDiv, dragging]
    );

    const handleHoverMove = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            if (!trackDiv.current) return;

            let rawPos = 0;
            if (isMouseEvent(e)) {
                rawPos = e.clientX;
            } else if (isTouchEvent(e)) {
                rawPos = e.touches[0].clientX;
            }
            const rect = trackDiv.current.getBoundingClientRect();
            const pos = rawPos - rect.left;
            const percent = Math.min(1, Math.max(0, pos / rect.width));
            setHoverPosition(percent);
        },
        [trackDiv]
    );

    useEffect(() => {
        const handleMouseUp = () => {
            setDragging(false);
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
    }, [dragging]);

    return (
        <div
            className={className || ""}
            onMouseEnter={() => {
                if (onMouseEnter) onMouseEnter();
            }}
            onMouseLeave={() => {
                if (onMouseLeave) onMouseLeave();
            }}
        >
            <div className="flex flex-col px-3 select-none">
                <div
                    className="h-3 flex flex-col justify-end cursor-pointer"
                    ref={trackDiv}
                    onMouseDown={(e: React.MouseEvent) => {
                        setDragging(true);
                        handleMouse(e, false);
                    }}
                    onMouseMove={handleHoverMove}
                    onMouseLeave={() => setHoverPosition(-1)}
                >
                    <div
                        className={`flex items-center relative w-full bg-white bg-opacity-20 ${
                            hoverPosition >= 0 || dragging ? "h-1" : "h-0.5"
                        }`}
                        style={{
                            transition: "all 0.3s",
                        }}
                    >
                        <div
                            className="absolute z-0 top-0 left-0 h-full bg-white bg-opacity-40"
                            style={{
                                width: hoverPosition >= 0 ? `${hoverPosition * 100}%` : "0%",
                            }}
                        />
                        <div
                            className="absolute z-10 top-0 left-0 h-full bg-primary-400"
                            style={{
                                width: `${(time / duration) * 100}%`,
                            }}
                        />
                        <div
                            className={`relative z-20 ${
                                hoverPosition >= 0 || dragging ? "h-3 w-3" : "h-0 w-0"
                            } bg-primary-400 rounded-full`}
                            style={{
                                left: `calc(${time / duration} * (100% - 0.75rem))`,
                                transition: "width 0.3s, height 0.3s",
                            }}
                            onMouseDown={() => {
                                setDragging(true);
                            }}
                            onTouchStart={() => {
                                setDragging(true);
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-between px-1">
                    <div className="flex items-center">
                        <button className="text-4xl p-2" onClick={togglePlay}>
                            {playing ? <MdPause /> : <MdPlayArrow />}
                        </button>
                        {showVolume && (
                            <div
                                className="flex items-center"
                                onMouseEnter={() => setHoveringVolume(true)}
                                onMouseLeave={() => setHoveringVolume(false)}
                            >
                                <button
                                    className="text-2xl p-2"
                                    onClick={() => {
                                        if (onSetVolume)
                                            onSetVolume(volume === 0 ? cachedVolume : 0);
                                    }}
                                    style={{
                                        paddingLeft:
                                            volume === 0 ? "4px" : volume < 0.5 ? "6px" : "8px",
                                        paddingRight:
                                            volume === 0 ? "12px" : volume < 0.5 ? "10px" : "8px",
                                    }}
                                >
                                    {volume === 0 ? (
                                        <MdVolumeMute />
                                    ) : volume < 0.5 ? (
                                        <MdVolumeDown />
                                    ) : (
                                        <MdVolumeUp />
                                    )}
                                </button>
                                <div
                                    className="relative h-10 flex items-center overflow-hidden"
                                    style={{
                                        width: hoveringVolume ? "5rem" : "0",
                                        transition: "all 0.3s",
                                    }}
                                >
                                    <div className="absolute w-20">
                                        <Slider
                                            value={volume}
                                            min={0}
                                            max={1}
                                            onChange={changeVolume}
                                            ticks={0}
                                            showValue={false}
                                            trackSize={"0.2rem"}
                                            knobSize={"1rem"}
                                            activeColor="white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex text-xs pl-2">
                            {formatTime(time)} / {formatTime(duration)}
                        </div>
                    </div>
                    <div className="flex">
                        {showZoom && (
                            <>
                                <button className="text-2xl p-2" onClick={() => zoom(-1)}>
                                    <MdZoomOut />
                                </button>
                                <button className="text-2xl p-2" onClick={() => zoom(1)}>
                                    <MdZoomIn />
                                </button>
                            </>
                        )}
                        {showFullscreen && (
                            <button className="text-2xl p-2" onClick={toggleFullscreen}>
                                {fullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerControls;
