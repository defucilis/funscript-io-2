import React, { useState } from "react";
import Handy from "lib/thehandy";
import { HandyMode } from "lib/thehandy/types";
import RateLimitedSlider from "components/molecules/RateLimitedSlider";
import Slider from "components/atoms/Slider";
import MinMaxSlider from "components/atoms/MinMaxSlider";

const AppDebug = ({ handy }: { handy: Handy }): JSX.Element => {
    const [hampVelocity, setHampVelocity] = useState(0);
    const [slideMin, setSlideMin] = useState(0);
    const [slideMax, setSlideMax] = useState(100);
    const [temp, setTemp] = useState(50);
    const [tempMin, setTempMin] = useState(0);
    const [tempMax, setTempMax] = useState(100);

    const [error, setError] = useState("");

    const trySetHampVelocity = (value: number): void => {
        setError("");
        handy.setHampVelocity(value).catch(setError);
    };

    const trySetSlideMin = (value: number): void => {
        setError("");
        handy.setSlideMin(value).catch(setError);
    };

    const trySetSlideMax = (value: number): void => {
        setError("");
        handy.setSlideMax(value).catch(setError);
    };

    return (
        <div>
            <h1>Debug</h1>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">Min Slide</label>
                        <span>{Math.round(slideMin)}%</span>
                    </div>
                    <RateLimitedSlider
                        min={0}
                        max={100}
                        value={slideMin}
                        onChange={setSlideMin}
                        onLimitedChange={trySetSlideMin}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">Max Slide</label>
                        <span>{Math.round(slideMax)}%</span>
                    </div>
                    <RateLimitedSlider
                        min={0}
                        max={100}
                        value={slideMax}
                        onChange={setSlideMax}
                        onLimitedChange={trySetSlideMax}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <button onClick={() => handy.setMode(HandyMode.hamp)}>Set HAMP Mode</button>
                <button onClick={() => handy.setHampStart()}>Start HAMP</button>
                <button onClick={() => handy.setHampStop()}>Stop HAMP</button>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">HAMP Velocity</label>
                        <span>{Math.round(hampVelocity)}%</span>
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
            {error && <p className="text-red-300 text-sm">{error}</p>}
            <Slider value={temp} min={0} max={100} onChange={setTemp} />
            <MinMaxSlider
                valueMin={tempMin}
                valueMax={tempMax}
                min={0}
                max={100}
                onChangeMin={setTempMin}
                onChangeMax={setTempMax}
            />
            <div className="h-96">
                <Slider value={temp} min={0} max={100} onChange={setTemp} vertical={true} />
                <MinMaxSlider
                    valueMin={tempMin}
                    valueMax={tempMax}
                    min={0}
                    max={100}
                    onChangeMin={setTempMin}
                    onChangeMax={setTempMax}
                    vertical={true}
                />
            </div>
            <pre className="text-white text-sm">{JSON.stringify(handy, null, 2)}</pre>
        </div>
    );
};

export default AppDebug;
