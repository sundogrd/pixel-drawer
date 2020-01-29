/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import * as React from 'react';
import NumberInput from '../src/renderer/components/NumberInput';

export default {
    title: 'NumberInput',
    parameters: {
        backgrounds: [{ name: 'gray', value: '#eee', default: true }],
    },
};

export const toStorybook = () => (
    <div>
        <NumberInput value={10} label={'keke'} onChange={() => {}} />
    </div>
);

toStorybook.story = {
    name: 'NumberInput',
};
