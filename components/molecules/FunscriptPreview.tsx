import { useEffect, useRef } from "react";
import useElementDimensions from "lib/hooks/useElementDimensions";
import { ActionsOptions, renderActions } from "lib/funscript-utils/funMapper";
import { Funscript } from "lib/funscript-utils/types";

const FunscriptPreview = ({
    className = "",
    funscript,
    options,
}: {
    className?: string;
    funscript?: Funscript;
    options?: ActionsOptions;
}): JSX.Element => {
    const parent = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);

    const { width, height } = useElementDimensions(parent);

    useEffect(() => {
        if (!canvas.current) return;
        renderActions(canvas.current, funscript, options);
    }, [canvas, width, height, funscript, options]);

    return (
        <div ref={parent} className={className}>
            <canvas ref={canvas} width={width} height={height} className="w-full h-full" />
        </div>
    );
};

export default FunscriptPreview;
