/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import * as React from 'react';
import DrawingBoard from '../src/renderer/components/DrawingBoard';

export default {
    title: 'DrawingBoard',
    parameters: {
        backgrounds: [{ name: 'gray', value: '#eee', default: true }],
    },
};

export const toStorybook = () => (
    <div style={{ width: 600, height: 600 }}>
        <DrawingBoard />
    </div>
);

toStorybook.story = {
    name: 'DrawingBoard',
};
