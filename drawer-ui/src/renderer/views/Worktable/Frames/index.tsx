import * as React from 'react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd';
import classnames from 'classnames';
import { useLogger } from 'react-use';
import { useWorktableStore } from '../store/context';
import { observer } from 'mobx-react';
import Frame from '../../../../models/Frame';
import FrameRender from './FrameRender';

import './index.css';

type FramesProps = {};

const Frames: React.FunctionComponent<FramesProps> = observer(() => {
    const { frames, addFrame, resortFrames } = useWorktableStore();

    useLogger('Frames', {
        frames: frames,
    });
    const handleDragEnd = (result: DropResult) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
    };

    return (
        <div className="frames">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(droppableProvided, droppableSnapshot) => (
                        <div
                            className={classnames('frames-droppable', {
                                'dragging-over':
                                    droppableSnapshot.isDraggingOver,
                            })}
                            ref={droppableProvided.innerRef}
                        >
                            {frames.map((frame, index) => (
                                <Draggable
                                    key={frame.id}
                                    draggableId={frame.id}
                                    index={index}
                                >
                                    {(draggableProvided, draggableSnapshot) => (
                                        <div
                                            className={classnames('frame', {
                                                dragging:
                                                    draggableSnapshot.isDragging,
                                            })}
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                        >
                                            <FrameRender
                                                frame={frame}
                                                zoom={1}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div
                id="add-frame-action"
                className="add-frame-action"
                data-tile-action="newframe"
                onClick={() => {
                    addFrame();
                }}
            >
                <div className="add-frame-action-icon icon-frame-plus-white" />
                <div className="label">Add new frame({frames.length})</div>
            </div>
        </div>
    );
});
export default Frames;
