import Mathf from "lib/Mathf";
import { roundNumber } from "lib/text";

const SliderTicks = ({
    count = 4,
    vertical = false,
    min = 0,
    max = 1,
    decimalPlaces = 0,
}: {
    count?: number;
    vertical?: boolean;
    min?: number;
    max?: number;
    decimalPlaces?: number;
}): JSX.Element | null => {
    if (!count || count === 0) return null;

    return (
        <div
            className={`absolute w-full h-full left-0 bottom-0.5 flex justify-between z-0 text-neutral-500 ${
                vertical ? "flex-col pl-1" : "pl-2"
            }`}
        >
            {Array.from(Array(count + 2)).map((_, i) => {
                const value = Mathf.lerp(
                    min,
                    max,
                    vertical ? 1.0 - i / ((count || 0) + 1) : i / ((count || 0) + 1)
                );
                return (
                    <div
                        className={`flex items-center ${vertical ? "" : "flex-col"}`}
                        key={"slider_" + i}
                    >
                        <span>{vertical ? "—" : "|"}</span>
                        <span>{roundNumber(value, decimalPlaces || 0)}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default SliderTicks;
