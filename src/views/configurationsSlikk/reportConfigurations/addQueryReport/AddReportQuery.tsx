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
        value: [{ key: '', value: '' }],
        required_fields: [{ key: '', value: '', dataType: 'String' }],
    }

    const handleSubmit = async (values: any) => {
        const formattedRequiredFields = values.required_fields.reduce((obj: any, item: { key: string; value: any; dataType: string }) => {
            obj[item.key] = `${item.dataType}_${item.value}`
            return obj
        }, {})

        const formattedValue = values.value.reduce((obj: any, item: { key: string; value: any }) => {
            const parser = new DOMParser()
            const htmlDoc = parser.parseFromString(item.value, 'text/html')
            const plainTextValue = htmlDoc.body.textContent || ''
            obj[item.key] = plainTextValue
            return obj
        }, {})

        const body = {
            ...values,
            value: formattedValue,
            required_fields: formattedRequiredFields,
        }

        try {
            const response = await axioisInstance.post(`/query/config`, body)
            notification.success({
                message: response?.data?.message || 'Successfully added query',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to add query',
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
                                                <div key={index} className="flex space-x-4 mt-2 items-center">
                                                    <div className="flex flex-col gap-2 w-full lg:w-2/3">
                                                        <Field
                                                            name={`value[${index}].key`}
                                                            placeholder="Enter Query Name"
                                                            component={Input}
                                                            className="w-1/4"
                                                        />
                                                        <Field name={`value[${index}].value`}>
                                                            {({ field, form }: FieldProps) => (
                                                                <RichTextEditor
                                                                    value={field.value}
                                                                    onChange={(val) => form.setFieldValue(field.name, val)}
                                                                    className="w-full"
                                                                />
                                                            )}
                                                        </Field>
                                                    </div>
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
                                                onClick={() => push({ key: '', value: '' })}
                                                className="mt-3 flex items-center text-green-600 hover:text-green-800 transition"
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
                                                onClick={() => push({ key: '', value: '', dataType: 'String' })}
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
