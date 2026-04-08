/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import RiderAgencyForm from '../RiderAgencyUtils/RiderAgencyForm'
import CommonPageHeader from '@/common/CommonPageHeader'
import { Button } from '@/components/ui'
import { FaSave } from 'react-icons/fa'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { deliveryAgency } from '@/store/services/deliveryAgencyService'
import { notification } from 'antd'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'

const RiderAgencyAdd = () => {
    const [createRiderAgency, createResponse] = deliveryAgency.useAddDeliveryAgencyMutation()

    useEffect(() => {
        if (createResponse.isSuccess) {
            notification.success({
                message: `Rider Agency- ${createResponse?.data?.data?.name} has been created with POC - ${createResponse?.data?.data?.poc_name || ''} `,
            })
        }
        if (createResponse.isError) {
            const errorMessage = getApiErrorMessage(createResponse.error)
            notification.error({ message: errorMessage })
        }
    }, [createResponse.isError, createResponse.isSuccess, createResponse.data?.data, createResponse.error])

    const handleSubmit = (values: any) => {
        const body = {
            name: values?.name,
            registered_name: values?.registered_name,
            agency_domains: values?.agency_domains?.join(','),
            poc_name: values?.poc_name,
            poc_mobile: values?.poc_mobile,
            poc_email: values?.poc_email,
            address: values?.address,
            gstin: values?.gstin,
            cin: values?.cin,
            is_active: values?.is_active,
        }
        createRiderAgency(body)
    }

    return (
        <div>
            <CommonPageHeader desc="Add Agencies" label="Add Rider AGENCY" />
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {() => (
                    <Form>
                        <RiderAgencyForm />
                        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 mt-8 transition-all">
                            <div className="flex items-center justify-between gap-4">
                                <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                                    <HiOutlineInformationCircle className="w-4 h-4" />
                                    <span>All changes are auto-saved in the form</span>
                                </div>

                                <Button
                                    type="submit"
                                    variant="accept"
                                    size="sm"
                                    icon={<FaSave />}
                                    loading={createResponse.isLoading}
                                    disabled={createResponse.isLoading}
                                >
                                    Add Agency
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default RiderAgencyAdd
