const Mathf: Math & {
    clamp: (value: number, min: number, max: number) => number;
    clamp01: (value: number) => number;
    lerp: (from: number, to: number, t: number) => number;
    inverseLerp: (from: number, to: number, value: number) => number;
    randomRange: (min: number, max: number) => number;
    easeIn: (t: number) => number;
    easeOut: (t: number) => number;
} = Object.create(Math);

Mathf.clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
};

Mathf.clamp01 = (value: number) => {
    return Math.max(0, Math.min(1, value));
};

Mathf.lerp = (from: number, to: number, t: number) => {
    return from + (to - from) * Mathf.clamp01(t);
};

Mathf.inverseLerp = (from: number, to: number, value: number) => {
    return Mathf.clamp01((value - from) / (to - from));
};

Mathf.randomRange = (min: number, max: number) => {
    return Mathf.lerp(min, max, Math.random());
};

Mathf.easeIn = (t: number) => {
    return Math.pow(t, 2.5);
};

Mathf.easeOut = (t: number) => {
    t = 1.0 - t;
    return Math.pow(t, 2.5);
};

export default Mathf;
