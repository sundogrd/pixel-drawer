import { configure } from '@storybook/react';

import './reset.css';
// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.(js|ts)x?$/), module);
