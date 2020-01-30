import React, { useRef, useEffect, useCallback } from 'react';
import { useGesture } from 'react-use-gesture';
import * as _ from 'lodash-es';
import {
    CanvasContext,
    clear,
    removeColor,
    line,
    eraserPoint,
    point,
    withinBound,
    checkerBoardPattern,
} from './canvas-fns';
import PureCanvas from './PureCanvas';

const useCanvasRef = (): [
    React.MutableRefObject<HTMLCanvasElement>,
    (node: any) => void,
] => {
    const ref = useRef<HTMLCanvasElement>();
    const callback = useCallback(node => {
        if (node) {
            ref.current = node;
        }
    }, []);
    return [ref as React.MutableRefObject<HTMLCanvasElement>, callback];
};

export enum EDrawingTool {
    PEN = 'PEN',
    ERASER = 'ERASER',
}

type PixelCanvasProps = {
    transparentGridSize: number;
    transparentFirstColor: string;
    transparentSecondColor: string;
    animatedStyleProps: React.CSSProperties;

    drawingTool: EDrawingTool;
    zoom: number;
    width: number;
    height: number;
    brushSize: number;
    selectedColor: string;
};

const defaultProps = {
    transparentGridSize: 2,
    transparentFirstColor: '#B4AEB7',
    transparentSecondColor: '#CCC8CE',
    animatedStyleProps: {} as React.CSSProperties,
};

const PixelCanvas: React.FC<PixelCanvasProps> & {
    defaultProps: Readonly<typeof defaultProps>;
} = ({
    transparentGridSize,
    transparentFirstColor,
    transparentSecondColor,
    animatedStyleProps,

    drawingTool,
    zoom,
    width,
    height,
    brushSize,
    selectedColor,
}) => {
    // canvas ref callback
    const [canvasRef, canvasRefCallback] = useCanvasRef();
    const [backgroundCanvasRef, backgroundCanvasRefCallback] = useCanvasRef();
    const [overlayCanvasRef, overlayCanvasRefCallback] = useCanvasRef();
    const wrapperRef = useRef<HTMLDivElement>();

    const getCanvasContext = (
        ref?: React.MutableRefObject<HTMLCanvasElement | undefined>,
    ): CanvasContext => {
        return Object.freeze({
            ctx: (ref ? ref : canvasRef).current!.getContext('2d')!,
            width,
            height,
            brushSize,
        } as CanvasContext);
    };

    // canvas setup
    useEffect(() => {
        const canvasContext = getCanvasContext(canvasRef);
        canvasContext.ctx.imageSmoothingEnabled = true;
        clear(canvasContext);

        const overlayCanvas = getCanvasContext(overlayCanvasRef);
        overlayCanvas.ctx.imageSmoothingEnabled = true;
        clear(overlayCanvas);

        const backgroundCanvasContext = getCanvasContext(backgroundCanvasRef);
        backgroundCanvasContext.ctx.imageSmoothingEnabled = true;
        checkerBoardPattern(backgroundCanvasContext, {
            squareSize: transparentGridSize,
            firstColor: transparentFirstColor,
            secondColor: transparentSecondColor,
        });

        // eslint-disable-next-line
    }, []);

    // gesture for canvas
    // const bindGesture = useGesture(
    //     {
    //         onDrag: state => {
    //             const [x0, y0] = state.previous;
    //             const [x1, y1] = state.xy;
    //             const canvas = canvasRef.current!;
    //             const canvasRect = canvas.getBoundingClientRect();

    //             const rectX0 = Math.floor((x0 - canvasRect.left) / zoom);
    //             const rectY0 = Math.floor((y0 - canvasRect.top) / zoom);
    //             const rectX1 = Math.floor((x1 - canvasRect.left) / zoom);
    //             const rectY1 = Math.floor((y1 - canvasRect.top) / zoom);

    //             // ignore if previous pos out of bound
    //             if (
    //                 !withinBound(getCanvasContext(), { x: rectX0, y: rectY0 })
    //             ) {
    //                 return;
    //             }

    //             if (drawingTool === EDrawingTool.PEN) {
    //                 point(getCanvasContext(), {
    //                     x0: rectX0,
    //                     y0: rectY0,
    //                     x1: rectX1,
    //                     y1: rectY1,
    //                     color: selectedColor,
    //                 });
    //             } else if (drawingTool === EDrawingTool.ERASER) {
    //                 eraserPoint(getCanvasContext(), {
    //                     x0: rectX0,
    //                     y0: rectY0,
    //                     x1: rectX1,
    //                     y1: rectY1,
    //                 });
    //             }
    //         },
    //     },
    //     {
    //         domTarget: wrapperRef as React.MutableRefObject<HTMLDivElement>,
    //     },
    // );

    const bindOverlayGesture = useGesture(
        {
            onDragStart: (state: any) => {
                console.log(state);
            },
            onDragEnd: (state: any) => {
                console.log(state);
            },
            onMove: _.throttle(state => {
                const [x0, y0] = state.previous;
                const [x1, y1] = state.xy;
                const canvas = overlayCanvasRef.current!;
                const canvasRect = canvas.getBoundingClientRect();

                const rectX0 = Math.floor((x0 - canvasRect.left) / zoom);
                const rectY0 = Math.floor((y0 - canvasRect.top) / zoom);
                const rectX1 = Math.floor((x1 - canvasRect.left) / zoom);
                const rectY1 = Math.floor((y1 - canvasRect.top) / zoom);

                // ignore if previous pos out of bound
                if (
                    !withinBound(getCanvasContext(overlayCanvasRef), {
                        x: rectX0,
                        y: rectY0,
                    })
                ) {
                    return;
                }

                // 笔触效果
                removeColor(getCanvasContext(overlayCanvasRef), {
                    x: rectX0,
                    y: rectY0,
                });

                point(getCanvasContext(overlayCanvasRef), {
                    x: rectX1,
                    y: rectY1,
                    color: 'rgba(255, 255, 255, 0.5)',
                });

                if (state.dragging && drawingTool === EDrawingTool.PEN) {
                    line(getCanvasContext(), {
                        x0: rectX0,
                        y0: rectY0,
                        x1: rectX1,
                        y1: rectY1,
                        color: selectedColor,
                    });
                } else if (
                    state.dragging &&
                    drawingTool === EDrawingTool.ERASER
                ) {
                    eraserPoint(getCanvasContext(), {
                        x0: rectX0,
                        y0: rectY0,
                        x1: rectX1,
                        y1: rectY1,
                    });
                }
            }, 6),
        },
        {
            domTarget: wrapperRef as React.MutableRefObject<HTMLDivElement>,
        },
    );

    return (
        <div
            ref={node => {
                if (node) {
                    wrapperRef.current = node;
                }
            }}
        >
            <PureCanvas
                canvasRefCallback={backgroundCanvasRefCallback}
                width={width}
                height={height}
                animatedStyleProps={animatedStyleProps}
                className={'Canvas-background'}
                style={{ zIndex: 0 }}
            />
            <PureCanvas
                canvasRefCallback={canvasRefCallback}
                width={width}
                height={height}
                animatedStyleProps={animatedStyleProps}
                style={{ zIndex: 1 }}
                className={'Canvas-main'}
            />
            {/* overlay 用于笔触以及显示操作中的线条 */}
            <PureCanvas
                canvasRefCallback={overlayCanvasRefCallback}
                width={width}
                height={height}
                bindGesture={bindOverlayGesture}
                animatedStyleProps={animatedStyleProps}
                style={{ zIndex: 2 }}
                className={'Canvas-overlay'}
            />
        </div>
    );
};

PixelCanvas.defaultProps = defaultProps;

export default PixelCanvas;
