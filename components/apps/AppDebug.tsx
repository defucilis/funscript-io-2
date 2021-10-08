import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HandyMode } from "lib/thehandy/types";
import RateLimitedSlider from "components/molecules/RateLimitedSlider";
import useHandy from "lib/thehandy-react";
import Button from "components/atoms/Button";

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
                    <RateLimitedSlider
                        min={0}
                        max={100}
                        value={slideMin}
                        onChange={setSlideMin}
                        onLimitedChange={sendSlideMin}
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
                        onLimitedChange={sendSlideMax}
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
                    <RateLimitedSlider
                        min={0}
                        max={100}
                        value={hampVelocity}
                        onChange={setHampVelocity}
                        onLimitedChange={sendHampVelocity}
                    />
                </div>
            </div>
            <Button onClick={() => toast.info("This is a test")}>Info</Button>
            <Button onClick={() => toast.warning("This is a test")}>Warning</Button>
            <Button onClick={() => toast.success("This is a test")}>Success</Button>
            <Button onClick={() => toast.error("This is a test")}>Error</Button>
            <Button onClick={() => toast("This is a test")}>Default</Button>
            {error && <p className="text-red-300 text-sm">{error}</p>}
        </div>
    );
};

export default AppDebug;
