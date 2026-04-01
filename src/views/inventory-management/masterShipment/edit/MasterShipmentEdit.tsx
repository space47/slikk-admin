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
            const data = masterShipmentCall?.data?.data
            setShipmentData(data)
            if (data?.child_shipment?.length) {
                const childIds = data.child_shipment.map((item) => item.id)
                setChildShipmentId(childIds)
            }
        }
        if (masterShipmentCall.isError) {
            const errorMessageText = getApiErrorMessage(masterShipmentCall.error) || 'Failed to load data'
            notification.error({ message: errorMessageText })
        }
    }, [masterShipmentCall.isSuccess, masterShipmentCall.isError, masterShipmentCall?.data?.data, masterShipmentCall.error])

    const initialValue = {
        name: shipmentData?.name,
        awb_number: shipmentData?.awb_number,
        dispatch_date: shipmentData?.dispatch_date,
        delivery_date: shipmentData?.delivery_date,
        document: shipmentData?.document,
        invoice_url: shipmentData?.invoice_url,
        awb_url: shipmentData?.awb_url,
        delivery_chalan: shipmentData?.delivery_chalan,
        dispatched_by: shipmentData?.dispatched_by,
        box_count: shipmentData?.box_count,
        items_count: shipmentData?.items_count,
        total_quantity: shipmentData?.total_quantity,
        total_invoice_value: shipmentData?.total_invoice_value,
        invoice_number: shipmentData?.invoice_number,
        company: selectedCompany?.currCompany?.id,
        shipment_id: shipmentData?.shipment_id,
        origin_address: shipmentData?.origin_address,
        delivery_address: shipmentData?.delivery_address,
        received_by: shipmentData?.received_by,
        child_shipments: shipmentData?.child_shipment?.map((item) => item.id) || [],
    }

    const textChanger = (value: any) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(value, 'text/html')
        const plainTextValue = htmlDoc.body.textContent || ''
        return plainTextValue
    }

    const handleSubmit = async (values: any) => {
        try {
            const [supportingDocumentResult, invoiceResult, awbResult, deliveryChalanResult] = await Promise.allSettled([
                values?.document?.length > 0 ? handleimage('product', values.document) : Promise.resolve(''),
                values?.invoice_url?.length > 0 ? handleimage('product', values.invoice_url) : Promise.resolve(''),
                values?.awb_url?.length > 0 ? handleimage('product', values.awb_url) : Promise.resolve(''),
                values?.delivery_chalan?.length > 0 ? handleimage('product', values.delivery_chalan) : Promise.resolve(''),
            ])

            const supportingDocumentUpload = supportingDocumentResult.status === 'fulfilled' ? supportingDocumentResult.value : ''
            const invoiceUpload = invoiceResult.status === 'fulfilled' ? invoiceResult.value : ''
            const awbUpload = awbResult.status === 'fulfilled' ? awbResult.value : ''
            const deliveryChalanUpload = deliveryChalanResult.status === 'fulfilled' ? deliveryChalanResult.value : ''
            const deliveryAddress = values?.delivery_address ? textChanger(values?.delivery_address) : ''
            const originAddress = values?.origin_address ? textChanger(values?.origin_address) : ''
            setShowSpinner(true)
            const body = {
                company: selectedCompany?.currCompany?.id,
                name: values?.name,
                awb_number: values?.awb_number,
                dispatch_date: values?.dispatch_date,
                delivery_date: values?.delivery_date,
                document: supportingDocumentUpload,
                invoice_url: invoiceUpload,
                awb_url: awbUpload,
                delivery_chalan: deliveryChalanUpload,
                dispatched_by: values?.dispatched_by,
                box_count: values?.box_count,
                items_count: values?.items_count,
                total_quantity: values.total_quantity,
                total_invoice_value: values?.total_invoice_value,
                invoice_number: values?.invoice_number,
                company_id: values?.company,
                store: values?.store?.join(','),
                shipment_id: values?.shipment_id,
                origin_address: originAddress,
                delivery_address: deliveryAddress,
                received_by: values?.received_by?.mobile,
                child_shipment_ids: childShipmentId,
            }
            const filteredBody = Object.fromEntries(
                Object.entries(body).filter(([, value]) => value !== '' && value !== null && value !== undefined),
            )

            const response = await axioisInstance.patch(`/shipments/master/${id}`, filteredBody)

            notification.success({
                message: response?.data?.message || 'Successfully updated shipment',
            })

            navigate(-1)
            return { id: response?.data?.data?.id }
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
