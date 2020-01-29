import * as React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import Palette from '../../components/Palette';
import DrawingBoard from '../../components/DrawingBoard';
import NumberInput from '../../components/NumberInput';

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

const Worktable: React.FunctionComponent<{}> = observer(() => {
    const store = useLocalStore(() => {
        return {
            canvasColumns: 10,
            canvasRows: 10,
            canvasColorGrid: new Array(10 * 10).fill('#333333') as Array<
                string
            >,
            paletteColor: '#a12af1',
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

    return (
        <div className="worktable">
            <Palette
                grid={PALETTE_COLORS}
                color={store.paletteColor}
                onColorSelected={color => store.changePaletteColor(color)}
            />
            <div style={{ maxWidth: 600, maxHeight: 600, margin: '10px auto' }}>
                <DrawingBoard
                    width={store.canvasColumns}
                    height={store.canvasRows}
                />
            </div>
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
    );
});

export default Worktable;
