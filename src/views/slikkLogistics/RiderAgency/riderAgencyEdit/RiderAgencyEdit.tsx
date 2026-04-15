/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import RiderAgencyForm from '../RiderAgencyUtils/RiderAgencyForm'
import CommonPageHeader from '@/common/CommonPageHeader'
import { Button } from '@/components/ui'
import { FaSave } from 'react-icons/fa'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { deliveryAgency } from '@/store/services/deliveryAgencyService'
import { notification, Spin } from 'antd'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { useParams } from 'react-router-dom'
import { DeliveryAgency } from '@/store/types/deliveryAgencyTypes'

const RiderAgencyEdit = () => {
    const { id } = useParams()
    const [agencyData, setAgencyData] = useState<DeliveryAgency | null>(null)
    const agencyCall = deliveryAgency.useGetSingleAgencyQuery({ id: id as string }, { skip: !id })

    const [updateRiderAgency, updateResponse] = deliveryAgency.useUpdateDeliveryAgencyMutation()

    useEffect(() => {
        if (agencyCall.isSuccess) {
            setAgencyData(agencyCall.data.data.results[0])
        }
        if (agencyCall.isError) {
            const errorMessage = getApiErrorMessage(agencyCall.error)
            notification.error({ message: errorMessage })
        }
    }, [agencyCall.isError, agencyCall.isSuccess, agencyCall.data?.data.results, agencyCall.error])

    const initialValues = useMemo(
        () => ({
            name: agencyData?.name,
            registered_name: agencyData?.registered_name,
            agency_domains: agencyData?.agency_domains,
            poc_name: agencyData?.poc_name,
            poc_mobile: agencyData?.poc_mobile,
            poc_email: agencyData?.poc_email,
            address: agencyData?.address,
            gstin: agencyData?.gstin,
            cin: agencyData?.cin,
            is_active: agencyData?.is_active,
        }),
        [agencyData],
    )

    useEffect(() => {
        if (updateResponse.isSuccess) {
            notification.success({
                message: `Rider Agency- ${updateResponse?.data?.data?.name} has been created with POC - ${updateResponse?.data?.data?.poc_name || ''} `,
            })
        }
        if (updateResponse.isError) {
            const errorMessage = getApiErrorMessage(updateResponse.error)
            notification.error({ message: errorMessage })
        }
    }, [updateResponse.isError, updateResponse.isSuccess, updateResponse.data?.data, updateResponse.error])

    const handleSubmit = (values: any) => {
        const body = {
            agency_id: id,
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
        updateRiderAgency(body as Record<string, string>)
    }

    return (
        <Spin spinning={agencyCall.isLoading || agencyCall.isError}>
            <CommonPageHeader desc="Update Agencies" label="Update Existing Rider AGENCY" />
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
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
                                    loading={updateResponse.isLoading}
                                    disabled={updateResponse.isLoading}
                                >
                                    Update Agency
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Spin>
    )
}

export default RiderAgencyEdit
