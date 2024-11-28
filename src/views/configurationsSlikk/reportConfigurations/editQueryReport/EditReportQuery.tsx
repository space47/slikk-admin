/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldArray } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { RichTextEditor } from '@/components/shared'
import Select from '@/components/ui/Select'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { Checkbox } from '@/components/ui'
import { ExtraAttributes } from './ExtraAttributes'

const reportQueryNames = [
    { label: 'Date', value: 'Date' },
    { label: 'Number', value: 'Number' },
    { label: 'String', value: 'String' },
    { label: 'Boolean', value: 'Boolean' },
    { label: 'Select', value: 'Select' },
    { label: 'MulltiSelect', value: 'MultiSelect' },
]

const EditReportQuery = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    console.log('edit Report')

    const [reportData, setReportData] = useState({
        name: '',
        display_name: '',
        value: [
            {
                key: '',
                value: {
                    name: '',
                    display_name: '',
                    position: 0,
                    extra_attributes: {
                        is_graph: false,
                        x_axis: '',
                        y_axis: '',
                        secondary_y_axis: '',
                        graph_type: '',
                    },
                    query: '',
                },
            },
        ],
        required_fields: [{ key: '', value: '', dataType: 'String', prefix: '', suffix: '' }],
    })

    const fetchReportApi = async () => {
        try {
            const response = await axioisInstance.get(`/query/config?id=${id}`)
            const data = response?.data?.data

            const formattedData = {
                name: data?.results[0]?.name || '',
                display_name: data?.results[0]?.display_name || '',
                value:
                    data?.results[0]?.value.map((item: any) => ({
                        name: item.name,
                        display_name: item.display_name,
                        position: item.position,
                        query: item.query,
                        extra_attributes: {
                            is_graph: item.extra_attributes?.is_graph || false,
                            x_axis: item?.extra_attributes?.x_axis || '',
                            y_axis: item?.extra_attributes?.y_axis || '',
                            secondary_y_axis: item?.extra_attributes?.secondary_y_axis || '',
                            graph_type: item?.extra_attributes?.graph_type || '',
                        },
                    })) || [],
                // value: [],

                required_fields: Object.entries(data?.results[0]?.required_fields || {}).map(([key, fullValue]) => {
                    const [dataType, value] = fullValue.split('_')
                    return { key, value, dataType: dataType || 'String' }
                }),
            }

            setReportData(formattedData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchReportApi()
    }, [id])

    const handleSubmit = async (values: any) => {
        const formattedRequiredFields = values.required_fields.reduce((result: any, item: any) => {
            if (item.key) {
                if (item.dataType === 'MultiSelect') {
                    const multiSelectValues = item.value.split(',').map((val: string) => {
                        val = val.trim()
                        return `'${item.prefix || ''}${val}${item.suffix || ''}'`
                    })
                    result[item.key] = `(${multiSelectValues.join(',')})`
                } else {
                    const value = item.value.trim()
                    result[item.key] = `${item.prefix || ''}${value}${item.suffix || ''}`
                }
            }
            return result
        }, {})

        console.log('ok the final stage', values.value)
        const updatedValues = values.value.map((item: any) => {
            const parser = new DOMParser()
            const htmlDoc = parser.parseFromString(item.query, 'text/html')
            const plainTextValue = htmlDoc.body.textContent || ''
            return {
                ...item,
                query: plainTextValue,
                extra_attributes: {
                    is_graph: item?.extra_attributes?.is_graph,
                    x_axis: item?.extra_attributes?.x_axis,
                    y_axis: item?.extra_attributes?.y_axis,
                    secondary_y_axis: item?.extra_attributes?.secondary_y_axis,
                    graph_type: item?.extra_attributes?.graph_type ? item?.extra_attributes?.graph_type : 'line',
                },
            }
        })

        const body = {
            ...values,
            value: updatedValues,
            required_fields: formattedRequiredFields,
        }
        console.log('Body', body)

        try {
            const response = await axioisInstance.patch(`/query/config/${id}`, body)
            notification.success({
                message: response?.data.message || 'Successfully updated query',
            })
            // navigate(`/app/reportConfigurations`)
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to update query',
            })
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Edit Report Query</h3>
            <Formik initialValues={reportData} enableReinitialize onSubmit={handleSubmit}>
                {({ values, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormItem label="Unique Report Name" className="col-span-1 w-1/2">
                                <Field type="text" name="name" placeholder="Enter Name" component={Input} />
                            </FormItem>
                            <FormItem label="Report Display Name" className="col-span-1 w-1/2">
                                <Field type="text" name="display_name" placeholder="Enter Display Name" component={Input} />
                            </FormItem>
                            <FormItem label="Query List" labelClass="!justify-start" className="col-span-1 w-full">
                                <FieldArray name="value">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.value.map((item, index) => (
                                                <div key={index} className="flex flex-col gap-4 mt-2">
                                                    <div className="flex space-x-4 items-center">
                                                        <FormItem label="name">
                                                            <Field
                                                                name={`value[${index}].name`}
                                                                placeholder="Enter Query Name"
                                                                component={Input}
                                                                className="w-auto"
                                                            />
                                                        </FormItem>
                                                        <FormItem label="Display Name">
                                                            <Field
                                                                name={`value[${index}].display_name`}
                                                                placeholder="Enter Display Name"
                                                                component={Input}
                                                                className="w-auto"
                                                            />
                                                        </FormItem>
                                                        <FormItem label="Position">
                                                            <Field
                                                                name={`value[${index}].position`}
                                                                type="number"
                                                                placeholder="Position"
                                                                component={Input}
                                                                className="w-full"
                                                            />
                                                        </FormItem>
                                                    </div>
                                                    <FormContainer className="flex gap-5 ">
                                                        {ExtraAttributes.map((item, key) => (
                                                            <FormContainer key={key} className="">
                                                                <FormItem label={item.label}>
                                                                    <Field
                                                                        name={`value[${index}].${item.name}`}
                                                                        type={item.type}
                                                                        placeholder={`Enter ${item.label}`}
                                                                        component={item.component}
                                                                    />
                                                                </FormItem>
                                                            </FormContainer>
                                                        ))}
                                                    </FormContainer>
                                                    <FormItem label="Query">
                                                        <Field name={`value[${index}].query`}>
                                                            {({ field, form }: any) => (
                                                                <RichTextEditor
                                                                    value={field.value}
                                                                    onChange={(val) => form.setFieldValue(field.name, val)}
                                                                    className="w-full"
                                                                />
                                                            )}
                                                        </Field>
                                                        <button
                                                            type="button"
                                                            className="text-red-600 hover:text-red-800 transition"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <MdCancel className="text-2xl" />
                                                        </button>
                                                    </FormItem>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    push({
                                                        name: '',
                                                        display_name: '',
                                                        position: 0,
                                                        is_graph: false,
                                                        query: '',
                                                    })
                                                }
                                                className="mt-3 flex items-center text-white bg-black px-2 py-2 rounded-lg hover:text-gray-200 transition"
                                            >
                                                <IoIosAddCircle className="text-2xl mr-1" />
                                                Add Query
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </FormItem>

                            <FormItem asterisk label="Required Fields" className="col-span-1 w-[60%] h-[80%]">
                                <FieldArray name="required_fields">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.required_fields.map((item, index) => (
                                                <div key={index} className="flex space-x-4 mt-2">
                                                    <Field
                                                        name={`required_fields[${index}].key`}
                                                        placeholder="Key"
                                                        component={Input}
                                                        className="w-1/3"
                                                    />
                                                    <Field name={`required_fields[${index}].dataType`}>
                                                        {({ field, form }: any) => (
                                                            <Select
                                                                className="w-1/4"
                                                                placeholder="Select dataType"
                                                                options={reportQueryNames}
                                                                value={reportQueryNames.find((option) => option.value === field.value)}
                                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name={`required_fields[${index}].value`}>
                                                        {({ field }: any) => {
                                                            const dataType = values.required_fields[index].dataType
                                                            return (
                                                                <Input
                                                                    type={dataType === 'Date' ? 'date' : 'text'}
                                                                    placeholder={dataType === 'Date' ? 'Select date' : 'Enter value'}
                                                                    {...field}
                                                                    className="w-1/3"
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                    <Field
                                                        name={`required_fields[${index}].prefix`}
                                                        placeholder="Enter Prefix"
                                                        component={Input}
                                                        className="w-1/3"
                                                    />
                                                    <Field
                                                        name={`required_fields[${index}].suffix`}
                                                        placeholder="Enter suffix"
                                                        component={Input}
                                                        className="w-1/3"
                                                    />
                                                    <button type="button" onClick={() => remove(index)}>
                                                        <MdCancel className="text-xl text-red-600" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => push({ key: '', value: '', dataType: 'String', prefix: '', suffix: '' })}
                                                className="mt-3"
                                            >
                                                <IoIosAddCircle className="text-green-600 text-xl" />
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </FormItem>

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className=" text-white">
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

export default EditReportQuery
