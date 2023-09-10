import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { toast } from "react-toastify";
import useHandy from "thehandy-react";
import { HampState, HandyMode } from "lib/thehandy/types";
import useAnim from "lib/hooks/useAnim";
import Mathf from "lib/Mathf";
import ButtonIcon from "components/atoms/ButtonIcon";
import useKeyboard from "lib/hooks/useKeyboard";
import SliderField from "components/molecules/SliderField";
import SliderMinMaxField from "components/molecules/SliderMinMaxField";

type Range = {
    min: number;
    max: number;
};

const AppCycler = (): JSX.Element => {
    const {
        loading,
        error,
        getSlideSettings,
        getHampVelocity,
        sendHampVelocity,
        sendSlideMin,
        sendSlideMax,
        sendMode,
        sendHampState,
        handyState,
    } = useHandy();
    const [initialized, setInitialized] = useState(false);

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

    const [lastError, setLastError] = useState("");
    useEffect(() => {
        if (error && error != lastError) {
            toast.error(error);
            setLastError(error);
        }
    }, [error]);

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
            if (!(handyState.hampState === HampState.moving)) {
                setNextCommandTime(-1);
                setCurrentTime(Math.random() * 0.01);
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
                    sendHampVelocity(newSpeed);
                    setHampVelocity(newSpeed);
                }

                setNextCommandTime(currentTime + setInterval);
            }
        },
        [
            handyState.hampState,
            nextCommandTime,
            speedBounds,
            hampVelocity,
            setInterval,
            currentTime,
            sendHampVelocity,
        ]
    );

    useEffect(() => {
        if (!canvasContainer.current) return;
        if (!previewCanvas.current) return;
        previewCanvas.current.width = canvasContainer.current.clientWidth;
        previewCanvas.current.height = canvasContainer.current.clientHeight;

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
        ctx.ellipse(mapX(0), actualValue, 20, 20, 0, 0, Math.PI * 2.0);
        ctx.fill();

        const speedPercent = Math.round(
            Mathf.lerp(speedBounds.min, speedBounds.max, getValue(currentTime))
        );
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(speedPercent + "", mapX(0), actualValue + 1.5);
    }, [canvasContainer, previewCanvas, getValue, currentTime, speedBounds]);

    const togglePlay = () => {
        sendHampState(
            handyState.hampState === HampState.moving ? HampState.stopped : HampState.moving
        );
    };

    useKeyboard(e => {
        switch (e.key) {
            case " ":
            case "Enter":
                togglePlay();
                break;
        }
    }, []);

    return (
        <div className="flex min-h-mobilemain md:min-h-main flex-col -mt-4 pb-5 pt-5 justify-between">
            <div className="flex flex-col gap-4">
                <SliderMinMaxField
                    label="Speed Bounds"
                    valueUnit="%"
                    min={0}
                    max={100}
                    valueMin={speedBounds.min}
                    valueMax={speedBounds.max}
                    onChangeMin={val => setSpeedBounds(cur => ({ ...cur, min: val }))}
                    onChangeMax={val => setSpeedBounds(cur => ({ ...cur, max: val }))}
                />
                <SliderField
                    label="Cycle Duration"
                    valueUnit="s"
                    min={10}
                    max={250}
                    value={cycleDuration}
                    onChange={setCycleDuration}
                    ticks={7}
                />
                <SliderField
                    label="Session Duration"
                    valueUnit=" min"
                    minValueDisplay="Unlimited"
                    min={0}
                    max={240}
                    value={sessionDuration}
                    onChange={setSessionDuration}
                    ticks={5}
                />
                <SliderField
                    label="Handy Update Interval"
                    valueUnit="s"
                    min={0.5}
                    max={5}
                    value={setInterval}
                    onChange={setSetInterval}
                    decimalPlaces={1}
                    ticks={8}
                />
                <SliderField
                    label="Ease In/Out Balance"
                    valueUnit="%"
                    min={0}
                    max={100}
                    value={easeInLength}
                    onChange={setEaseInLength}
                />

                <div className="flex flex-col items-center">
                    <ButtonIcon disabled={false} onClick={togglePlay}>
                        {handyState.hampState === HampState.moving ? <MdPause /> : <MdPlayArrow />}
                    </ButtonIcon>
                    <span className="text-sm">
                        {handyState.hampState === HampState.moving ? "Stop" : "Start"}
                    </span>
                </div>
                <SliderMinMaxField
                    label="Stroke Range"
                    valueUnit="%"
                    min={0}
                    max={100}
                    valueMin={slideMin}
                    valueMax={slideMax}
                    onChangeMin={setSlideMin}
                    onChangeMax={setSlideMax}
                    onIntervalChangeMin={sendSlideMin}
                    onIntervalChangeMax={sendSlideMax}
                    disabled={loading}
                />
            </div>
            <div className="flex justify-around items-center h-72 w-full border-t pt-4 mt-5">
                <div className="w-full h-full" ref={canvasContainer}>
                    <canvas
                        width={canvasContainer.current?.clientWidth || 100}
                        height={canvasContainer.current?.clientHeight || 100}
                        ref={previewCanvas}
                    />
                </div>
            </div>
        </div>
    );
};

export default AppCycler;
