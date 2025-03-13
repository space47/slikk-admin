/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { checkBoxFields, textField } from './component/textFields.common'
import ImageField from './component/ImageField'
import { RichTextEditor } from '@/components/shared'
import { beforeUpload } from '@/common/beforeUpload'
import LoadingSpinner from '@/common/LoadingSpinner'

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
    logo_array: File[]
    logo: string
}

const BrandEdit = () => {
    const [catedate, setCateData] = useState<FormModel | null>(null)
    const [imagview, setImageView] = useState<string[]>([])
    const [logoview, setLogoView] = useState<string[]>([])
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`brands?id=${id}&dashboard=true`)
            const categoryData = response.data?.data.results[0] || {}
            setCateData(categoryData)
            setImageView(categoryData.image ? [categoryData.image] : [])
            setLogoView(categoryData.logo ? [categoryData.logo] : [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                description: response?.data?.message || 'Brand has been Successfully Updated',
            })
            navigate('/app/category/brand')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Failed to edit Brand',
            })
        }
    }

    if (!catedate) {
        return <LoadingSpinner />
    }

    const initialValue: FormModel = {
        id: catedate?.id,
        name: catedate?.name,
        title: catedate?.title,
        description: catedate?.description,
        image: catedate?.image,
        footer: catedate?.footer,
        quick_filter_tags: catedate?.quick_filter_tags,
        is_top: catedate?.is_top,
        is_exclusive: catedate?.is_exclusive,
        is_private: catedate?.is_private,
        is_active: catedate?.is_active,
        create_date: catedate?.create_date,
        update_date: catedate?.update_date,
        is_try_and_buy: catedate?.is_try_and_buy,
        last_updated_by: catedate?.last_updated_by,
        images: [],
        logo_array: [],
        logo: catedate?.logo,
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

                            <FormItem label="Brand Logo">
                                <ImageField
                                    label="ADD NEW LOGO"
                                    name="logo"
                                    beforeUpload={beforeUpload}
                                    fileList={values.logo_array}
                                    setImageView={setLogoView}
                                    imagview={logoview}
                                />
                            </FormItem>
                            <FormItem label="Brand Image">
                                <ImageField
                                    label="ADD NEW IMAGE"
                                    name="image"
                                    beforeUpload={beforeUpload}
                                    fileList={values.images}
                                    setImageView={setImageView}
                                    imagview={imagview}
                                />
                            </FormItem>

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
