/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldArray, FieldProps } from 'formik'
import { useNavigate } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { RichTextEditor } from '@/components/shared'
import Select from '@/components/ui/Select'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { ExtraAttributes } from '../editQueryReport/ExtraAttributes'

const reportQueryNames = [
    { label: 'Date', value: 'Date' },
    { label: 'Number', value: 'Number' },
    { label: 'String', value: 'String' },
    { label: 'Boolean', value: 'Boolean' },
    { label: 'Select', value: 'Select' },
    { label: 'MultiSelect', value: 'MultiSelect' },
]

const AddReportQuery = () => {
    const navigate = useNavigate()

    const initialValue = {
        name: '',
        display_name: '',
        value: [
            {
                name: '',
                display_name: '',
                position: 0,
                is_graph: false,
                query: '',
                extra_attributes: {},
            },
        ],
        required_fields: [{ key: '', value: '', dataType: 'String', prefix: '' }],
    }

    const handleSubmit = async (values: any) => {
        console.log('Submitting form...', values)

        try {
            const formattedRequiredFields = values.required_fields.reduce((obj: any, item: any) => {
                if (item.key) {
                    if (item.dataType === 'MultiSelect') {
                        const multiSelectValues = item.value.split(',')
                        // obj[item.key] = multiSelectValues.map((val: string) => (item.prefix ? `${item.prefix}_${val.trim()}` : val.trim()))
                        if (item?.prefix) {
                            obj[item.key] = multiSelectValues.map((val: string) => `${item.prefix}_${val.trim()}`)
                        } else {
                            obj[item.key] = multiSelectValues.map((val: string) => val.trim())
                        }
                    } else {
                        obj[item.key] = `${item.dataType}_${item.value}`
                    }
                }
                return obj
            }, {})

            const updatedValues = values.value.map((item: any, index: number) => {
                if (!item.query) {
                    throw new Error(`Missing query for value at index ${index}`)
                }
                const parser = new DOMParser()
                const htmlDoc = parser.parseFromString(item.query, 'text/html')
                const plainTextValue = htmlDoc.body.textContent || ''
                return {
                    ...item,
                    query: plainTextValue.trim(),
                    extra_attributes: {
                        is_graph: item.extra_attributes?.is_graph || false,
                        x_axis: item.extra_attributes?.x_axis || null,
                        y_axis: item.extra_attributes?.y_axis || null,
                        secondary_y_axis: item.extra_attributes?.secondary_y_axis || null,
                        graph_type: item.extra_attributes?.graph_type || null,
                    },
                }
            })

            const body = {
                ...values,
                value: updatedValues,
                required_fields: formattedRequiredFields,
            }

            console.log('API payload:', body)

            const response = await axioisInstance.post(`/query/config`, body)

            notification.success({
                message: response?.data?.message || 'Successfully added query',
            })
            console.log('API response:', response)
        } catch (error: any) {
            console.error('Error during API call:', error.message || error)
            notification.error({
                message: error?.message || 'Failed to add query',
            })
        }
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h3 className="mb-5 text-xl font-semibold text-neutral-900">Add Report Query</h3>
            <Formik initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm }) => (
                    <Form className="w-full lg:w-2/3">
                        <FormContainer>
                            <FormItem label="Name" className="col-span-1 w-full lg:w-1/2 mb-4">
                                <Field type="text" name="name" placeholder="Enter Name" component={Input} />
                            </FormItem>
                            <FormItem label="Report Display Name" className="col-span-1 w-full lg:w-1/2 mb-4">
                                <Field type="text" name="display_name" placeholder="Enter Display Name" component={Input} />
                            </FormItem>
                            <FormItem label="Query List" labelClass="!justify-start" className="col-span-1 w-full mb-4">
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
                                                                className="w-3/4"
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
                                                            {({ field, form }: FieldProps) => (
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
                            <FormItem asterisk label="Required Fields" className="col-span-1 w-full lg:w-[60%] mb-4">
                                <FieldArray name="required_fields">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.required_fields.map((item, index) => (
                                                <div key={index} className="flex space-x-4 mt-2 items-center">
                                                    <Field
                                                        name={`required_fields[${index}].key`}
                                                        placeholder="Key"
                                                        component={Input}
                                                        className="w-1/3"
                                                    />
                                                    <Field name={`required_fields[${index}].dataType`}>
                                                        {({ field, form }: FieldProps) => (
                                                            <Select
                                                                placeholder="Select dataType"
                                                                options={reportQueryNames}
                                                                value={reportQueryNames.find((option) => option.value === field.value)}
                                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                                className="w-1/3"
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name={`required_fields[${index}].value`}>
                                                        {({ field }: FieldProps) => {
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
                                                    <button
                                                        type="button"
                                                        className="text-red-600 hover:text-red-800 transition"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <MdCancel className="text-2xl" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => push({ key: '', value: '', dataType: 'String', prefix: '' })}
                                                className="mt-3 flex items-center text-green-600 hover:text-green-800 transition"
                                            >
                                                <IoIosAddCircle className="text-2xl mr-1" />
                                                Add Required Field
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </FormItem>

                            <div className="flex justify-end mt-6 space-x-4">
                                <Button type="reset" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddReportQuery
