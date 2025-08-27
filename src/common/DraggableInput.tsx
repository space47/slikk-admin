/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

interface DraggableInputProps {
    fieldArray: any
    droppableId: string
    onDragEnd: (result: any) => void
}

const DraggableInput: React.FC<DraggableInputProps> = ({ fieldArray, droppableId, onDragEnd }) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={droppableId}>
                {(dropProvided) => (
                    <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                        {fieldArray}
                        {dropProvided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default DraggableInput
