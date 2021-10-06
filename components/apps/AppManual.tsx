import React, { useEffect, useState } from "react";
import Handy from "lib/thehandy";
import { HampState, HandyMode } from "lib/thehandy/types";
import RateLimitedSlider from "components/molecules/RateLimitedSlider";
import ManualControls from "./manual/ManualControls";

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
        <div className="flex min-h-mobilemain md:min-h-main flex-col -mt-4 pb-5 pt-5 justify-between">
            <ManualControls
                loading={loading}
                running={hampRunning}
                onButtonUp={() => tryIncrementSlide(1)}
                onButtonDown={() => tryIncrementSlide(-1)}
                onButtonLeft={() => tryIncrementHampVelocity(-1)}
                onButtonRight={() => tryIncrementHampVelocity(1)}
                onButtonCenter={() => tryTogglePlay()}
                slideVerticalMin={slideMin}
                onSlideVerticalMin={setSlideMin}
                onLimitedSlideVerticalMin={trySetSlideMin}
                slideVerticalMax={slideMax}
                onSlideVerticalMax={setSlideMax}
                onLimitedSlideVerticalMax={trySetSlideMax}
                slideHorizontal={hampVelocity}
                onSlideHorizontal={setHampVelocity}
                onLimitedSlideHorizontal={trySetHampVelocity}
            />
            <div className="flex flex-col gap-2 w-full">
                <RateLimitedSlider
                    label="Speed Interval"
                    valueUnit="%"
                    min={0}
                    max={100}
                    value={velocityInterval}
                    onChange={setVelocityInterval}
                />
                <RateLimitedSlider
                    label="Slide Interval"
                    valueUnit="%"
                    min={0}
                    max={100}
                    value={slideInterval}
                    onChange={setSlideInterval}
                />
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
