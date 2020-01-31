import * as React from 'react';
import { useObserver, observer } from 'mobx-react';
import Palette from './Palette';
import DrawingBoard from '../../components/DrawingBoard';
import NumberInput from '../../components/NumberInput';
import Frames from './Frames';
import { WorktableStoreProvider } from './store/context';
import ToolsContainer from './ToolsContainer';

import './index.css';
import Board from './Board';

const Worktable: React.FunctionComponent<{}> = observer(() => {
    return (
        <div className="worktable">
            <WorktableStoreProvider>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Palette />
                    <ToolsContainer />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Frames />
                </div>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Board />
                </div>
                {/* <div style={{}}>
                    <NumberInput
                        value={store.canvasColumns}
                        label={'Pixel Columns'}
                        onChange={number => {
                            store.changeCanvasSize(store.canvasRows, number);
                        }}
                    />
                    <NumberInput
                        value={store.canvasRows}
                        label={'Pixel Rows'}
                        onChange={number => {
                            store.changeCanvasSize(number, store.canvasColumns);
                        }}
                    />
                </div> */}
            </WorktableStoreProvider>
        </div>
    );
});

export default Worktable;
