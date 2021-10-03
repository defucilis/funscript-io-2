import { Funscript } from "./types";
import { getSpeed } from "./utils";

//colors from Lucife
type ColorGroup = number[];
export const heatmapColors: ColorGroup[] = [
    [0, 0, 0],
    [30, 144, 255],
    [34, 139, 34],
    [255, 215, 0],
    [220, 20, 60],
    [147, 112, 219],
    [37, 22, 122],
];
/**
 * Converts a three-element RGB array of colors into a CSS rgb color string
 * @param  {ColorGroup} c - Array of three color (RGB)
 * @param  {number} alpha=1 - Optional alpha value
 * @returns {string} CSS color string
 */
export const formatColor = (c: ColorGroup, alpha = 1): string => {
    return "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + alpha + ")";
};

const getLerpedColor = (colorA: ColorGroup, colorB: ColorGroup, t: number) =>
    colorA.map((c, index) => c + (colorB[index] - c) * t);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAverageColor = (colors: ColorGroup[]) => {
    const colorSum = colors.reduce(
        (acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]],
        [0, 0, 0]
    );
    return [colorSum[0] / colors.length, colorSum[1] / colors.length, colorSum[2] / colors.length];
};

/**
 * Converts a intensity/speed value into a heatmap color. Adapted from Lucifie's heatmap generation script.
 * @param  {number} intensity - Speed value, in 0-100 movements per second
 * @returns Three-element array of R, G and B color values (0-255)
 */
export const getColor = (intensity: number): ColorGroup => {
    //console.log(intensity);
    const stepSize = 120;
    if (intensity <= 0) return heatmapColors[0];
    if (intensity > 5 * stepSize) return heatmapColors[6];
    intensity += stepSize / 2.0;
    try {
        return getLerpedColor(
            heatmapColors[Math.floor(intensity / stepSize)],
            heatmapColors[1 + Math.floor(intensity / stepSize)],
            Math.min(
                1.0,
                Math.max(0.0, (intensity - Math.floor(intensity / stepSize) * stepSize) / stepSize)
            )
        );
    } catch (error) {
        //console.error("Failed on intensity", intensity, error);
        return [0, 0, 0];
    }
};

export interface HeatmapOptions {
    background?: string;
    showStrokeLength?: boolean;
    gapThreshold?: number;
}
const defaultHeatmapOptions: HeatmapOptions = {
    showStrokeLength: true,
    gapThreshold: 5000,
};
/**
 * Renders a heatmap into a provided HTML5 Canvas
 * @param  {HTMLCanvasElement} canvas - HTML5 Canvas to be rendered into
 * @param  {Funscript} script - Funscript to render the heatmap from
 * @param  {HeatmapOptions|undefined=undefined} options - Rendering options
 */
export const renderHeatmap = (
    canvas: HTMLCanvasElement,
    script: Funscript,
    options: HeatmapOptions | undefined = undefined
): void => {
    if (options) options = { ...defaultHeatmapOptions, ...options };
    else options = { ...defaultHeatmapOptions };

    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (options.background) {
        ctx.fillStyle = options.background;
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }

    const msToX = width / script.actions.slice(-1)[0].at;

    let colorAverageList: ColorGroup[] = [];
    let intensityList: number[] = [];
    let posList: number[] = [];
    let yMaxList = [script.actions[0].pos];
    let yMinList = [script.actions[0].pos];
    const yWindowSize = 15;
    const xWindowSize = 50;
    let lastX = 0;
    for (let i = 1; i < script.actions.length; i++) {
        const x = Math.floor(msToX * script.actions[i].at);

        if (
            options.gapThreshold &&
            script.actions[i].at - script.actions[i - 1].at > options.gapThreshold
        ) {
            colorAverageList = [];
            intensityList = [];
            posList = [];
            yMaxList = [script.actions[i].pos];
            yMinList = [script.actions[i].pos];
            lastX = x;
            continue;
        }

        const intensity = getSpeed(script.actions[i - 1], script.actions[i]);
        intensityList.push(intensity);
        colorAverageList.push(getColor(intensity));
        posList.push(script.actions[i].pos);

        if (intensityList.length > xWindowSize) intensityList = intensityList.slice(1);
        if (colorAverageList.length > xWindowSize) colorAverageList = colorAverageList.slice(1);
        if (posList.length > yWindowSize) posList = posList.slice(1);

        const averageIntensity =
            intensityList.reduce((acc, cur) => acc + cur, 0) / intensityList.length;
        //const averageColor = getAverageColor(colorAverageList);
        const averageColor = getColor(averageIntensity);
        const sortedPos = [...posList].sort((a, b) => a - b);
        const bottomHalf = sortedPos.slice(0, sortedPos.length / 2);
        const topHalf = sortedPos.slice(sortedPos.length / 2);
        const averageBottom = bottomHalf.reduce((acc, cur) => acc + cur, 0) / bottomHalf.length;
        const averageTop = topHalf.reduce((acc, cur) => acc + cur, 0) / topHalf.length;

        yMaxList.push(script.actions[i].pos);
        yMinList.push(script.actions[i].pos);

        if (yMinList.length > yWindowSize) yMinList = yMinList.slice(1);
        if (yMaxList.length > yWindowSize) yMaxList = yMaxList.slice(1);

        const y2 = height * (averageBottom / 100.0);
        const y1 = height * (averageTop / 100.0);

        ctx.fillStyle = formatColor(averageColor, 1);
        if (options.showStrokeLength) {
            ctx.fillRect(lastX, height - y2, x - lastX, y2 - y1);
        } else {
            ctx.fillRect(lastX, 0, x - lastX, height);
        }

        lastX = x;
    }
};

export interface ActionsOptions {
    clear?: boolean;
    background?: string;
    lineColor?: string;
    lineWeight?: number;
    startTime?: number;
    duration?: number;
    onlyTimes?: boolean;
    onlyTimeColor?: string;
    offset?: { x: number; y: number };
}

const defaultActionsOptions: ActionsOptions = {
    clear: true,
    background: "#000",
    lineColor: "#FFF",
    lineWeight: 3,
    startTime: 0,
    onlyTimes: false,
    onlyTimeColor: "rgba(255,255,255,0.1)",
    offset: { x: 0, y: 0 },
};
/**
 * Renders a funscript preview onto a provided HTML5 Canvas
 * @param  {HTMLCanvasElement} canvas - HTML5 Canvas to be rendered into
 * @param  {Funscript} script - Funscript to generate preview from
 * @param  {ActionsOptions} options? - Rendering options
 */
export const renderActions = (
    canvas: HTMLCanvasElement,
    script: Funscript,
    options?: ActionsOptions
): void => {
    const drawPath = (ctx: CanvasRenderingContext2D, funscript: Funscript, opt: ActionsOptions) => {
        const position = opt.startTime || 0;
        const duration = opt.duration || (script.metadata ? script.metadata.duration || 10 : 10);

        const scriptDuration = funscript.actions.slice(-1)[0].at;
        const min = Math.max(0, scriptDuration * position - duration * 0.5);
        const max = min + duration;

        ctx.beginPath();
        let first = true;
        funscript.actions
            .filter((a, i) => {
                const prev = i === 0 ? a : funscript.actions[i - 1];
                const next = i === funscript.actions.length - 1 ? a : funscript.actions[i + 1];
                return next.at > min && prev.at < max;
            })
            .forEach(action => {
                const x =
                    (width * (action.at - min)) / duration + (opt && opt.offset ? opt.offset.x : 0);
                const y =
                    height - (action.pos / 100) * height + (opt && opt.offset ? opt.offset.y : 0);

                if (first) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);

                if (opt && opt.onlyTimes) ctx.fillRect(x - 1, 0, 2, height);

                first = false;
            });
        if (!opt.onlyTimes) ctx.stroke();
    };

    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    options = { ...defaultActionsOptions, ...options };

    if (options.clear) ctx.clearRect(0, 0, width, height);

    if (options.clear) {
        ctx.fillStyle = options.background || "#000";
        ctx.fillRect(0, 0, width, height);
    }

    ctx.lineWidth = options.lineWeight || 3;

    ctx.strokeStyle = options.lineColor || "#FFF";
    ctx.fillStyle = options.onlyTimeColor || "rgba(255,255,255,0.1)";
    drawPath(ctx, script, options);
};
