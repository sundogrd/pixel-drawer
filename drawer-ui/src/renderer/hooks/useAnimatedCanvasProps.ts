import * as React from 'react';
import { useSpring } from 'react-spring';

const usePrevious = function<TValue>(value: TValue) {
    const ref = React.useRef<TValue>(value);
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

const toEven = (val: number) => {
    if (val % 2 === 0) {
        return val;
    } else {
        return val + 1;
    }
};

const useAnimatedCanvasProps = ({
    width,
    height,
    zoom,
    parentDomRect,
    wheelXy,
}: {
    width: number;
    height: number;
    zoom: number;
    parentDomRect: DOMRect;
    wheelXy: { x: number; y: number };
}): React.CSSProperties => {
    const [animatedProps, setAnimatedProps] = useSpring(() => {
        return {
            width: zoom * width,
            height: zoom * height,
        };
    });
    React.useEffect(() => {
        const w = zoom * width;
        const h = zoom * height;
        setAnimatedProps({
            width: w,
            height: h,
        });
    }, [width, height, zoom, setAnimatedProps]);

    const previousZoom = usePrevious(zoom);

    // TODO: enable pan and zoom control offset
    const [animatedOffsetProps, setAnimatedOffsetProps] = useSpring(() => {
        return {
            left: 0,
            top: 0,
        };
    });
    const [canvasOffset, setCanvasOffset] = React.useState<{
        left: number;
        top: number;
    }>({
        left: 0,
        top: 0,
    });
    React.useEffect(() => {
        setAnimatedOffsetProps(canvasOffset);
    }, [canvasOffset, setAnimatedOffsetProps]);

    // offset to center once
    const [initialized, setInitialized] = React.useState(false);
    React.useEffect(() => {
        if (initialized) {
            return;
        }
        if (parentDomRect) {
            setInitialized(true);
            setCanvasOffset({
                left: toEven(
                    Math.floor((parentDomRect.width - width * zoom) / 2),
                ),
                top: toEven(
                    Math.floor((parentDomRect.height - height * zoom) / 2),
                ),
            });
        }
    }, [width, height, zoom, initialized, parentDomRect]);

    React.useEffect(() => {
        if (!initialized) {
            return;
        }
        if (canvasOffset.left === 0) {
            return;
        }
        const wheelRelative = parentDomRect
            ? {
                x: wheelXy.x - parentDomRect.x,
                y: wheelXy.y - parentDomRect.y,
            } : { x: 0, y: 0 };

        const threshold = 2;
        const leftDelta =
            ((wheelRelative.x - canvasOffset.left) / previousZoom) *
            (zoom - previousZoom);
        const rightDelta =
            ((wheelRelative.y - canvasOffset.top) / previousZoom) *
            (zoom - previousZoom);
        if (
            Math.abs(leftDelta) > threshold ||
            Math.abs(rightDelta) > threshold
        ) {
            setCanvasOffset({
                left: toEven(Math.floor(canvasOffset.left - leftDelta)),
                top: toEven(Math.floor(canvasOffset.top - rightDelta)),
            });
        }
    }, [
        width,
        height,
        previousZoom,
        canvasOffset,
        zoom,
        initialized,
        parentDomRect,
        wheelXy.x,
        wheelXy.y,
    ]);

    return { ...animatedProps, ...animatedOffsetProps };
};

export default useAnimatedCanvasProps;
