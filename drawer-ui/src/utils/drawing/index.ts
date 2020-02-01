import { TinyColor } from '@ctrl/tinycolor';

const BASE64_REGEX = /\s*;\s*base64\s*(?:;|$)/i;

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

const dataToBlob = (
    dataURI: string,
    type: string,
    callback: (blob: Blob) => void,
) => {
    const decode = (base64: string) => {
        const base64Ranks = new Uint8Array([
            62,
            -1,
            -1,
            -1,
            63,
            52,
            53,
            54,
            55,
            56,
            57,
            58,
            59,
            60,
            61,
            -1,
            -1,
            -1,
            0,
            -1,
            -1,
            -1,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            -1,
            -1,
            -1,
            -1,
            -1,
            -1,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
        ]);
        let outptr = 0;
        const last = [0, 0];
        let state = 0;
        let save = 0;

        let undef;
        let len = base64.length;
        let i = 0;
        const buffer = new Uint8Array(((len / 4) * 3) | 0);
        while (len--) {
            const code = base64.charCodeAt(i++);
            const rank = base64Ranks[code - 43];
            if (rank !== 255 && rank !== undef) {
                last[1] = last[0];
                last[0] = code;
                save = (save << 6) | rank;
                state++;
                if (state === 4) {
                    buffer[outptr++] = save >>> 16;
                    if (last[1] !== 61 /* padding character */) {
                        buffer[outptr++] = save >>> 8;
                    }
                    if (last[0] !== 61 /* padding character */) {
                        buffer[outptr++] = save;
                    }
                    state = 0;
                }
            }
        }
        // 2/3 chance there's going to be some null bytes at the end, but that
        // doesn't really matter with most image formats.
        // If it somehow matters for you, truncate the buffer up outptr.
        return buffer.buffer;
    };
    const headerEnd = dataURI.indexOf(',');
    const data = dataURI.substring(headerEnd + 1);
    const isBase64 = BASE64_REGEX.test(dataURI.substring(0, headerEnd));

    const blobData = isBase64 ? decode(data) : decodeURIComponent(data);
    const blob = new Blob([blobData], { type: type });
    callback(blob);
};

export const canvasToBlob = (
    canvas: HTMLCanvasElement,
    callback: (blob: Blob) => void,
    type: string,
    ...args: any
) => {
    type = type || 'image/png';

    const dataURI = canvas.toDataURL(...args);
    dataToBlob(dataURI, type, callback);
};

export const stringToBlob = (
    string: string,
    callback: (blob: Blob) => void,
    type: string,
) => {
    type = type || 'text/plain';
    dataToBlob('data:' + type + ',' + string, type, callback);
};
