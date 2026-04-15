/* eslint-disable @typescript-eslint/no-explicit-any */
import StoreSelectForm from '@/common/StoreSelectForm'
import { Button, Dialog, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { deliveryAgency } from '@/store/services/deliveryAgencyService'
import { riderPayoutService } from '@/store/services/riderPayoutService'
import { RiderPayout } from '@/store/types/riderPayout.types'
import { DeliveryType } from '@/views/slikkLogistics/riderDetails/RiderDetailsCommon'
import { notification } from 'antd'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    refetch: any
}

export const WEEKDAY_ARRAY = [
    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
    { label: 'Saturday', value: '6' },
    { label: 'Sunday', value: '7' },
]

const PayoutMappingModal: React.FC<Props> = ({ isOpen, setIsOpen, refetch }) => {
    const [riderAgencyArray, setRiderAgencyArray] = useState<DeliveryType[]>([])
    const [payoutData, setPayoutData] = useState<RiderPayout[]>([])
    const riderAgencyCall = deliveryAgency.useGetDeliveryAgencyQuery({ page: 1, page_size: 100 })
    const [searchInput, setSearchInput] = useState<string>('')
    const [queryParams, setQueryParams] = useState({ page: 1, pageSize: 10, name: '' })

    const [mappingCall, mappingResponse] = riderPayoutService.useAddPayoutCommercialsMutation()

    const handleSearch = (inputValue: string) => {
        setSearchInput(inputValue)
        setQueryParams((prev) => ({ ...prev, name: inputValue }))
    }

    const payoutCall = riderPayoutService.usePayoutListQuery(queryParams)

    useEffect(() => {
        if (payoutCall.isSuccess) {
            const results = payoutCall?.data?.data?.results || []
            setPayoutData(results)
        }
    }, [payoutCall.isSuccess, payoutCall.data])

    const formattedData = payoutData.map((item) => {
        return { label: item?.name, value: item?.id }
    })

    useEffect(() => {
        if (riderAgencyCall.isSuccess) {
            setRiderAgencyArray(
                riderAgencyCall.data?.data?.results?.map((item) => ({
                    label: item.name || 'Slikk',
                    value: item.id || 0,
                })),
            )
        }
    }, [riderAgencyCall.isSuccess, riderAgencyCall.isError, riderAgencyCall?.data?.data?.results])

    useEffect(() => {
        if (mappingResponse.isSuccess) {
            notification.success({
                message: `Operation Successful`,
            })
            setIsOpen(false)
            refetch()
        }
        if (mappingResponse.isError) {
            const errorMessage = getApiErrorMessage(mappingResponse.error)
            notification.error({ message: errorMessage })
        }
    }, [mappingResponse.isError, mappingResponse.isSuccess, mappingResponse.error])

    const handleSubmit = (values: any) => {
        const body = {
            agency: values?.agency,
            store: values?.store?.id,
            payout_model: values?.payout_model,
            management_fees: values?.management_fees,
            days_of_week: values?.week_day_number?.join(',') || '',
        }

        mappingCall(body)
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800}>
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {() => (
                    <Form>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Payout Agency Mapping</h3>
                            <p className="text-sm text-gray-500">Configure payout model, agency and store mapping</p>
                        </div>
                        <FormContainer className="grid grid-cols-2 gap-2">
                            <FormItem label="Rider Agency">
                                <Field name="agency">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            isClearable
                                            isSearchable
                                            options={riderAgencyArray}
                                            value={riderAgencyArray.find((o) => o.value === field.value) || null}
                                            onChange={(opt) => form.setFieldValue(field.name, opt?.value ?? null)}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem label="Select Payout Model" className="col-span-1 w-full">
                                <Field name="payout_model">
                                    {({ form, field }: FieldProps) => {
                                        console.log('FIELD.NAME', field.name, field.value)
                                        return (
                                            <Select
                                                isSearchable
                                                isClearable
                                                inputValue={searchInput}
                                                options={formattedData}
                                                value={formattedData?.find((option) => option.value === field.value)}
                                                onInputChange={handleSearch}
                                                onChange={(selectedOption) => {
                                                    const value = selectedOption ? selectedOption.value : ''
                                                    form.setFieldValue(field.name, value)
                                                }}
                                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>
                            {/* Daywise data value */}
                            {/*  */}
                            <FormItem label="WeekDays" className="">
                                <Field name="week_day_number">
                                    {({ form, field }: FieldProps) => {
                                        const selectedOptions = Array.isArray(field.value)
                                            ? WEEKDAY_ARRAY.filter((option) => field.value.includes(option.value))
                                            : []

                                        return (
                                            <div className="w-full max-w-md">
                                                <Select
                                                    isMulti
                                                    className="w-full"
                                                    options={WEEKDAY_ARRAY}
                                                    getOptionLabel={(option) => option?.label}
                                                    getOptionValue={(option) => String(option?.value)}
                                                    value={selectedOptions}
                                                    onChange={(newVal) => {
                                                        form.setFieldValue(
                                                            'week_day_number',
                                                            newVal.map((option: any) => option.value),
                                                        )
                                                    }}
                                                />
                                            </div>
                                        )
                                    }}
                                </Field>
                            </FormItem>

                            <StoreSelectForm isSingle label="Select Store" name="store" />
                            <FormItem label="Management Fees">
                                <Field name="management_fees" type="number" component={Input} placeholder="Enter Management Fees" />
                            </FormItem>
                        </FormContainer>

                        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 mt-8 transition-all">
                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    type="submit"
                                    variant="accept"
                                    size="sm"
                                    icon={<FaPlus />}
                                    loading={mappingResponse.isLoading}
                                    disabled={mappingResponse.isLoading}
                                >
                                    Add Payout Agency Mapping
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default PayoutMappingModal
