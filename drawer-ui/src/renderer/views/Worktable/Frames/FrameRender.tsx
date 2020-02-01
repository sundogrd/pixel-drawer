import * as React from 'react';
import Frame from '../../../../models/Frame';
import useCanvasRef from '../../../hooks/useCanvasRef';
import constants from '../../../../constants';
import { drawFrameToCanvas } from '../../../../utils/frame';

type FrameRenderProps = {
    className?: string;
    frame: Frame;
    zoom: number;
    onClick?: () => void;
};
const FrameRender: React.FunctionComponent<FrameRenderProps> = ({
    frame,
    zoom,
    className = '',
    onClick,
}) => {
    const [canvasRef, canvasRefCallback] = useCanvasRef();

    // setup
    React.useEffect(() => {
        const handleFrameUpdate = () => {
            console.log('rerenderFrame', frame);
            drawFrameToCanvas(
                frame,
                canvasRef.current,
                constants.TRANSPARENT_COLOR,
                1,
                zoom,
            );
        };

        frame.onUpdate(handleFrameUpdate);

        return function cleanup() {
            frame.removeUpdateListener(handleFrameUpdate);
        };
    });

    React.useEffect(() => {
        drawFrameToCanvas(
            frame,
            canvasRef.current,
            constants.TRANSPARENT_COLOR,
            1,
            zoom,
        );
    }, [frame, zoom]);

    return (
        <canvas
            width={frame.width * zoom}
            height={frame.height * zoom}
            className={className}
            ref={canvasRefCallback}
            onClick={onClick}
        ></canvas>
    );
};

export default FrameRender;
