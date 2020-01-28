import * as React from 'react';
import { Link } from 'react-router-dom';

const Worktable: React.FunctionComponent<{}> = () => {
    return (
        <div className="home-view">
            <div className="logo-wrapper">keke</div>
            <Link to="/bundle" className="operate">
                新的冒险
            </Link>
            <Link to="/records" className="operate">
                旧的回忆
            </Link>
        </div>
    );
};

export default Worktable;
