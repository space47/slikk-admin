/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleimage } from '@/common/handleImage'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { textParser } from '@/common/textParser'
import BrandShipmentForm from '../brandShipmentsUtils/BrandShipmentForm'

const BrandShipmentsAdd = () => {
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const [showSpinner, setShowSpinner] = useState(false)

    const handleSubmit = async (values: any) => {
        try {
            notification.info({ message: 'In Process' })
            const imageUpload = values?.itemsArray && values?.itemsArray.length > 0 ? await handleimage('product', values?.itemsArray) : ''
            const deliveryAddress = values?.delivery_address ? textParser(values?.delivery_address) : ''
            const originAddress = values?.origin_address ? textParser(values?.origin_address) : ''
            const body = {
                company: selectedCompany?.currCompany?.id,
                store: values?.store?.join(','),
                shipment_id: values?.shipment_id,
                name: values?.name,
                origin_address: originAddress,
                delivery_address: deliveryAddress,
                awb_number: values?.awb_number,
                dispatch_date: values?.dispatch_date,
                delivery_date: values?.delivery_date,
                document: imageUpload,
                dispatched_by: values?.dispatched_by,
                received_by: values?.received_by?.mobile,
                box_count: values?.box_count,
                items_count: values?.items_count,
            }
            const response = await axioisInstance.post(`/product-shipment`, body)
            notification.success({
                message: response?.data?.message || 'Successfully updated shipment',
            })
            const shipmentId = response?.data?.data?.id

            if (values?.csvArray?.length > 0) {
                try {
                    setShowSpinner(true)
                    notification.info({
                        message: 'CSV upload is in progress',
                    })
                    const formData = new FormData()
                    formData.append('shipment_items_file', values.csvArray[0])
                    formData.append('shipment_id', shipmentId)
                    await axioisInstance.post(`/shipment/bulkupload/items`, formData)
                    notification.success({
                        message: 'CSV uploaded successfully',
                    })
                    navigate(-1)
                } catch (csvError) {
                    notification.error({
                        message: 'Failed to upload CSV',
                    })
                    console.error(csvError)
                } finally {
                    setShowSpinner(false)
                }
            }

            return { id: shipmentId }
        } catch (error: any) {
            console.error('error', error)
            notification.error({
                message: error?.response?.data?.message || 'Failed to Update',
            })
        } finally {
            setShowSpinner(false)
        }
    }

    return (
        <div className="bg-gray-50 rounded-2xl">
            <div className="flex text-xl font-bold mb-10">Add New Shipment</div>

            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {({ values }: any) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl ">
                        <BrandShipmentForm values={values} />
                        <FormContainer className="flex justify-end">
                            <Button variant="blue" type="submit" loading={showSpinner}>
                                Create New Shipment
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default BrandShipmentsAdd
