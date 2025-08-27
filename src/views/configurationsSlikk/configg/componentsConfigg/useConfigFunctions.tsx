/* eslint-disable @typescript-eslint/no-explicit-any */

import { MdCancel } from 'react-icons/md'
import _ from 'lodash'
import RenderFields from './RenderLogic'
import { FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import { beforeUpload } from '@/common/beforeUpload'
import { FILTER_STATE } from '@/store/types/filters.types'
import { IoIosAddCircle } from 'react-icons/io'
import { Modal } from 'antd'

interface props {
    obj: any
    filters: FILTER_STATE
    parentKey: string
    setFieldValue: (field: string, value: any) => void
    editableKeys: string[]
    setEditableKeys: any
    isAddModalOpen: boolean
    setIsAddModalOpen: any
}

export const useConfigFunctions = ({
    obj,
    filters,
    parentKey,
    editableKeys,
    setEditableKeys,
    isAddModalOpen,
    setIsAddModalOpen,
}: props) => {
    const ObjectFields = ({ setFieldValue }: { setFieldValue: (field: string, value: any) => void }) => {
        const handleAddField = () => {
            setIsAddModalOpen(true)
        }

        const handleTypeSelection = (type: 'string' | 'array' | 'object') => {
            setIsAddModalOpen(false)

            const newKey = `new_key_${Date.now()}`
            let newValue

            switch (type) {
                case 'string':
                    newValue = ''
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
        }

        // Handle primitive types (string, number, boolean)
        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
            return (
                <Field name={parentKey}>
                    {({ field }: FieldProps) => {
                        // Determine input type based on the value
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
                                    onClick={() =>
                                        setFieldValue(parentKey, typeof obj === 'string' ? '' : typeof obj === 'number' ? 0 : false)
                                    }
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
                {Object.entries(obj).map(([key, val]) => {
                    const fieldName = parentKey ? `${parentKey}.${key}` : key
                    const tempKey = editableKeys[key] ?? key
                    return (
                        <div key={fieldName} className="flex gap-4 items-center mb-2 shadow-xl bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                            {/* Editable key */}
                            <Field name={fieldName}>
                                {() => (
                                    <Input
                                        placeholder="Key"
                                        value={tempKey}
                                        className="w-1/3"
                                        onChange={(e) => {
                                            const newKey = e.target.value
                                            setEditableKeys((prev: any) => ({ ...prev, [key]: newKey }))
                                        }}
                                        onBlur={() => {
                                            if (tempKey && tempKey !== key) {
                                                const updatedEntries = Object.entries(obj).map(([k, v]) =>
                                                    k === key ? [tempKey, v] : [k, v],
                                                )
                                                const updatedObj = Object.fromEntries(updatedEntries)
                                                setFieldValue(parentKey, updatedObj)
                                            }
                                            setEditableKeys((prev: any) => {
                                                const { [key]: _, ...rest } = prev
                                                console.log('rest', _)
                                                return rest
                                            })
                                        }}
                                    />
                                )}
                            </Field>

                            {key.toLowerCase().includes('filters') ? (
                                <div>
                                    <Field name={fieldName}>
                                        {({ field, form }: FieldProps<any>) => {
                                            const selectedTags = Array.isArray(field.value)
                                                ? field.value.flatMap((tag: any) => {
                                                      return tag?.map((item: any) => {
                                                          const matchedData = filters.filters.find((option: any) => option.value === item)
                                                          return (
                                                              matchedData || {
                                                                  value: item,
                                                                  label: item,
                                                              }
                                                          )
                                                      })
                                                  })
                                                : []

                                            return (
                                                <Select
                                                    isMulti
                                                    placeholder="Select Filter Tags"
                                                    options={filters.filters}
                                                    value={selectedTags ?? []}
                                                    getOptionLabel={(option) => option.label}
                                                    getOptionValue={(option) => option.value}
                                                    onChange={(newVal) => {
                                                        const newValues = newVal ? newVal.map((val) => val.value) : []
                                                        form.setFieldValue(field.name, [newValues])
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </div>
                            ) : key.toLowerCase() === 'message' && obj?.messages_list?.length > 0 ? (
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
                                <FormItem className="xl:mt-6 ">
                                    <Field name={fieldName}>
                                        {() => (
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
                                        )}
                                    </Field>
                                    <Field
                                        component={Input}
                                        type="text"
                                        placeholder={`Enter ${key}`}
                                        name={fieldName}
                                        value={val}
                                        className="w-[500px]"
                                        onChange={(e: any) => setFieldValue(fieldName, e.target.value)}
                                    />
                                </FormItem>
                            ) : key.toLowerCase().includes('lottie') ? (
                                <FormItem className="xl:mt-6 ">
                                    <Field name={fieldName}>
                                        {() => (
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
                                        )}
                                    </Field>
                                    <Field
                                        component={Input}
                                        type="text"
                                        placeholder={`Enter ${key}`}
                                        name={fieldName}
                                        value={val}
                                        className="w-[500px]"
                                        onChange={(e: any) => setFieldValue(fieldName, e.target.value)}
                                    />
                                </FormItem>
                            ) : _.isPlainObject(val) || _.isArray(val) ? (
                                <div className="w-full">
                                    <RenderFields
                                        obj={val}
                                        parentKey={fieldName}
                                        setFieldValue={setFieldValue}
                                        editableKeys={editableKeys}
                                        setEditableKeys={setEditableKeys}
                                        filters={filters}
                                    />
                                </div>
                            ) : (
                                <Field
                                    name={fieldName}
                                    render={({ field }: any) => {
                                        const isPureNumber = /^[0-9]+$/.test(field.value)
                                        return (
                                            <Input
                                                {...field}
                                                type={isPureNumber ? 'number' : 'text'}
                                                placeholder="Value"
                                                className="w-full"
                                                onChange={(e) => setFieldValue(fieldName, e.target.value)}
                                            />
                                        )
                                    }}
                                />
                            )}

                            {/* Remove buttn */}
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => {
                                    const updatedObj = { ...obj }
                                    delete updatedObj[key]
                                    setFieldValue(parentKey, updatedObj)
                                }}
                            >
                                <MdCancel className="text-xl" />
                            </button>
                        </div>
                    )
                })}

                <button type="button" className=" text-green-600 px-4 py-2 rounded" onClick={handleAddField}>
                    <IoIosAddCircle className="text-xl" />
                </button>

                <Modal title="Select Field Type" open={isAddModalOpen} footer={null} onCancel={() => setIsAddModalOpen(false)}>
                    <div className="flex flex-col gap-2">
                        <button
                            className="p-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg "
                            onClick={() => handleTypeSelection('string')}
                        >
                            String
                        </button>
                        <button
                            className="p-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg "
                            onClick={() => handleTypeSelection('array')}
                        >
                            Array
                        </button>
                        <button
                            className="p-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg "
                            onClick={() => handleTypeSelection('object')}
                        >
                            Object
                        </button>
                    </div>
                </Modal>
            </div>
        )
    }

    return { ObjectFields }
}
