import { useEffect, useState } from "react";
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardArrowUp,
    MdPause,
    MdPlayArrow,
} from "react-icons/md";
import Handy from "lib/thehandy";
import { HampState, HandyMode } from "lib/thehandy/types";
import RateLimitedSlider from "components/molecules/RateLimitedSlider";
import RateLimitedMinMaxSlider from "components/molecules/RateLimitedMinMaxSlider";

enum SlideIntervalMode {
    min = 0,
    max = 1,
    offset = 2,
}

const AppManual = ({ handy }: { handy: Handy }): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [hampRunning, setHampRunning] = useState(false);
    const [hampVelocity, setHampVelocity] = useState(0);
    const [slideMin, setSlideMin] = useState(0);
    const [slideMax, setSlideMax] = useState(100);
    const [velocityInterval, setVelocityInterval] = useState(10);
    const [slideInterval, setSlideInterval] = useState(10);
    const [slideIntervalMode, setSlideIntervalMode] = useState(SlideIntervalMode.min);

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

    const trySetSlide = (min: number, max: number, fromSlider = true): void => {
        setError("");
        if (!fromSlider) setLoading(true);
        handy
            .setSlideSettings(min, max)
            .then(() => {
                if (fromSlider) return;
                setLoading(false);
                setSlideMin(handy.slideMin);
                setSlideMax(handy.slideMax);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const tryIncrementHampVelocity = (increment: -1 | 1): void => {
        setError("");
        const newVelocity = Math.round(
            Math.min(100, Math.max(0, hampVelocity + increment * velocityInterval))
        );
        if (newVelocity === hampVelocity) return;
        trySetHampVelocity(newVelocity, false);
    };

    const tryIncrementSlide = (increment: -1 | 1): void => {
        setError("");
        if (slideIntervalMode === SlideIntervalMode.min) {
            const newMin = Math.round(
                Math.min(slideMax, Math.max(0, slideMin + increment * slideInterval))
            );
            if (newMin === slideMin) return;
            trySetSlideMin(newMin, false);
        } else if (slideIntervalMode === SlideIntervalMode.max) {
            const newMax = Math.round(
                Math.min(100, Math.max(0, slideMax + increment * slideInterval))
            );
            if (newMax === slideMax) return;
            trySetSlideMax(newMax, false);
        } else if (slideIntervalMode === SlideIntervalMode.offset) {
            const newMin = Math.round(slideMin + increment * slideInterval);
            const newMax = Math.round(slideMax + increment * slideInterval);
            if (newMin < 0 || newMin > 100 || newMax < 0 || newMax > 100) return;
            trySetSlide(newMin, newMax, false);
        }
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
        <div className="flex min-h-mobilemain md:min-h-main flex-col md:flex-row justify-between -mt-4 pb-5 pt-5">
            <div>
                <div className="flex w-full h-60 justify-center gap-5">
                    <div className="grid grid-rows-3 grid-cols-3 w-60 gap-4 text-4xl text-neutral-900">
                        <div className="col-start-2 row-start-1 grid place-items-center">
                            <button
                                disabled={loading}
                                onClick={() => tryIncrementSlide(1)}
                                className={`w-12 h-12 grid place-items-center rounded ${
                                    loading ? "bg-neutral-400" : "bg-primary-400"
                                }`}
                            >
                                <MdKeyboardArrowUp />
                            </button>
                            <span className="text-white text-sm">Slide +</span>
                        </div>
                        <div className="col-start-1 row-start-2 grid place-items-center">
                            <button
                                disabled={loading}
                                onClick={() => tryIncrementHampVelocity(-1)}
                                className={`w-12 h-12 grid place-items-center rounded ${
                                    loading ? "bg-neutral-400" : "bg-primary-400"
                                }`}
                            >
                                <MdKeyboardArrowLeft />
                            </button>
                            <span className="text-white text-sm">Speed -</span>
                        </div>
                        <div className="col-start-2 row-start-2 grid place-items-center">
                            <button
                                disabled={loading}
                                onClick={() => tryTogglePlay()}
                                className={`w-12 h-12 grid place-items-center rounded ${
                                    loading ? "bg-neutral-400" : "bg-primary-400"
                                }`}
                            >
                                {hampRunning ? <MdPause /> : <MdPlayArrow />}
                            </button>
                            <span className="text-white text-sm">
                                {hampRunning ? "Stop" : "Start"}
                            </span>
                        </div>
                        <div className="col-start-3 row-start-2 grid place-items-center">
                            <button
                                disabled={loading}
                                onClick={() => tryIncrementHampVelocity(1)}
                                className={`w-12 h-12 grid place-items-center rounded ${
                                    loading ? "bg-neutral-400" : "bg-primary-400"
                                }`}
                            >
                                <MdKeyboardArrowRight />
                            </button>
                            <span className="text-white text-sm">Speed +</span>
                        </div>
                        <div className="col-start-2 row-start-3 grid place-items-center">
                            <button
                                disabled={loading}
                                onClick={() => tryIncrementSlide(-1)}
                                className={`w-12 h-12 grid place-items-center rounded ${
                                    loading ? "bg-neutral-400" : "bg-primary-400"
                                }`}
                            >
                                <MdKeyboardArrowDown />
                            </button>
                            <span className="text-white text-sm">Slide -</span>
                        </div>
                    </div>
                    <div className="h-full flex flex-col items-center w-20">
                        <label className="text-sm text-white mb-0">Slide</label>
                        <div className="h-full">
                            <RateLimitedMinMaxSlider
                                min={0}
                                max={100}
                                valueMin={slideMin}
                                valueMax={slideMax}
                                onChangeMin={setSlideMin}
                                onChangeMax={setSlideMax}
                                onLimitedChangeMin={trySetSlideMin}
                                onLimitedChangeMax={trySetSlideMax}
                                vertical={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="flex flex-col w-72">
                        <div className="flex justify-between w-full">
                            <label className="text-sm text-white mb-0">Speed</label>
                        </div>
                        <RateLimitedSlider
                            min={0}
                            max={100}
                            value={hampVelocity}
                            onChange={setHampVelocity}
                            onLimitedChange={trySetHampVelocity}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-grow md:h-72 md:justify-center w-full">
                <div className="flex flex-col mt-4">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">Speed Interval</label>
                        <span>{Math.round(velocityInterval)}%</span>
                    </div>
                    <RateLimitedSlider
                        min={0}
                        max={100}
                        value={velocityInterval}
                        onChange={setVelocityInterval}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">Slide Interval</label>
                        <span>{Math.round(slideInterval)}%</span>
                    </div>
                    <RateLimitedSlider
                        min={0}
                        max={100}
                        value={slideInterval}
                        onChange={setSlideInterval}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">Slide Interval Mode</label>
                    </div>
                    <select
                        className="bg-neutral-800 py-1 px-2 rounded"
                        value={slideIntervalMode}
                        onChange={e => setSlideIntervalMode(Number(e.target.value))}
                    >
                        <option value={SlideIntervalMode.min}>Min</option>
                        <option value={SlideIntervalMode.max}>Max</option>
                        <option value={SlideIntervalMode.offset}>Offset</option>
                    </select>
                </div>
                {error && (
                    <p className="text-neutral-900 bg-red-500 rounded font-bold text-sm w-full grid place-items-center p-2 my-2 text-center">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AppManual;
