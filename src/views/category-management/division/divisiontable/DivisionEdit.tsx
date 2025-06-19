/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Upload from '@/components/ui/Upload'
import { Field, Form, Formik } from 'formik'
import Select from '@/components/ui/Select'
import type { FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { RichTextEditor } from '@/components/shared'
import { beforeUpload } from '@/common/beforeUpload'

type FormModel = {
    id: number | undefined
    name: string | undefined
    division: number | undefined
    title: string | undefined
    description: string | undefined
    image: string | undefined
    footer: string | undefined
    quick_filter_tags: string | undefined
    position: number | undefined
    gender: string | undefined
    is_active: boolean | undefined
    create_date: string | undefined
    update_date: string | undefined
    is_try_and_buy: boolean | undefined
    last_updated_by: string | undefined
    images: File[]
}

const DivisionEdit = () => {
    const [catedate, setCateData] = useState<FormModel | null>(null)
    const [imagview, setImageView] = useState<string[]>([])

    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`division?id=${id}&dashboard=true`)
            const categoryData = response.data?.data[0] || {}
            setCateData(categoryData)
            setImageView(categoryData.image ? [categoryData.image] : [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const handleFileupload = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'category')

        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const newData = response.data.url
            setImageView(newData)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    const handleSubmit = async (values: FormModel) => {
        const formData = {
            ...values,
            footer: values.footer,
            images: values.image,
        }

        const filteredBody = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== '' && value !== null && value !== undefined),
        )
        try {
            const response = await axioisInstance.patch('division', filteredBody)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Division Changed Successfully',
            })
            navigate('/app/category/division')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Failed to edit',
            })
        }
    }

    if (!catedate) {
        return <div>Loading...</div>
    }

    const initialValue: FormModel = {
        id: catedate.id,
        name: catedate.name,
        division: catedate.division,
        title: catedate.title,
        description: catedate.description,
        image: catedate.image,
        footer: catedate.footer,
        quick_filter_tags: catedate.quick_filter_tags,
        position: catedate.position,
        gender: catedate.gender,
        is_active: catedate.is_active,
        create_date: catedate.create_date,
        update_date: catedate.update_date,
        is_try_and_buy: catedate.is_try_and_buy,
        last_updated_by: catedate.last_updated_by,
        images: [],
    }

    return (
        <div>
            <div className="text-xl mb-10">Division Edit</div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-full" onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}>
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem label="Division Name" className="col-span-1 w-1/2">
                                    <Field type="text" name="name" component={Input} />
                                </FormItem>
                                <FormItem label="Description" className="col-span-1 w-1/2">
                                    <Field type="text" name="description" component={Input} />
                                </FormItem>
                            </FormContainer>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <div className=" image w-[10%] h-[20%] mt-5  ">
                                    {imagview && imagview.length > 0 ? (
                                        imagview.map((img, index) => <img key={index} src={img} alt="img" className="rounded-xl" />)
                                    ) : (
                                        <p>No image</p>
                                    )}
                                </div>
                                <FormContainer className="mt-5">
                                    <FormItem
                                        label="ADD NEW IMAGE"
                                        invalid={Boolean(errors.image && touched.image)}
                                        errorMessage={errors.image as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="image">
                                            {({ form }: FieldProps<FormModel>) => (
                                                <>
                                                    <Upload
                                                        showList={false}
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.images}
                                                        onChange={async (files) => {
                                                            const uploadedImage = await handleFileupload(files)
                                                            {
                                                                form.setFieldValue('image', uploadedImage)
                                                                setImageView([uploadedImage])
                                                            }
                                                        }}
                                                        onFileRemove={(files) => form.setFieldValue('image', files)}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                    <br />
                                </FormContainer>
                            </FormContainer>
                            <FormContainer>
                                <FormItem
                                    label="Footer"
                                    labelClass="!justify-start"
                                    invalid={errors.footer && touched.footer}
                                    errorMessage={errors.footer}
                                    className="col-span-1 w-full"
                                >
                                    <Field name="footer">
                                        {({ field, form }: FieldProps) => (
                                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem label="Quick Filter Tag" className="col-span-1 w-1/2">
                                    <Field as="textarea" name="quick_filter_tags" component={Input} />
                                </FormItem>

                                <FormItem label="position" className="col-span-1 w-1/2">
                                    <Field type="text" name="position" component={Input} />
                                </FormItem>
                                <FormItem label="Gender" className="col-span-1 w-1/2">
                                    <Field name="gender">
                                        {({ field, form }: FieldProps<any>) => {
                                            const genderOptions = [
                                                { value: 'Men', label: 'Men' },
                                                { value: 'Women', label: 'Women' },
                                            ]

                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={genderOptions}
                                                    value={genderOptions.find((option) => option.value === field.value)}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/* Select boxes......................................................................... */}
                            <FormItem label="ACTIVE">
                                <Field name="is_active" component={Checkbox}>
                                    Active
                                </Field>
                            </FormItem>

                            <FormItem label="TRY_&_BUY">
                                <Field name="is_try_and_buy" component={Checkbox}>
                                    Try and Buy
                                </Field>
                            </FormItem>

                            <FormItem>
                                <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit">
                                    Submit
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default DivisionEdit
