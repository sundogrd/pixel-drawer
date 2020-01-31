import { TinyColor } from '@ctrl/tinycolor';

const colorCache: {
    [color: string]: number;
} = {};
const colorCacheReverse: {
    [color: string]: string;
} = {};
export const colorToInt = function(color: string | number) {
    if (typeof color === 'number') {
        return color;
    }

    if (typeof colorCache[color] !== 'undefined') {
        return colorCache[color];
    }

    const tc = new TinyColor(color);
    const rgb = tc.toRgb();
    const a = Math.round(rgb.a * 255);
    let intValue = ((a << 24) >>> 0) + (rgb.b << 16) + (rgb.g << 8) + rgb.r;
    if (a === 0) {
        // assign all 'transparent' colors to 0, theoretically mapped to rgba(0,0,0,0) only
        intValue = 0;
    }
    colorCache[color] = intValue;
    colorCacheReverse[intValue] = color;
    return intValue;
};

export const intToColor = (intValue: number) => {
    if (typeof intValue === 'string') {
        return intValue;
    }

    if (typeof colorCacheReverse[intValue] !== 'undefined') {
        return colorCacheReverse[intValue];
    }

    const r = intValue & 0xff;
    const g = (intValue >> 8) & 0xff;
    const b = (intValue >> 16) & 0xff;
    const a = (((intValue >> 24) >>> 0) & 0xff) / 255;
    const color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

    colorCache[color] = intValue;
    colorCacheReverse[intValue] = color;
    return color;
};
