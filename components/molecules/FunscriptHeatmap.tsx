import { useEffect, useRef } from "react";
import { Funscript } from "lib/funscript-utils/types";
import { HeatmapOptions, renderHeatmap } from "lib/funscript-utils/funMapper";
import useElementDimensions from "lib/hooks/useElementDimensions";

const FunscriptHeatmap = ({
    funscript,
    className = "",
    onDataUrlChange = null,
    options,
}: {
    funscript: Funscript;
    className?: string;
    onDataUrlChange?: ((dataUrl: string) => void) | null;
    options?: HeatmapOptions;
}): JSX.Element => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const parent = useRef<HTMLDivElement>(null);

    const { width, height } = useElementDimensions(parent);

    useEffect(() => {
        if (!canvas.current) return;

        renderHeatmap(canvas.current, funscript, options);
        if (onDataUrlChange) {
            const data = canvas.current.toDataURL("images/png");
            onDataUrlChange(data);
        }
    }, [canvas, width, height, funscript, options]);

    return (
        <div className={className || ""} ref={parent}>
            <canvas ref={canvas} width={width} height={height} />
        </div>
    );
};

export default FunscriptHeatmap;
