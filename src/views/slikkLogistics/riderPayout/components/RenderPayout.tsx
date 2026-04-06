/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Modal, message } from 'antd'
import { FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldArray, FieldProps } from 'formik'
import { IoIosAddCircle, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { MdCancel, MdDragHandle, MdEdit, MdCheck, MdClose } from 'react-icons/md'
import { FaRegFileAlt, FaHashtag, FaToggleOn, FaToggleOff, FaCode, FaObjectGroup } from 'react-icons/fa'
import _ from 'lodash'
import { beforeUpload } from '@/common/beforeUpload'

const RenderPayout = ({ obj, parentKey, setFieldValue, editableKeys, setEditableKeys }: any) => {
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

    const getTypeIcon = (value: any) => {
        if (typeof value === 'string') return <FaRegFileAlt className="text-blue-500" />
        if (typeof value === 'number') return <FaHashtag className="text-green-500" />
        if (typeof value === 'boolean')
            return value ? <FaToggleOn className="text-purple-500" /> : <FaToggleOff className="text-gray-500" />
        if (_.isArray(value)) return <FaCode className="text-orange-500" />
        if (_.isPlainObject(value)) return <FaObjectGroup className="text-red-500" />
        return <FaRegFileAlt className="text-gray-500" />
    }

    // Handle primitive types (string, number, boolean)
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return (
            <Field name={parentKey}>
                {({ field }: FieldProps) => {
                    let inputType = 'text'
                    if (typeof obj === 'number') inputType = 'number'

                    return (
                        <div className="flex items-center gap-3 mb-3 w-full group">
                            <div className="flex-1">
                                {typeof obj === 'boolean' ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{field.value ? 'Yes' : 'No'}</span>
                                        <button
                                            type="button"
                                            onClick={() => setFieldValue(parentKey, !field.value)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                field.value ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    field.value ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        {...field}
                                        type={inputType}
                                        placeholder={`Enter ${typeof obj} value...`}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                                <MdCancel className="text-xl" />
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

        return (
            <div className="w-full">
                {!isEmpty && (
                    <button
                        type="button"
                        onClick={() => toggleExpand(parentKey)}
                        className="w-full flex items-center justify-between px-3 py-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            {getTypeIcon(obj)}
                            <span>Object Properties</span>
                            <span className="text-xs text-gray-500">({Object.keys(obj).length} items)</span>
                        </span>
                        {isExpanded ? <IoIosArrowUp className="text-lg" /> : <IoIosArrowDown className="text-lg" />}
                    </button>
                )}

                {(isExpanded || isEmpty) && (
                    <div className="space-y-3 pl-0 md:pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                        {Object.entries(obj).map(([key, val]) => {
                            const fieldName = parentKey ? `${parentKey}.${key}` : key
                            const tempKey = editableKeys?.[key] ?? key

                            return (
                                <div
                                    key={fieldName}
                                    className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="p-4">
                                        <div className="flex flex-col lg:flex-row gap-4">
                                            {/* Editable key section */}
                                            <div className="lg:w-1/4">
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                    Property Name
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Key"
                                                            value={tempKey}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                                                    <div className="text-gray-400">{getTypeIcon(val)}</div>
                                                </div>
                                            </div>

                                            {/* Value section */}
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
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
                                                                    value={field.value ? { label: field.value, value: field.value } : null}
                                                                    onChange={(newVal) => {
                                                                        form.setFieldValue(field.name, newVal ? newVal.value : '')
                                                                    }}
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                ) : key.toLowerCase().includes('image') ? (
                                                    <div className="space-y-3">
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
                                                            value={val}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                            onChange={(e: any) => setFieldValue(fieldName, e.target.value)}
                                                        />
                                                    </div>
                                                ) : key.toLowerCase().includes('lottie') ? (
                                                    <div className="space-y-3">
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
                                                            value={val}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                                                        />
                                                    </div>
                                                ) : (
                                                    <Field name={fieldName}>
                                                        {({ field }: FieldProps) => {
                                                            const isNumber = typeof val === 'number'
                                                            const isBoolean = typeof val === 'boolean'

                                                            if (isBoolean) {
                                                                return (
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                            {field.value ? 'Yes' : 'No'}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setFieldValue(fieldName, !field.value)}
                                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                                                field.value ? 'bg-blue-600' : 'bg-gray-300'
                                                                            }`}
                                                                        >
                                                                            <span
                                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                                    field.value ? 'translate-x-6' : 'translate-x-1'
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
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                                                    className="mt-6 text-red-500 hover:text-red-700 transition-colors"
                                                    onClick={() => {
                                                        const updatedObj = { ...obj }
                                                        delete updatedObj[key]
                                                        setFieldValue(parentKey, updatedObj)
                                                        message.success('Property removed')
                                                    }}
                                                >
                                                    <MdCancel className="text-xl" />
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
                    className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                    onClick={handleAddField}
                >
                    <IoIosAddCircle className="text-lg" /> Add Property
                </button>

                <Modal title="Add New Property" open={isAddModalOpen} footer={null} onCancel={() => setIsAddModalOpen(false)} width={400}>
                    <div className="py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select the type of property to add:</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { type: 'string', label: 'String', icon: <FaRegFileAlt />, color: 'blue' },
                                { type: 'number', label: 'Number', icon: <FaHashtag />, color: 'green' },
                                { type: 'boolean', label: 'Boolean', icon: <FaToggleOn />, color: 'purple' },
                                { type: 'array', label: 'Array', icon: <FaCode />, color: 'orange' },
                                { type: 'object', label: 'Object', icon: <FaObjectGroup />, color: 'red' },
                            ].map((item) => (
                                <button
                                    key={item.type}
                                    className={`flex items-center justify-center gap-2 p-3 bg-${item.color}-50 hover:bg-${item.color}-100 text-${item.color}-700 font-medium rounded-lg transition-all duration-200 border border-${item.color}-200`}
                                    onClick={() => handleTypeSelection(item.type as any)}
                                >
                                    {item.icon}
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

        return (
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={parentKey || 'droppable-array'}>
                    {(dropProvided, snapshot) => (
                        <FieldArray
                            name={parentKey}
                            render={(arrayHelpers) => (
                                <div
                                    ref={dropProvided.innerRef}
                                    {...dropProvided.droppableProps}
                                    className={`space-y-3 p-4 rounded-lg border-2 border-dashed transition-colors ${
                                        snapshot.isDraggingOver
                                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(obj)}
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Array Items</span>
                                            <span className="text-xs text-gray-500">({obj.length} items)</span>
                                        </div>
                                    </div>

                                    {isEmpty && (
                                        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                                            <FaCode className="text-4xl mx-auto mb-2" />
                                            <p className="text-sm">No items in array</p>
                                        </div>
                                    )}

                                    {obj.map((item, index) => {
                                        const arrayKey = parentKey ? `${parentKey}[${index}]` : `${index}`
                                        return (
                                            <Draggable key={arrayKey} draggableId={arrayKey} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`group bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 ${
                                                            snapshot.isDragging
                                                                ? 'border-blue-400 shadow-lg scale-105'
                                                                : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
                                                        }`}
                                                    >
                                                        <div className="p-4">
                                                            <div className="flex items-start gap-3">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 select-none mt-1"
                                                                >
                                                                    <MdDragHandle className="text-2xl" />
                                                                </div>

                                                                <div className="flex-1">
                                                                    {_.isPlainObject(item) || _.isArray(item) ? (
                                                                        <RenderPayout
                                                                            obj={item}
                                                                            parentKey={arrayKey}
                                                                            setFieldValue={setFieldValue}
                                                                            editableKeys={editableKeys}
                                                                            setEditableKeys={setEditableKeys}
                                                                        />
                                                                    ) : (
                                                                        <Field name={arrayKey}>
                                                                            {({ field }: FieldProps) => {
                                                                                const isNumber = typeof item === 'number'
                                                                                const isBoolean = typeof item === 'boolean'

                                                                                if (isBoolean) {
                                                                                    return (
                                                                                        <div className="flex items-center gap-3">
                                                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                                                {field.value ? 'True' : 'False'}
                                                                                            </span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    setFieldValue(arrayKey, !field.value)
                                                                                                }
                                                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                                                                    field.value
                                                                                                        ? 'bg-blue-600'
                                                                                                        : 'bg-gray-300'
                                                                                                }`}
                                                                                            >
                                                                                                <span
                                                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                                                        field.value
                                                                                                            ? 'translate-x-6'
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
                                                                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                                                                    className="text-red-500 hover:text-red-700 transition-colors mt-1"
                                                                    onClick={() => {
                                                                        arrayHelpers.remove(index)
                                                                        message.success('Item removed')
                                                                    }}
                                                                >
                                                                    <MdCancel className="text-xl" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {dropProvided.placeholder}

                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                                        onClick={() => {
                                            setCurrentArrayHelpers(arrayHelpers)
                                            setIsAddModalOpen(true)
                                        }}
                                    >
                                        <IoIosAddCircle className="text-lg" /> Add Item to Array
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
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select the type of item to add:</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { type: 'string', label: 'String', icon: <FaRegFileAlt />, value: '' },
                                                    { type: 'number', label: 'Number', icon: <FaHashtag />, value: 0 },
                                                    { type: 'boolean', label: 'Boolean', icon: <FaToggleOn />, value: false },
                                                    { type: 'array', label: 'Array', icon: <FaCode />, value: [] },
                                                    { type: 'object', label: 'Object', icon: <FaObjectGroup />, value: {} },
                                                ].map((item) => (
                                                    <button
                                                        key={item.type}
                                                        className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-all duration-200 border border-gray-200"
                                                        onClick={() => {
                                                            setIsAddModalOpen(false)
                                                            currentArrayHelpers?.push(item.value)
                                                            setCurrentArrayHelpers(null)
                                                            message.success(`${item.type} item added`)
                                                        }}
                                                    >
                                                        {item.icon}
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </Modal>
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
