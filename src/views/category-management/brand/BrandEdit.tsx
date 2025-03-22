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
import { FormModel, initialBrandValue } from './brandCommon'
import { fetchBrandData } from './brandUtils/brandApicalls'

const BrandEdit = () => {
    const navigate = useNavigate()
    const [catedate, setCateData] = useState<FormModel | null>(null)
    const [imagview, setImageView] = useState<string[]>([])
    const [logoview, setLogoView] = useState<string[]>([])
    const { id } = useParams()

    useEffect(() => {
        fetchBrandData(setCateData, setImageView, setLogoView, id)
    }, [id])

    const handleSubmit = async (values: FormModel) => {
        const formData = {
            ...values,
            images: values.image,
        }
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
    const initialValue = initialBrandValue(catedate)

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-full p-4 shadow-xl rounded-xl">
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
                            <FormItem className="flex gap-2">
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

export default BrandEdit
