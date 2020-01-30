import * as React from 'react';
import classnames from 'classnames';
import { ETools } from '.';

type ToolProps = {
    selected?: boolean;
    toolKey: ETools;
    onClick?: (e: React.MouseEvent) => void;
};

const Tool: React.FunctionComponent<ToolProps> = ({
    selected = false,
    toolKey,
    onClick,
}) => {
    return (
        <li
            className={classnames(
                `tool-icon icon-tool-${toolKey.toLowerCase()}`,
                {
                    selected: selected,
                },
            )}
            onClick={onClick}
        ></li>
    );
};

export default Tool;
