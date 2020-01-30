import * as React from 'react';
import classnames from 'classnames';
import { ETools } from '.';

type ToolProps = {
    selected?: boolean;
    toolKey: ETools;
};

const Tool: React.FunctionComponent<ToolProps> = ({
    selected = false,
    toolKey,
}) => {
    return (
        <li
            className={classnames(
                `tool-icon icon-tool-${toolKey.toLowerCase()}`,
                {
                    selected: selected,
                },
            )}
        ></li>
    );
};

export default Tool;
