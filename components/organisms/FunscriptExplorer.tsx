import React, { useMemo, useRef, useState } from "react";
import FunscriptHeatmap from "components/molecules/FunscriptHeatmap";
import FunscriptPreview from "components/molecules/FunscriptPreview";
import { Funscript } from "lib/funscript-utils/types";
import useElementDimensions from "lib/hooks/useElementDimensions";

const FunscriptExplorer = ({
    funscript,
    compareFunscript,
}: {
    funscript?: Funscript;
    compareFunscript?: Funscript;
}): JSX.Element | null => {
    const parent = useRef<HTMLDivElement>(null);
    const { x, width } = useElementDimensions(parent);

    const duration = useMemo(
        () => funscript?.metadata?.duration || funscript?.actions.slice(-1)[0].at || 1,
        [funscript]
    );
    const [viewCenter, setViewCenter] = useState(10000);
    const [viewDuration, setViewDuration] = useState(40000);

    const handleMouseMove = (e: React.MouseEvent) => {
        const localX = (e.clientX - x) / width;
        setViewCenter(
            Math.max(viewDuration * 0.5, Math.min(duration - viewDuration * 0.5, localX * duration))
        );
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const localX = (e.touches[0].clientX - x) / width;
        setViewCenter(
            Math.max(viewDuration * 0.5, Math.min(duration - viewDuration * 0.5, localX * duration))
        );
    };

    const handleMouseWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY;
        const newDuration = Math.max(
            5000,
            Math.min(duration, viewDuration * (delta > 0 ? 1.5 : 1 / 1.5))
        );
        setViewDuration(newDuration);
        if (viewCenter - newDuration * 0.5 < 0) setViewCenter(newDuration * 0.5);
        else if (viewCenter + newDuration * 0.5 > duration)
            setViewCenter(duration - newDuration * 0.5);
    };

    if (!funscript) return null;

    return (
        <div className="w-full flex flex-col relative">
            <FunscriptPreview
                className="h-40 py-2 relative z-10"
                funscript={funscript}
                options={{
                    duration: viewDuration,
                    startTime: viewCenter - viewDuration * 0.5,
                    background: "rgba(0,0,0,0)",
                    clear: true,
                    lineWeight:
                        viewDuration > 300000
                            ? 1
                            : viewDuration > 100000
                            ? 2
                            : viewDuration > 30000
                            ? 3
                            : 4,
                    lineColor: `rgba(255,255,255,${compareFunscript ? "0.5" : "1"})`,
                }}
            />
            {compareFunscript && (
                <FunscriptPreview
                    className="w-full h-40 py-2 absolute left-0 top-0 z-0"
                    funscript={compareFunscript}
                    options={{
                        duration: viewDuration,
                        startTime: viewCenter - viewDuration * 0.5,
                        background: "rgba(0,0,0,0)",
                        clear: true,
                        lineWeight:
                            viewDuration > 300000
                                ? 1
                                : viewDuration > 100000
                                ? 2
                                : viewDuration > 30000
                                ? 3
                                : 4,
                        lineColor: "rgb(521, 113, 133)",
                        offset: {
                            x: 2,
                            y: 0,
                        },
                    }}
                />
            )}
            <div
                className="h-12 relative"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onWheel={handleMouseWheel}
                ref={parent}
            >
                <FunscriptHeatmap funscript={funscript} className="h-full" />
                <div
                    className="absolute top-0 h-full border border-white"
                    style={{
                        width: (width * viewDuration) / duration,
                        left: ((viewCenter - viewDuration * 0.5) / duration) * width,
                    }}
                />
            </div>
        </div>
    );
};

export default FunscriptExplorer;
