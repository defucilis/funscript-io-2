import { useEffect, useState } from "react";

const useElementDimensions = (
    ref: React.RefObject<HTMLElement>
): { width: number; height: number } => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver(() => {
            if (!ref.current) return;
            setDimensions({
                width: ref.current.clientWidth,
                height: ref.current.clientHeight,
            });
        });
        observer.observe(ref.current);

        setDimensions({
            width: ref.current.clientWidth,
            height: ref.current.clientHeight,
        });
    }, [ref]);

    return dimensions;
};

export default useElementDimensions;
