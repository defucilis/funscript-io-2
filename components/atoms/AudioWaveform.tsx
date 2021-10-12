import { useEffect, useRef, useState } from "react";
import { MdSync } from "react-icons/md";

const AudioWaveform = ({
    url,
    progress,
    width = 1000,
    height = 192,
}: {
    url: string;
    progress?: number;
    width?: number;
    height?: number;
}): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!canvas.current) return;

        const width = canvas.current.width;
        const height = canvas.current.height;
        const canvasCtx = canvas.current.getContext("2d");
        if (!canvasCtx) return;
        canvasCtx.clearRect(0, 0, width, height);

        setLoading(true);

        const audioCtx: AudioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        fetch(url)
            .then(r => r.arrayBuffer())
            .then(buffer => {
                audioCtx.decodeAudioData(buffer, result => {
                    const samples = result.getChannelData(0);

                    const averages: number[] = [];
                    const sampleWidth = Math.round(5 * Math.pow(samples.length, 0.25));
                    for (let i = 0; i < samples.length; i += sampleWidth) {
                        averages.push(samples[i]);
                    }
                    const subAverages: number[] = [];
                    for (let i = 0; i < averages.length; i += sampleWidth) {
                        let max = 0;
                        for (let j = 0; j < sampleWidth; j++) {
                            max = Math.max(max, Math.abs(averages[i + j]));
                        }
                        subAverages.push(max);
                    }

                    //canvasCtx.beginPath();
                    //canvasCtx.moveTo(0, height/2);
                    canvasCtx.fillStyle = "rgb(244,63,94)";
                    const barWidth = width / subAverages.length;
                    for (let i = 0; i < subAverages.length; i++) {
                        const barHeight = height * subAverages[i];
                        canvasCtx.fillRect(
                            barWidth * i,
                            height / 2 - barHeight / 2,
                            barWidth - 1,
                            barHeight
                        );
                    }

                    setLoading(false);
                });
            });
    }, [url, canvas]);

    return (
        <div className="relative px-3" style={{ height }}>
            <canvas className="w-full h-full" ref={canvas} width={width} height={height} />
            {loading ? (
                <div className="absolute left-0 top-0 w-full h-full grid place-items-center">
                    <div className="flex flex-col items-center">
                        <MdSync className="text-white text-4xl animate-spin" />
                        <p>Calculating Waveform...</p>
                    </div>
                </div>
            ) : null}
            {progress ? (
                <div className="absolute left-0 top-0 w-full h-full px-3">
                    <div
                        className="relative z-0 top-0 h-full bg-white bg-opacity-50"
                        style={{
                            width: 1,
                            left: `${progress * 100}%`,
                        }}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default AudioWaveform;
