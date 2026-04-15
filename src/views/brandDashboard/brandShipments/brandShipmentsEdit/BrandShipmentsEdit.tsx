/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useAppSelector } from '@/store'
import BrandShipmentForm from '../brandShipmentsUtils/BrandShipmentForm'
import { buildShipmentPayload, ShipmentItemsUpload } from '../brandShipmentsUtils/brandShipmentFunctions'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { shipmentService } from '@/store/services/shipmentService'
import { notification } from 'antd'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'

const BrandShipmentsEdit = () => {
    const { id } = useParams()
    const [shipmentData, setShipmentData] = useState<any>()
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const shipmentCall = shipmentService.useGetShipmentDetailQuery({ id: id as string }, { skip: !id })
    const shipmentItemsCall = shipmentService.useGetShipmentItemsQuery({ page: 1, pageSize: 10, shipment_id: id as string }, { skip: !id })
    const [resetItems, resetResponse] = shipmentService.useResetShipmentItemsMutation()
    const [showSpinner, setShowSpinner] = useState(false)

    useEffect(() => {
        if (shipmentCall.isSuccess && shipmentCall.data) {
            setShipmentData(shipmentCall?.data?.data?.results[0])
        }
    }, [shipmentCall.isSuccess, shipmentCall.data])

    // useEffect(() => {
    //     const fetchShipmentDetails = async () => {
    //         try {
    //             const response = await axioisInstance.get(`/product-shipment?id=${id}`)
    //             const data = response?.data?.data?.results || []
    //             setShipmentData(data[0])
    //         } catch (error) {
    //             console.error('Error fetching shipment details:', error)
    //         }
    //     }

    //     fetchShipmentDetails()
    // }, [id])

    const initialValue = useMemo(
        () => ({
            name: shipmentData?.name,
            awb_number: shipmentData?.awb_number,
            shipment_id: shipmentData?.shipment_id,
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
        }),
        [shipmentData],
    )

    useEffect(() => {
        if (resetResponse.isSuccess) {
            notification.success({ message: 'successfully cleared the shipment items' })
            shipmentCall.refetch()
            shipmentItemsCall.refetch()
        }
        if (resetResponse.isError) {
            const errorMessage = getApiErrorMessage(resetResponse.error)
            notification.error({ message: errorMessage || 'Failed to clear' })
        }
    }, [resetResponse.isSuccess, resetResponse.isError, resetResponse.error])

    const handleDeleteItems = () => {
        resetItems({ id: id as string })
    }

    const handleSubmitEdit = async (values: any) => {
        try {
            setShowSpinner(true)
            const filteredBody = await buildShipmentPayload({
                values,
                selectedCompany,
                isEdit: true,
                initialValues: initialValue,
            })
            const response = await axioisInstance.patch(`/product-shipment/${id}`, filteredBody)
            successMessage(response)
            const shipmentId = response?.data?.data?.id
            if (values?.csvArray?.length > 0) {
                ShipmentItemsUpload({ values, shipmentId, setShowSpinner })
            }

            return { id: shipmentId }
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setShowSpinner(false)
        }
    }

    return (
        <div className="bg-gray-50 rounded-2xl">
            <div className="flex text-xl font-bold mb-10">Update Shipment</div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmitEdit}>
                {({ values }: any) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl ">
                        <BrandShipmentForm values={values} isEdit handleDeleteItems={handleDeleteItems} />
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

export default BrandShipmentsEdit
