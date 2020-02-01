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
import FrameComponent from './Frame';
import './index.css';

type FramesProps = {};

const Frames: React.FunctionComponent<FramesProps> = observer(() => {
    const {
        frames,
        addFrame,
        canvasRows,
        canvasColumns,
        resortFrames,
        changeCurrentFrame,
        currentFrame,
    } = useWorktableStore();

    useLogger('Frames', {
        frames: frames,
    });
    const handleDragEnd = (result: DropResult) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        resortFrames(result.source.index, result.destination.index);
    };

    const previewZoom = 94 / canvasRows;

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
                                        <FrameComponent
                                            index={index}
                                            frame={frame}
                                            zoom={previewZoom}
                                            isDragging={
                                                draggableSnapshot.isDragging
                                            }
                                            selected={
                                                currentFrame.id === frame.id
                                            }
                                            forwardingRef={
                                                draggableProvided.innerRef
                                            }
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                        />
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
