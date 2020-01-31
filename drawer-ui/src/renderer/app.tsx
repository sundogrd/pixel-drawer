import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import routes from './routes';
import { Provider, observer } from 'mobx-react';
// import { spy } from "mobx"
import { createStore } from './store/index';
import { useLocalStore } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import renderRoutes from './routes/renderRoutes';

import './style/reset.css';
import './style/app.css';

if (process.env.NODE_ENV === 'development') {
    // spy((event) => {
    //     if (event.type === 'action') {
    //         console.log(`${event.name} with args: ${event.arguments}`)
    //     }
    // })
}

const App = observer<any>(() => {
    const store = useLocalStore(createStore);
    return (
        <Provider {...store}>
            <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
        </Provider>
    );
});

export default hot(App);
