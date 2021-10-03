import { useEffect, useState } from "react";

const ProgressRing = ({
    className,
    radius,
    stroke,
    progress,
    color,
}: {
    className?: string;
    radius: number;
    stroke: number;
    progress: number;
    color: string;
}): JSX.Element => {
    const [normalizedRadius, setNormalizedRadius] = useState(0);
    const [circumference, setCircumference] = useState(0);
    const [strokeDashOffset, setStrokeDashOffset] = useState(0);

    useEffect(() => {
        const normRad = radius - stroke * 2;
        const circ = normRad * 2 * Math.PI;
        const dashOffset = circ - (progress / 100) * circ;

        setNormalizedRadius(normRad);
        setCircumference(circ);
        setStrokeDashOffset(dashOffset);
    }, [radius, stroke, progress]);

    return (
        <svg
            height={radius * 2}
            width={radius * 2}
            style={{
                transform: "rotate(-90deg)",
            }}
            className={className || ""}
        >
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset: strokeDashOffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
        </svg>
    );
};

export default ProgressRing;
