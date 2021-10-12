import React, { useMemo, useRef, useState } from "react";
import FunscriptHeatmap from "components/molecules/FunscriptHeatmap";
import FunscriptPreview from "components/molecules/FunscriptPreview";
import { Funscript } from "lib/funscript-utils/types";
import useElementDimensions from "lib/hooks/useElementDimensions";


const FunscriptExplorer = ({funscript}: {funscript?: Funscript}): JSX.Element | null => {

    const parent = useRef<HTMLDivElement>(null);
    const {x, width} = useElementDimensions(parent);

    const duration = useMemo(() => funscript?.metadata?.duration || funscript?.actions.slice(-1)[0].at || 1, [funscript]);
    const [viewCenter, setViewCenter] = useState(10000);
    const [viewDuration, setViewDuration] = useState(40000);

    const handleMouseMove = (e: React.MouseEvent) => {
        const localX = (e.clientX - x) / width;
        setViewCenter(Math.max(viewDuration * 0.5, Math.min(duration - viewDuration * 0.5, localX * duration)));
    }

    if(!funscript) return null;

    return (
        <div className="w-full flex flex-col">
            <FunscriptPreview className="h-40" funscript={funscript} />
            <div className="h-12 relative" onMouseMove={handleMouseMove} ref={parent}>
                <FunscriptHeatmap funscript={funscript} className="h-full" />
                <div className="absolute top-0 h-full border border-white" style={{
                    width: width * viewDuration / duration,
                    left: ((viewCenter - viewDuration * 0.5) / duration) * width
                }} />
            </div>
        </div>
    )
}

export default FunscriptExplorer;