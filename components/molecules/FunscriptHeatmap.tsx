import { useEffect, useRef, useState } from "react";
import { Funscript } from "lib/funscript-utils/types";
import { HeatmapOptions, renderHeatmap } from "lib/funscript-utils/funMapper";

const FunscriptHeatmap = ({
    funscript,
    className,
    options,
}: {
    funscript: Funscript;
    className?: string;
    options?: HeatmapOptions;
}): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const parent = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);

    useEffect(() => {
        if (!parent.current) return;
        setWidth(parent.current.clientWidth);
        setHeight(parent.current.clientHeight);
    }, [parent]);

    useEffect(() => {
        if (!canvas.current) return;

        renderHeatmap(canvas.current, funscript, options);
    }, [canvas, width, height, funscript, options]);

    return (
        <div className={className || ""} ref={parent}>
            <canvas ref={canvas} width={width} height={height} />
        </div>
    );
};

export default FunscriptHeatmap;
