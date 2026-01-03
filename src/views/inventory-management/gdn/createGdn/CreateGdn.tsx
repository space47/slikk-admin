/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik'
import moment from 'moment'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GdnForm from '../GdnForm'
import { handleimage } from '@/common/handleImage'
import { gdnService } from '@/store/services/gdnService'
import { notification } from 'antd'

const CreateGdn = () => {
    const [createGdn, createResponse] = gdnService.useAddNewGdnMutation()
    const navigate = useNavigate()

    useEffect(() => {
        if (createResponse.isSuccess) {
            notification.success({ message: createResponse.data.message })
            navigate('/app/goods/gdn')
        }
        if (createResponse.isError) {
            notification.error({ message: (createResponse.error as any).data.message })
        }
    }, [createResponse.isSuccess, createResponse.isError])

    const handleSubmit = async (values: any) => {
        let docsUpload = null
        if (values.files && values.files.length > 0) {
            docsUpload = await handleimage('grn', values.files)
        }

        let imageUpload = null
        if (values.image && values.image.length > 0) {
            imageUpload = await handleimage('grn', values.image)
        }

        let docsShow = null
        if (docsUpload && values.document) {
            docsShow = [docsUpload, values.document].join(',')
        } else if (docsUpload) {
            docsShow = docsUpload
        } else if (values.document) {
            docsShow = values.document
        }

        let imageShow = null
        if (imageUpload && values.images) {
            imageShow = [imageUpload, values.images].join(',')
        } else if (imageUpload) {
            imageShow = imageUpload
        } else if (values.image) {
            imageShow = values.images
        }

        const formData = {
            ...(values?.document_number && { document_number: values.document_number }),
            ...(values?.company && { company: values?.company }),
            ...(values?.dispatched_by && { dispatched_by: values.dispatched_by }),
            ...(values?.document_date && { document_date: moment(values.document_date).format('YYYY-MM-DD') }),
            ...(values?.origin_address && { origin_address: values?.origin_address }),
            ...(values?.delivery_address && { delivery_address: values?.delivery_address }),
            ...(values?.total_sku && { total_sku: values.total_sku }),
            ...(values?.total_quantity && { total_quantity: values.total_quantity }),
            ...(docsShow && { document: docsShow }),
            ...(imageShow && { images: imageShow }),
            ...(values?.store?.id && { store: values.store.id }),
        }
        createGdn(formData)
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {({ values }) => (
                    <div>
                        <GdnForm values={values} imagview={[]} spinner={createResponse.isLoading} />
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default CreateGdn
