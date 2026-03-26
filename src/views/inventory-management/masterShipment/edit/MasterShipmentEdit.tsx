/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { handleimage } from '@/common/handleImage'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useAppSelector } from '@/store'
import BrandShipmentForm from '@/views/brandDashboard/brandShipments/brandShipmentsUtils/BrandShipmentForm'
import CommonAccordion from '@/common/CommonAccordion'
import { FaFileAlt } from 'react-icons/fa'
import ChildShipmentSelect from '../utils/ChildShipmentSelect'
import { Shipment } from '@/store/types/masterShipment.types'
import { masterShipmentService } from '@/store/services/masterShipmentService'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'

const MasterShipmentsEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [shipmentData, setShipmentData] = useState<Shipment>()
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const [childShipmentId, setChildShipmentId] = useState<number[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const masterShipmentCall = masterShipmentService.useMasterShipmentDetailsQuery({ id: id as string }, { skip: !id })

    useEffect(() => {
        if (masterShipmentCall.isSuccess) {
            setShipmentData(masterShipmentCall?.data?.data)
        }
        if (masterShipmentCall.isError) {
            const errorMessageText = getApiErrorMessage(masterShipmentCall.error) || 'Failed to load data'
            notification.error({ message: errorMessageText })
        }
    }, [masterShipmentCall.isSuccess, masterShipmentCall.isError, masterShipmentCall?.data?.data, masterShipmentCall.error])

    const initialValue = {
        company: selectedCompany?.currCompany?.id,
        shipment_id: shipmentData?.shipment_id,
        name: shipmentData?.name,
        origin_address: shipmentData?.origin_address,
        delivery_address: shipmentData?.delivery_address,
        awb: shipmentData?.awb_number,
        dispatch_date: shipmentData?.dispatch_date,
        delivery_date: shipmentData?.delivery_date,
        document: shipmentData?.document,
        dispatched_by: shipmentData?.dispatched_by,
        received_by: shipmentData?.received_by,
        box_count: shipmentData?.box_count,
        items_count: shipmentData?.items_count,
        child_shipment: shipmentData?.child_shipment,
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
                child_shipment_ids: childShipmentId,
            }
            const filteredBody = Object.fromEntries(
                Object.entries(body).filter(([, value]) => value !== '' && value !== null && value !== undefined),
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

            // if (values?.csvArray?.length > 0) {
            //     console.log('is res here')
            //     try {
            //         setShowSpinner(true)
            //         notification.info({
            //             message: 'CSV upload is in progress',
            //         })
            //         const formData = new FormData()
            //         formData.append('shipment_items_file', values.csvArray[0])
            //         formData.append('shipment_id', shipmentData?.id)

            //         const res = await axioisInstance.post(`/shipment/bulkupload/items`, formData)

            //         notification.success({
            //             message: res?.data?.data?.message || 'CSV uploaded successfully',
            //         })

            //         navigate(-1)
            //     } catch (csvError: any) {
            //         if (csvError?.response?.status === 400) {
            //             notification.error({
            //                 message: 'Failed to upload CSV',
            //             })
            //         }
            //         console.error(csvError)
            //     } finally {
            //         setShowSpinner(false)
            //     }
            // }
            navigate(-1)
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
            <div className="flex text-xl font-bold mb-10">Update Shipment</div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }: any) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl ">
                        <div className="shadow-xl p-3 rounded-2xl border-l-4 mb-8 border-red-600">
                            <CommonAccordion
                                header={
                                    <div className="mb-5 flex gap-3 items-center">
                                        <span className="p-2 bg-blue-100 rounded-xl">
                                            <FaFileAlt className=" text-2xl text-blue-600" />
                                        </span>
                                        <h5>Child Shipments</h5>
                                    </div>
                                }
                            >
                                <ChildShipmentSelect shipmentId={childShipmentId} setShipmentId={setChildShipmentId} />
                            </CommonAccordion>
                        </div>
                        <BrandShipmentForm noBulk values={values} isEdit />
                        <FormContainer className="flex justify-end">
                            <Button variant="blue" type="submit" loading={showSpinner}>
                                Update
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default MasterShipmentsEdit
