/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Progress, Spinner, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { handleimage } from '@/common/handleImage'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import BrandFormFirst from '../brandShipmentsUtils/BrandFormFirst'
import BrandFormSecond from '../brandShipmentsUtils/BrandFormSecond'
import BrandFormThirdStep from '../brandShipmentsUtils/BrandFormThirdStep'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useAppSelector } from '@/store'

const BrandShipmentsEdit = () => {
    const { id } = useParams()
    // const navigate = useNavigate()
    const [shipmentData, setShipmentData] = useState<any>()
    const [currentStep, setCurrentStep] = useState(0)
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const [shipmentItemsCount, setShipmentItemsCount] = useState(0)
    const [showSpinner, setShowSpinner] = useState(false)

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

    const fetchShipmentItemsCount = async (shipmentId: string | any) => {
        try {
            const response = await axioisInstance.get(`/product-shipment?view=detail&id=${shipmentId}`)
            const data = response?.data?.data?.results[0]
            setShipmentItemsCount(data?.upload_count)
        } catch (error) {
            console.error('Error fetching shipment details:', error)
        }
    }

    console.log('shipmentItemsCount', shipmentItemsCount)

    const initialValue = {
        company: selectedCompany?.currCompany?.id,
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
        console.log('values are', values?.csvArray?.length)

        try {
            const imageUpload = values?.itemsArray && values?.itemsArray.length > 0 ? await handleimage('product', values?.itemsArray) : ''
            const deliveryAddress = values?.delivery_address ? textChanger(values?.delivery_address) : ''
            const originAddress = values?.origin_address ? textChanger(values?.origin_address) : ''
            setShowSpinner(true)
            const body = {
                company: values?.company,
                store: values?.store?.join(','),
                shipment_id: values?.shipment_id,
                name: values?.name,
                origin_address: originAddress,
                delivery_address: deliveryAddress,
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

            const response = await axioisInstance.patch(`/product-shipment/${id}`, filteredBody)

            notification.success({
                message: response?.data?.message || 'Successfully updated shipment',
            })
            if (!values?.csvArray) {
                console.log('navigate', values?.csvArray?.length)
                // navigate(-1)
            }
            const shipmentId = response?.data?.data?.id
            console.log('shipmentId is', shipmentId)

            if (values?.csvArray?.length > 0) {
                console.log('is res here')
                try {
                    notification.info({
                        message: 'CSV upload is in progress',
                    })
                    const formData = new FormData()
                    formData.append('shipment_items_file', values.csvArray[0])
                    formData.append('shipment_id', shipmentData?.id)

                    let completed = false
                    axioisInstance.post(`/shipment/bulkupload/items`, formData).finally(() => {
                        completed = true
                    })

                    const checkForItemCount = async () => {
                        const intervalId = setInterval(async () => {
                            try {
                                await fetchShipmentItemsCount(id)

                                if (completed) {
                                    clearInterval(intervalId)
                                }
                            } catch (err) {
                                console.error(err)
                                clearInterval(intervalId)
                                notification.error({
                                    message: 'Error while checking CSV processing status',
                                })
                            }
                        }, 10000)
                    }

                    checkForItemCount()

                    if (completed) {
                        notification.success({
                            message: 'CSV uploaded successfully',
                        })
                    }
                    // navigate(-1)
                } catch (csvError: any) {
                    if (csvError?.response?.status === 400) {
                        notification.error({
                            message: 'Failed to upload CSV',
                        })
                    }
                    console.error(csvError)
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

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1)
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1)
    }

    return (
        <div className="bg-gray-50 rounded-2xl">
            <div className="flex text-xl font-bold mb-10">Update Shipment</div>

            <div className="mb-5">
                <Steps current={currentStep} className="flex flex-col items-start xl:flex-row">
                    {['Sender Details', 'Receiver Details', 'Items Selection'].map((stepTitle, index) => (
                        <Steps.Item
                            key={index}
                            title={
                                <span
                                    className={`p-2 rounded-md ${
                                        currentStep === index
                                            ? 'text-green-500 font-bold bg-gray-200 px-2 py-2 rounded-md text-xl'
                                            : 'text-inherit font-normal'
                                    }`}
                                >
                                    {stepTitle}
                                </span>
                            }
                        />
                    ))}
                </Steps>
            </div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl ">
                        <FormContainer className="">
                            {/* <BrandShipmentsForm isEdit setFieldValue={setFieldValue} values={values} resetForm={resetForm} /> */}
                            {currentStep === 0 && <BrandFormFirst isEdit values={values} />}
                            {currentStep === 1 && <BrandFormSecond />}
                            {currentStep === 2 && <BrandFormThirdStep values={values} />}
                        </FormContainer>
                        <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                            {currentStep > 0 && currentStep < 2 && (
                                <Button type="button" variant="pending" className="mr-2 bg-gray-600" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            )}
                            {currentStep < 2 && currentStep > 0 && (
                                <Button type="button" variant="accept" className="mr-2 bg-gray-600" onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </FormContainer>

                        {currentStep === 0 && (
                            <FormContainer className="flex justify-end">
                                <Button type="button" variant="accept" className="mr-2 bg-gray-600" onClick={handleNext}>
                                    Next
                                </Button>
                            </FormContainer>
                        )}

                        <div className="mb-10 mt-10">
                            <div className="text-xl font-bold mb-2">Items Uploaded</div>
                            {shipmentItemsCount > 0 && <Progress percent={(shipmentItemsCount / values?.items_count) * 100} />}
                        </div>

                        <FormContainer className="flex justify-end">
                            {currentStep === 2 && (
                                <div className="flex">
                                    <Button type="button" variant="pending" className="mr-2 bg-gray-600" onClick={handlePrevious}>
                                        Previous
                                    </Button>
                                    <div className="flex gap-20">
                                        <Button variant="accept" type="submit" className=" text-white" disabled={!values.shipment_id}>
                                            {showSpinner ? (
                                                <div className="flex gap-2 items-center justify-center">
                                                    <Spinner size={30} color="white" /> <span>Submitting</span>
                                                </div>
                                            ) : (
                                                'Submit'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default BrandShipmentsEdit
