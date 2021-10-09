import { useCallback, useEffect, useRef, useState } from "react";
import { PlayableContent } from "components/molecules/ContentDropzone";
import useInterval from "lib/hooks/useInterval";
import useDoubleClick from "lib/hooks/useDoubleClick";
import PlayerControls from "./PlayerControls";

const VideoPlayer = ({
    content,
    playing,
    onPlay,
    onPause,
    onEnded,
    onSeek,
    onProgress,
    onDuration,
}: {
    content: PlayableContent;
    playing: boolean;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onSeek?: (time: number) => void;
    onProgress?: (time: number) => void;
    onDuration?: (duration: number) => void;
}): JSX.Element => {
    const video = useRef<HTMLVideoElement>(null);
    const playerParent = useRef<HTMLDivElement>(null);

    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [fullscreen, setFullscreen] = useState(false);

    const [mouseInControls, setMouseInControls] = useState(false);
    const [mouseActive, setMouseActive] = useState(false);
    const [lastMoveTime, setLastMoveTime] = useState(0);

    useEffect(() => {
        const handlePlay = () => onPlay && onPlay();
        const handlePause = () => onPause && onPause();
        const handleEnded = () => onEnded && onEnded();
        const handleSeek = () => onSeek && onSeek(video.current?.currentTime || 0);
        const handleProgress = () => {
            onProgress && onProgress((video.current?.currentTime || 0) / duration);
            setTime(video.current?.currentTime || 0);
        };
        const handleDuration = () => setDuration(video.current?.duration || 0);

        if (!video.current) return;

        video.current.addEventListener("play", handlePlay);
        video.current.addEventListener("pause", handlePause);
        video.current.addEventListener("ended", handleEnded);
        video.current.addEventListener("seeked", handleSeek);
        video.current.addEventListener("timeupdate", handleProgress);
        video.current.addEventListener("durationchange", handleDuration);

        return () => {
            if (!video.current) return;

            video.current.removeEventListener("ended", handlePlay);
            video.current.removeEventListener("pause", handlePause);
            video.current.removeEventListener("play", handlePlay);
            video.current.removeEventListener("seeked", handleSeek);
            video.current.removeEventListener("timeupdate", handleProgress);
            video.current.removeEventListener("durationchange", handleDuration);
        };
    }, [video, content, duration]);

    useEffect(() => {
        if (onDuration) onDuration(duration);
    }, [duration, onDuration]);

    useEffect(() => {
        if (!video.current) return;

        video.current.volume = volume;
    }, [volume, video]);

    const seek = (time: number) => {
        if (!video.current) return;
        video.current.currentTime = time;
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

    useEffect(() => {
        const handleFullscreenChange = () => {
            console.log(document.fullscreenElement);
            if (document.fullscreenElement) setFullscreen(true);
            else setFullscreen(false);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useDoubleClick({
        onSingleClick: () => {
            if (playing) video.current?.pause();
            else video.current?.play();
        },
        onDoubleClick: () => {
            if (fullscreen) document.exitFullscreen();
            else playerParent.current?.requestFullscreen();
        },
        ref: video,
        latency: 200,
    });

    return (
        <div className="mt-4">
            <h1 className="text-2xl">{content.name}</h1>
            <div
                ref={playerParent}
                className={`w-full flex flex-col justify-end relative`}
                onMouseMove={bump}
                style={{
                    cursor: showingUi() ? undefined : "none",
                }}
            >
                <video ref={video} src={content?.url} className="rounded-tl rounded-tr" />
                <div
                    className="absolute left-0 bottom-0 w-full h-32 z-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0) 100% )",
                        opacity: showingUi() ? 1 : 0,
                        transition: "opacity 0.2s",
                    }}
                />
                <PlayerControls
                    className={`absolute bottom-0 left-0 w-full ${
                        showingUi() ? "opacity-100" : "opacity-0"
                    } transition-opacity`}
                    onMouseEnter={() => setMouseInControls(true)}
                    onMouseLeave={() => setMouseInControls(false)}
                    playing={playing}
                    time={time}
                    duration={duration}
                    volume={volume}
                    fullscreen={fullscreen}
                    onPlay={() => video.current?.play()}
                    onPause={() => video.current?.pause()}
                    onSeek={seek}
                    onSetVolume={setVolume}
                    onEnterFullscreen={enterFullscreen}
                    onLeaveFullscreen={leaveFullscreen}
                    showFullscreen={true}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
