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
import useKeyboard from "lib/hooks/useKeyboard";

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

export interface PlayerControlsProps {
    showingUi?: boolean;
    playing: boolean;
    time: number;
    duration: number;
    volume: number;
    fullscreen?: boolean;
    onPlay?: () => void;
    onPause?: () => void;
    onSeek?: (time: number) => void;
    onSeekEnd?: () => void;
    onSetVolume?: (volume: number) => void;
    onZoom?: (direction: -1 | 1) => void;
    onEnterFullscreen?: () => void;
    onLeaveFullscreen?: () => void;
    showPlayPause?: boolean;
    showVolume?: boolean;
    showZoom?: boolean;
    showFullscreen?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
    onHoverMove?: (newPosition: number) => void;
}

const PlayerControls = ({
    showingUi = true,
    playing,
    time,
    duration,
    volume,
    fullscreen,
    onPlay,
    onPause,
    onSeek,
    onSeekEnd,
    onSetVolume,
    onZoom,
    onEnterFullscreen,
    onLeaveFullscreen,
    showPlayPause = true,
    showVolume = true,
    showZoom = false,
    showFullscreen = false,
    onMouseEnter,
    onMouseLeave,
    onHoverStart,
    onHoverEnd,
    onHoverMove,
}: PlayerControlsProps): JSX.Element => {
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
        if (!showFullscreen) return;

        if (fullscreen && onLeaveFullscreen) onLeaveFullscreen();
        else if (!fullscreen && onEnterFullscreen) onEnterFullscreen();
    };

    const toggleMute = () => {
        if (!showFullscreen) return;
        if (onSetVolume) onSetVolume(volume === 0 ? cachedVolume : 0);
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
            if (onHoverMove && window.innerWidth < 768) onHoverMove(percent);
        },
        [onSeek, trackDiv, dragging, onHoverMove]
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
            if (hoverPosition < 0 && onHoverStart) onHoverStart();
            if (onHoverMove) onHoverMove(percent);
        },
        [trackDiv, onHoverEnd, hoverPosition]
    );

    useEffect(() => {
        const handleMouseUp = () => {
            if (dragging && onSeekEnd) onSeekEnd();
            setDragging(false);
            if (window.innerWidth < 768 && onHoverEnd) onHoverEnd();
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
    }, [dragging, handleMouse, onHoverEnd]);

    const stepSeek = useCallback(
        (offset: number) => {
            if (onSeek) onSeek(Math.max(0, Math.min(duration, time + offset)));
        },
        [onSeek, time, duration]
    );

    useKeyboard(
        e => {
            switch (e.key) {
                case " ":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "m":
                    toggleMute();
                    break;
                case "f":
                    toggleFullscreen();
                    break;
                case "ArrowRight":
                    stepSeek(10);
                    break;
                case "ArrowLeft":
                    stepSeek(-10);
                    break;
            }
        },
        [stepSeek]
    );

    return (
        <div className="absolute left-0 top-0 flex flex-col justify-end w-full h-full">
            <div
                className={`absolute h-0.5 flex flex-col justify-end cursor-pointer w-full ${
                    showingUi ? "opacity-0" : "opacity-100"
                }`}
                style={{
                    transition: "all 0.5s",
                }}
            >
                <div
                    className="absolute z-10 top-0 left-0 h-full bg-primary-400"
                    style={{
                        width: `${(time / duration) * 100}%`,
                        transition: "all 0.5s",
                    }}
                />
            </div>
            <div
                className="absolute left-0 bottom-0 w-full h-32 z-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0) 100% )",
                    opacity: showingUi ? 1 : 0,
                    transition: "opacity 0.2s",
                }}
            />
            {!showPlayPause && (
                <div
                    className={`relative z-10 flex-grow grid place-items-center pt-4 ${
                        showingUi ? "opacity-100" : "opacity-0"
                    } transition-opacity`}
                    style={{
                        fontSize: "5rem",
                    }}
                >
                    <button onClick={() => (showingUi ? togglePlay() : undefined)}>
                        {playing ? <MdPause /> : <MdPlayArrow />}
                    </button>
                </div>
            )}
            <div
                className={`relative z-10 w-full ${
                    showingUi ? "opacity-100" : "opacity-0"
                } transition-opacity`}
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
                            if (onHoverStart) onHoverStart();
                            handleMouse(e, false);
                        }}
                        onMouseMove={handleHoverMove}
                        onMouseLeave={() => {
                            setHoverPosition(-1);
                            if (onHoverEnd) onHoverEnd();
                        }}
                    >
                        <div
                            className={`flex items-center relative w-full bg-white bg-opacity-20 ${
                                hoverPosition >= 0 || dragging || (!showPlayPause && showingUi)
                                    ? "h-1"
                                    : "h-0.5"
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
                                className={`relative z-20 touchable ${
                                    hoverPosition >= 0 || dragging || (!showPlayPause && showingUi)
                                        ? "h-3 w-3"
                                        : "h-0 w-0"
                                } bg-primary-400 rounded-full`}
                                style={{
                                    left: `calc(${time / duration} * 100% - 0.325rem)`,
                                    transition: "width 0.3s, height 0.3s",
                                }}
                                onMouseDown={() => {
                                    setDragging(true);
                                    if (onHoverStart) onHoverStart();
                                }}
                                onTouchStart={() => {
                                    setDragging(true);
                                    if (onHoverStart) onHoverStart();
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between px-1">
                        <div className="flex items-center">
                            {showPlayPause && (
                                <button className="text-4xl p-2" onClick={togglePlay}>
                                    {playing ? <MdPause /> : <MdPlayArrow />}
                                </button>
                            )}
                            {showVolume && (
                                <div
                                    className="flex items-center"
                                    onMouseEnter={() => setHoveringVolume(true)}
                                    onMouseLeave={() => setHoveringVolume(false)}
                                >
                                    <button
                                        className="text-2xl p-2"
                                        onClick={toggleMute}
                                        style={{
                                            paddingLeft:
                                                volume === 0 ? "4px" : volume < 0.5 ? "6px" : "8px",
                                            paddingRight:
                                                volume === 0
                                                    ? "12px"
                                                    : volume < 0.5
                                                    ? "10px"
                                                    : "8px",
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
        </div>
    );
};

export default PlayerControls;
