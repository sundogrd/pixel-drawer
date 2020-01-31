import { colorToInt } from '../utils/drawing';
import constants from '../constants';
import uuidv4 from 'uuid/v4';

const _emptyPixelGridCache: {
    [key: string]: any;
} = {};
const createEmptyPixelGrid_ = (width: number, height: number) => {
    let pixels: Uint32Array;
    const key = width + '-' + height;
    if (_emptyPixelGridCache[key]) {
        pixels = _emptyPixelGridCache[key];
    } else {
        pixels = _emptyPixelGridCache[key] = new Uint32Array(width * height);
        // const transparentColorInt = colorToInt(constants.TRANSPARENT_COLOR);
        const transparentColorInt = colorToInt('rgba(125,42,12, 0.6)');
        pixels.fill(transparentColorInt);
    }

    return new Uint32Array(pixels);
};

class Frame {
    width: number;
    height: number;
    id: string;
    version: number;
    pixels: Uint32Array;
    stateIndex: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.id = uuidv4();
        this.version = 0;
        this.pixels = createEmptyPixelGrid_(width, height);
        this.stateIndex = 0; // for history
    }

    static createEmptyFromFrame(frame: Frame) {
        return new Frame(frame.width, frame.height);
    }

    fromPixelGrid(pixels: Uint32Array, width: number, height: number) {
        const frame = new Frame(width, height);
        frame.setPixels(pixels);
        return frame;
    }

    setPixels(pixels: Uint32Array) {
        this.pixels = new Uint32Array(pixels);
        this.version++;
    }
    /**
     * Returns a copy of the pixels used by the frame
     */
    getPixels() {
        return new Uint32Array(this.pixels);
    }
    clear() {
        this.pixels = createEmptyPixelGrid_(this.width, this.height);
        this.version++;
    }
    containsPixel(col: number, row: number) {
        return col >= 0 && row >= 0 && col < this.width && row < this.height;
    }

    clone() {
        const clone = new Frame(this.width, this.height);
        clone.setPixels(this.pixels);
        return clone;
    }

    get hash() {
        return [this.id, this.version].join('-');
    }

    setPixel(x: number, y: number, color: string | number) {
        if (this.containsPixel(x, y)) {
            const index = y * this.width + x;
            const p = this.pixels[index];
            color = colorToInt(color);

            if (p !== color) {
                this.pixels[index] =
                    color || colorToInt(constants.TRANSPARENT_COLOR);
                this.version++;
            }
        }
    }
    getPixel(x: number, y: number) {
        if (this.containsPixel(x, y)) {
            return this.pixels[y * this.width + x];
        } else {
            return null;
        }
    }
    forEachPixel(
        callback: (
            bitIndex: number,
            col: number,
            row: number,
            frame: Frame,
        ) => void,
    ) {
        const width = this.width;
        const height = this.height;
        const length = width * height;
        for (let i = 0; i < length; i++) {
            callback(this.pixels[i], i % width, Math.floor(i / width), this);
        }
    }
    isSameSize(otherFrame: Frame) {
        return (
            this.height === otherFrame.height && this.width === otherFrame.width
        );
    }
}

export default Frame;
