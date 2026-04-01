/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { textParser } from '@/common/textParser'
import BrandShipmentForm from '../brandShipmentsUtils/BrandShipmentForm'
import { buildShipmentPayload, ShipmentItemsUpload } from '../brandShipmentsUtils/brandShipmentFunctions'

const BrandShipmentsAdd = () => {
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const [showSpinner, setShowSpinner] = useState(false)

    const handleSubmitAdd = async (values: any) => {
        try {
            notification.info({ message: 'In Process' })
            setShowSpinner(true)
            const body = await buildShipmentPayload({
                values,
                selectedCompany,
                isEdit: false,
                textParser,
            })

            const response = await axioisInstance.post(`/product-shipment`, body)

            notification.success({
                message: response?.data?.message || 'Successfully updated shipment',
            })

            const shipmentId = response?.data?.data?.id

            if (values?.csvArray?.length > 0) {
                ShipmentItemsUpload({ values, shipmentId, setShowSpinner })
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

            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmitAdd}>
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
