import { useEffect, useRef, useState } from "react";
import useElementDimensions from "lib/hooks/useElementDimensions";
import { formatTime } from "lib/text";
import PlayerControls, { PlayerControlsProps } from "./PlayerControls";

export interface VideoPlayerControlsProps extends PlayerControlsProps {
    videoUrl?: string;
}

const VideoPlayerControls = ({
    videoUrl,
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
}: VideoPlayerControlsProps): JSX.Element => {
    const thumbnail = useRef<HTMLVideoElement>(null);
    const parent = useRef<HTMLDivElement>(null);
    const videoParent = useRef<HTMLDivElement>(null);

    const [hovering, setHovering] = useState(false);
    const [hoverPosition, setHoverPosition] = useState(-1);
    const [hoverText, setHoverText] = useState("");
    const { width } = useElementDimensions(parent);

    useEffect(() => {
        if (!thumbnail.current || !videoParent.current) return;
        if (Number.isNaN(thumbnail.current.duration)) return;
        thumbnail.current.currentTime = thumbnail.current.duration * hoverPosition;

        const left = Math.max(0, Math.min(width - 128, width * hoverPosition - 64));

        videoParent.current.style.setProperty("left", `${left}px`);
    }, [thumbnail, hoverPosition, width, videoParent]);

    useEffect(() => {
        if (!thumbnail.current) {
            setHoverText("");
            return;
        }
        if (Number.isNaN(thumbnail.current.duration)) {
            setHoverText("");
            return;
        }
        setHoverText(formatTime(thumbnail.current.duration * hoverPosition));
    }, [thumbnail, hoverPosition, hovering]);

    return (
        <div ref={parent} className="relative w-full">
            <div
                ref={videoParent}
                className={`flex flex-col items-center absolute bottom-12 md:bottom-16 z-20 w-32 ${
                    hovering ? "" : "hidden"
                }`}
            >
                <video
                    width={128}
                    ref={thumbnail}
                    src={videoUrl}
                    className={`border border-white w-full`}
                    preload="auto"
                />
                <span className="text-sm">{hoverText}</span>
            </div>
            <PlayerControls
                showingUi={showingUi}
                playing={playing}
                time={time}
                duration={duration}
                volume={volume}
                fullscreen={fullscreen}
                onPlay={onPlay}
                onPause={onPause}
                onSeek={onSeek}
                onSeekEnd={onSeekEnd}
                onSetVolume={onSetVolume}
                onZoom={onZoom}
                onEnterFullscreen={onEnterFullscreen}
                onLeaveFullscreen={onLeaveFullscreen}
                showPlayPause={showPlayPause}
                showVolume={showVolume}
                showZoom={showZoom}
                showFullscreen={showFullscreen}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onHoverStart={() => setHovering(true)}
                onHoverEnd={() => setHovering(false)}
                onHoverMove={setHoverPosition}
            />
        </div>
    );
};

export default VideoPlayerControls;
