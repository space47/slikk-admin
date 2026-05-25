/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import BrandShipmentForm from '@/views/brandDashboard/brandShipments/brandShipmentsUtils/BrandShipmentForm'
import CommonAccordion from '@/common/CommonAccordion'
import ChildShipmentSelect from '../utils/ChildShipmentSelect'
import { FaFileAlt } from 'react-icons/fa'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { masterShipmentPayload } from '../utils/masterShipmentFunctions'
import { AxiosError } from 'axios'

const AddMasterShipment = () => {
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const [childShipmentId, setChildShipmentId] = useState<number[]>([])
    const [showSpinner, setShowSpinner] = useState(false)

    const handleSubmit = async (values: any) => {
        try {
            notification.info({ message: 'In Process' })
            const filteredBody = await masterShipmentPayload({
                values,
                selectedCompany,
                isEdit: true,
                childShipmentId,
            })
            const response = await axioisInstance.post(`/shipments/master`, filteredBody)
            successMessage(response)
            const shipmentId = response?.data?.data?.id
            navigate(-1)
            return { id: shipmentId }
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
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
