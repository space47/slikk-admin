/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Modal, message } from 'antd'
import { FormItem, Select, Upload } from '@/components/ui'
import { Field, FieldArray, FieldProps } from 'formik'
import { IoIosAddCircle, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { MdCancel, MdDragHandle } from 'react-icons/md'
import _ from 'lodash'
import { beforeUpload } from '@/common/beforeUpload'
import { FaCode } from 'react-icons/fa'

const RenderPayout = ({ obj, parentKey, setFieldValue, editableKeys, setEditableKeys, depth = 0 }: any) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [currentArrayHelpers, setCurrentArrayHelpers] = useState<any>(null)
    const [expandedObjects, setExpandedObjects] = useState<Set<string>>(new Set())

    const toggleExpand = (key: string) => {
        const newExpanded = new Set(expandedObjects)
        if (newExpanded.has(key)) {
            newExpanded.delete(key)
        } else {
            newExpanded.add(key)
        }
        setExpandedObjects(newExpanded)
    }

    const handleDragEnd = (result: any) => {
        if (!result.destination) return
        const sourceIdx = result.source.index
        const destIdx = result.destination.index

        if (_.isArray(obj)) {
            const newArr = Array.from(obj)
            const [removed] = newArr.splice(sourceIdx, 1)
            newArr.splice(destIdx, 0, removed)
            setFieldValue(parentKey, newArr)
            message.success('Item reordered successfully')
        }
    }

    const handleAddField = () => {
        setIsAddModalOpen(true)
    }

    const handleTypeSelection = (type: 'string' | 'array' | 'object' | 'number' | 'boolean') => {
        setIsAddModalOpen(false)
        const newKey = `new_key_${Date.now()}`
        let newValue

        switch (type) {
            case 'string':
                newValue = ''
                break
            case 'number':
                newValue = 0
                break
            case 'boolean':
                newValue = false
                break
            case 'array':
                newValue = []
                break
            case 'object':
                newValue = {}
                break
            default:
                newValue = ''
        }

        setFieldValue(parentKey, { ...obj, [newKey]: newValue })
        message.success(`${type} field added successfully`)
    }

    // Handle primitive types (string, number, boolean)
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return (
            <Field name={parentKey}>
                {({ field }: FieldProps) => {
                    let inputType = 'text'
                    if (typeof obj === 'number') inputType = 'number'

                    return (
                        <div className="flex items-center gap-2 mb-2 w-full group">
                            <div className="flex-1">
                                {typeof obj === 'boolean' ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">{field.value ? 'Yes' : 'No'}</span>
                                        <button
                                            type="button"
                                            onClick={() => setFieldValue(parentKey, !field.value)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                field.value ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                                    field.value ? 'translate-x-5' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        {...field}
                                        type={inputType}
                                        placeholder={`Enter ${typeof obj} value...`}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        onChange={(e) => {
                                            let value: string | number = e.target.value
                                            if (typeof obj === 'number') value = Number(value)
                                            setFieldValue(parentKey, value)
                                        }}
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                                onClick={() => setFieldValue(parentKey, typeof obj === 'string' ? '' : typeof obj === 'number' ? 0 : false)}
                            >
                                <MdCancel className="text-sm" />
                            </button>
                        </div>
                    )
                }}
            </Field>
        )
    }

    // Handle object type
    if (_.isPlainObject(obj)) {
        const isEmpty = Object.keys(obj).length === 0
        const isExpanded = expandedObjects.has(parentKey)
        const nextDepth = depth + 1

        return (
            <div className="w-full relative">
                {depth > 0 && (
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" style={{ left: '-12px' }} />
                )}

                {!isEmpty && (
                    <button
                        type="button"
                        onClick={() => toggleExpand(parentKey)}
                        className="w-full flex items-center justify-between px-2 py-1.5 mb-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="flex items-center gap-1.5">
                            <span>Properties</span>
                            <span className="text-xs text-gray-500">({Object.keys(obj).length})</span>
                            {isExpanded ? (
                                <span className="text-xs text-white bg-red-500 px-2 rounded-lg">Click to Close</span>
                            ) : (
                                <span className="text-xs text-white bg-green-500 px-2 rounded-lg">Click to Open</span>
                            )}
                        </span>
                        {isExpanded ? <IoIosArrowUp className="text-sm" /> : <IoIosArrowDown className="text-sm" />}
                    </button>
                )}

                {(isExpanded || isEmpty) && (
                    <div className="space-y-2 relative pl-4">
                        {/* Vertical line for nested structure */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" />

                        {Object.entries(obj).map(([key, val]) => {
                            const fieldName = parentKey ? `${parentKey}.${key}` : key
                            const tempKey = editableKeys?.[key] ?? key

                            return (
                                <div
                                    key={fieldName}
                                    className="group relative bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="p-2">
                                        <div className="flex flex-col lg:flex-row gap-2">
                                            {/* Editable key section */}
                                            <div className="lg:w-1/4">
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                                                    Property
                                                </label>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Key"
                                                            value={tempKey}
                                                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                            onChange={(e) => {
                                                                const newKey = e.target.value
                                                                setEditableKeys?.((prev: any) => ({ ...prev, [key]: newKey }))
                                                            }}
                                                            onBlur={() => {
                                                                if (tempKey && tempKey !== key) {
                                                                    const updatedEntries = Object.entries(obj).map(([k, v]) =>
                                                                        k === key ? [tempKey, v] : [k, v],
                                                                    )
                                                                    const updatedObj = Object.fromEntries(updatedEntries)
                                                                    setFieldValue(parentKey, updatedObj)
                                                                    message.success('Property renamed')
                                                                }
                                                                setEditableKeys?.((prev: any) => {
                                                                    const { [key]: _, ...rest } = prev
                                                                    return rest
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Value section */}
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                                                    Value
                                                </label>
                                                {key.toLowerCase() === 'message' && obj?.messages_list?.length > 0 ? (
                                                    <Field name={fieldName}>
                                                        {({ field, form }: FieldProps<any>) => {
                                                            const messagesList = obj.messages_list || []
                                                            const options = Array.isArray(messagesList)
                                                                ? messagesList.map((message) => ({
                                                                      label: message,
                                                                      value: message,
                                                                  }))
                                                                : []

                                                            return (
                                                                <Select
                                                                    isClearable
                                                                    placeholder="Select Message"
                                                                    options={options}
                                                                    className="text-xs"
                                                                    value={field.value ? { label: field.value, value: field.value } : null}
                                                                    onChange={(newVal) => {
                                                                        form.setFieldValue(field.name, newVal ? newVal.value : '')
                                                                    }}
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                ) : key.toLowerCase().includes('image') ? (
                                                    <div className="space-y-2">
                                                        <FormItem className="mb-0">
                                                            <Field name={fieldName}>
                                                                {({ form }: FieldProps) => (
                                                                    <Upload
                                                                        beforeUpload={beforeUpload}
                                                                        className="flex justify-center"
                                                                        onChange={(files) => {
                                                                            console.log('files to be upload', fieldName)
                                                                            return form.setFieldValue(fieldName, files)
                                                                        }}
                                                                        onFileRemove={(files) => form.setFieldValue(fieldName, files)}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </FormItem>
                                                        <input
                                                            type="text"
                                                            placeholder={`Or enter ${key} URL...`}
                                                            value={val as any}
                                                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                            onChange={(e: any) => setFieldValue(fieldName, e.target.value)}
                                                        />
                                                    </div>
                                                ) : key.toLowerCase().includes('lottie') ? (
                                                    <div className="space-y-2">
                                                        <FormItem className="mb-0">
                                                            <Field name={fieldName}>
                                                                {({ form }: FieldProps) => (
                                                                    <Upload
                                                                        beforeUpload={beforeUpload}
                                                                        className="flex justify-center"
                                                                        onChange={(files) => {
                                                                            console.log('files to be upload', fieldName)
                                                                            return form.setFieldValue(fieldName, files)
                                                                        }}
                                                                        onFileRemove={(files) => form.setFieldValue(fieldName, files)}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </FormItem>
                                                        <input
                                                            type="text"
                                                            placeholder={`Or enter ${key} URL...`}
                                                            value={val as any}
                                                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                            onChange={(e: any) => setFieldValue(fieldName, e.target.value)}
                                                        />
                                                    </div>
                                                ) : _.isPlainObject(val) || _.isArray(val) ? (
                                                    <div className="w-full">
                                                        <RenderPayout
                                                            obj={val}
                                                            parentKey={fieldName}
                                                            setFieldValue={setFieldValue}
                                                            editableKeys={editableKeys}
                                                            setEditableKeys={setEditableKeys}
                                                            depth={nextDepth}
                                                        />
                                                    </div>
                                                ) : (
                                                    <Field name={fieldName}>
                                                        {({ field }: FieldProps) => {
                                                            const isNumber = typeof val === 'number'
                                                            const isBoolean = typeof val === 'boolean'

                                                            if (isBoolean) {
                                                                return (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                            {field.value ? 'Yes' : 'No'}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setFieldValue(fieldName, !field.value)}
                                                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 ${
                                                                                field.value ? 'bg-blue-600' : 'bg-gray-300'
                                                                            }`}
                                                                        >
                                                                            <span
                                                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                                                                    field.value ? 'translate-x-5' : 'translate-x-1'
                                                                                }`}
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            }

                                                            return (
                                                                <input
                                                                    {...field}
                                                                    type={isNumber ? 'number' : 'text'}
                                                                    placeholder="Enter value..."
                                                                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                                    onChange={(e) => {
                                                                        let value: any = e.target.value
                                                                        if (isNumber) value = Number(value)
                                                                        setFieldValue(fieldName, value)
                                                                    }}
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                )}
                                            </div>

                                            {/* Remove button */}
                                            <div className="lg:w-auto">
                                                <button
                                                    type="button"
                                                    className="mt-4 text-red-500 hover:text-red-700 transition-colors"
                                                    onClick={() => {
                                                        const updatedObj = { ...obj }
                                                        delete updatedObj[key]
                                                        setFieldValue(parentKey, updatedObj)
                                                        message.success('Property removed')
                                                    }}
                                                >
                                                    <MdCancel className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <button
                    type="button"
                    className="mt-2 flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                    onClick={handleAddField}
                >
                    <IoIosAddCircle className="text-sm" /> Add Property
                </button>

                <Modal title="Add New Property" open={isAddModalOpen} footer={null} onCancel={() => setIsAddModalOpen(false)} width={400}>
                    <div className="py-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Select the type of property to add:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { type: 'string', label: 'String' },
                                { type: 'number', label: 'Number' },
                                { type: 'boolean', label: 'Boolean' },
                                { type: 'array', label: 'Array' },
                                { type: 'object', label: 'Object' },
                            ].map((item) => (
                                <button
                                    key={item.type}
                                    className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                                    onClick={() => handleTypeSelection(item.type as any)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

    // Handle array type
    if (_.isArray(obj)) {
        const isEmpty = obj.length === 0
        const nextDepth = depth + 1

        return (
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={parentKey || 'droppable-array'}>
                    {(dropProvided, snapshot) => (
                        <FieldArray
                            name={parentKey}
                            render={(arrayHelpers) => (
                                <div className="relative">
                                    {depth > 0 && (
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600"
                                            style={{ left: '-12px' }}
                                        />
                                    )}

                                    <div
                                        ref={dropProvided.innerRef}
                                        {...dropProvided.droppableProps}
                                        className={`space-y-2 p-2 rounded border-2 border-dashed transition-colors ${
                                            snapshot.isDraggingOver
                                                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Array</span>
                                                <span className="text-xs text-gray-500">({obj.length})</span>
                                            </div>
                                        </div>

                                        {isEmpty && (
                                            <div className="text-center py-4 text-gray-400 dark:text-gray-500">
                                                <FaCode className="text-2xl mx-auto mb-1" />
                                                <p className="text-xs">No items in array</p>
                                            </div>
                                        )}

                                        <div className="space-y-2 relative pl-3">
                                            {/* Vertical line for array items */}
                                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600" />

                                            {obj.map((item, index) => {
                                                const arrayKey = parentKey ? `${parentKey}[${index}]` : `${index}`
                                                return (
                                                    <Draggable key={arrayKey} draggableId={arrayKey} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`group bg-white dark:bg-gray-800 rounded border transition-all duration-200 ${
                                                                    snapshot.isDragging
                                                                        ? 'border-blue-400 shadow-md'
                                                                        : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
                                                                }`}
                                                            >
                                                                <div className="p-2">
                                                                    <div className="flex items-start gap-2">
                                                                        <div
                                                                            {...provided.dragHandleProps}
                                                                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 select-none mt-0.5"
                                                                        >
                                                                            <MdDragHandle className="text-base" />
                                                                        </div>

                                                                        <div className="flex-1">
                                                                            {_.isPlainObject(item) || _.isArray(item) ? (
                                                                                <RenderPayout
                                                                                    obj={item}
                                                                                    parentKey={arrayKey}
                                                                                    setFieldValue={setFieldValue}
                                                                                    editableKeys={editableKeys}
                                                                                    setEditableKeys={setEditableKeys}
                                                                                    depth={nextDepth}
                                                                                />
                                                                            ) : (
                                                                                <Field name={arrayKey}>
                                                                                    {({ field }: FieldProps) => {
                                                                                        const isNumber = typeof item === 'number'
                                                                                        const isBoolean = typeof item === 'boolean'

                                                                                        if (isBoolean) {
                                                                                            return (
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                                                        {field.value ? 'True' : 'False'}
                                                                                                    </span>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={() =>
                                                                                                            setFieldValue(
                                                                                                                arrayKey,
                                                                                                                !field.value,
                                                                                                            )
                                                                                                        }
                                                                                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                                                                                            field.value
                                                                                                                ? 'bg-blue-600'
                                                                                                                : 'bg-gray-300'
                                                                                                        }`}
                                                                                                    >
                                                                                                        <span
                                                                                                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                                                                                                field.value
                                                                                                                    ? 'translate-x-5'
                                                                                                                    : 'translate-x-1'
                                                                                                            }`}
                                                                                                        />
                                                                                                    </button>
                                                                                                </div>
                                                                                            )
                                                                                        }

                                                                                        return (
                                                                                            <input
                                                                                                {...field}
                                                                                                type={isNumber ? 'number' : 'text'}
                                                                                                placeholder={`Item ${index + 1} value...`}
                                                                                                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                                                                onChange={(e) => {
                                                                                                    let value: any = e.target.value
                                                                                                    if (isNumber) value = Number(value)
                                                                                                    setFieldValue(arrayKey, value)
                                                                                                }}
                                                                                            />
                                                                                        )
                                                                                    }}
                                                                                </Field>
                                                                            )}
                                                                        </div>

                                                                        <button
                                                                            type="button"
                                                                            className="text-red-500 hover:text-red-700 transition-colors mt-0.5"
                                                                            onClick={() => {
                                                                                arrayHelpers.remove(index)
                                                                                message.success('Item removed')
                                                                            }}
                                                                        >
                                                                            <MdCancel className="text-sm" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                        </div>
                                        {dropProvided.placeholder}

                                        <button
                                            type="button"
                                            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                                            onClick={() => {
                                                setCurrentArrayHelpers(arrayHelpers)
                                                setIsAddModalOpen(true)
                                            }}
                                        >
                                            <IoIosAddCircle className="text-sm" /> Add Item
                                        </button>

                                        <Modal
                                            title="Add Array Item"
                                            open={isAddModalOpen}
                                            footer={null}
                                            onCancel={() => {
                                                setIsAddModalOpen(false)
                                                setCurrentArrayHelpers(null)
                                            }}
                                            width={400}
                                        >
                                            <div className="py-4">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                                    Select the type of item to add:
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { type: 'string', label: 'String', value: '' },
                                                        { type: 'number', label: 'Number', value: 0 },
                                                        { type: 'boolean', label: 'Boolean', value: false },
                                                        { type: 'array', label: 'Array', value: [] },
                                                        { type: 'object', label: 'Object', value: {} },
                                                    ].map((item) => (
                                                        <button
                                                            key={item.type}
                                                            className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                                                            onClick={() => {
                                                                setIsAddModalOpen(false)
                                                                currentArrayHelpers?.push(item.value)
                                                                setCurrentArrayHelpers(null)
                                                                message.success(`${item.type} item added`)
                                                            }}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                            )}
                        />
                    )}
                </Droppable>
            </DragDropContext>
        )
    }

    return null
}

export default RenderPayout
