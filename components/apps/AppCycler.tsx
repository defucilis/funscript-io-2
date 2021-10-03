import { useCallback, useEffect, useRef, useState } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import Handy from "lib/thehandy";
import { HampState, HandyMode } from "lib/thehandy/types";
import RateLimitedMinMaxSlider from "components/molecules/RateLimitedMinMaxSlider";
import useAnim from "lib/hooks/useAnim";
import Mathf from "lib/Mathf";
import Slider from "components/atoms/Slider";
import MinMaxSlider from "components/atoms/MinMaxSlider";

type Range = {
    min: number;
    max: number;
};

const AppCycler = ({ handy }: { handy: Handy }): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [hampRunning, setHampRunning] = useState(false);
    const [hampVelocity, setHampVelocity] = useState(0);
    const [slideMin, setSlideMin] = useState(0);
    const [slideMax, setSlideMax] = useState(100);

    const [currentTime, setCurrentTime] = useState(0);
    const [nextCommandTime, setNextCommandTime] = useState(-1);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [cycleDuration, setCycleDuration] = useState(60);
    const [setInterval, setSetInterval] = useState(0.5);
    const [easeInLength, setEaseInLength] = useState(50);

    const canvasContainer = useRef<HTMLDivElement>(null);
    const previewCanvas = useRef<HTMLCanvasElement>(null);

    const [speedBounds, setSpeedBounds] = useState<Range>({
        min: 0,
        max: 100,
    });

    const getValue = useCallback(
        (time: number): number => {
            const afterFinish = sessionDuration > 0 && time > sessionDuration * 60;
            const longAfterFinish = afterFinish && time > sessionDuration * 60 + cycleDuration;
            const cycleX = (time % cycleDuration) / cycleDuration;
            let cycleValue: number;
            if (longAfterFinish) cycleValue = 1.0;
            else {
                const threshold = easeInLength / 100;
                let inMul, outMul: number;
                // Corner cases that would otherwise give us div by zero errors
                if (threshold === 0) {
                    inMul = 0;
                    outMul = 1;
                } else if (threshold === 1) {
                    inMul = 1;
                    outMul = 0;
                } else {
                    inMul = Math.pow(threshold, -1);
                    outMul = Math.pow(1 - threshold, -1);
                }

                if (cycleX < threshold) cycleValue = Mathf.easeIn(cycleX * inMul);
                else cycleValue = afterFinish ? 1.0 : Mathf.easeOut((cycleX - threshold) * outMul);
            }
            return cycleValue;
        },
        [sessionDuration, cycleDuration, easeInLength]
    );

    useAnim(
        (runTime: number, deltaTime: number) => {
            if (!hampRunning) {
                setNextCommandTime(cur => cur + deltaTime);
                setCurrentTime(0);
                return;
            }

            setCurrentTime(cur => cur + deltaTime);
            if (nextCommandTime < 0) setNextCommandTime(currentTime);

            if (currentTime > nextCommandTime) {
                const cycleValue = getValue(currentTime);
                const newSpeed = Math.round(
                    Mathf.lerp(speedBounds.min, speedBounds.max, cycleValue)
                );
                if (newSpeed !== hampVelocity) {
                    trySetHampVelocity(newSpeed);
                    setHampVelocity(newSpeed);
                }

                setNextCommandTime(currentTime + setInterval);
            }
        },
        [hampRunning, nextCommandTime, speedBounds, hampVelocity, setInterval, currentTime]
    );

    useEffect(() => {
        if (!previewCanvas.current) return;
        const ctx = previewCanvas.current.getContext("2d");
        if (!ctx) return;

        const width = previewCanvas.current.width;
        const height = previewCanvas.current.height;

        const timeMin = -20;
        const timeMax = 80;
        const mapX = (x: number): number =>
            Mathf.lerp(0, width, Mathf.inverseLerp(timeMin, timeMax, x));
        const mapY = (y: number): number =>
            Mathf.lerp(
                height - 20,
                20,
                Mathf.lerp(speedBounds.min, speedBounds.max, getValue(y + currentTime)) / 100
            );

        ctx.clearRect(0, 0, width, height);

        const timeResolution = 0.1;
        const actualValue = mapY(0);
        ctx.beginPath();
        for (let i = timeMin; i <= timeMax; i += timeResolution) {
            const x = mapX(i);
            const y = mapY(i);
            if (i === timeMin) {
                ctx.moveTo(x, y);
                continue;
            }
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(mapX(0), 0);
        ctx.lineTo(mapX(0), height);
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.ellipse(mapX(0), actualValue, 10, 10, 0, 0, Math.PI * 2.0);
        ctx.fill();
    }, [previewCanvas, getValue, currentTime, speedBounds]);

    const [error, setError] = useState("");

    useEffect(() => {
        const initialization = async () => {
            try {
                setLoading(true);
                await handy.setMode(HandyMode.hamp);
                setHampVelocity(await handy.getHampVelocity());
                const slideSettings = await handy.getSlideSettings();
                setSlideMin(slideSettings.min);
                setSlideMax(slideSettings.max);
                setHampRunning((await handy.getStatus()).state === HampState.moving);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
            }
        };

        initialization();
    }, [handy]);

    const trySetHampVelocity = (value: number, fromSlider = true): void => {
        setError("");
        if (!fromSlider) setLoading(true);
        handy
            .setHampVelocity(value)
            .then(() => {
                if (fromSlider) return;
                setLoading(false);
                setHampVelocity(handy.hampVelocity);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const trySetSlideMin = (value: number, fromSlider = true): void => {
        setError("");
        if (!fromSlider) setLoading(true);
        handy
            .setSlideMin(value)
            .then(() => {
                if (fromSlider) return;
                setLoading(false);
                setSlideMin(handy.slideMin);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const trySetSlideMax = (value: number, fromSlider = true): void => {
        setError("");
        if (!fromSlider) setLoading(true);
        handy
            .setSlideMax(value)
            .then(() => {
                if (fromSlider) return;
                setLoading(false);
                setSlideMax(handy.slideMax);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const tryTogglePlay = () => {
        setError("");
        setLoading(true);
        if (hampRunning)
            handy
                .setHampStop()
                .then(() => {
                    setHampRunning(false);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        else
            handy
                .setHampStart()
                .then(() => {
                    setHampRunning(true);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
    };

    return (
        <div className="flex min-h-mobilemain md:min-h-main flex-col -mt-4 pb-5 pt-5 justify-between">
            <div className="flex flex-col gap-4">
                <div>
                    <div className="flex justify-between w-full">
                        <label className="text-sm text-white mb-0">Speed Bounds</label>
                        <p>
                            {Math.round(speedBounds.min)}% to {Math.round(speedBounds.max)}%
                        </p>
                    </div>
                    <MinMaxSlider
                        min={0}
                        max={100}
                        valueMin={speedBounds.min}
                        valueMax={speedBounds.max}
                        onChangeMin={val => setSpeedBounds(cur => ({ ...cur, min: val }))}
                        onChangeMax={val => setSpeedBounds(cur => ({ ...cur, max: val }))}
                    />
                </div>
                <div>
                    <div className="flex justify-between w-full">
                        <label className="text-sm text-white mb-0">Cycle Duration</label>
                        <p>{Math.round(cycleDuration)}s</p>
                    </div>
                    <Slider min={10} max={240} value={cycleDuration} onChange={setCycleDuration} />
                </div>
                <div>
                    <div className="flex justify-between w-full">
                        <label className="text-sm text-white mb-0">Session Duration</label>
                        <p>
                            {sessionDuration === 0
                                ? "Unlimited"
                                : Math.round(sessionDuration) + " min"}
                        </p>
                    </div>
                    <Slider
                        min={0}
                        max={240}
                        value={sessionDuration}
                        onChange={setSessionDuration}
                    />
                </div>
                <div>
                    <div className="flex justify-between w-full">
                        <label className="text-sm text-white mb-0">Handy Update Interval</label>
                        <p>{Math.round(setInterval * 10) / 10}s</p>
                    </div>
                    <Slider min={0.5} max={5} value={setInterval} onChange={setSetInterval} />
                </div>
                <div>
                    <div className="flex justify-between w-full">
                        <label className="text-sm text-white mb-0">Easet In/Out Balance</label>
                        <p>{Math.round(easeInLength)}%</p>
                    </div>
                    <Slider min={0} max={100} value={easeInLength} onChange={setEaseInLength} />
                </div>
                <div className="flex flex-col items-center">
                    <button
                        disabled={loading}
                        className={`w-12 h-12 grid place-items-center rounded text-4xl text-neutral-900 ${
                            loading ? "bg-neutral-400" : "bg-primary-400"
                        }`}
                        onClick={tryTogglePlay}
                    >
                        {hampRunning ? <MdPause /> : <MdPlayArrow />}
                    </button>
                    <span className="text-sm">{hampRunning ? "Stop" : "Start"}</span>
                </div>
                <div>
                    <div className="flex justify-between w-full">
                        <label className="text-sm text-white mb-0">Stroke Range</label>
                        <p>
                            {Math.round(slideMin)}% - {Math.round(slideMax)}%
                        </p>
                    </div>
                    <RateLimitedMinMaxSlider
                        min={0}
                        max={100}
                        valueMin={slideMin}
                        valueMax={slideMax}
                        onChangeMin={setSlideMin}
                        onChangeMax={setSlideMax}
                        onLimitedChangeMin={trySetSlideMin}
                        onLimitedChangeMax={trySetSlideMax}
                        disabled={loading}
                    />
                </div>
                {error && (
                    <p className="text-neutral-900 bg-red-500 rounded font-bold text-sm w-full grid place-items-center p-2 my-2 text-center">
                        {error}
                    </p>
                )}
            </div>
            <div className="flex justify-around items-center h-72 w-full border-t pt-4 mt-5">
                <div className="w-full h-full" ref={canvasContainer}>
                    {canvasContainer.current && (
                        <canvas
                            width={canvasContainer.current.clientWidth}
                            height={canvasContainer.current.clientHeight}
                            ref={previewCanvas}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppCycler;
