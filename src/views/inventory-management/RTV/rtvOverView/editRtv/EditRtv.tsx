/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RtvCommonForm from '../rtvComponents/RtvCommonForm'
import FormButton from '@/components/ui/Button/FormButton'
import { rtvService } from '@/store/services/rtvService'
import { Rtv_Data } from '@/store/types/rtv.types'
import { notification } from 'antd'

const EditRtv = () => {
    const { id } = useParams()
    const [rtvData, setRtvData] = useState<Rtv_Data>()
    const [updateRtv, updateResponse] = rtvService.useUpdateRtvMutation()
    const { data, isSuccess } = rtvService.useRtvDataQuery({ rtv_id: id })

    useEffect(() => {
        if (isSuccess) {
            setRtvData(data?.data?.results[0])
        }
    }, [isSuccess, data, id])

    console.log('rtvData', rtvData)

    const initialValue = {
        document_number: rtvData?.document_number,
        company: rtvData?.company,
        store: rtvData?.store,
    }

    useEffect(() => {
        if (updateResponse?.isSuccess) {
            notification.success({ message: updateResponse?.data?.message || 'Successfully Assigned' })
        }
        if (updateResponse?.isError) {
            notification.error({ message: (updateResponse?.error as any)?.data?.message || 'Failed to Assign' })
        }
    }, [updateResponse.isSuccess, updateResponse.isError])

    const handleSubmit = (values: any) => {
        updateRtv({
            id: id as any,
            document_number: values?.document_number,
            company: values?.company,
            store: values?.store?.id,
        })
    }

    return (
        <div>
            <Formik initialValues={initialValue} onSubmit={handleSubmit} enableReinitialize>
                {() => {
                    return (
                        <Form>
                            <RtvCommonForm />
                            <FormButton value="Update" isSpinning={updateResponse?.isLoading} />
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default EditRtv
