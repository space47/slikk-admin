/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BrandShipmentsForm from '../brandShipmentsUtils/BrandSeriesForm'
import { handleimage } from '@/common/handleImage'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const BrandShipmentsEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [shipmentData, setShipmentData] = useState<any>()

    useEffect(() => {
        const fetchShipmentDetails = async () => {
            try {
                const response = await axioisInstance.get(`/product-shipment?id=${id}`)
                const data = response?.data?.data?.results || []
                setShipmentData(data[0])
            } catch (error) {
                console.error('Error fetching shipment details:', error)
            }
        }

        fetchShipmentDetails()
    }, [id])

    const initialValue = {
        company: shipmentData?.company,
        // store: shipmentData?.store,
        shipment_id: shipmentData?.shipment_id,
        name: shipmentData?.name,
        origin_address: shipmentData?.origin_address,
        delivery_address: shipmentData?.delivery_address,
        awb: shipmentData?.awb_number,
        dispatch_date: shipmentData?.dispatch_date,
        delivery_date: shipmentData?.delivery_date,
        document: shipmentData?.document,
        dispatched_by: shipmentData?.dispatched_by,
        received_by: shipmentData?.received_by?.mobile,
        box_count: shipmentData?.box_count,
        items_count: shipmentData?.items_count,
    }

    const textChanger = (value: any) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(value, 'text/html')
        const plainTextValue = htmlDoc.body.textContent || ''

        return plainTextValue
    }

    const handleSubmit = async (values: any) => {
        console.log('values are', values)
        const imageUpload = values?.itemsArray && values?.itemsArray.length > 0 ? await handleimage('product', values?.itemsArray) : ''
        const deliveryAdderss = values?.delivery_address ? textChanger(values?.delivery_address) : ''
        const originAddress = values?.origin_address ? textChanger(values?.origin_address) : ''

        const body = {
            company: values?.company,
            store: values?.store?.join(','),
            shipment_id: values?.shipment_id,
            name: values?.name,
            origin_address: originAddress,
            delivery_address: deliveryAdderss,
            awb_number: values?.awb,
            dispatch_date: values?.dispatch_date,
            delivery_date: values?.delivery_date,
            document: imageUpload ?? values?.document,
            dispatched_by: values?.dispatched_by,
            received_by: values?.received_by?.mobile,
            box_count: values?.box_count,
            items_count: values?.items_count,
        }
        const filteredBody = Object.fromEntries(
            Object.entries(body).filter(([_, value]) => value !== '' && value !== null && value !== undefined),
        )

        try {
            const response = await axioisInstance.patch(`/product-shipment/${id}`, filteredBody)
            notification.success({
                message: response?.data?.message || 'Successfully updated shipment',
            })
            navigate(-1)
        } catch (error: any) {
            console.log('error', error)
            notification.error({
                message: error?.response?.data?.message || 'Failed to Update',
            })
        }
    }

    return (
        <div className="bg-gray-50 rounded-2xl">
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, resetForm }) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl ">
                        <div className="flex text-xl font-bold mb-10">Add New Shipment</div>
                        <FormContainer className="">
                            <BrandShipmentsForm isEdit setFieldValue={setFieldValue} values={values} resetForm={resetForm} />
                        </FormContainer>
                        <FormContainer>
                            <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default BrandShipmentsEdit
