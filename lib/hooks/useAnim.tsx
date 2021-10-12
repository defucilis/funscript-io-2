import { useRef, useEffect } from "react";

const useAnim = (
    callback?: (runTime: number, deltaTime: number) => void,
    dependencies?: React.DependencyList
): void => {
    const animationRef = useRef<number>();
    const prevTimeRef = useRef<number>();
    const startTimeRef = useRef<number>();
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        const tick = () => {
            const time = performance.now();
            const handle = animationRef.current;

            if (!startTimeRef.current) {
                startTimeRef.current = time;
            }
            if (!prevTimeRef.current) {
                prevTimeRef.current = time;
                animationRef.current = requestAnimationFrame(tick);
                return;
            }

            const deltaTime = (time - (prevTimeRef.current || 0)) / 1000.0;
            const runTime = (time - startTimeRef.current) / 1000.0;

            if (savedCallback.current) savedCallback.current(runTime, deltaTime);

            prevTimeRef.current = time;
            if (animationRef.current === handle) animationRef.current = requestAnimationFrame(tick);
        };

        animationRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(animationRef.current || -1);
        };
    }, dependencies);
};

export default useAnim;
