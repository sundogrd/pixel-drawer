import * as React from 'react';
import { createWorktableStore, WorktableStore } from './createWorktableStore';
import { useLocalStore } from 'mobx-react'; // 6.x or mobx-react-lite@1.4.0

const storeContext = React.createContext<WorktableStore | null>(null);

export const WorktableStoreProvider: React.FunctionComponent = ({
    children,
}) => {
    const store = useLocalStore(createWorktableStore);
    return (
        <storeContext.Provider value={store}>{children}</storeContext.Provider>
    );
};

export const useWorktableStore = () => {
    const store = React.useContext(storeContext);
    if (!store) {
        // this is especially useful in TypeScript so you don't need to be checking for null all the time
        throw new Error(
            'useWorktableStore must be used within a StoreProvider.',
        );
    }
    return store;
};
