//modified from https://www.npmjs.com/package/use-double-click

import { RefObject, useEffect, useRef } from "react";

/**
 * A simple React hook for differentiating single and double clicks on the same component.
 *
 * @param {node} ref Dom node to watch for double clicks
 * @param {number} [latency=300] The amount of time (in milliseconds) to wait before differentiating a single from a double click
 * @param {function} onSingleClick A callback function for single click events
 * @param {function} onDoubleClick A callback function for double click events
 */
const useDoubleClick = ({
    ref,
    latency = 300,
    onSingleClick = () => null,
    onDoubleClick = () => null,
}: {
    ref: RefObject<HTMLElement>;
    latency?: number;
    onSingleClick?: () => void;
    onDoubleClick?: () => void;
}): void => {
    const clickCount = useRef(0);

    useEffect(() => {
        if (!ref.current) return;

        const clickRef = ref.current;
        const handleClick = () => {
            clickCount.current = clickCount.current + 1;

            setTimeout(() => {
                if (clickCount.current === 1) onSingleClick();
                else if (clickCount.current === 2) onDoubleClick();

                clickCount.current = 0;
            }, latency);
        };

        clickRef.addEventListener("click", handleClick);
        return () => {
            if (!ref.current) return;
            ref.current.removeEventListener("click", handleClick);
        };
    }, [ref, latency, onSingleClick, onDoubleClick, clickCount]);
};

export default useDoubleClick;
