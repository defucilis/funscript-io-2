import React, { useRef } from "react";
import useKeyboard from "lib/hooks/useKeyboard";
import SliderField from "components/molecules/SliderField";
import SliderMinMaxField from "components/molecules/SliderMinMaxField";
import ManualButtons from "./ManualButtons";

const ManualControls = ({
    loading,
    running,
    onButtonUp,
    onButtonDown,
    onButtonLeft,
    onButtonRight,
    onButtonCenter,
    slideVerticalMin,
    onSlideVerticalMin,
    onIntervalSlideVerticalMin,
    slideVerticalMax,
    onSlideVerticalMax,
    onIntervalSlideVerticalMax,
    slideHorizontal,
    onSlideHorizontal,
    onIntervalSlideHorizontal,
}: {
    loading: boolean;
    running: boolean;
    onButtonUp: () => void;
    onButtonDown: () => void;
    onButtonLeft: () => void;
    onButtonRight: () => void;
    onButtonCenter: () => void;
    slideVerticalMin: number;
    onSlideVerticalMin: (val: number) => void;
    onIntervalSlideVerticalMin: (val: number) => void;
    slideVerticalMax: number;
    onSlideVerticalMax: (val: number) => void;
    onIntervalSlideVerticalMax: (val: number) => void;
    slideHorizontal: number;
    onSlideHorizontal: (val: number) => void;
    onIntervalSlideHorizontal: (val: number) => void;
}): JSX.Element => {
    const parentRef = useRef<HTMLDivElement>(null);

    useKeyboard(
        e => {
            switch (e.key) {
                case "a":
                case "ArrowLeft":
                    onButtonLeft();
                    break;
                case "w":
                case "ArrowUp":
                    onButtonUp();
                    break;
                case "d":
                case "ArrowRight":
                    onButtonRight();
                    break;
                case "s":
                case "ArrowDown":
                    onButtonDown();
                    break;
                case " ":
                case "Enter":
                    onButtonCenter();
                    break;
            }
        },
        [onButtonLeft, onButtonUp, onButtonRight, onButtonDown, onButtonCenter]
    );

    return (
        <div className="flex gap-2 w-full justify-between">
            <div className="flex flex-col gap-2 justify-between flex-grow" ref={parentRef}>
                <div className="grid place-items-center">
                    <ManualButtons
                        loading={loading}
                        running={running}
                        onButtonUp={onButtonUp}
                        onButtonDown={onButtonDown}
                        onButtonLeft={onButtonLeft}
                        onButtonRight={onButtonRight}
                        onButtonCenter={onButtonCenter}
                        targetHeight={parentRef.current?.clientWidth || 200}
                    />
                </div>
                <div className="w-full">
                    <SliderField
                        label="Speed"
                        valueUnit="%"
                        min={0}
                        max={100}
                        value={slideHorizontal}
                        onChange={onSlideHorizontal}
                        onIntervalChange={onIntervalSlideHorizontal}
                    />
                </div>
            </div>
            <div className="pb-10 w-12">
                <SliderMinMaxField
                    min={0}
                    max={100}
                    valueMin={slideVerticalMin}
                    valueMax={slideVerticalMax}
                    onChangeMin={onSlideVerticalMin}
                    onChangeMax={onSlideVerticalMax}
                    onIntervalChangeMin={onIntervalSlideVerticalMin}
                    onIntervalChangeMax={onIntervalSlideVerticalMax}
                    vertical={true}
                    valueUnit="%"
                />
            </div>
        </div>
    );
};

export default ManualControls;
