import React, { useRef, useEffect, useCallback } from 'react';
import { useGesture } from 'react-use-gesture';
import {
    CanvasContext,
    clear,
    line,
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
        const canvasContext = getCanvasContext();
        canvasContext.ctx.imageSmoothingEnabled = true;
        clear(canvasContext);

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
    const bindGesture = useGesture({
        onDrag: state => {
            console.log(state);
            const [x0, y0] = state.previous;
            const [x1, y1] = state.xy;
            const canvas = canvasRef.current!;
            const canvasRect = canvas.getBoundingClientRect();

            const rectX0 = Math.floor((x0 - canvasRect.left) / zoom);
            const rectY0 = Math.floor((y0 - canvasRect.top) / zoom);
            const rectX1 = Math.floor((x1 - canvasRect.left) / zoom);
            const rectY1 = Math.floor((y1 - canvasRect.top) / zoom);

            // ignore if previous pos out of bound
            if (!withinBound(getCanvasContext(), { x: rectX0, y: rectY0 })) {
                return;
            }

            if (drawingTool === EDrawingTool.PEN) {
                point(getCanvasContext(), {
                    x0: rectX0,
                    y0: rectY0,
                    x1: rectX1,
                    y1: rectY1,
                    color: selectedColor,
                });
            }

            // line(getCanvasContext(), {
            //     x0: rectX0,
            //     y0: rectY0,
            //     x1: rectX1,
            //     y1: rectY1,
            //     color: selectedColor
            // });
        },
    });

    return (
        <>
            <PureCanvas
                canvasRefCallback={backgroundCanvasRefCallback}
                width={width}
                height={height}
                animatedStyleProps={animatedStyleProps}
                className={'Canvas-background'}
            />
            <PureCanvas
                canvasRefCallback={canvasRefCallback}
                width={width}
                height={height}
                bindGesture={bindGesture}
                animatedStyleProps={animatedStyleProps}
                className={'Canvas-main'}
            />
        </>
    );
};

PixelCanvas.defaultProps = defaultProps;

export default PixelCanvas;
