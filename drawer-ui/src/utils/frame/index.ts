import Frame from '../../models/Frame';
import { colorToInt } from '../drawing';
import constants from '../../constants';

const colorCache = {};
const imageDataPool: {
    [imageDataKey: string]: ImageData;
} = {};

const offCanvasPool: {
    [offCanvasKey: string]: HTMLCanvasElement & {
        context?: CanvasRenderingContext2D;
    };
} = {};

export const toImage = (frame: Frame, zoom = 1, opacity = 1) => {};

// (function () {
//     const ns = $.namespace('pskl.utils');

//     ns.FrameUtils = {
//         /**
//        * Render a Frame object as an image.
//        * Can optionally scale it (zoom)
//        * @param frame {Frame} frame
//        * @param zoom {Number} zoom
//        * @return {Image}
//        */
//         toImage : function (frame, zoom, opacity) {
//             zoom = zoom || 1;
//             opacity = isNaN(opacity) ? 1 : opacity;

//             const canvasRenderer = new pskl.rendering.CanvasRenderer(frame, zoom);
//             canvasRenderer.drawTransparentAs(Constants.TRANSPARENT_COLOR);
//             canvasRenderer.setOpacity(opacity);
//             return canvasRenderer.render();
//         },

//         /**
//        * Draw the provided frame in a 2d canvas
//        *
//        * @param {Frame|RenderedFrame} frame the frame to draw
//        * @param {Canvas} canvas the canvas target
//        * @param {String} transparentColor (optional) color to use to represent transparent pixels.
//        * @param {String} globalAlpha (optional) global frame opacity
//        */
//         drawToCanvas : function (frame, canvas, transparentColor, globalAlpha) {
//             const context = canvas.getContext('2d');
//             globalAlpha = isNaN(globalAlpha) ? 1 : globalAlpha;
//             context.globalAlpha = globalAlpha;
//             transparentColor = transparentColor || Constants.TRANSPARENT_COLOR;

//             if (frame instanceof pskl.model.frame.RenderedFrame) {
//                 context.fillRect(transparentColor, 0, 0, frame.getWidth(), frame.getHeight());
//                 context.drawImage(frame.getRenderedFrame(), 0, 0);
//             } else {
//                 const w = frame.getWidth();
//                 const h = frame.getHeight();
//                 let pixels = frame.pixels;

//                 // Replace transparent color
//                 const constantTransparentColorInt = pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR);
//                 const transparentColorInt = pskl.utils.colorToInt(transparentColor);
//                 if (transparentColorInt != constantTransparentColorInt) {
//                     pixels = frame.getPixels();
//                     for (let i = 0, length = pixels.length; i < length; i++) {
//                         if (pixels[i] == constantTransparentColorInt) {
//                             pixels[i] = transparentColorInt;
//                         }
//                     }
//                 }

//                 // Imagedata from cache
//                 const imageDataKey = w + '-' + h;
//                 let imageData;
//                 if (!imageDataPool[imageDataKey]) {
//                     imageData = imageDataPool[imageDataKey] = context.createImageData(w, h);
//                 } else {
//                     imageData = imageDataPool[imageDataKey];
//                 }

//                 // Convert to uint8 and set the data
//                 const data = new Uint8ClampedArray(pixels.buffer);
//                 const imgDataData = imageData.data;
//                 imgDataData.set(data);

//                 // Offcanvas from cache
//                 const offCanvasKey = w + '-' + h;
//                 let offCanvas;
//                 if (!offCanvasPool[offCanvasKey]) {
//                     offCanvas = offCanvasPool[offCanvasKey] = pskl.utils.CanvasUtils.createCanvas(w, h);
//                     offCanvas.context = offCanvas.getContext('2d');
//                 } else {
//                     offCanvas = offCanvasPool[offCanvasKey];
//                 }

//                 // Put pixel data to offcanvas and draw the offcanvas onto the canvas
//                 offCanvas.context.putImageData(imageData, 0, 0);
//                 context.drawImage(offCanvas, 0, 0, w, h);
//                 context.globalAlpha = 1;
//             }
//         },

//         /**
//        * Render a line of a single color in a given canvas 2D context.
//        *
//        * @param  color {String} color to draw
//        * @param  x {Number} x coordinate
//        * @param  y {Number} y coordinate
//        * @param  width {Number} width of the line to draw, in pixels
//        * @param  context {CanvasRenderingContext2D} context of the canvas target
//        */
//         renderLine_ : function (color, x, y, width, context) {
//             if (color === Constants.TRANSPARENT_COLOR || color === null) {
//                 return;
//             }
//             context.fillStyle = color;
//             context.fillRect(x, y, 1, width);
//         },

//         merge : function (frames) {
//             let merged = null;
//             if (frames.length) {
//                 merged = frames[0].clone();
//                 for (let i = 1 ; i < frames.length ; i++) {
//                     pskl.utils.FrameUtils.mergeFrames_(merged, frames[i]);
//                 }
//             }
//             return merged;
//         },

//         mergeFrames_ : function (frameA, frameB) {
//             const transparentColorInt = pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR);
//             for (let i = 0, length = frameA.getWidth() * frameA.getHeight(); i < length; ++i) {
//                 if (frameB.pixels[i] != transparentColorInt && frameA.pixels[i] != frameB.pixels[i]) {
//                     frameA.pixels[i] = frameB.pixels[i];
//                 }
//             }
//         },

//         /**
//        * Insert the provided image in the provided frame, at the x, y sprite coordinates.
//        * Coordinates will be adjusted so that the image fits in the frame, if possible.
//        */
//         addImageToFrame: function (frame, image, x, y) {
//             const imageFrame = pskl.utils.FrameUtils.createFromImage(image);
//             x = x - Math.floor(imageFrame.width / 2);
//             y = y - Math.floor(imageFrame.height / 2);

//             x = Math.max(0, x);
//             y = Math.max(0, y);

//             if (imageFrame.width <= frame.width) {
//                 x = Math.min(x, frame.width - imageFrame.width);
//             }

//             if (imageFrame.height <= frame.height) {
//                 y = Math.min(y, frame.height - imageFrame.height);
//             }

//             imageFrame.forEachPixel(function (color, frameX, frameY) {
//                 if (color != pskl.utils.colorToInt(Constants.TRANSPARENT_COLOR)) {
//                     frame.setPixel(x + frameX, y + frameY, color);
//                 }
//             });
//         },

//         resize : function (frame, targetWidth, targetHeight, smoothing) {
//             const image = pskl.utils.FrameUtils.toImage(frame);
//             const resizedImage = pskl.utils.ImageResizer.resize(image, targetWidth, targetHeight, smoothing);
//             return pskl.utils.FrameUtils.createFromImage(resizedImage);
//         },

//         removeTransparency : function (frame) {
//             frame.forEachPixel(function (color, x, y) {
//                 const alpha = color >> 24 >>> 0 & 0xff;
//                 if (alpha && alpha !== 255) {
//                     const rounded = Math.round(alpha / 255) * 255;
//                     const roundedColor = color - (alpha << 24 >>> 0) + (rounded << 24 >>> 0);
//                     frame.setPixel(x, y, roundedColor);
//                 }
//             });
//         },

//         createFromCanvas : function (canvas, x, y, w, h, preserveOpacity) {
//             const imgData = canvas.getContext('2d').getImageData(x, y, w, h).data;
//             return pskl.utils.FrameUtils.createFromImageData_(imgData, w, h, preserveOpacity);
//         },

//         createFromImageSrc : function (src, preserveOpacity, cb) {
//             const image = new Image();
//             image.addEventListener('load', function onImageLoaded() {
//                 image.removeEventListener('load', onImageLoaded);
//                 const frame = ns.FrameUtils.createFromImage(image, preserveOpacity);
//                 cb(frame);
//             });
//             image.src = src;
//         },

//         /*
//        * Create a pskl.model.Frame from an Image object. By default transparent
//        * pixels will be converted to completely opaque or completely transparent
//        * pixels. If preserveOpacity is true the actual opacity of the pixel will
//        * be used and the generated frame will contain rgba pixels.
//        *
//        * @param  {Image} image source image
//        * @param  {boolean} preserveOpacity set to true to preserve the opacity
//        * @return {pskl.model.Frame} corresponding frame
//        */
//         createFromImage : function (image, preserveOpacity) {
//             const w = image.width;
//             const h = image.height;
//             const canvas = pskl.utils.CanvasUtils.createCanvas(w, h);
//             const context = canvas.getContext('2d');

//             context.drawImage(image, 0, 0, w, h, 0, 0, w, h);
//             const imgData = context.getImageData(0, 0, w, h).data;
//             return pskl.utils.FrameUtils.createFromImageData_(imgData, w, h, preserveOpacity);
//         },

//         createFromImageData_ : function (imageData, width, height, preserveOpacity) {
//             const frame = new pskl.model.Frame(width, height);
//             frame.pixels = new Uint32Array(imageData.buffer);
//             if (!preserveOpacity) {
//                 pskl.utils.FrameUtils.removeTransparency(frame);
//             }

//             return frame;
//         },

//         /**
//        * Create a Frame array from an Image object.
//        * Transparent pixels will either be converted to completely opaque or completely transparent pixels.
//        *
//        * @param  {Image} image source image
//        * @param  {Number} frameCount number of frames in the spritesheet
//        * @return {Array<Frame>}
//        */
//         createFramesFromSpritesheet : function (image, frameCount) {
//             const layout = [];
//             for (let i = 0 ; i < frameCount ; i++) {
//                 layout.push([i]);
//             }
//             const chunkFrames = pskl.utils.FrameUtils.createFramesFromChunk(image, layout);
//             return chunkFrames.map(function (chunkFrame) {
//                 return chunkFrame.frame;
//             });
//         },

//         /**
//        * Create a Frame array from an Image object.
//        * Transparent pixels will either be converted to completely opaque or completely transparent pixels.
//        *
//        * @param  {Image} image source image
//        * @param  {Array <Array>} layout description of the frame indexes expected to be found in the chunk
//        * @return {Array<Object>} array of objects containing: {index: frame index, frame: frame instance}
//        */
//         createFramesFromChunk : function (image, layout) {
//             const width = image.width;
//             const height = image.height;

//             // Recalculate the expected frame dimensions from the layout information
//             const frameWidth = width / layout.length;
//             const frameHeight = height / layout[0].length;

//             // Create a canvas adapted to the image size
//             const canvas = pskl.utils.CanvasUtils.createCanvas(frameWidth, frameHeight);
//             const context = canvas.getContext('2d');

//             // Draw the zoomed-up pixels to a different canvas context
//             const chunkFrames = [];
//             for (let i = 0 ; i < layout.length ; i++) {
//                 const row = layout[i];
//                 for (let j = 0 ; j < row.length ; j++) {
//                     context.clearRect(0, 0 , frameWidth, frameHeight);
//                     context.drawImage(image, frameWidth * i, frameHeight * j,
//                         frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
//                     const frame = pskl.utils.FrameUtils.createFromCanvas(canvas, 0, 0, frameWidth, frameHeight);
//                     chunkFrames.push({
//                         index : layout[i][j],
//                         frame : frame
//                     });
//                 }
//             }

//             return chunkFrames;
//         },

//         toFrameGrid : function (normalGrid) {
//             const frameGrid = [];
//             const w = normalGrid[0].length;
//             const h = normalGrid.length;
//             for (let x = 0 ; x < w ; x++) {
//                 frameGrid[x] = [];
//                 for (let y = 0 ; y < h ; y++) {
//                     frameGrid[x][y] = normalGrid[y][x];
//                 }
//             }
//             return frameGrid;
//         }
//     };
// })();

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

export const drawFrameToCanvas = (
    frame: Frame,
    canvas: HTMLCanvasElement,
    transparentColor: string = constants.TRANSPARENT_COLOR,
    globalAlpha = 1,
    zoom = 1,
) => {
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('browser not support canvas');
    }
    context.globalAlpha = globalAlpha;
    transparentColor = transparentColor;

    const w = frame.width;
    const h = frame.height;

    // clear canvas
    context.clearRect(0, 0, w, h);

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

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(zoom, zoom);

    // Put pixel data to offcanvas and draw the offcanvas onto the canvas
    offCanvas.context.putImageData(imageData, 0, 0);
    context.drawImage(offCanvas, 0, 0, w, h);
    context.globalAlpha = 1;
};

// // TODO: 拆分文件结构
// export const saveAsBmp = (frame: Frame, width: number, height: number) => {
//     const data = getImageData(scaleCanvas(canvas, width, height));
//     const strData = genBitmapImage(data);
//     saveFile(makeURI(strData, downloadMime));
// }
