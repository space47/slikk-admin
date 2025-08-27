/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Modal } from 'antd'
import { Input } from '@/components/ui'
import { Field, FieldArray, FieldProps } from 'formik'
import { IoIosAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import _ from 'lodash'
import { useConfigFunctions } from './useConfigFunctions'

const RenderFields = ({ obj, parentKey, setFieldValue, editableKeys, setEditableKeys, filters }: any) => {
    const handleDragEnd = (result: any) => {
        if (!result.destination) return
        const sourceIdx = result.source.index
        const destIdx = result.destination.index
        if (_.isArray(obj)) {
            const newArr = Array.from(obj)
            const [removed] = newArr.splice(sourceIdx, 1)
            newArr.splice(destIdx, 0, removed)
            setFieldValue(parentKey, newArr)
        }
    }
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const { ObjectFields } = useConfigFunctions({
        obj,
        filters,
        parentKey,
        setFieldValue,
        editableKeys,
        setEditableKeys,
        isAddModalOpen,
        setIsAddModalOpen,
    })

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return (
            <Field name={parentKey}>
                {({ field }: FieldProps) => {
                    let inputType = 'text'
                    if (typeof obj === 'number') inputType = 'number'
                    if (typeof obj === 'boolean') inputType = 'text'

                    return (
                        <div className="flex gap-4 items-center mb-2">
                            <Input
                                {...field}
                                type={inputType}
                                placeholder={`Enter value`}
                                className="w-full"
                                checked={typeof obj === 'boolean' ? field.value : undefined}
                                onChange={(e) => {
                                    let value: string | number | boolean = e.target.value
                                    if (typeof obj === 'number') value = Number(value)
                                    if (typeof obj === 'boolean') value = e.target.checked
                                    setFieldValue(parentKey, value)
                                }}
                            />
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => setFieldValue(parentKey, typeof obj === 'string' ? '' : typeof obj === 'number' ? 0 : false)}
                            >
                                <MdCancel className="text-xl" />
                            </button>
                        </div>
                    )
                }}
            </Field>
        )
    }

    return (
        <div>
            {_.isPlainObject(obj) && <ObjectFields setFieldValue={setFieldValue} />}

            {_.isArray(obj) && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId={parentKey || 'droppable-array'}>
                        {(dropProvided) => (
                            <FieldArray
                                name={parentKey}
                                render={(arrayHelpers) => (
                                    <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                                        {obj.map((item, index) => {
                                            const arrayKey = parentKey ? `${parentKey}[${index}]` : `${index}`
                                            return (
                                                <Draggable key={arrayKey} draggableId={arrayKey} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className="flex gap-4 items-center mb-2"
                                                        >
                                                            <span
                                                                {...provided.dragHandleProps}
                                                                className="cursor-grab px-2 text-xl select-none"
                                                                title="Drag to reorder"
                                                            >
                                                                ::
                                                            </span>
                                                            {_.isPlainObject(item) || _.isArray(item) ? (
                                                                <div className="w-full">
                                                                    <RenderFields
                                                                        obj={item}
                                                                        parentKey={arrayKey}
                                                                        setFieldValue={setFieldValue}
                                                                        editableKeys={editableKeys}
                                                                        setEditableKeys={setEditableKeys}
                                                                        filters={filters}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <Field
                                                                    name={arrayKey}
                                                                    render={({ field }: any) => {
                                                                        const inputType =
                                                                            typeof item === 'number'
                                                                                ? 'number'
                                                                                : typeof item === 'boolean'
                                                                                  ? 'checkbox'
                                                                                  : 'text'
                                                                        return (
                                                                            <Input
                                                                                {...field}
                                                                                type={inputType}
                                                                                placeholder={`Enter value`}
                                                                                className="w-full"
                                                                                checked={
                                                                                    typeof item === 'boolean' ? field.value : undefined
                                                                                }
                                                                                onChange={(e) => {
                                                                                    let value: any = e.target.value
                                                                                    if (typeof item === 'number') value = Number(value)
                                                                                    if (typeof item === 'boolean') value = e.target.checked
                                                                                    setFieldValue(arrayKey, value)
                                                                                }}
                                                                            />
                                                                        )
                                                                    }}
                                                                />
                                                            )}
                                                            <button
                                                                type="button"
                                                                className="text-red-500"
                                                                onClick={() => arrayHelpers.remove(index)}
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {dropProvided.placeholder}
                                        <button
                                            type="button"
                                            className="bg-black text-white px-2 py-2 rounded-xl flex gap-2"
                                            onClick={() => setIsAddModalOpen(true)}
                                        >
                                            <IoIosAddCircle className="text-xl" /> Add Item
                                        </button>
                                        <Modal
                                            title="Select Field Type"
                                            open={isAddModalOpen}
                                            footer={null}
                                            onCancel={() => setIsAddModalOpen(false)}
                                        >
                                            <div className="flex flex-col gap-2">
                                                {['string', 'array', 'object'].map((type) => (
                                                    <button
                                                        key={type}
                                                        className="p-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg"
                                                        onClick={() => {
                                                            setIsAddModalOpen(false)
                                                            arrayHelpers.push(type === 'string' ? '' : type === 'array' ? [] : {})
                                                        }}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </Modal>
                                    </div>
                                )}
                            />
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </div>
    )
}

export default RenderFields
