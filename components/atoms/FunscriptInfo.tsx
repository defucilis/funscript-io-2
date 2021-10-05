import { Funscript } from "lib/funscript-utils/types";
import { formatTime } from "lib/text";

const FunscriptInfo = ({ funscript }: { funscript: Funscript }): JSX.Element => {
    return (
        <div className="grid grid-cols-3 place-items-center">
            <p>Duration: {formatTime(funscript.actions.slice(-1)[0].at / 1000)}</p>
            <p>Average Speed: {Math.round(funscript.metadata?.average_speed || 0) || "???"}</p>
            <p>Actions: {funscript.actions.length}</p>
        </div>
    );
};

export default FunscriptInfo;
