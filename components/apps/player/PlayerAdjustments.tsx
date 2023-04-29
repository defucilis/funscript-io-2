import { useState } from "react";
import SliderField from "components/molecules/SliderField";
import SliderMinMaxField from "components/molecules/SliderMinMaxField";
import useKeyboard from "lib/hooks/useKeyboard";
import useHandy from "lib/thehandy-react";

enum SlideIntervalMode {
    min = 0,
    max = 1,
    offset = 2,
}

const PlayerAdjustments = (): JSX.Element => {
    const { sendSlideMin, sendSlideMax, sendHstpOffset, handyState, loading } = useHandy();

    const [offset, setOffset] = useState(handyState.hstpOffset);
    const [slideMin, setSlideMin] = useState(handyState.slideMin);
    const [slideMax, setSlideMax] = useState(handyState.slideMax);
    const [slideInterval, setSlideInterval] = useState(10);
    const [slideIntervalMode, setSlideIntervalMode] = useState(SlideIntervalMode.min);

    useKeyboard(
        e => {
            if (loading) return;
            switch (e.key) {
                case "ArrowUp":
                    setOffset(cur => Math.min(2000, cur + 200));
                    sendHstpOffset(Math.min(2000, offset + 200));
                    break;
                case "ArrowDown":
                    setOffset(cur => Math.max(-2000, cur - 200));
                    sendHstpOffset(Math.max(-2000, offset - 200));
                    break;
            }
        },
        [loading]
    );

    return (
        <div className="flex flex-col gap-2 w-full mt-4">
            <SliderMinMaxField
                label="Stroke Length"
                min={0}
                max={100}
                valueMin={slideMin}
                valueMax={slideMax}
                onChangeMin={setSlideMin}
                onChangeMax={setSlideMax}
                onIntervalChangeMin={sendSlideMin}
                onIntervalChangeMax={sendSlideMax}
                valueUnit="%"
                disabled={loading}
            />
            <SliderField
                label="Time Offset - ↕"
                valueOverride={`Handy is ${Math.abs(Math.round(offset))} ms ${
                    offset > 0 ? "ahead" : "behind"
                }`}
                min={-2000}
                max={2000}
                value={offset}
                onChange={setOffset}
                onIntervalChange={sendHstpOffset}
                disabled={loading}
            />
            <SliderField
                label="Slide Interval"
                valueUnit="%"
                min={0}
                max={100}
                value={slideInterval}
                onChange={setSlideInterval}
                disabled={loading}
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
    );
};

export default PlayerAdjustments;
