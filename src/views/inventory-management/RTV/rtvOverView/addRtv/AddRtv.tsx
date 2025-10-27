/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import RtvCommonForm from '../rtvComponents/RtvCommonForm'
import { rtvService } from '@/store/services/rtvService'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import FormButton from '@/components/ui/Button/FormButton'

const AddRtv = () => {
    const navigate = useNavigate()
    const [pack, packResponse] = rtvService.usePackRtvMutation()

    useEffect(() => {
        if (packResponse?.isSuccess) {
            notification.success({ message: packResponse?.data?.message || 'Successfully Packed' })
            navigate(-1)
        }
        if (packResponse?.isError) {
            notification.error({ message: (packResponse?.error as any)?.data?.message || 'Failed to pack' })
        }
    }, [packResponse.isSuccess, packResponse.isError])

    const handleSubmit = (values: any) => {
        pack({
            document_number: values?.document_number,
            company: values?.company,
            store: values?.store?.id,
        })
    }

    return (
        <div>
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                {() => {
                    return (
                        <Form>
                            <RtvCommonForm />
                            <FormButton value="Add" isSpinning={packResponse?.isLoading} />
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default AddRtv
