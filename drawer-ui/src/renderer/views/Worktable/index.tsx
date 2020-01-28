import * as React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import useStores from '../../hooks/useStores';

const Worktable: React.FunctionComponent<{}> = observer(() => {
    const { appStore } = useStores();
    return (
        <div className="home-view">
            <div className="logo-wrapper">keke</div>
            <Link to="/bundle" className="operate">
                新的冒险
            </Link>
            <Link to="/records" className="operate">
                旧的回忆
            </Link>
            <div>{appStore.darkMode ? 'dark' : 'light'}</div>
            <button
                onClick={() => {
                    appStore.toggleDark();
                }}
            >
                change
            </button>
        </div>
    );
});

export default Worktable;
