import { useEffect, useRef, useState } from "react";
import { PlayableContent } from "components/molecules/ContentDropzone";
import PlayerControls from "./PlayerControls";

const AudioPlayer = ({
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
    const audio = useRef<HTMLAudioElement>(null);

    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const handlePlay = () => onPlay && onPlay();
        const handlePause = () => onPause && onPause();
        const handleEnded = () => onEnded && onEnded();
        const handleSeek = () => onSeek && onSeek(audio.current?.currentTime || 0);
        const handleProgress = () => {
            onProgress && onProgress((audio.current?.currentTime || 0) / duration);
            setTime(audio.current?.currentTime || 0);
        };
        const handleDuration = () => setDuration(audio.current?.duration || 0);

        if (!audio.current) return;

        audio.current.addEventListener("play", handlePlay);
        audio.current.addEventListener("pause", handlePause);
        audio.current.addEventListener("ended", handleEnded);
        audio.current.addEventListener("seeked", handleSeek);
        audio.current.addEventListener("timeupdate", handleProgress);
        audio.current.addEventListener("durationchange", handleDuration);

        return () => {
            if (!audio.current) return;

            audio.current.removeEventListener("ended", handlePlay);
            audio.current.removeEventListener("pause", handlePause);
            audio.current.removeEventListener("play", handlePlay);
            audio.current.removeEventListener("seeked", handleSeek);
            audio.current.removeEventListener("timeupdate", handleProgress);
            audio.current.removeEventListener("durationchange", handleDuration);
        };
    }, [audio, content, duration]);

    useEffect(() => {
        if (onDuration) onDuration(duration);
    }, [duration, onDuration]);

    useEffect(() => {
        if (!audio.current) return;

        audio.current.volume = volume;
    }, [volume, audio]);

    const seek = (time: number) => {
        if (!audio.current) return;
        audio.current.currentTime = time;
    };

    return (
        <div className="mt-4">
            <h1 className="text-2xl">{content.name}</h1>
            <audio
                ref={audio}
                src={
                    content?.url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                }
            />
            <div className="w-full flex flex-col justify-end">
                <PlayerControls
                    playing={playing}
                    time={time}
                    duration={duration}
                    volume={volume}
                    onPlay={() => audio.current?.play()}
                    onPause={() => audio.current?.pause()}
                    onSeek={seek}
                    onSetVolume={setVolume}
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
