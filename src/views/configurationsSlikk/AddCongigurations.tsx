import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'

interface OBJECTVALUE {
    key: string
    value: string
}

interface CONFIGPROPS {
    config_name: string
    config_value: any
    component_type?: string
}

const CONFIG_CATEGORY_TYPES = [
    {
        label: 'String',
        value: 'string',
    },
    {
        label: 'Array',
        value: 'array',
    },
    {
        label: 'Object',
        value: 'object',
    },
]

const AddConfigurations = () => {
    const [componentType, setComponentType] = useState<string>('')

    const initialValue: CONFIGPROPS = {
        config_name: '',
        config_value: componentType === 'array' || componentType === 'object' ? [] : '',
        component_type: '',
    }

    const handleSubmit = async (values: CONFIGPROPS) => {
        console.log('Form Submitted: ', values)

        let configuration_value: any

        if (componentType === 'string') {
            configuration_value = values.config_value
        } else if (componentType === 'array') {
            configuration_value = values.config_value ? values.config_value.split(',') : []
        } else if (componentType === 'object') {
            configuration_value = values.config_value.reduce((obj: any, item: OBJECTVALUE) => {
                obj[item.key] = item.value
                return obj
            }, {})
        }

        const body = {
            config_name: values.config_name,
            config_value: configuration_value,
        }

        try {
            const response = await axioisInstance.post(`/app/configuration`, body)
            notification.success({
                message: response?.data.message || 'Configuration Successfully Created',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to create configuration',
            })
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                <FormItem asterisk label="Configuration Name" className="w-1/2">
                                    <Field type="text" name="config_name" placeholder="Enter Config Name" component={Input} />
                                </FormItem>
                            </FormContainer>

                            <FormItem asterisk label="Select Configuration Type" className="col-span-1 w-[60%] h-[80%]">
                                <Field name="component_type">
                                    {({ field, form }: FieldProps<any>) => (
                                        <Select
                                            field={field}
                                            form={form}
                                            options={CONFIG_CATEGORY_TYPES}
                                            value={CONFIG_CATEGORY_TYPES.find((option) => option.value === field.value)}
                                            onChange={(option) => {
                                                const value = option ? option.value : ''
                                                form.setFieldValue(field.name, value)
                                                form.setFieldValue('config_value', value === 'string' ? '' : [])
                                                setComponentType(value)
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            {componentType === 'array' || componentType === 'object' ? (
                                <FieldArray name="config_value">
                                    {({ push }) => (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (values.component_type === 'object') {
                                                        push({ key: '', value: '' })
                                                    } else {
                                                        push('')
                                                    }
                                                }}
                                                className="mt-3 bg-none border-none "
                                            >
                                                <IoIosAddCircle className="text-green-600 text-xl" />
                                            </button>

                                            {Array.isArray(values.config_value) &&
                                                values.config_value.map((item: any, index: number) => (
                                                    <div key={index} className="flex space-x-4 mt-2">
                                                        {componentType === 'object' ? (
                                                            <>
                                                                <Field
                                                                    name={`config_value[${index}].key`}
                                                                    placeholder="Key"
                                                                    component={Input}
                                                                    className="w-1/2"
                                                                />
                                                                <Field
                                                                    name={`config_value[${index}].value`}
                                                                    placeholder="Value"
                                                                    component={Input}
                                                                    className="w-1/2"
                                                                />
                                                            </>
                                                        ) : (
                                                            <Field
                                                                name={`config_value[${index}]`}
                                                                placeholder="Enter Value"
                                                                component={Input}
                                                                className="w-full"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </FieldArray>
                            ) : (
                                <FormItem asterisk label="Configuration Value">
                                    <Field
                                        type="text"
                                        name="config_value"
                                        placeholder="Enter Config Value"
                                        component={Input}
                                        className="w-full"
                                    />
                                </FormItem>
                            )}

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className="text-white">
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

export default AddConfigurations
