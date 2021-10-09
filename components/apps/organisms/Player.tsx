import { useState } from "react";
import { PlayableContent } from "components/molecules/ContentDropzone";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptHeatmap from "components/molecules/FunscriptHeatmap";
import AudioPlayer from "./AudioPlayer";
import ScriptPlayer from "./ScriptPlayer";
import VideoPlayer from "./VideoPlayer";

const Player = ({
    content,
    funscript,
}: {
    content: PlayableContent | null;
    funscript: Funscript | null;
}): JSX.Element => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const getFunscriptPadding = () => {
        if (!funscript) return "0px";
        if (duration === 0) return "0px";
        const lastAction = funscript.actions.slice(-1)[0].at / 1000;
        const videoFraction = lastAction / duration;
        const videoPercentage = 100 - Math.min(100, 100 * videoFraction);
        return `${videoPercentage}%`;
    };

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
                />
            )}
            {!content && funscript && <ScriptPlayer script={funscript} />}
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
