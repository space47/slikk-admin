/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { ConfigInterface, EDITFIELDSARRAY } from './commonConfigTypes'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem, Input, Select, Spinner, Upload } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate, useParams } from 'react-router-dom'
import { notification } from 'antd'
import _ from 'lodash'
import LoadingSpinner from '@/common/LoadingSpinner'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { MdCancel } from 'react-icons/md'
import { IoIosAddCircle } from 'react-icons/io'
import TagsEdit from '@/views/appsSettings/pageSettings/TagsEdit'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'

const EditConfigurations = () => {
    const navigate = useNavigate()
    const [editConfigData, setEditConfigData] = useState<ConfigInterface | null>(null)
    const [showSpinner, setShowSpinner] = useState(false)
    const { id } = useParams()

    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const fetchConfigurationApi = async () => {
        try {
            const response = await axiosInstance.get(`/app/configuration?config_id=${id}`)
            const apiData = response.data?.config
            setEditConfigData(apiData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchConfigurationApi()
    }, [id])

    const renderFields = (obj: any, parentKey: string, setFieldValue: any) => {
        console.log('Item for the renderedFields', obj, parentKey)
        if (_.isPlainObject(obj)) {
            return Object.entries(obj).map(([key, val]) => {
                const fieldName = parentKey ? `${parentKey}.${key}` : key
                console.log('Key to recognize', key)
                if (_.isPlainObject(val)) {
                    return (
                        <div key={fieldName} className="col-span-2">
                            <div className="text-xl font-semibold mb-1">{key}::</div>

                            <div className="grid grid-cols-2 gap-4">{renderFields(val, fieldName, setFieldValue)}</div>
                        </div>
                    )
                } else {
                    return (
                        <FormItem key={fieldName} className="col-span-1 w-full">
                            {key.toLowerCase().includes('image') ? (
                                <div>
                                    <Field name={fieldName}>
                                        {({ form }: FieldProps) => (
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                onChange={(files) => form.setFieldValue(fieldName, files)}
                                                onFileRemove={(files) => form.setFieldValue(fieldName, files)}
                                                className="flex justify-center"
                                            />
                                        )}
                                    </Field>
                                    <Field
                                        component={Input}
                                        type="text"
                                        placeholder={`Enter ${key}`}
                                        name={fieldName}
                                        value={val}
                                        onChange={(e: any) => setFieldValue(fieldName, e.target.value)}
                                    />
                                </div>
                            ) : key === 'filters' ? (
                                <div>
                                    <Field name={fieldName}>
                                        {({ field, form }: FieldProps<any>) => {
                                            const selectedTags = Array.isArray(field.value)
                                                ? field.value?.map((tag: any) => {
                                                      const matchedOption = filters.filters.find((option: any) => option.value === tag)
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
                            ) : (
                                <div>
                                    <FieldArray
                                        name={parentKey || ''}
                                        render={(arrayHelpers) => {
                                            console.log('Data for obj', obj)
                                            return (
                                                <div>
                                                    <FormItem key={fieldName} label={key} className="col-span-1 w-full">
                                                        <Field
                                                            component={Input}
                                                            type="text"
                                                            placeholder={`Enter ${key}`}
                                                            name={fieldName}
                                                            value={val}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                                setFieldValue(fieldName, e.target.value)
                                                            }
                                                        />
                                                    </FormItem>
                                                    {/* {Object.entries(obj).map([key,value])=>{
                                                        return (
                                                            <div>
                                                                ss
                                                            </div>
                                                        )
                                                    }} */}
                                                </div>
                                            )
                                        }}
                                    />
                                </div>
                            )}
                        </FormItem>
                    )
                }
            })
        } else if (_.isArray(obj)) {
            return (
                <FieldArray
                    name={parentKey || ''}
                    render={(arrayHelpers) => (
                        <div>
                            {obj.map((item, index) => {
                                const arrayKey = parentKey ? `${parentKey}[${index}]` : `${index}`
                                console.log('FieldName of Array', arrayKey)

                                if (_.isPlainObject(item)) {
                                    return (
                                        <div key={arrayKey} className="col-span-1">
                                            <div className="text-lg font-medium mb-2">Data {index + 1}:</div>
                                            <div className="flex gap-2">
                                                <div className="grid grid-cols-2 gap-4">{renderFields(item, arrayKey, setFieldValue)}</div>
                                                <button
                                                    type="button"
                                                    onClick={() => arrayHelpers.remove(index)}
                                                    className="text-red-500 mt-2"
                                                >
                                                    <MdCancel className="text-xl text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                } else if (_.isArray(item)) {
                                    return (
                                        <div key={arrayKey} className="col-span-2 flex gap-2">
                                            {item.map((subItem, subIndex) => {
                                                console.log('Array checking for Filter dropdown', subItem)
                                                return (
                                                    <Field
                                                        key={`${arrayKey}[${subIndex}]`}
                                                        component={Input}
                                                        type="text"
                                                        placeholder={`Enter value for ${parentKey}[${index}][${subIndex}]`}
                                                        name={`${arrayKey}[${subIndex}]`}
                                                        value={subItem}
                                                        className="w-full"
                                                        onChange={(e: any) => setFieldValue(`${arrayKey}[${subIndex}]`, e.target.value)}
                                                    />
                                                )
                                            })}
                                            <button type="button" onClick={() => arrayHelpers.remove(index)} className="text-red-500 mt-2">
                                                <MdCancel className="text-xl text-red-600" />
                                            </button>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={arrayKey} className="flex gap-2">
                                            <Field
                                                component={Input}
                                                type="text"
                                                placeholder={`Enter value for ${parentKey}[${index}]`}
                                                name={arrayKey}
                                                value={item}
                                                onChange={(e: any) => setFieldValue(arrayKey, e.target.value)}
                                                className="w-full"
                                            />
                                            <button type="button" onClick={() => arrayHelpers.remove(index)} className="text-red-500 mt-2">
                                                <MdCancel className="text-xl text-red-600" />
                                            </button>
                                        </div>
                                    )
                                }
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
            )
        }
    }

    const handleSubmit = async (values: ConfigInterface) => {
        const handlingValueForAll = async (obj: any): Promise<any> => {
            if (Array.isArray(obj)) {
                return Promise.all(obj.map(async (item) => handlingValueForAll(item)))
            } else if (_.isPlainObject(obj)) {
                const entries = await Promise.all(
                    Object.entries(obj).map(async ([key, val]) => {
                        if (key.toLowerCase().includes('image') && Array.isArray(val)) {
                            const processedImage = await handleimage(key, val)
                            return [key, processedImage]
                        } else if (_.isPlainObject(val) || Array.isArray(val)) {
                            const nestedValue = await handlingValueForAll(val)
                            return [key, nestedValue]
                        } else {
                            return [key, val]
                        }
                    }),
                )
                return Object.fromEntries(entries)
            } else {
                return obj
            }
        }

        const body = {
            config_name: values.name,
            config_value: await handlingValueForAll(values.value),
        }

        console.log('Body of config', body)

        try {
            setShowSpinner(true)
            const response = await axiosInstance.post(`/app/configuration`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Configured',
            })
            // navigate(`/app/configurations`)
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failed to configure',
            })
        } finally {
            setShowSpinner(false)
        }
    }

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div>
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
                    <Form className="w-2/3">
                        <FormContainer>
                            <h5 className="mb-5 text-neutral-900">Edit Configurations</h5>

                            {EDITFIELDSARRAY.map((item, key) => (
                                <FormItem key={key} label={item.label} className="col-span-1 w-1/2">
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}

                            <FormContainer className="grid grid-cols-2 gap-10">
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
