import * as React from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router';
import { Path } from 'history';

export interface RouteConfigComponentProps<
    Params extends { [K in keyof Params]?: string } = {}
> extends RouteComponentProps<Params> {
    route?: RouteConfig;
}

export interface RouteConfig {
    key?: React.Key;
    location?: Location;
    redirect?: Path;
    component?: React.ComponentType |
    React.ComponentType<RouteConfigComponentProps<any>>;
    path?: string | string[];
    exact?: boolean;
    strict?: boolean;
    routes?: RouteConfig[];
    render?: (props: RouteConfigComponentProps<any>) => React.ReactNode;
    [propName: string]: any;
}

const renderRoutes: React.FunctionComponent<any> = (
    routes: Array<RouteConfig>,
    extraProps = {},
    switchProps = {},
) => {
    if (!routes) {
        null;
    }
    // return <Route path="/" >fuck</Route>
    return (
        <Switch {...switchProps}>
            {routes.map((route, i) => {
                if (route.redirect) {
                    return (
                        <Route path={route.path}>
                            <Redirect to={route.redirect} />
                        </Route>
                    );
                }
                return (
                    <Route
                        key={route.key || i}
                        path={route.path}
                        exact={route.exact}
                        strict={route.strict}
                        render={props => {
                            if (route.render) {
                                return route.render({
                                    ...props,
                                    ...extraProps,
                                    route: route,
                                });
                            }
                            if (route.component) {
                                return (
                                    <route.component
                                        {...props}
                                        {...extraProps}
                                        route={route}
                                    />
                                );
                            }
                            return undefined;
                        }}
                    />
                );
            })}
        </Switch>
    );
};

export default renderRoutes;
