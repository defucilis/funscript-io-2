import { useEffect, useState } from "react";

const useElementDimensions = (
    ref: React.RefObject<HTMLElement>
): { x: number; y: number; width: number; height: number } => {
    const [dimensions, setDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver(() => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            setDimensions({
                x: rect.left,
                y: rect.top,
                width: ref.current.clientWidth,
                height: ref.current.clientHeight,
            });
        });
        observer.observe(ref.current);

        const rect = ref.current.getBoundingClientRect();
        setDimensions({
            x: rect.left,
            y: rect.top,
            width: ref.current.clientWidth,
            height: ref.current.clientHeight,
        });
    }, [ref]);

    return dimensions;
};

export default useElementDimensions;
