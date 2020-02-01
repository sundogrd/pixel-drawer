import React, { useState, useEffect } from 'react';
import useDimensions from '../../hooks/useDimensions';
import PixelCanvas, { EDrawingTool } from './PixelCanvas';
import useAnimatedCanvasProps from '../../hooks/useAnimatedCanvasProps';
import { useLocalStore, useObserver } from 'mobx-react';
import { useToggle } from 'react-use';
import './index.css';

export type DrawingBoardProps = {
    width: number;
    height: number;
    selectedColor: string;
    drawingTool: string;
    onCanvasUpdate?: (pixels: Uint32Array) => void;
    onInit?: (mainCanvas: HTMLCanvasElement) => void;
};

const defaultProps = {
    width: 20,
    height: 20,
    selectedColor: '#333333',
};

const toolClassMap = {
    [EDrawingTool.PEN]: 'tool-pen',
    [EDrawingTool.ERASER]: 'tool-eraser',
};

const DrawingBoard: React.FunctionComponent<DrawingBoardProps> & {
    defaultProps: Readonly<typeof defaultProps>;
} = ({ width, height, selectedColor, drawingTool, onCanvasUpdate, onInit }) => {
    const [ref, domRect] = useDimensions();
    const [isInit, toggleIsInit] = useToggle(false);

    const store = useLocalStore(() => ({
        mainCanvas: null as null | HTMLCanvasElement,

        width: width,
        height: height,
        zoom: 15,
        maxZoom: 15,
        minZoom: 5,
        brushSize: 1,
        drawingTool: drawingTool as EDrawingTool,
        selectedColor: selectedColor,
        setMainCanvas(mainCanvas: HTMLCanvasElement) {
            this.mainCanvas = mainCanvas;
        },
        increaseZoom(increase: number) {
            this.zoom = Math.min(this.maxZoom, this.zoom + increase);
        },
        decreaseZoom(decrease: number) {
            this.zoom = Math.max(this.minZoom, this.zoom - decrease);
        },
        changeCanvasSize(width: number, height: number) {
            this.width = width;
            this.height = height;
        },
        changeColor(color: string) {
            this.selectedColor = color;
        },
        changeDrawingTool(tool: EDrawingTool) {
            this.drawingTool = tool;
        },
    }));

    useEffect(() => {
        if (store.mainCanvas && !isInit) {
            onInit && onInit(store.mainCanvas);
            toggleIsInit(true);
        }
    }, [store.mainCanvas]);

    useEffect(() => {
        store.changeCanvasSize(width, height);
    }, [width, height]);

    useEffect(() => {
        store.changeColor(selectedColor);
    }, [selectedColor]);

    useEffect(() => {
        store.changeDrawingTool(drawingTool as EDrawingTool);
    }, [drawingTool]);

    const [wheelXy, setWheelXy] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const animatedStyleProps = useAnimatedCanvasProps({
        width: store.width,
        height: store.height,
        zoom: store.zoom,
        parentDomRect: domRect,
        wheelXy,
    });

    const handleWheel = (event: React.WheelEvent) => {
        event.preventDefault();
        const deltaY = event.deltaY;
        if (deltaY < 0) {
            store.increaseZoom(-deltaY / 30);
        } else {
            store.decreaseZoom(deltaY / 30);
        }
        setWheelXy({ x: event.clientX, y: event.clientY });
    };

    const toolClass = toolClassMap[store.drawingTool];

    return useObserver(() => (
        <div
            className={`drawing-board ${toolClass}`}
            ref={ref}
            onWheel={handleWheel}
        >
            <PixelCanvas
                onCanvasUpdate={onCanvasUpdate}
                onCanvasInit={onInit}
                animatedStyleProps={animatedStyleProps}
                zoom={store.zoom}
                width={store.width}
                height={store.height}
                brushSize={store.brushSize}
                selectedColor={store.selectedColor}
                drawingTool={store.drawingTool}
            />
        </div>
    ));
};
DrawingBoard.defaultProps = defaultProps;

export default DrawingBoard;
