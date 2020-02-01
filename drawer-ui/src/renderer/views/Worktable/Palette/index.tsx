import React from 'react';
import { observer } from 'mobx-react';
import PaletteGrid from '../../../components/PaletteGrid';
import { useWorktableStore } from '../store/context';

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
    '#ffff45',
    '#f53d31',
    '#ffd34a',
    '#fbaa27',
];

type PaletteProps = {};

const Palette: React.FunctionComponent<PaletteProps> = observer(({}) => {
    const { paletteColor, changePaletteColor } = useWorktableStore();
    return (
        <PaletteGrid
            grid={PALETTE_COLORS}
            color={paletteColor}
            onColorSelected={color => changePaletteColor(color)}
        />
    );
});

export default Palette;
