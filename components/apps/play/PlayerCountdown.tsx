import { useMemo } from "react";

const PlayerCountdown = ({
    countdownTime,
    playbackTime,
    countdownDuration = 20,
    style,
}: {
    countdownTime: number;
    playbackTime: number;
    countdownDuration?: number;
    style?: React.CSSProperties;
}): JSX.Element => {
    const showTime = useMemo(() => {
        const offset = countdownTime - playbackTime;
        if (offset <= -2) return null;
        if (offset > countdownDuration) return null;
        const val = Math.round(Math.max(0, offset));
        return val;
    }, [countdownTime, playbackTime]);

    return (
        <div className="absolute left-0 top-0 pointer-events-none" style={style}>
            <div
                className={`relative r-0 t-0 m-4 grid place-items-center w-16 h-16 rounded-full ${
                    showTime != null && showTime <= 0 ? "bg-white" : "bg-primary-700"
                } text-white text-3xl`}
                style={{
                    opacity: showTime === null ? 0 : 100,
                    transition: "all 1s",
                }}
            >
                <span className="font-mono text-center">{showTime}</span>
            </div>
        </div>
    );
};

export default PlayerCountdown;
