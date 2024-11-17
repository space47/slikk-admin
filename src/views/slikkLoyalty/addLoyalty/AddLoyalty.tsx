/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const AddLoyalty = () => {
    const navigate = useNavigate()

    const initialValue = {}

    const handleSubmit = async () => {}

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Seller Details</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            \{/* ------------------------------------------------------------------------------------------------ */}
                            <FormContainer className="grid grid-cols-2 gap-10 ">
                                <FormItem label="" className="">
                                    <Field type="" name="" placeholder="" component={Input} />
                                </FormItem>
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

export default AddLoyalty
