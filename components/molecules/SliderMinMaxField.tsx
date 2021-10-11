import SliderTicks from "components/atoms/SliderTicks";
import SliderHeader from "components/atoms/SliderHeader";
import SliderMinMax, { SliderMinMaxProps } from "components/atoms/SliderMinMax";
import { SliderFieldOptions } from "./SliderField";

const SliderMinMaxField = ({
    valueMin,
    onChangeMin,
    onIntervalChangeMin,
    onStartEditMin,
    onStopEditMin,
    valueMax,
    onChangeMax,
    onIntervalChangeMax,
    onStartEditMax,
    onStopEditMax,
    interval = 500,
    min = 0,
    max = 1,
    disabled = false,
    className = "",
    vertical = false,
    trackSize = "0.5rem",
    knobSize = "1.5rem",
    activeColor = "rgb(244,63,94)",
    inactiveColor = "rgb(200,200,200)",
    label = "",
    showValue = true,
    valueUnit = "",
    minValueDisplay = "",
    maxValueDisplay = "",
    decimalPlaces = 0,
    ticks = 4,
}: SliderMinMaxProps & SliderFieldOptions): JSX.Element => {
    return (
        <div
            className={`flex flex-col items-center select-none  ${
                vertical ? "h-full" : "w-full"
            } ${className}`}
        >
            <SliderHeader
                className={`${ticks && ticks > 0 && vertical ? "mr-4" : ""}`}
                label={label}
                value={[valueMin, valueMax]}
                valueUnit={valueUnit}
                minValueDisplay={minValueDisplay}
                maxValueDisplay={maxValueDisplay}
                showValue={showValue}
                decimalPlaces={decimalPlaces}
                min={min}
                max={max}
                vertical={vertical}
            />
            <div
                className={`relative grid place-items-center ${
                    vertical ? "w-6 h-full" : "w-full h-6"
                } ${ticks && ticks > 0 ? (vertical ? "mr-4" : "mb-4") : ""}`}
            >
                <SliderMinMax
                    interval={interval}
                    min={min}
                    max={max}
                    valueMin={valueMin}
                    onChangeMin={onChangeMin}
                    onIntervalChangeMin={onIntervalChangeMin}
                    onStartEditMin={onStartEditMin}
                    onStopEditMin={onStopEditMin}
                    valueMax={valueMax}
                    onChangeMax={onChangeMax}
                    onIntervalChangeMax={onIntervalChangeMax}
                    onStartEditMax={onStartEditMax}
                    onStopEditMax={onStopEditMax}
                    disabled={disabled}
                    vertical={vertical}
                    trackSize={trackSize}
                    knobSize={knobSize}
                    activeColor={activeColor}
                    inactiveColor={inactiveColor}
                />
                <SliderTicks
                    count={ticks}
                    min={min}
                    max={max}
                    vertical={vertical}
                    decimalPlaces={decimalPlaces}
                />
            </div>
        </div>
    );
};

export default SliderMinMaxField;
