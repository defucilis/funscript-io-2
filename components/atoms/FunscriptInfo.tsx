import { formatColor, getColor } from "lib/funscript-utils/funMapper";
import { Funscript } from "lib/funscript-utils/types";
import { formatTime } from "lib/text";

const FunscriptInfo = ({ funscript }: { funscript: Funscript }): JSX.Element => {
    return (
        <div className="grid grid-cols-3 place-items-center">
            <p>Duration: {formatTime(funscript.actions.slice(-1)[0].at / 1000)}</p>
            <p>
                {`Avg. Speed: `}
                <span
                    className="font-bold"
                    style={{
                        color: funscript.metadata?.average_speed
                            ? formatColor(getColor(funscript.metadata?.average_speed))
                            : "white",
                    }}
                >
                    {Math.round(funscript.metadata?.average_speed || 0) || "???"}
                </span>
            </p>
            <p>Actions: {funscript.actions.length}</p>
        </div>
    );
};

export default FunscriptInfo;
