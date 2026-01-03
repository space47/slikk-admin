/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd'
import { Formik } from 'formik'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GdnForm from '../GdnForm'
import { handleimage } from '@/common/handleImage'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import AccessDenied from '@/views/pages/AccessDenied'
import LoadingSpinner from '@/common/LoadingSpinner'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { getChangedValues } from '@/common/objectDiff'
import { gdnService } from '@/store/services/gdnService'

const EditGdn = () => {
    const navigate = useNavigate()
    const [imagview, setImageView] = useState<string[]>([])
    const { document_number } = useParams()
    const { data, loading, responseStatus } = useFetchApi<any>({ url: `/goods/dispatch?document_number=${document_number}` })
    const [updateGdn, updateResponse] = gdnService.useUpdateGdnMutation()

    useEffect(() => {
        if (document_number) {
            setImageView(data[0]?.images.split(',') || [])
        }
    }, [document_number, data])

    useEffect(() => {
        if (updateResponse.isSuccess) {
            notification.success({ message: updateResponse.data.message })
            navigate('/app/goods/gdn')
        }
        if (updateResponse.isError) {
            notification.error({ message: (updateResponse.error as any).data.message })
        }
    }, [updateResponse.isSuccess, updateResponse.isError])

    const initialValue = {
        document_number: data[0]?.document_number || '',
        company: data[0]?.company || '',
        dispatched_by: data[0]?.dispatched_by?.mobile || '',
        document_date: data[0]?.create_date ? moment(data[0]?.document_date).format('YYYY-MM-DD') : '',
        origin_address: data[0]?.origin_address || '',
        delivery_address: data[0]?.delivery_address || '',
        total_sku: data[0]?.total_sku || null,
        total_quantity: data[0]?.total_quantity || null,
        document: data[0]?.document || '',
        images: data[0]?.images || '',
        store: data[0]?.store || '',
    }

    const processUpload = async (value: any, existingValue: any) => {
        let uploadResult = null
        if (value && value.length > 0) uploadResult = await handleimage('grn', value)
        if (uploadResult && existingValue) {
            return [uploadResult, existingValue].join(',')
        } else if (uploadResult) {
            return uploadResult
        } else {
            return existingValue
        }
    }

    const handleSubmit = async (values: any) => {
        const docsShow = await processUpload(values.files, values.document)
        const imageShow = await processUpload(values.image, values.images)
        const body = {
            document_number: values?.document_number,
            company: values?.company || '',
            document_date: moment(values.document_date).format('YYYY-MM-DD') || '',
            dispatched_by: values.dispatched_by || '',
            origin_address: values.origin_address || '',
            delivery_address: values.delivery_address || '',
            total_sku: values.total_sku || '',
            total_quantity: values.total_quantity || '',
            document: docsShow || '',
            images: imageShow || '',
        }

        const filteredBody = filterEmptyValues(body)
        const changedValues = getChangedValues(filteredBody as any, initialValue)
        updateGdn({ id: data[0]?.id, data: changedValues })
    }

    if (responseStatus === 403) {
        return <AccessDenied />
    }

    return (
        <div>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                    {({ values }) => (
                        <div>
                            <GdnForm values={values} imagview={imagview} spinner={updateResponse.isLoading} />
                        </div>
                    )}
                </Formik>
            )}
        </div>
    )
}

export default EditGdn
