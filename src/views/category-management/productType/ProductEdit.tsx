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
import { RichTextEditor } from '@/components/shared'
import { category, FormModel, Option } from './ProductTypeCommon'
import { beforeUpload } from '@/common/beforeUpload'

const ProductEdit = () => {
    const [catedate, setCateData] = useState<FormModel | null>(null)
    const [divdata, setDivData] = useState<category[]>()
    const [options, setOptions] = useState<Option[]>([])
    const [imagview, setImageView] = useState<string[]>([])
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`product-type?id=${id}`)
            const categoryData = response.data?.data[0] || {}
            setCateData(categoryData)
            setImageView(categoryData.image ? [categoryData.image] : [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDivision = async () => {
        try {
            const response = await axioisInstance.get(`sub-category`)
            const divisionData = response.data?.data || []
            setDivData(divisionData)
            const transformedOptions = divisionData.map((item: category) => ({
                value: item.id,
                label: item.name,
            }))
            setOptions(transformedOptions)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchDivision()
    }, [])

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

        console.log('formDaata', formData)

        try {
            const response = await axioisInstance.patch('product-type', formData)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Product Type Changed Successfully',
            })
            navigate('/app/category/productType')
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
        sub_category_name: catedate.sub_category_name,
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
        sub_category: catedate.sub_category,
        images: [],
    }

    return (
        <div>
            <div className="text-xl mb-10">EDIT PRODUCT TYPE</div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, touched, errors, resetForm }) => (
                    <Form className="p-4 w-full shadow-xl rounded-xl">
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    asterisk
                                    label="Product Type"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="name"
                                        component={Input}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' && e.preventDefault()
                                        }}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Sub-Category Name"
                                    invalid={errors.sub_category_name && touched.sub_category_name}
                                    errorMessage={errors.sub_category_name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field name="sub_category">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={options}
                                                value={options.find((option) => option.value === field.value)}
                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                onKeyDown={(e) => {
                                                    e.key === 'Enter' && e.preventDefault()
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/* Title and Description */}

                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    asterisk
                                    label="Title"
                                    invalid={errors.title && touched.title}
                                    errorMessage={errors.title}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="title"
                                        component={Input}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' && e.preventDefault()
                                        }}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Description"
                                    invalid={errors.description && touched.description}
                                    errorMessage={errors.description}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="description"
                                        component={Input}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' && e.preventDefault()
                                        }}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* Image upload */}

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
                                                        showList={false}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                    <br />
                                </FormContainer>
                            </FormContainer>

                            {/* Text area */}

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

                            {/* Quick Filter Tag, Position, and Gender */}

                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    asterisk
                                    label="Quick Filter Tag"
                                    invalid={errors.quick_filter_tags && touched.quick_filter_tags}
                                    errorMessage={errors.quick_filter_tags}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="quick_filter_tags"
                                        component={Input}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' && e.preventDefault()
                                        }}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="position"
                                    invalid={errors.position && touched.position}
                                    errorMessage={errors.position}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="position"
                                        component={Input}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' && e.preventDefault()
                                        }}
                                    />
                                </FormItem>
                                {/* gender */}

                                <FormItem
                                    asterisk
                                    label="Gender"
                                    invalid={errors.gender && touched.gender}
                                    errorMessage={errors.gender}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field name="gender">
                                        {({ field, form }: FieldProps<any>) => {
                                            const genderOptions = [
                                                {
                                                    value: 'Men',
                                                    label: 'Men',
                                                },
                                                {
                                                    value: 'Women',
                                                    label: 'Women',
                                                },
                                            ]

                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={genderOptions}
                                                    value={genderOptions.find((option) => option.value === field.value)}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                    onKeyDown={(e) => {
                                                        e.key === 'Enter' && e.preventDefault()
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/* Select boxes */}
                            <FormItem label="ACTIVE" invalid={errors.is_active && touched.is_active}>
                                <Field
                                    name="is_active"
                                    component={Checkbox}
                                    onKeyDown={(e) => {
                                        e.key === 'Enter' && e.preventDefault()
                                    }}
                                >
                                    Active
                                </Field>
                            </FormItem>

                            <FormItem label="TRY_&_BUY" invalid={errors.is_try_and_buy && touched.is_try_and_buy}>
                                <Field
                                    name="is_try_and_buy"
                                    component={Checkbox}
                                    onKeyDown={(e) => {
                                        e.key === 'Enter' && e.preventDefault()
                                    }}
                                >
                                    Try and Buy
                                </Field>
                            </FormItem>

                            {/* Handle Submit */}

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

export default ProductEdit
