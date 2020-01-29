/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import * as React from 'react';
import Palette from '../src/renderer/components/Palette';

export default {
    title: 'PaletteColor',
    parameters: {
        backgrounds: [{ name: 'gray', value: '#eee', default: true }],
    },
};

export const toStorybook = () => (
    <div>
        <Palette
            grid={[
                '#111111',
                '#aa0000',
                '#bb44aa',
                '#aa11aa',
                '#1b44aa',
                '#5b44aa',
                '#9344aa',
                '#4944aa',
            ]}
        />
    </div>
);

toStorybook.story = {
    name: 'Palette',
};
