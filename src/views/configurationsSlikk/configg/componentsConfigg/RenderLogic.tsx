/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Modal } from 'antd'
import { beforeUpload } from '@/common/beforeUpload'
import { FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldArray, FieldProps } from 'formik'
import { IoIosAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import _ from 'lodash'

const RenderFields = ({ obj, parentKey, setFieldValue, editableKeys, setEditableKeys, filters }: any) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

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

    return (
        <div>
            {_.isPlainObject(obj) && (
                <div>
                    {Object.entries(obj).map(([key, val]) => {
                        const fieldName = parentKey ? `${parentKey}.${key}` : key
                        const tempKey = editableKeys[key] ?? key
                        return (
                            <div key={fieldName} className="flex gap-4 items-center mb-2">
                                {/* Editable key */}
                                <Field name={fieldName}>
                                    {() => (
                                        <Input
                                            placeholder="Key"
                                            value={tempKey}
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
                                                    return rest
                                                })
                                            }}
                                            className="w-1/3"
                                        />
                                    )}
                                </Field>

                                {/* Editable value based on key */}
                                {key.toLowerCase().includes('filters') ? (
                                    <div>
                                        <Field name={fieldName}>
                                            {({ field, form }: FieldProps<any>) => {
                                                const selectedTags = Array.isArray(field.value)
                                                    ? field.value.flatMap((tag: any) => {
                                                          return tag?.map((item: any) => {
                                                              const matchedData = filters.filters.find(
                                                                  (option: any) => option.value === item,
                                                              )
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
                                ) : key.toLowerCase().includes('image') ? (
                                    <FormItem className="xl:mt-6">
                                        <Field name={fieldName}>
                                            {({ field, form }) => (
                                                <Field name={fieldName}>
                                                    {({ form }: FieldProps) => (
                                                        <Upload
                                                            beforeUpload={beforeUpload}
                                                            onChange={(files) => {
                                                                console.log('files to be upload', fieldName)
                                                                return form.setFieldValue(fieldName, files)
                                                            }}
                                                            onFileRemove={(files) => form.setFieldValue(fieldName, files)}
                                                            className="flex justify-center"
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
                                            onChange={(e: any) => setFieldValue(fieldName, e.target.value)}
                                            className="w-[500px]"
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
                                    onClick={() => {
                                        const updatedObj = { ...obj }
                                        delete updatedObj[key]
                                        setFieldValue(parentKey, updatedObj)
                                    }}
                                    className="text-red-500"
                                >
                                    <MdCancel className="text-xl" />
                                </button>
                            </div>
                        )
                    })}

                    <button type="button" onClick={handleAddField} className=" text-green-600 px-4 py-2 rounded">
                        <IoIosAddCircle className="text-xl" />
                    </button>

                    <Modal title="Select Field Type" open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} footer={null}>
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
            )}

            {_.isArray(obj) && (
                <FieldArray
                    name={parentKey}
                    render={(arrayHelpers) => (
                        <div>
                            {obj.map((item, index) => {
                                const arrayKey = parentKey ? `${parentKey}[${index}]` : `${index}`

                                return (
                                    <div key={arrayKey} className="flex gap-4 items-center mb-2">
                                        {_.isPlainObject(item) ? (
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
                                                    const isPureNumber = /^[0-9]+$/.test(field.value)
                                                    return (
                                                        <Input
                                                            {...field}
                                                            type={isPureNumber ? 'number' : 'text'}
                                                            placeholder={`Enter value for ${parentKey}[${index}]`}
                                                            className="w-full"
                                                        />
                                                    )
                                                }}
                                            />
                                        )}

                                        <button type="button" onClick={() => arrayHelpers.remove(index)} className="text-red-500">
                                            X
                                        </button>
                                    </div>
                                )
                            })}

                            <button
                                type="button"
                                className="bg-black text-white px-2 py-2 rounded-xl flex gap-2"
                                onClick={() => {
                                    if (obj.length > 0) {
                                        const newItem = _.isPlainObject(obj[0])
                                            ? _.mapValues(obj[0], () => '')
                                            : _.isArray(obj[0])
                                              ? []
                                              : ''
                                        arrayHelpers.push(newItem)
                                    } else {
                                        arrayHelpers.push('')
                                    }
                                }}
                            >
                                <IoIosAddCircle className="text-xl" /> Add Item
                            </button>
                        </div>
                    )}
                />
            )}
        </div>
    )
}

export default RenderFields
