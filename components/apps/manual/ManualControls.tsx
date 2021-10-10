import React, { useRef } from "react";
import RateLimitedMinMaxSlider from "components/molecules/RateLimitedMinMaxSlider";
import RateLimitedSlider from "components/molecules/RateLimitedSlider";
import useKeyboard from "lib/hooks/useKeyboard";
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
    onLimitedSlideVerticalMin,
    slideVerticalMax,
    onSlideVerticalMax,
    onLimitedSlideVerticalMax,
    slideHorizontal,
    onSlideHorizontal,
    onLimitedSlideHorizontal,
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
    onLimitedSlideVerticalMin: (val: number) => void;
    slideVerticalMax: number;
    onSlideVerticalMax: (val: number) => void;
    onLimitedSlideVerticalMax: (val: number) => void;
    slideHorizontal: number;
    onSlideHorizontal: (val: number) => void;
    onLimitedSlideHorizontal: (val: number) => void;
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
                    <RateLimitedSlider
                        label="Speed"
                        valueUnit="%"
                        min={0}
                        max={100}
                        value={slideHorizontal}
                        onChange={onSlideHorizontal}
                        onLimitedChange={onLimitedSlideHorizontal}
                    />
                </div>
            </div>
            <div className="pb-10">
                <RateLimitedMinMaxSlider
                    min={0}
                    max={100}
                    valueMin={slideVerticalMin}
                    valueMax={slideVerticalMax}
                    onChangeMin={onSlideVerticalMin}
                    onChangeMax={onSlideVerticalMax}
                    onLimitedChangeMin={onLimitedSlideVerticalMin}
                    onLimitedChangeMax={onLimitedSlideVerticalMax}
                    vertical={true}
                />
            </div>
        </div>
    );
};

export default ManualControls;
