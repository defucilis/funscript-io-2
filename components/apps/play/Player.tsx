import { useCallback, useEffect, useState } from "react";
import useHandy, { HsspState } from "thehandy-react";
import { PlayableContent } from "components/molecules/ContentDropzone";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptHeatmap from "components/molecules/FunscriptHeatmap";
import AudioPlayer from "./AudioPlayer";
import ScriptPlayer from "./ScriptPlayer";
import VideoPlayer from "./VideoPlayer";

const Player = ({
    content,
    funscript,
    prepared = false,
}: {
    content: PlayableContent | null;
    funscript: Funscript | null;
    prepared?: boolean;
}): JSX.Element => {
    const { sendHsspPlay, sendHsspStop, handyState } = useHandy();

    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [scriptDuration, setScriptDuration] = useState(0);
    const [ended, setEnded] = useState(false);
    const [cachedPlaybackPosition, setCachedPlaybackPosition] = useState(0);

    const getFunscriptPadding = () => {
        if (!funscript) return "0px";
        if (duration === 0) return "0px";
        const lastAction = funscript.actions.slice(-1)[0].at / 1000;
        const videoFraction = lastAction / duration;
        const videoPercentage = 100 - Math.min(100, 100 * videoFraction);
        return `${videoPercentage}%`;
    };

    useEffect(() => {
        if (!funscript) setScriptDuration(0);
        else setScriptDuration(funscript.actions.slice(-1)[0].at / 1000);
    }, [funscript]);

    useEffect(() => {
        if (!prepared) {
            return;
        }
        if (handyState.hsspState === HsspState.needSetup) {
            return;
        }

        if (playing && handyState.hsspState === HsspState.stopped) {
            sendHsspPlay(Math.round(cachedPlaybackPosition * 1000));
        } else if (!playing && handyState.hsspState === HsspState.playing) {
            setCachedPlaybackPosition(Math.min(scriptDuration, progress * duration));
            sendHsspStop();
        }
    }, [playing, prepared, handyState.hsspState, cachedPlaybackPosition]);

    const handleSeek = useCallback(
        (time: number) => {
            if (!prepared) {
                return;
            }
            if (handyState.hsspState === HsspState.needSetup) {
                return;
            }

            if (playing && handyState.hsspState === HsspState.playing) {
                sendHsspPlay(Math.round(time * 1000));
            } else {
                setCachedPlaybackPosition(Math.min(scriptDuration, time));
            }
        },
        [prepared, playing, handyState.hsspState]
    );

    useEffect(() => {
        if (!playing) setCachedPlaybackPosition(Math.min(scriptDuration, progress * duration));
    }, [playing, progress]);

    return (
        <div>
            {content && content.type === "video" && (
                <VideoPlayer
                    content={content}
                    playing={playing}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onProgress={setProgress}
                    onDuration={setDuration}
                    onSeekEnd={() => {
                        handleSeek(progress * duration);
                    }}
                />
            )}
            {content && content.type === "audio" && (
                <AudioPlayer
                    content={content}
                    playing={playing}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onProgress={setProgress}
                    onDuration={setDuration}
                    onSeekEnd={() => {
                        handleSeek(progress * duration);
                    }}
                />
            )}
            {!content && funscript && (
                <ScriptPlayer
                    script={funscript}
                    playing={playing}
                    time={progress * duration}
                    ended={ended}
                    onPlay={() => {
                        if (ended) {
                            setProgress(0);
                            setEnded(false);
                        }
                        setPlaying(true);
                    }}
                    onPause={() => setPlaying(false)}
                    onProgress={setProgress}
                    onDuration={setDuration}
                    onSeek={time => {
                        setProgress(time / duration);
                        handleSeek(time);
                    }}
                    onSeekEnd={() => {
                        handleSeek(progress * duration);
                    }}
                    onEnded={() => {
                        setPlaying(false);
                        setEnded(true);
                    }}
                />
            )}
            {funscript && (
                <div className="relative px-2 bg-black bg-opacity-40 rounded-bl rounded-br">
                    <div
                        style={{
                            paddingRight: getFunscriptPadding(),
                        }}
                    >
                        <FunscriptHeatmap funscript={funscript} className="h-12" />
                    </div>
                    <div className="absolute w-full left-0 top-0 h-12">
                        <div className="relative w-full px-2 h-full">
                            <div
                                className="relative bottom-0 bg-white h-full"
                                style={{
                                    left: `${progress * 100}%`,
                                    width: "1px",
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Player;
