import * as React from 'react';
import Tool from './Tool';

import './index.css';

export enum ETools {
    PEN = 'PEN',
    ERASER = 'ERASER',
}

type ToolsContainerProps = {
    currentTool: ETools;
    onChange?: (tool: ETools) => void;
};

const ToolsContainer: React.FunctionComponent<ToolsContainerProps> = ({
    currentTool,
}) => {
    return (
        <ul className="tools-container">
            <Tool toolKey={ETools.PEN} selected={currentTool === ETools.PEN} />
            <Tool
                toolKey={ETools.ERASER}
                selected={currentTool === ETools.ERASER}
            />
        </ul>
    );
};

export default ToolsContainer;