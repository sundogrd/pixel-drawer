import * as React from 'react';
import { useLocalStore, useObserver } from 'mobx-react';
import Palette from '../../components/Palette';
import DrawingBoard from '../../components/DrawingBoard';
import NumberInput from '../../components/NumberInput';
import ToolsContainer, { ETools } from './ToolsContainer';

import './index.css';

const PALETTE_COLORS = [
    '#111111',
    '#aa0000',
    '#bb44aa',
    '#aa11aa',
    '#1b44aa',
    '#5b44aa',
    '#9344aa',
    '#4944aa',
    '#a12af1',
];

const Worktable: React.FunctionComponent<{}> = () => {
    const store = useLocalStore(() => {
        return {
            canvasColumns: 32,
            canvasRows: 32,
            paletteColor: '#a12af1',
            drawingTool: 'PEN',
            changeCanvasSize(rows: number, columns: number): void {
                // TODO: implementation
                this.canvasColumns = columns;
                this.canvasRows = rows;
            },
            changePaletteColor(color: string): void {
                this.paletteColor = color;
            },
        };
    });

    const handleToolChange = (newTool: ETools) => {
        store.drawingTool = newTool;
    };

    return useObserver(() => (
        <div className="worktable">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Palette
                    grid={PALETTE_COLORS}
                    color={store.paletteColor}
                    onColorSelected={color => store.changePaletteColor(color)}
                />
                <ToolsContainer
                    currentTool={store.drawingTool as ETools}
                    onChange={handleToolChange}
                />
            </div>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <DrawingBoard
                    width={store.canvasColumns}
                    height={store.canvasRows}
                    selectedColor={store.paletteColor}
                    drawingTool={store.drawingTool}
                />
            </div>
            <div style={{}}>
                <NumberInput
                    value={store.canvasColumns}
                    label={'Pixel Columns'}
                    onChange={number => {
                        store.changeCanvasSize(store.canvasRows, number);
                    }}
                />
                <NumberInput
                    value={store.canvasRows}
                    label={'Pixel Rows'}
                    onChange={number => {
                        store.changeCanvasSize(number, store.canvasColumns);
                    }}
                />
            </div>
        </div>
    ));
};

export default Worktable;
