/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { StrictModeDroppable } from '@/components/shared'
import { Cell, flexRender, Header, HeaderGroup, Row } from '@tanstack/react-table'
import { Table } from '@/components/ui'
import type { DropResult } from 'react-beautiful-dnd'
import { WebType } from './PageSettingsCommon'

const { Tr, Th, Td, THead, TBody } = Table

interface DragableProps {
    table: any
    handleDragEnd: (result: DropResult) => void
}

const PageDraggavleTable = ({ table, handleDragEnd }: DragableProps) => {
    return (
        <div>
            <Table className="w-full">
                <THead>
                    {table.getHeaderGroups().map((headerGroup: HeaderGroup<WebType>) => {
                        console.log('object', headerGroup)
                        return (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header: Header<WebType, unknown>) => {
                                    return (
                                        <Th key={header.id} colSpan={header.colSpan}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </Th>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </THead>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <StrictModeDroppable droppableId="table-body">
                        {(provided) => (
                            <TBody ref={provided.innerRef} {...provided.droppableProps}>
                                {table.getRowModel().rows.map((row: Row<WebType>) => {
                                    return (
                                        <Draggable key={row.id} draggableId={row.id} index={row.index}>
                                            {(provided, snapshot) => {
                                                const { style } = provided.draggableProps
                                                return (
                                                    <Tr
                                                        ref={provided.innerRef}
                                                        className={snapshot.isDragging ? 'table' : ''}
                                                        style={style}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {row.getVisibleCells().map((cell: Cell<WebType, unknown>) => {
                                                            return (
                                                                <Td key={cell.id}>
                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </Td>
                                                            )
                                                        })}
                                                    </Tr>
                                                )
                                            }}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </TBody>
                        )}
                    </StrictModeDroppable>
                </DragDropContext>
            </Table>
        </div>
    )
}

export default PageDraggavleTable
