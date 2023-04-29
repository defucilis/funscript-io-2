import Slider, { SliderProps } from "components/atoms/Slider";
import SliderTicks from "components/atoms/SliderTicks";
import SliderHeader from "components/atoms/SliderHeader";

export interface SliderFieldOptions {
    label?: string;
    showValue?: boolean;
    valueUnit?: string;
    valuePrefix?: string;
    valueOverride?: string;
    minValueDisplay?: string;
    maxValueDisplay?: string;
    decimalPlaces?: number;
    ticks?: number;
}

const SliderField = ({
    value,
    onChange,
    onIntervalChange,
    onStartEdit,
    onStopEdit,
    interval = 500,
    min = 0,
    max = 1,
    disabled = false,
    className = "",
    vertical = false,
    trackSize = "0.5rem",
    knobSize = "1.5rem",
    activeColor = "rgb(251,113,133)",
    inactiveColor = "rgb(200,200,200)",
    label = "",
    showValue = true,
    valueUnit = "",
    valuePrefix = "",
    valueOverride = "",
    minValueDisplay = "",
    maxValueDisplay = "",
    decimalPlaces = 0,
    ticks = 4,
}: SliderProps & SliderFieldOptions): JSX.Element => {
    return (
        <div
            className={`flex flex-col select-none  ${vertical ? "h-full" : "w-full"} ${className}`}
        >
            <SliderHeader
                label={label}
                value={value}
                valueUnit={valueUnit}
                valuePrefix={valuePrefix}
                valueOverride={valueOverride}
                minValueDisplay={minValueDisplay}
                maxValueDisplay={maxValueDisplay}
                showValue={showValue}
                decimalPlaces={decimalPlaces}
                min={min}
                max={max}
            />
            <div
                className={`relative grid place-items-center ${
                    vertical ? "w-6 h-full" : "w-full h-6"
                } ${ticks && ticks > 0 ? (vertical ? "mr-4" : "mb-4") : ""}`}
            >
                <Slider
                    interval={interval}
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    onIntervalChange={onIntervalChange}
                    onStartEdit={onStartEdit}
                    onStopEdit={onStopEdit}
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

export default SliderField;
