// import * as React from 'react';
import Worktable from '../views/Worktable';
import { RouteConfig } from './renderRoutes';

const routes: Array<RouteConfig> = [
    {
        path: '/worktable',
        component: Worktable,
    },
    {
        path: '/',
        redirect: '/worktable',
        exact: true,
    },
];

export default routes;
