import { useCallback, useEffect, useRef, useState } from "react";
import useInterval from "lib/hooks/useInterval";
import useDoubleClick from "lib/hooks/useDoubleClick";
import useDimensions from "lib/hooks/useDimensions";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptPreview from "components/molecules/FunscriptPreview";
import useAnim from "lib/hooks/useAnim";
import PlayerControls from "./PlayerControls";

const ScriptPlayer = ({
    script,
    playing,
    ended,
    time,
    onPlay,
    onPause,
    onEnded,
    onSeek,
    onSeekEnd,
    onProgress,
    onDuration,
}: {
    script: Funscript;
    playing: boolean;
    ended: boolean;
    time: number;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onSeek?: (time: number) => void;
    onSeekEnd?: () => void;
    onProgress?: (time: number) => void;
    onDuration?: (duration: number) => void;
}): JSX.Element => {
    const playerParent = useRef<HTMLDivElement>(null);
    const preview = useRef<HTMLDivElement>(null);

    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [fullscreen, setFullscreen] = useState(false);

    const [mouseInControls, setMouseInControls] = useState(false);
    const [mouseActive, setMouseActive] = useState(false);
    const [lastMoveTime, setLastMoveTime] = useState(0);

    const [displayDuration, setDisplayDuration] = useState(20000);

    const { width } = useDimensions();

    useEffect(() => {
        if (onDuration) onDuration(duration);
        setDisplayDuration(Math.min(20000, duration * 1000));
    }, [duration, onDuration]);

    useEffect(() => {
        setDuration(script.actions.slice(-1)[0].at / 1000);
        if (onPause) onPause();
    }, [script]);

    const seek = (newTime: number) => {
        if (onSeek) onSeek(newTime);
    };

    const bump = () => {
        setMouseActive(true);
        setLastMoveTime(Date.now());
    };

    const showingUi = () => !playing || mouseInControls || mouseActive;

    useInterval(() => {
        if (Date.now().valueOf() - lastMoveTime.valueOf() > 3000) {
            setMouseActive(false);
        }
    }, 500);

    const enterFullscreen = useCallback(() => {
        playerParent.current?.requestFullscreen();
    }, [playerParent]);

    const leaveFullscreen = () => {
        document.exitFullscreen();
    };

    const zoom = useCallback(
        (direction: -1 | 1) => {
            const newDuration = displayDuration * (direction < 0 ? 1.5 : 1 / 1.5);
            setDisplayDuration(Math.max(5000, Math.min(duration * 1000, newDuration)));
        },
        [duration, displayDuration]
    );

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (document.fullscreenElement) setFullscreen(true);
            else setFullscreen(false);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const play = () => {
        if (time >= duration) {
            if (onSeek) onSeek(0);
        }
        if (onPlay) onPlay();
    };

    const pause = () => {
        if (onPause) onPause();
    };

    const togglePlay = useCallback(() => {
        if (playing) pause();
        else play();
    }, [playing]);

    useDoubleClick({
        onSingleClick: () => {
            togglePlay();
        },
        onDoubleClick: () => {
            if (fullscreen) document.exitFullscreen();
            else playerParent.current?.requestFullscreen();
        },
        ref: preview,
        latency: 200,
    });

    useAnim(
        (_, delta) => {
            if (playing && !ended) {
                let newTime = time + delta;
                if (newTime > duration) {
                    newTime = duration;
                    if (onEnded) onEnded();
                }
                if (onProgress) onProgress(newTime / duration);
            }
        },
        [playing, time, duration, ended, onEnded, onProgress]
    );

    return (
        <div className="mt-4">
            <h1 className="text-2xl">{script.metadata?.title || "Unnamed Script"}</h1>
            <div
                ref={playerParent}
                className={`w-full flex flex-col justify-end relative h-48`}
                onMouseMove={bump}
                style={{
                    cursor: showingUi() ? undefined : "none",
                }}
            >
                <div className="h-48" ref={preview}>
                    <FunscriptPreview
                        funscript={script}
                        className="h-full"
                        options={{
                            duration: displayDuration,
                            lineColor: "rgb(251,113,133)",
                            lineWeight:
                                displayDuration > 60000 ? 1 : displayDuration > 30000 ? 2 : 3,
                            clear: true,
                            background: "rgba(0,0,0,0)",
                            startTime: time * 1000 - displayDuration * 0.25,
                            currentTime: time * 1000,
                        }}
                    />
                </div>
                <PlayerControls
                    showingUi={showingUi()}
                    onMouseEnter={() => setMouseInControls(true)}
                    onMouseLeave={() => setMouseInControls(false)}
                    playing={playing}
                    time={time}
                    duration={duration}
                    volume={volume}
                    fullscreen={fullscreen}
                    onPlay={play}
                    onPause={pause}
                    onSeek={seek}
                    onSeekEnd={onSeekEnd}
                    onSetVolume={setVolume}
                    onZoom={zoom}
                    onEnterFullscreen={enterFullscreen}
                    onLeaveFullscreen={leaveFullscreen}
                    showPlayPause={width > 600}
                    showFullscreen={true}
                    showVolume={width > 600}
                    showZoom={true}
                />
            </div>
        </div>
    );
};

export default ScriptPlayer;
