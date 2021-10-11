import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HandyMode } from "lib/thehandy/types";
import useHandy from "lib/thehandy-react";
import Button from "components/atoms/Button";
import Slider from "components/atoms/Slider";
import SliderField from "components/molecules/SliderField";
import SliderMinMax from "components/atoms/SliderMinMax";
import SliderMinMaxField from "components/molecules/SliderMinMaxField";

const AppDebug = (): JSX.Element => {
    const {
        sendSlideMin,
        sendSlideMax,
        sendHampVelocity,
        error,
        sendMode,
        sendHampStart,
        sendHampStop,
    } = useHandy();

    const [hampVelocity, setHampVelocity] = useState(0);
    const [slideMin, setSlideMin] = useState(0);
    const [slideMax, setSlideMax] = useState(100);

    const [testMin, setTestMin] = useState(0);
    const [testMax, setTestMax] = useState(0);
    const [slowTestMin, setSlowTestMin] = useState(0);
    const [slowTestMax, setSlowTestMax] = useState(0);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    return (
        <div>
            <h1>Debug</h1>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">Min Slide</label>
                        <span>{Math.round(slideMin)}%</span>
                    </div>
                    <Slider
                        min={0}
                        max={100}
                        value={slideMin}
                        onChange={setSlideMin}
                        onIntervalChange={sendSlideMin}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">Max Slide</label>
                        <span>{Math.round(slideMax)}%</span>
                    </div>
                    <Slider
                        min={0}
                        max={100}
                        value={slideMax}
                        onChange={setSlideMax}
                        onIntervalChange={sendSlideMax}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <button onClick={() => sendMode(HandyMode.hamp)}>Set HAMP Mode</button>
                <button onClick={sendHampStart}>Start HAMP</button>
                <button onClick={sendHampStop}>Stop HAMP</button>
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <label className="text-sm text-white mb-0">HAMP Velocity</label>
                        <span>{Math.round(hampVelocity)}%</span>
                    </div>
                    <Slider
                        min={0}
                        max={100}
                        value={hampVelocity}
                        onChange={setHampVelocity}
                        onIntervalChange={sendHampVelocity}
                    />
                </div>
            </div>
            <Button onClick={() => toast.info("This is a test")}>Info</Button>
            <Button onClick={() => toast.warning("This is a test")}>Warning</Button>
            <Button onClick={() => toast.success("This is a test")}>Success</Button>
            <Button onClick={() => toast.error("This is a test")}>Error</Button>
            <Button onClick={() => toast("This is a test")}>Default</Button>
            <div className="flex flex-col mt-4 gap-4">
                <SliderMinMax valueMin={slowTestMin} valueMax={slowTestMax} />
                <SliderMinMax
                    valueMin={testMin}
                    valueMax={testMax}
                    onChangeMin={setTestMin}
                    onChangeMax={setTestMax}
                    onIntervalChangeMin={setSlowTestMin}
                    onIntervalChangeMax={setSlowTestMax}
                />
                <SliderField
                    value={testMin}
                    onChange={setTestMin}
                    label="Test"
                    decimalPlaces={2}
                    minValueDisplay={"min!"}
                    maxValueDisplay="max!"
                />
                <SliderMinMaxField
                    valueMin={testMin}
                    onChangeMin={setTestMin}
                    valueMax={testMax}
                    onChangeMax={setTestMax}
                    label="Test"
                    decimalPlaces={2}
                    minValueDisplay={"min!"}
                    maxValueDisplay="max!"
                />
            </div>
            {error && <p className="text-red-300 text-sm">{error}</p>}
        </div>
    );
};

export default AppDebug;
