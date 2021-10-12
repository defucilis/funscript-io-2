import { Action, Funscript } from "./types";
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
    return "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + alpha + ")";
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
    /** Whether to draw a background, and what color it should be (default is undefined, which creates a transparent-background heatmap) */
    background?: string;
    /** The width of the lines that are drawn to the canvas - default is 2px. Has no effect in solid mode */
    lineWidth?: number;
    /** Over how many pixels the color should be smoothed - default is 5px */
    colorSmoothing?: number;
    /** If true, the heatmap will be a solid gradient. Otherwise, actions will be drawn, demonstrating the stroke lengths over time */
    solid?: boolean;
}
const defaultHeatmapOptions: HeatmapOptions = {
    lineWidth: 2,
    colorSmoothing: 5,
};
/**
 * Renders a heatmap into a provided HTML5 Canvas
 * @param  {HTMLCanvasElement} canvas - HTML5 Canvas to be rendered into
 * @param  {Funscript} script - Funscript to render the heatmap from
 * @param  {HeatmapOptions|undefined=undefined} options - Rendering options
 */
export const renderHeatmap = (
    canvas: HTMLCanvasElement,
    script?: Funscript,
    options?: HeatmapOptions
): void => {
    if (options) options = { ...defaultHeatmapOptions, ...options };
    else options = { ...defaultHeatmapOptions };

    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!script || width === 0 || height === 0) {
        ctx.clearRect(0, 0, width, height);
        return;
    }

    if (options.background) {
        ctx.fillStyle = options.background;
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }

    const duration = script.metadata?.duration || script.actions.slice(-1)[0].at;

    let currentIndex = 0;
    const pixelColors: ColorGroup[] = [];
    const pixelBounds: { min: number; max: number }[] = [];
    const pixelCounts: number[] = [];

    //first, we get the target color of each pixel
    for (let i = 0; i < width; i++) {
        const pixelTimeBounds = {
            min: (i / width) * duration,
            max: ((i + 1) / width) * duration,
        };
        const currentPixel: {
            last: Action;
            cur: Action;
        }[] = [];
        while (
            currentIndex < script.actions.length &&
            script.actions[currentIndex].at < pixelTimeBounds.max
        ) {
            if (currentIndex > 0) {
                currentPixel.push({
                    last: script.actions[currentIndex - 1],
                    cur: script.actions[currentIndex],
                });
            }
            currentIndex++;
        }
        const speedSum =
            currentPixel.reduce((acc, p) => {
                return acc + getSpeed(p.last, p.cur);
            }, 0) / (currentPixel.length || 1);
        pixelColors.push(getColor(speedSum));

        const min = currentPixel.reduce((acc, p) => Math.min(acc, p.cur.pos), 100);
        const max = currentPixel.reduce((acc, p) => Math.max(acc, p.cur.pos), 0);
        pixelBounds.push({ min, max });

        pixelCounts.push(currentPixel.length);
    }

    const colorSmoothing = options.colorSmoothing || 5;
    const colorAverage: ColorGroup[] = [];
    pixelColors.forEach((color, x) => {
        if (pixelCounts[x] > 0 || options?.solid) {
            if (colorAverage.length === colorSmoothing) colorAverage.shift();
            colorAverage.push(color);
        }
        const col = getAverageColor(colorAverage);
        ctx.fillStyle = formatColor(col);
        ctx.fillRect(x - Math.floor(colorSmoothing * 0.5), 0, 1, options?.solid ? height : 1);
    });

    if (options?.solid) return;

    const colors = ctx.getImageData(0, 0, width, 1).data;

    //we just did this to get the smooth colors, now we can clear and draw the actual lines
    if (options.background) {
        ctx.fillStyle = options.background;
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }

    ctx.lineWidth = options.lineWidth || 2;

    const timeToX = (time: number) => (time / duration) * width;
    const posToY = (pos: number) => (1 - pos / 100) * height;
    for (let i = 1; i < script.actions.length; i++) {
        const action = script.actions[i];
        const prevAction = script.actions[i - 1];

        const x = Math.floor(timeToX((action.at + prevAction.at) / 2));
        ctx.strokeStyle = `rgba(${colors[x * 4]}, ${colors[x * 4 + 1]}, ${colors[x * 4 + 2]}, ${
            colors[x * 4 + 3]
        })`;
        ctx.beginPath();
        ctx.moveTo(timeToX(prevAction.at), posToY(prevAction.pos));
        ctx.lineTo(timeToX(action.at), posToY(action.pos));
        ctx.stroke();
    }
};
export interface ActionsOptions {
    /** Whether to clear the canvas before drawing. Defaults to true */
    clear?: boolean;
    /** Background style for the canvas - defaults to black */
    background?: string;
    /** Line color for the actions - defaults to white */
    lineColor?: string;
    /** Line weight - defaults to 3 */
    lineWeight?: number;
    /** Start time in ms - defaults to zero */
    startTime?: number;
    /** Duration to display in ms - defaults to the full duration of the script */
    duration?: number;
    /** Whether to only show the times as vertical lines, without position information */
    onlyTimes?: boolean;
    /** The color to draw the 'only times' lines */
    onlyTimeColor?: string;
    /** A global offset to apply to all actions - useful for displaying multiple scripts on the same canvas */
    offset?: { x: number; y: number };
    /** The current time in ms, for use in displaying realtime playback information. If undefined, realtime playback info won't be displayed */
    currentTime?: number;
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
    currentTime: undefined,
};
/**
 * Renders a funscript preview onto a provided HTML5 Canvas
 * @param  {HTMLCanvasElement} canvas - HTML5 Canvas to be rendered into
 * @param  {Funscript} script - Funscript to generate preview from
 * @param  {ActionsOptions} options? - Rendering options
 */
export const renderActions = (
    canvas: HTMLCanvasElement,
    script?: Funscript,
    options?: ActionsOptions
): void => {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!script) {
        ctx.clearRect(0, 0, width, height);
        return;
    }

    options = { ...defaultActionsOptions, ...options };

    const position = options.startTime || 0;
    const duration =
        options.duration || script.metadata?.duration || script.actions.slice(-1)[0].at;
    const min = position;
    const max = min + duration;

    const timeToX = (time: number, offset = 0) => {
        return width * ((time - min) / duration) + offset;
    };
    const posToY = (pos: number, offset = 0) => {
        return height - (pos / 100) * height + offset;
    };

    const posAtTime = (time: number) => {
        if (time <= script.actions[0].at) return script.actions[0].pos;
        if (time >= script.actions.slice(-1)[0].at) return script.actions.slice(-1)[0].pos;
        for (let i = 1; i < script.actions.length; i++) {
            if (time > script.actions[i].at) continue;
            const inverseLerp =
                (time - script.actions[i - 1].at) /
                (script.actions[i].at - script.actions[i - 1].at);
            return (
                script.actions[i - 1].pos +
                (script.actions[i].pos - script.actions[i - 1].pos) * inverseLerp
            );
        }
        return script.actions.slice(-1)[0].pos;
    };

    const drawPath = (ctx: CanvasRenderingContext2D, funscript: Funscript, opt: ActionsOptions) => {
        ctx.beginPath();
        let first = true;
        funscript.actions
            .filter((a, i) => {
                const prev = i === 0 ? a : funscript.actions[i - 1];
                const next = i === funscript.actions.length - 1 ? a : funscript.actions[i + 1];
                return next.at > min && prev.at < max;
            })
            .forEach(action => {
                const x = timeToX(action.at, opt?.offset?.x || 0);
                const y = posToY(action.pos, opt?.offset?.y || 0);

                if (first) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);

                if (opt && opt.onlyTimes) ctx.fillRect(x - 1, 0, 2, height);

                first = false;
            });
        if (!opt.onlyTimes) ctx.stroke();
    };

    if (options.clear) ctx.clearRect(0, 0, width, height);

    if (options.clear) {
        ctx.fillStyle = options.background || "#000";
        ctx.fillRect(0, 0, width, height);
    }

    ctx.lineWidth = options.lineWeight || 3;

    ctx.strokeStyle = options.lineColor || "#FFF";
    ctx.fillStyle = options.onlyTimeColor || "rgba(255,255,255,0.1)";
    drawPath(ctx, script, options);

    if (options.currentTime != null) {
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const x = timeToX(options.currentTime);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        ctx.beginPath();
        const y = posToY(posAtTime(options.currentTime));
        ctx.arc(x, y, (options.lineWeight || 3) * 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFF";
        ctx.fill();
    }

    ctx.fillStyle = "white";
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.textAlign = "left";
    ctx.lineWidth = 1;
    for (let i = 0; i < script.actions.slice(-1)[0].at; i += 1000) {
        const x = timeToX(i);
        if (i % 5000 === 0) ctx.fillText(String(Math.round(i / 1000)), x, height - 5);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
};
