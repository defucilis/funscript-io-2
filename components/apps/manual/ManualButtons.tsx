import { useEffect, useRef, useState } from "react";
import {
    MdKeyboardArrowUp,
    MdKeyboardArrowLeft,
    MdPause,
    MdPlayArrow,
    MdKeyboardArrowRight,
    MdKeyboardArrowDown,
} from "react-icons/md";
import useDimensions from "lib/hooks/useDimensions";
import ManualButton from "./ManualButton";

const ManualButtons = ({
    loading,
    running,
    onButtonUp,
    onButtonDown,
    onButtonLeft,
    onButtonRight,
    onButtonCenter,
    targetHeight,
}: {
    loading: boolean;
    running: boolean;
    onButtonUp: () => void;
    onButtonDown: () => void;
    onButtonLeft: () => void;
    onButtonRight: () => void;
    onButtonCenter: () => void;
    targetHeight: number;
}): JSX.Element => {
    const cellRef = useRef<HTMLDivElement>(null);
    const { width, height } = useDimensions();
    const [cellSize, setCellSize] = useState(50);

    useEffect(() => {
        if (!cellRef.current) return;
        setCellSize(cellRef.current.clientWidth);
    }, [cellRef, width]);

    return (
        <div
            className="grid grid-rows-3 grid-cols-3 flex-grow gap-4 text-4xl text-neutral-900"
            style={{
                width: Math.min(targetHeight, height / 2),
                height: Math.min(targetHeight, height / 2),
            }}
        >
            <div ref={cellRef} className="col-start-2 row-start-1">
                <ManualButton
                    disabled={loading}
                    onClick={onButtonUp}
                    label="Slide +"
                    cellSize={cellSize}
                >
                    <MdKeyboardArrowUp />
                </ManualButton>
            </div>
            <div className="col-start-1 row-start-2">
                <ManualButton
                    disabled={loading}
                    onClick={onButtonLeft}
                    label="Speed -"
                    cellSize={cellSize}
                >
                    <MdKeyboardArrowLeft />
                </ManualButton>
            </div>
            <div className="col-start-2 row-start-2">
                <ManualButton
                    disabled={loading}
                    onClick={onButtonCenter}
                    label={running ? "Stop" : "Start"}
                    cellSize={cellSize}
                >
                    {running ? <MdPause /> : <MdPlayArrow />}
                </ManualButton>
            </div>
            <div className="col-start-3 row-start-2">
                <ManualButton
                    disabled={loading}
                    onClick={onButtonRight}
                    label="Speed +"
                    cellSize={cellSize}
                >
                    <MdKeyboardArrowRight />
                </ManualButton>
            </div>
            <div className="col-start-2 row-start-3">
                <ManualButton
                    disabled={loading}
                    onClick={onButtonDown}
                    label="Slide -"
                    cellSize={cellSize}
                >
                    <MdKeyboardArrowDown />
                </ManualButton>
            </div>
        </div>
    );
};

export default ManualButtons;
