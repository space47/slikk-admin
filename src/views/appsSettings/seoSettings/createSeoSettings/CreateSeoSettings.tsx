import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { SeoFieldsArray } from './SeoFieldCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const CreateSeoSettings = () => {
    const [spinnerShow, setSpinnerShow] = useState(false)
    const initialValue = {
        name: '',
        type: '',
        url: '',
    }

    const handleSubmit = async (values: any) => {
        const body = {
            name: values?.name ?? '',
            type: values?.type ?? '',
            url: values?.url ?? '',
        }
        try {
            setSpinnerShow(true)
            const response = await axioisInstance.post(`/seo/links`, body)
            notification.success({
                message: response.data?.message || 'Successfully Created SEO',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failed to create SEO',
            })
        } finally {
            setSpinnerShow(false)
        }
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10 ">
                                {SeoFieldsArray.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={`Enter ${item?.name}`} component={Input} />
                                    </FormItem>
                                ))}
                            </FormContainer>

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

export default CreateSeoSettings
