/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { ConfigInterface, EDITFIELDSARRAY } from './commonConfigTypes'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate, useParams } from 'react-router-dom'
import { notification } from 'antd'
import _ from 'lodash'
import LoadingSpinner from '@/common/LoadingSpinner'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { IoIosAddCircle } from 'react-icons/io'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import { MdCancel } from 'react-icons/md'

const EditConfigurations = () => {
    const navigate = useNavigate()
    const [editConfigData, setEditConfigData] = useState<ConfigInterface | null>(null)
    const [showSpinner, setShowSpinner] = useState(false)
    const { id } = useParams()
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})

    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const fetchConfigurationApi = async () => {
        try {
            const response = await axiosInstance.get(`/app/configuration?config_id=${id}`)
            setEditConfigData(response.data?.config || null)
        } catch (error) {
            console.error('Error fetching configuration:', error)
        }
    }

    useEffect(() => {
        if (id) fetchConfigurationApi()
    }, [id])

    const renderFields = (obj: any, parentKey: string, setFieldValue: any) => {
        if (_.isPlainObject(obj)) {
            return (
                <div>
                    {Object.entries(obj).map(([key, val]) => {
                        const fieldName = parentKey ? `${parentKey}.${key}` : key
                        const tempKey = editableKeys[key] ?? key
                        return (
                            <div key={fieldName} className="flex gap-4 items-center mb-2">
                                {/* Editable key */}
                                <Field name={fieldName}>
                                    {({ form }) => (
                                        <Input
                                            placeholder="Key"
                                            value={tempKey}
                                            onChange={(e) => {
                                                const newKey = e.target.value
                                                setEditableKeys((prev) => ({ ...prev, [key]: newKey }))
                                            }}
                                            onBlur={() => {
                                                if (tempKey && tempKey !== key) {
                                                    const updatedEntries = Object.entries(obj).map(([k, v]) =>
                                                        k === key ? [tempKey, v] : [k, v],
                                                    )
                                                    const updatedObj = Object.fromEntries(updatedEntries)
                                                    setFieldValue(parentKey, updatedObj)
                                                }
                                                setEditableKeys((prev) => {
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
                                    <>
                                        <div>
                                            <Field name={fieldName}>
                                                {({ field, form }: FieldProps<any>) => {
                                                    const selectedTags = Array.isArray(field.value)
                                                        ? field.value?.map((tag: any) => {
                                                              const matchedOption = filters.filters.find(
                                                                  (option: any) => option.value === tag,
                                                              )
                                                              return (
                                                                  matchedOption || {
                                                                      value: tag,
                                                                      label: tag,
                                                                  }
                                                              )
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
                                                                form.setFieldValue(field.name, newValues)
                                                            }}
                                                        />
                                                    )
                                                }}
                                            </Field>
                                        </div>
                                    </>
                                ) : key.toLowerCase().includes('image') ? (
                                    <FormItem className="xl:mt-6">
                                        {/* <Field name={fieldName}>
                                            {({ field, form }) => (
                                                <Upload
                                                    beforeUpload={beforeUpload}
                                                    fileList={[fieldName]}
                                                    onChange={async (info) => {
                                                        
                                                        form.setFieldValue(fieldName, processedImage)
                                                    }}
                                                >
                                                    <Button type="button">Upload Image</Button>
                                                </Upload>
                                            )}
                                        </Field> */}
                                        <Field name={fieldName} component={Input} type="text" placeholder="image" />
                                    </FormItem>
                                ) : _.isPlainObject(val) || _.isArray(val) ? (
                                    <div className="w-full">{renderFields(val, fieldName, setFieldValue)}</div>
                                ) : (
                                    <Field
                                        name={fieldName}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Value"
                                                className="w-full"
                                                onChange={(e) => setFieldValue(fieldName, e.target.value)}
                                            />
                                        )}
                                    />
                                )}

                                {/* Remove key-value set */}
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

                    {/* Add new key-value set */}
                    <button
                        type="button"
                        onClick={() => {
                            const newKey = `new_key_${Date.now()}`
                            setFieldValue(parentKey, { ...obj, [newKey]: '' })
                        }}
                        className=" text-green-600 px-4 py-2 rounded"
                    >
                        <IoIosAddCircle className="text-xl" />
                    </button>
                </div>
            )
        } else if (_.isArray(obj)) {
            return (
                <FieldArray
                    name={parentKey}
                    render={(arrayHelpers) => (
                        <div>
                            {obj.map((item, index) => {
                                const arrayKey = parentKey ? `${parentKey}[${index}]` : `${index}`

                                return (
                                    <div key={arrayKey} className="flex gap-4 items-center mb-2">
                                        {_.isPlainObject(item) ? (
                                            <div className="w-full">{renderFields(item, arrayKey, setFieldValue)}</div>
                                        ) : (
                                            <Field
                                                name={arrayKey}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder={`Enter value for ${parentKey}[${index}]`}
                                                        className="w-full"
                                                    />
                                                )}
                                            />
                                        )}

                                        {/* Remove array item */}
                                        <button type="button" onClick={() => arrayHelpers.remove(index)} className="text-red-500">
                                            X
                                        </button>
                                    </div>
                                )
                            })}

                            {/* Add new array item */}
                            <button
                                type="button"
                                className="bg-black text-white px-2 py-2 rounded-xl flex gap-2"
                                onClick={() => arrayHelpers.push('')}
                            >
                                <IoIosAddCircle className="text-xl" /> Add Item
                            </button>
                        </div>
                    )}
                />
            )
        }
    }

    const handleSubmit = async (values: ConfigInterface) => {
        const processValues = async (obj: any): Promise<any> => {
            if (Array.isArray(obj)) {
                return Promise.all(obj.map(processValues))
            }
            if (_.isPlainObject(obj)) {
                const entries = await Promise.all(
                    Object.entries(obj).map(async ([key, val]) => {
                        if (key.toLowerCase().includes('image') && Array.isArray(val)) {
                            const processedImage = await handleimage('product', val)
                            return [key, processedImage]
                        }
                        if (_.isPlainObject(val) || Array.isArray(val)) {
                            return [key, await processValues(val)]
                        }
                        return [key, val]
                    }),
                )
                return Object.fromEntries(entries)
            }
            return obj
        }

        const body = {
            is_active: values?.is_active,
            config_name: values.name,
            config_value: await processValues(values.value),
        }

        try {
            setShowSpinner(true)
            const response = await axiosInstance.post('/app/configuration', body)
            notification.success({ message: response.data?.message || 'Successfully Configured' })
            navigate('/app/configurations')
        } catch (error) {
            console.error('Submit Error:', error)
            notification.error({ message: 'Failed to configure' })
        } finally {
            setShowSpinner(false)
        }
    }

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div className="w-full">
            <Formik
                enableReinitialize
                initialValues={
                    editConfigData || {
                        id: '',
                        name: '',
                        is_active: false,
                        last_updated_by: '',
                        create_date: '',
                        update_date: '',
                        value: {},
                    }
                }
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="w-4/5">
                        <FormContainer>
                            <h5 className="mb-5 text-neutral-900">Edit Configurations</h5>

                            {EDITFIELDSARRAY.map((item) => (
                                <FormItem key={item.name} label={item.label} className="col-span-1 w-1/2">
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}

                            <FormContainer className="grid grid-cols-1 gap-10">
                                {renderFields(values.value, 'value', setFieldValue)}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2">
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                    Submit
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditConfigurations
