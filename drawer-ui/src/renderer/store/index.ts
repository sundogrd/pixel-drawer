import { createAppStore } from './appStore';

export type TStore = {
    appStore: ReturnType<typeof createAppStore>;
};

export function createStore(): TStore {
    // note the use of this which refers to observable instance of the store
    const store = {
        appStore: createAppStore(),
    };
    return store;
}
