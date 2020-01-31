import * as React from 'react';
import Tool from './Tool';
import { useWorktableStore } from '../store/context';
import { observer } from 'mobx-react';

import './index.css';

export enum ETools {
    PEN = 'PEN',
    ERASER = 'ERASER',
}

type ToolsContainerProps = {};

const ToolsContainer: React.FunctionComponent<ToolsContainerProps> = observer(
    ({}) => {
        const { drawingTool, changeDrawingTool } = useWorktableStore();
        const clickHandlerFactory = (tool: ETools) => {
            return () => {
                changeDrawingTool(tool);
            };
        };

        return (
            <ul className="tools-container">
                <Tool
                    toolKey={ETools.PEN}
                    selected={drawingTool === ETools.PEN}
                    onClick={clickHandlerFactory(ETools.PEN)}
                />
                <Tool
                    toolKey={ETools.ERASER}
                    selected={drawingTool === ETools.ERASER}
                    onClick={clickHandlerFactory(ETools.ERASER)}
                />
            </ul>
        );
    },
);

export default ToolsContainer;
