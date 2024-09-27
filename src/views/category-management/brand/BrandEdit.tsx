/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Upload from '@/components/ui/Upload'
import Textarea from '@/views/ui-components/forms/Input/Textarea'
import { Field, Form, Formik } from 'formik'
import Select from '@/components/ui/Select'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { checkBoxFields, textField } from './component/textFields.common'
import ImageField from './component/ImageField'
import { RichTextEditor } from '@/components/shared'

export type FormModel = {
    id: number
    name: string
    title: string
    description: string
    image: string
    is_top: boolean
    is_exclusive: boolean
    is_private: boolean
    footer: string | null
    quick_filter_tags: string[]
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    last_updated_by: string | null
    images: File[]
}

interface Option {
    value: number
    label: string
}

const MIN_UPLOAD = 1
const MAX_UPLOAD = 8

const BrandEdit = () => {
    const [catedate, setCateData] = useState<FormModel | null>(null)

    const [imagview, setImageView] = useState<string[]>([])

    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`brands?id=${id}`)
            const categoryData = response.data?.data.results[0] || {}
            setCateData(categoryData)
            setImageView(categoryData.image ? [categoryData.image] : [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]
        const MAX_FILE_SIZE = 5000000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a valid file format'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }

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
            images: values.image,
        }

        console.log('formDaata', formData)

        try {
            const response = await axioisInstance.patch(`brands/${id}`, formData)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Category Changed Successfully',
            })
            navigate('/app/category/brand')
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
        title: catedate.title,
        description: catedate.description,
        image: catedate.image,
        footer: catedate.footer,
        quick_filter_tags: catedate.quick_filter_tags,
        is_top: catedate.is_top,
        is_exclusive: catedate.is_exclusive,
        is_private: catedate.is_private,
        is_active: catedate.is_active,
        create_date: catedate.create_date,
        update_date: catedate.update_date,
        is_try_and_buy: catedate.is_try_and_buy,
        last_updated_by: catedate.last_updated_by,
        images: [],
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-3 ">
                                {textField.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.className}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            component={Input}
                                            onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                        />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            <FormContainer className="flex flex-row gap-7 ">
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

                            {/* Image */}

                            <ImageField
                                label="ADD NEW IMAGE"
                                name="image"
                                beforeUpload={beforeUpload}
                                fileList={values.images}
                                handleFileupload={handleFileupload}
                                setImageView={setImageView}
                                imagview={imagview}
                            />

                            {/* Select boxes......................................................................... */}

                            {checkBoxFields.map((item, key) => (
                                <FormItem key={key} label={item.label}>
                                    <Field
                                        name={item.name}
                                        component={Checkbox}
                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                    >
                                        {item.fieldName}
                                    </Field>
                                </FormItem>
                            ))}

                            {/* Handle Submit........................... */}

                            <FormItem>
                                <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    // onClick={() => handleSubmit()}
                                >
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

export default BrandEdit
