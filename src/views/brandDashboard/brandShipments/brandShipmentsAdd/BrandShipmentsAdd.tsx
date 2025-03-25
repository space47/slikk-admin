/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandShipmentsForm from '../brandShipmentsUtils/BrandSeriesForm'
import { handleimage } from '@/common/handleImage'

const BrandShipmentsAdd = () => {
    const navigate = useNavigate()

    const initialValue = {}

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
            document: imageUpload,
            dispatched_by: values?.dispatched_by,
            received_by: values?.received_by?.mobile,
            box_count: values?.box_count,
            items_count: values?.items_count,
        }
        console.log('body is', body)
    }

    return (
        <div className="bg-gray-100 rounded-2xl">
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
                            <BrandShipmentsForm setFieldValue={setFieldValue} values={values} resetForm={resetForm} />
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

export default BrandShipmentsAdd
