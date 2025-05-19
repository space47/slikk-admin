/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Progress, Spinner, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleimage } from '@/common/handleImage'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import BrandFormFirst from '../brandShipmentsUtils/BrandFormFirst'
import BrandFormSecond from '../brandShipmentsUtils/BrandFormSecond'
import BrandFormThirdStep from '../brandShipmentsUtils/BrandFormThirdStep'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'

const BrandShipmentsAdd = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const [showSpinner, setShowSpinner] = useState(false)
    const [shipmentItemsCount, setShipmentItemsCount] = useState(0)

    const initialValue = {}

    const textChanger = (value: any) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(value, 'text/html')
        const plainTextValue = htmlDoc.body.textContent || ''
        return plainTextValue
    }

    const handleSubmit = async (values: any) => {
        try {
            notification.info({ message: 'In Process' })
            const imageUpload = values?.itemsArray && values?.itemsArray.length > 0 ? await handleimage('product', values?.itemsArray) : ''
            const deliveryAddress = values?.delivery_address ? textChanger(values?.delivery_address) : ''
            const originAddress = values?.origin_address ? textChanger(values?.origin_address) : ''
            const body = {
                company: selectedCompany?.currCompany?.id,
                store: values?.store?.join(','),
                shipment_id: values?.shipment_id,
                name: values?.name,
                origin_address: originAddress,
                delivery_address: deliveryAddress,
                awb_number: values?.awb,
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
                    // navigate(-1)
                } catch (csvError) {
                    notification.error({
                        message: 'Failed to upload CSV',
                    })
                    console.error(csvError)
                } finally {
                    setShowSpinner(false)
                }

                const checkForItemCount = async () => {
                    const intervalId = setInterval(async () => {
                        try {
                            const response = await axioisInstance.get(`/product-shipment?view=detail&id=${shipmentId}`)
                            const data = response?.data?.data?.results[0]
                            setShipmentItemsCount(data?.upload_count)

                            if (!data?.in_progress) {
                                clearInterval(intervalId)
                                notification.success({
                                    message: 'CSV processing completed',
                                })
                            }
                        } catch (err) {
                            console.error(err)
                            clearInterval(intervalId)
                            notification.error({
                                message: 'Error while checking CSV processing status',
                            })
                        }
                    }, 10000)
                    return () => clearInterval(intervalId)
                }

                checkForItemCount()
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
            <div className="flex text-xl font-bold mb-10">Add New Shipment</div>

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
                {({ values }: any) => (
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

export default BrandShipmentsAdd
