import React from 'react';
import { observer } from 'mobx-react';
import { useWorktableStore } from '../store/context';
import DrawingBoard from '../../../components/DrawingBoard';

type BoardProps = {};

const Board: React.FunctionComponent<BoardProps> = observer(({}) => {
    const {
        canvasColumns,
        canvasRows,
        paletteColor,
        drawingTool,
    } = useWorktableStore();
    return (
        <DrawingBoard
            width={canvasColumns}
            height={canvasRows}
            selectedColor={paletteColor}
            drawingTool={drawingTool}
        />
    );
});

export default Board;
