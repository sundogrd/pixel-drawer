import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import routes from './routes';
import { Provider, observer } from 'mobx-react';
import { createStore } from './store/index';
import { useLocalStore } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import renderRoutes from './routes/renderRoutes';

import './style/reset.css';
import './style/app.css';

const App = observer<any>(() => {
    const store = useLocalStore(createStore);
    return (
        <Provider {...store}>
            <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
        </Provider>
    );
});

export default hot(App);
