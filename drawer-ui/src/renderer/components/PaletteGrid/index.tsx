import React from 'react';
import PaletteColor from './PaletteColor';

import './index.css';

type PaletteGridProps = {
    grid: Array<string>;
    color?: string;
    onColorSelected?: (color: string) => void;
};

const PaletteGrid: React.FunctionComponent<PaletteGridProps> = ({
    grid,
    color,
    onColorSelected,
}) => {
    return (
        <div className="palette-grid">
            {grid.map(gridColor => (
                <PaletteColor
                    key={gridColor}
                    color={gridColor}
                    selected={gridColor === color}
                    onSelect={onColorSelected}
                />
            ))}
        </div>
    );
};

export default PaletteGrid;
