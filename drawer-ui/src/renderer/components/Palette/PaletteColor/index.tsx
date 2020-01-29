import * as React from 'react';

import './index.css';

type PaletteColorProps = {
    color: string;
    selected?: boolean;
    onSelect?: (color: string) => void;
};
const PaletteColor: React.FunctionComponent<PaletteColorProps> = ({
    color,
    selected,
    onSelect,
}) => {
    const cellColor = color;
    const styles = {
        backgroundColor: cellColor,
    };

    return (
        <button
            type="button"
            aria-label="Color Palette"
            className={`palette-color ${selected ? 'selected' : ''}`}
            style={styles}
            onClick={(): void => {
                onSelect && onSelect(color);
            }}
        />
    );
};

export default PaletteColor;
