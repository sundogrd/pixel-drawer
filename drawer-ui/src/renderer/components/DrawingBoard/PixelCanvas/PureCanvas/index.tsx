import * as React from 'react';
import { animated } from 'react-spring';
import './index.css';

interface PureCanvasProps {
    width: number;
    height: number;
    animatedStyleProps: React.CSSProperties;
    canvasRefCallback?: (instance: HTMLCanvasElement) => void;
    bindGesture?: (...args: any[]) => any;
    style?: React.CSSProperties;
    className?: string;
}

const PureCanvas: React.FunctionComponent<PureCanvasProps> = ({
    width,
    height,
    animatedStyleProps,
    canvasRefCallback,
    bindGesture,
    style,
    className,
}) => {
    const gestureHandlers = bindGesture ? bindGesture() : {};
    return (
        <animated.canvas
            {...gestureHandlers}
            ref={canvasRefCallback}
            width={width}
            height={height}
            className={'Canvas-pixelated ' + className}
            style={{ ...style, ...animatedStyleProps }}
        />
    );
};

export default React.memo(PureCanvas);
