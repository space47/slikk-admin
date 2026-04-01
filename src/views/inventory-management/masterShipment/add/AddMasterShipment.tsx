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
import BrandShipmentForm from '@/views/brandDashboard/brandShipments/brandShipmentsUtils/BrandShipmentForm'
import CommonAccordion from '@/common/CommonAccordion'
import ChildShipmentSelect from '../utils/ChildShipmentSelect'
import { FaFileAlt } from 'react-icons/fa'
import { successMessage } from '@/utils/responseMessages'

const AddMasterShipment = () => {
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const [childShipmentId, setChildShipmentId] = useState<number[]>([])
    const [showSpinner, setShowSpinner] = useState(false)

    const handleSubmit = async (values: any) => {
        try {
            notification.info({ message: 'In Process' })
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
            const deliveryAddress = values?.delivery_address ? textParser(values?.delivery_address) : ''
            const originAddress = values?.origin_address ? textParser(values?.origin_address) : ''
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
            const response = await axioisInstance.post(`/shipments/master`, body)
            successMessage(response)
            const shipmentId = response?.data?.data?.id

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
            <div className="flex text-xl font-bold mb-10">Add New Shipment</div>

            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
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

                        <BrandShipmentForm noBulk={true} values={values} />
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

export default AddMasterShipment
