import * as React from 'react';
import Frame from '../../../../models/Frame';
import useCanvasRef from '../../../hooks/useCanvasRef';
import constants from '../../../../constants';
import { colorToInt } from '../../../../utils/drawing';

const imageDataPool: {
    [imageDataKey: string]: ImageData;
} = {};

const offCanvasPool: {
    [offCanvasKey: string]: HTMLCanvasElement & {
        context?: CanvasRenderingContext2D;
    };
} = {};

const createCanvas = (
    width: number,
    height: number,
    classList?: Array<string>,
) => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());

    if (classList) {
        for (let i = 0; i < classList.length; i++) {
            canvas.classList.add(classList[i]);
        }
    }

    return canvas;
};

const drawFrameToCanvas = (
    frame: Frame,
    canvas: HTMLCanvasElement,
    transparentColor: string,
    globalAlpha = 1,
) => {
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('browser not support canvas');
    }
    context.globalAlpha = globalAlpha;
    transparentColor = transparentColor || constants.TRANSPARENT_COLOR;

    const w = frame.width;
    const h = frame.height;
    let pixels = frame.pixels;

    // Replace transparent color
    const constantTransparentColorInt = colorToInt(constants.TRANSPARENT_COLOR);
    const transparentColorInt = colorToInt(transparentColor);
    if (transparentColorInt != constantTransparentColorInt) {
        pixels = frame.getPixels();
        for (let i = 0, length = pixels.length; i < length; i++) {
            if (pixels[i] == constantTransparentColorInt) {
                pixels[i] = transparentColorInt;
            }
        }
    }

    // Imagedata from cache
    const imageDataKey = w + '-' + h;
    let imageData;
    if (!imageDataPool[imageDataKey]) {
        imageData = imageDataPool[imageDataKey] = context.createImageData(w, h);
    } else {
        imageData = imageDataPool[imageDataKey];
    }

    // Convert to uint8 and set the data
    const data = new Uint8ClampedArray(pixels.buffer);
    const imgDataData = imageData.data;
    imgDataData.set(data);

    // Offcanvas from cache
    const offCanvasKey = w + '-' + h;
    let offCanvas: HTMLCanvasElement & { context?: CanvasRenderingContext2D };
    if (!offCanvasPool[offCanvasKey]) {
        offCanvas = offCanvasPool[offCanvasKey] = createCanvas(w, h);
        offCanvas.context = offCanvas.getContext('2d') || undefined;
    } else {
        offCanvas = offCanvasPool[offCanvasKey];
    }
    if (!offCanvas.context) {
        throw new Error("something wrong because of 'null' contexts");
    }

    // Put pixel data to offcanvas and draw the offcanvas onto the canvas
    offCanvas.context.putImageData(imageData, 0, 0);
    context.drawImage(offCanvas, 0, 0, w, h);
    context.globalAlpha = 1;
};

type FrameRenderProps = {
    className?: string;
    frame: Frame;
    zoom: number;
};
const FrameRender: React.FunctionComponent<FrameRenderProps> = ({
    frame,
    zoom,
    className = '',
}) => {
    const [canvasRef, canvasRefCallback] = useCanvasRef();

    React.useEffect(() => {
        drawFrameToCanvas(
            frame,
            canvasRef.current,
            constants.TRANSPARENT_COLOR,
        );
    }, [frame, zoom]);

    return (
        <canvas
            width={frame.width}
            height={frame.height}
            className={className}
            ref={canvasRefCallback}
        ></canvas>
    );
};

export default FrameRender;
