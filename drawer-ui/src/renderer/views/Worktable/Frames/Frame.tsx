import * as React from 'react';
import classnames from 'classnames';
import Frame from '../../../../models/Frame';
import FrameRender from './FrameRender';
import { useWorktableStore } from '../store/context';
import { useToggle } from 'react-use';
import { useTransition, animated } from 'react-spring';
import { saveAsBmp } from '../../../../utils/canvas';
import { drawFrameToCanvas } from '../../../../utils/frame';

type FrameProps = {
    index: number;
    frame: Frame;
    zoom: number;
    isDragging: boolean;
    selected: boolean;
    forwardingRef: (element?: HTMLElement | null) => any;
    [key: string]: any;
};
const FrameComponent: React.FunctionComponent<FrameProps> = ({
    forwardingRef,
    index,
    frame,
    isDragging,
    selected,
    zoom,
    ...otherProps
}) => {
    const {
        changeCurrentFrame,
        currentFrame,
        canvasColumns,
        canvasRows,
    } = useWorktableStore();

    const [isHovering, toggleIsHovering] = useToggle(true);

    const handleMouseEnter = () => {
        toggleIsHovering(true);
    };

    const handleMouseLeave = () => {
        toggleIsHovering(false);
    };

    React.useEffect(() => {
        toggleIsHovering(false);
    }, [isDragging]);

    const toolsTransitions = useTransition(isHovering, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });

    const exportFrame = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasColumns;
        tempCanvas.height = canvasRows;
        drawFrameToCanvas(currentFrame, tempCanvas);
        saveAsBmp(tempCanvas, currentFrame.width, currentFrame.height);
    };
    const importBMP = () => {
        const inputElement = document.createElement('input');
        inputElement.accept = 'image/gif, image/jpg, image/jpeg, image/png';
        throw new Error('not implemented');
    };

    return (
        <div
            className={classnames('frame', {
                dragging: isDragging,
                selected: selected,
            })}
            ref={forwardingRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...otherProps}
        >
            <FrameRender
                onClick={() => changeCurrentFrame(frame)}
                frame={frame}
                zoom={zoom}
            />
            <button className="frame-index">{index}</button>

            {toolsTransitions.map(
                ({ item, key, props }) =>
                    item && (
                        <animated.div key={key} style={props}>
                            <div className="frame-tools">
                                <div
                                    className="frame-tool icon-frame-tool-import"
                                    onClick={() => {
                                        importBMP();
                                    }}
                                ></div>
                                <div
                                    className="frame-tool icon-frame-tool-export"
                                    onClick={() => {
                                        exportFrame();
                                    }}
                                ></div>
                            </div>
                        </animated.div>
                    ),
            )}
        </div>
    );
};

export default FrameComponent;
