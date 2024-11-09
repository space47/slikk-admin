import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldArray, FieldProps } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { RichTextEditor } from '@/components/shared'
import Select from '@/components/ui/Select'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'

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

    const [reportData, setReportData] = useState({
        name: '',
        value: '',
        required_fields: [{ key: '', value: '', dataType: 'String' }],
    })

    const fetchReportApi = async () => {
        try {
            const response = await axioisInstance.get(`/query/config?id=${id}`)
            const data = response?.data?.data
            const formattedData = {
                name: data?.results[0]?.name || '',
                value: data?.results[0]?.value || '',
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
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(values.value, 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''

        console.log('FieldArray', values?.required_fields)
        const formatedRequiredFields = values.required_fields.reduce((obj: any, item: { key: string; value: any; dataType: string }) => {
            obj[item.key] = `${item.dataType}_${item.value}`
            return obj
        }, {})

        const body = {
            ...values,
            value: plainTextMessage || '',
            required_fields: formatedRequiredFields,
        }

        console.log('Value of body', body)

        try {
            const response = await axioisInstance.patch(`/query/config/${id}`, body)
            notification.success({
                message: response?.data.message || 'Successfully updated query',
            })
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
                            <FormItem label="Name" className="col-span-1 w-1/2">
                                <Field type="text" name="name" placeholder="Enter Name" component={Input} />
                            </FormItem>
                            <FormItem label="Value" labelClass="!justify-start" className="col-span-1 w-full">
                                <Field name="value">
                                    {({ field, form }: FieldProps) => (
                                        <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem asterisk label="Required Fields" className="col-span-1 w-[60%] h-[80%]">
                                <FieldArray name="required_fields">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.required_fields.map((item: any, index: number) => (
                                                <div key={index} className="flex space-x-4 mt-2">
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
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name={`required_fields[${index}].value`}>
                                                        {({ field, form }: FieldProps) => {
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
                                                    <button type="button" className="bg-none border-none" onClick={() => remove(index)}>
                                                        <MdCancel className="text-xl text-red-600" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => push({ key: '', value: '', dataType: 'String' })}
                                                className="mt-3 bg-none border-none"
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
