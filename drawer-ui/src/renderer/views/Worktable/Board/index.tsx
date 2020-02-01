import * as React from 'react';
import { observer } from 'mobx-react';
import { useWorktableStore } from '../store/context';
import DrawingBoard from '../../../components/DrawingBoard';
import { drawFrameToCanvas } from '../../../../utils/frame';

type BoardProps = {};

const Board: React.FunctionComponent<BoardProps> = observer(({}) => {
    const {
        canvasColumns,
        canvasRows,
        paletteColor,
        drawingTool,
        currentFrame,
    } = useWorktableStore();

    const [
        mainCanvas,
        setMainCanvas,
    ] = React.useState<HTMLCanvasElement | null>(null);

    const handleCanvasUpdate: (pixels: Uint32Array) => void = pixels => {
        currentFrame.setPixels(pixels);
        console.debug('[Board] set pixels');
        currentFrame.emitter.emit('update');
    };

    React.useEffect(() => {
        console.log('boardCore', mainCanvas);
        if (!mainCanvas) {
            console.warn("can't get main canvas");
            return;
        }
        drawFrameToCanvas(currentFrame, mainCanvas);
    }, [currentFrame]);

    const handleInit = (canvas: HTMLCanvasElement) => {
        setMainCanvas(canvas);
    };

    return (
        <DrawingBoard
            width={canvasColumns}
            height={canvasRows}
            selectedColor={paletteColor}
            drawingTool={drawingTool}
            onCanvasUpdate={handleCanvasUpdate}
            onInit={handleInit}
        />
    );
});

export default Board;
