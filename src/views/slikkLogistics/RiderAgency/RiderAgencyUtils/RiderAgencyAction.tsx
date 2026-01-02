/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import { deliveryAgency } from '@/store/services/deliveryAgencyService'
import { DeliveryAgency } from '@/store/types/deliveryAgencyTypes'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { notification } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    isEdit?: boolean
    agencyId?: number
}

interface FormValues {
    id?: number
    name: string
    delivery_type: string
    client_id?: string
    url?: string
    is_active?: boolean
}

const DELIVERY_TYPE_OPTIONS = [
    { label: 'EXPRESS', value: 'EXPRESS' },
    { label: 'TRY_AND_BUY', value: 'TRY_AND_BUY' },
]

const RiderAgencyAction = ({ isOpen, setIsOpen, isEdit, agencyId }: Props) => {
    const [riderAgencyData, setRiderAgencyData] = useState<DeliveryAgency | null>(null)
    const [addAgency, addResponse] = deliveryAgency.useAddDeliveryAgencyMutation()
    const [updateAgency, updateResponse] = deliveryAgency.useUpdateDeliveryAgencyMutation()
    const riderAgency = deliveryAgency.useGetDeliveryAgencyQuery({ id: agencyId }, { skip: !agencyId })

    useEffect(() => {
        if (riderAgency.isSuccess) setRiderAgencyData(riderAgency.data.data?.[0])
        if (riderAgency.isError) notification.error({ message: 'Failed to load agency details' })
    }, [riderAgency.isSuccess, riderAgency.isError])

    const initialValues: FormValues = useMemo(
        () => ({
            name: riderAgencyData?.name || '',
            delivery_type: riderAgencyData?.delivery_type || '',
            client_id: riderAgencyData?.client_id || '',
            url: riderAgencyData?.url || '',
            is_active: riderAgencyData?.is_active ?? true,
        }),
        [riderAgencyData],
    )

    useEffect(() => {
        if (addResponse.isSuccess) {
            notification.success({ message: 'Agency Added Successfully' })
            setIsOpen(false)
        }
        if (addResponse.isError) {
            notification.error({ message: (addResponse.error as any).data.message })
        }
    }, [addResponse.isSuccess, addResponse.isError])

    useEffect(() => {
        if (updateResponse.isSuccess) {
            notification.success({ message: 'Agency Updated Successfully' })
            setIsOpen(false)
        }
        if (updateResponse.isError) {
            notification.error({ message: (updateResponse.error as any).data.message })
        }
    }, [updateResponse.isSuccess, updateResponse.isError])

    const handleSubmit = async (values: FormValues) => {
        const body: Partial<FormValues> = {
            name: values.name,
            delivery_type: values.delivery_type,
        }

        if (isEdit) {
            body.url = values.url
            body.is_active = values.is_active
            body.id = agencyId
            body.client_id = values.client_id
        }

        if (isEdit && agencyId) {
            updateAgency(body)
        } else {
            addAgency(body)
        }
    }

    const isSubmitting = addResponse.isLoading || updateResponse.isLoading

    return (
        <Dialog isOpen={isOpen} width={1000} onClose={() => setIsOpen(false)}>
            <div className="px-6 py-5">
                <h3 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Rider Agency' : 'Add Rider Agency'}</h3>
                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                    {() => (
                        <Form className="space-y-6">
                            <FormContainer className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                <FormItem label="Agency Name">
                                    <Field name="name" placeholder="Enter agency name" component={Input} />
                                </FormItem>
                                <CommonSelect name="delivery_type" label="Delivery Type" options={DELIVERY_TYPE_OPTIONS} />
                            </FormContainer>

                            {isEdit && (
                                <FormContainer className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    <FormItem label="Client ID">
                                        <Field name="client_id" placeholder="Enter client id" component={Input} />
                                    </FormItem>

                                    <FormItem label="Callback URL">
                                        <Field name="url" placeholder="Enter callback url" component={Input} />
                                    </FormItem>

                                    <FormItem label="Active">
                                        <Field name="is_active" component={Switcher} />
                                    </FormItem>
                                </FormContainer>
                            )}

                            <FormButton type="submit" loading={isSubmitting}>
                                {isEdit ? 'Update' : 'Create'}
                            </FormButton>
                        </Form>
                    )}
                </Formik>
            </div>
        </Dialog>
    )
}

export default RiderAgencyAction
