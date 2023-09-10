import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useHandy from "thehandy-react";
import { HampState, HandyMode } from "lib/thehandy/types";
import SliderField from "components/molecules/SliderField";
import ManualControls from "./manual/ManualControls";

enum SlideIntervalMode {
    min = 0,
    max = 1,
    offset = 2,
}

const AppManual = (): JSX.Element => {
    const {
        loading,
        error,
        getSlideSettings,
        getHampVelocity,
        sendHampVelocity,
        sendSlideMin,
        sendSlideMax,
        sendSlideSettings,
        sendMode,
        sendHampState,
        handyState,
    } = useHandy();

    const [initialized, setInitialized] = useState(false);
    const [hampVelocity, setHampVelocity] = useState(0);
    const [slideMin, setSlideMin] = useState(0);
    const [slideMax, setSlideMax] = useState(100);
    const [velocityInterval, setVelocityInterval] = useState(10);
    const [slideInterval, setSlideInterval] = useState(10);
    const [slideIntervalMode, setSlideIntervalMode] = useState(SlideIntervalMode.min);

    const [lastError, setLastError] = useState("");
    useEffect(() => {
        if (error && error != lastError) {
            toast.error(error);
            setLastError(error);
        }
    }, [error]);

    useEffect(() => {
        const initialization = async () => {
            setInitialized(true);
            if (handyState.currentMode !== HandyMode.hamp) {
                await sendHampState(HampState.stopped);
                const slideSettings = await getSlideSettings();
                const hampVelocity = await getHampVelocity();
                setSlideMin(slideSettings.min);
                setSlideMax(slideSettings.max);
                setHampVelocity(hampVelocity);
            } else {
                setSlideMin(handyState.slideMin);
                setSlideMax(handyState.slideMax);
                setHampVelocity(handyState.hampVelocity);
            }
        };

        if (!initialized) initialization();
    }, [
        sendMode,
        sendHampState,
        handyState.currentMode,
        handyState.slideMin,
        handyState.slideMax,
        handyState.hampVelocity,
        initialized,
        getSlideSettings,
        getHampVelocity,
    ]);

    const tryIncrementHampVelocity = useCallback(
        (increment: -1 | 1): void => {
            const newVelocity = Math.round(
                Math.min(100, Math.max(0, hampVelocity + increment * velocityInterval))
            );
            if (newVelocity === hampVelocity) return;
            setHampVelocity(newVelocity);
            sendHampVelocity(newVelocity);
        },
        [sendHampVelocity, hampVelocity]
    );

    const tryIncrementSlide = useCallback(
        (increment: -1 | 1): void => {
            if (slideIntervalMode === SlideIntervalMode.min) {
                const newMin = Math.round(
                    Math.min(slideMax, Math.max(0, slideMin + increment * slideInterval))
                );
                if (newMin === slideMin) return;
                setSlideMin(newMin);
                sendSlideMin(newMin);
            } else if (slideIntervalMode === SlideIntervalMode.max) {
                const newMax = Math.round(
                    Math.min(100, Math.max(0, slideMax + increment * slideInterval))
                );
                if (newMax === slideMax) return;
                setSlideMax(newMax);
                sendSlideMax(newMax);
            } else if (slideIntervalMode === SlideIntervalMode.offset) {
                const newMin = Math.round(slideMin + increment * slideInterval);
                const newMax = Math.round(slideMax + increment * slideInterval);
                if (newMin < 0 || newMin > 100 || newMax < 0 || newMax > 100) return;
                setSlideMin(newMin);
                setSlideMax(newMax);
                sendSlideSettings(newMin, newMax);
            }
        },
        [sendSlideMin, sendSlideMax, sendSlideSettings, slideMin, slideMax, slideIntervalMode]
    );

    const tryTogglePlay = useCallback(() => {
        if (handyState.hampState === HampState.stopped) {
            sendHampState(HampState.moving);
        } else {
            sendHampState(HampState.stopped);
        }
    }, [handyState.hampState, sendHampState]);

    return (
        <div className="flex min-h-mobilemain md:min-h-main flex-col -mt-4 pb-5 pt-5 justify-between">
            <ManualControls
                loading={loading}
                running={handyState.hampState === HampState.moving}
                onButtonUp={() => tryIncrementSlide(1)}
                onButtonDown={() => tryIncrementSlide(-1)}
                onButtonLeft={() => tryIncrementHampVelocity(-1)}
                onButtonRight={() => tryIncrementHampVelocity(1)}
                onButtonCenter={() => tryTogglePlay()}
                slideVerticalMin={slideMin}
                onSlideVerticalMin={setSlideMin}
                onIntervalSlideVerticalMin={sendSlideMin}
                slideVerticalMax={slideMax}
                onSlideVerticalMax={setSlideMax}
                onIntervalSlideVerticalMax={sendSlideMax}
                slideHorizontal={hampVelocity}
                onSlideHorizontal={setHampVelocity}
                onIntervalSlideHorizontal={sendHampVelocity}
            />
            <div className="flex flex-col gap-2 w-full">
                <SliderField
                    label="Speed Interval"
                    valueUnit="%"
                    min={0}
                    max={100}
                    value={velocityInterval}
                    onChange={setVelocityInterval}
                />
                <SliderField
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
            </div>
        </div>
    );
};

export default AppManual;
