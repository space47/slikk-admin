/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps, Form, Formik, FieldArray } from 'formik'
import React, { useEffect } from 'react'
import { RiderFieldArray, RiderTypeArray } from './riderUtils'
import FullTimePicker from '@/common/FullTimePicker'
import { ridersService } from '@/store/services/riderServices'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { RiderDetailType, setRiderProfile } from '@/store/slices/riderDetails/riderDetails.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'

const BulkAddRiders = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { riderProfile } = useAppSelector<RiderDetailType>((state) => state.riderDetails)
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    console.log('navigate is', navigate)

    const { data: riders, isSuccess } = ridersService.useRiderProfileQuery(
        {
            page: 1,
            pageSize: 100,
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRiderProfile(riders?.data || []))
        }
    }, [riders, isSuccess, dispatch])

    const initialRiderValue = (isExisting = false, selectedMobile = '') => {
        if (isExisting && selectedMobile) {
            const rider = riderProfile.find((r) => r.user?.mobile.toString() === selectedMobile)
            return {
                isExisting: true,
                selectedMobile: selectedMobile,
                first_name: rider?.user?.first_name || '',
                last_name: rider?.user?.last_name || '',
                mobile: rider?.user?.mobile.toString() || '',
                shift_start_time: rider?.shift_start_time || '',
                shift_end_time: rider?.shift_end_time || '',
                rider_type: rider?.rider_type || '',
                is_active: rider?.is_active || false,
                service_latitude: rider?.service_latitude || '',
                service_longitude: rider?.service_longitude || '',
            }
        }
        return {
            isExisting: false,
            selectedMobile: '',
            first_name: '',
            last_name: '',
            mobile: '',
            shift_start_time: '',
            shift_end_time: '',
            rider_type: '',
            is_active: false,
            service_latitude: '',
            service_longitude: '',
        }
    }

    const initialValues = {
        riders: [initialRiderValue()],
    }

    const handleSubmit = (values: any) => {
        console.log('values are', values)
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
                        <FieldArray name="riders">
                            {({ push, remove }) => (
                                <>
                                    {values.riders.map((rider, index) => (
                                        <div key={index} className="mb-8 p-4 border rounded-lg bg-gray-50">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold">Rider #{index + 1}</h3>
                                                {index > 0 && (
                                                    <Button type="button" variant="reject" onClick={() => remove(index)}>
                                                        Remove Rider
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="mb-4 flex space-x-4">
                                                <Button
                                                    type="button"
                                                    variant={rider.isExisting ? 'default' : 'solid'}
                                                    onClick={() => {
                                                        setFieldValue(`riders.${index}.isExisting`, false)
                                                        setFieldValue(`riders.${index}.selectedMobile`, '')
                                                        setFieldValue(`riders.${index}.first_name`, '')
                                                        setFieldValue(`riders.${index}.last_name`, '')
                                                        setFieldValue(`riders.${index}.mobile`, '')
                                                        setFieldValue(`riders.${index}.shift_start_time`, '')
                                                        setFieldValue(`riders.${index}.shift_end_time`, '')
                                                        setFieldValue(`riders.${index}.rider_type`, '')
                                                        setFieldValue(`riders.${index}.service_latitude`, '')
                                                        setFieldValue(`riders.${index}.service_longitude`, '')
                                                        setFieldValue(`riders.${index}.is_active`, false)
                                                    }}
                                                >
                                                    New Rider
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={rider.isExisting ? 'solid' : 'default'}
                                                    onClick={() => {
                                                        setFieldValue(`riders.${index}.isExisting`, true)
                                                    }}
                                                >
                                                    Existing Rider
                                                </Button>
                                            </div>

                                            {rider.isExisting ? (
                                                <div className="mb-4">
                                                    <label className="block mb-2">Select Existing Rider</label>
                                                    <select
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                        value={rider.selectedMobile}
                                                        onChange={(e) => {
                                                            const selectedMobile = e.target.value
                                                            setFieldValue(`riders.${index}.selectedMobile`, selectedMobile)

                                                            if (selectedMobile) {
                                                                const selectedRider = riderProfile.find(
                                                                    (r) => r.user?.mobile.toString() === selectedMobile,
                                                                )
                                                                if (selectedRider) {
                                                                    setFieldValue(
                                                                        `riders.${index}.first_name`,
                                                                        selectedRider.user?.first_name || '',
                                                                    )
                                                                    setFieldValue(
                                                                        `riders.${index}.last_name`,
                                                                        selectedRider.user?.last_name || '',
                                                                    )
                                                                    setFieldValue(
                                                                        `riders.${index}.mobile`,
                                                                        selectedRider.user?.mobile.toString() || '',
                                                                    )
                                                                    setFieldValue(
                                                                        `riders.${index}.shift_start_time`,
                                                                        selectedRider.shift_start_time || '',
                                                                    )
                                                                    setFieldValue(
                                                                        `riders.${index}.shift_end_time`,
                                                                        selectedRider.shift_end_time || '',
                                                                    )
                                                                    setFieldValue(
                                                                        `riders.${index}.rider_type`,
                                                                        selectedRider.rider_type || '',
                                                                    )
                                                                    setFieldValue(
                                                                        `riders.${index}.service_latitude`,
                                                                        selectedRider.service_latitude || '',
                                                                    )
                                                                    setFieldValue(
                                                                        `riders.${index}.service_longitude`,
                                                                        selectedRider.service_longitude || '',
                                                                    )
                                                                    setFieldValue(
                                                                        `riders.${index}.is_active`,
                                                                        selectedRider.is_active || false,
                                                                    )
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <option value="">Select a rider</option>
                                                        {riderProfile?.map((item, key) => (
                                                            <option key={key} value={item?.user?.mobile}>
                                                                {item.user?.first_name} ({item.user?.mobile})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : null}

                                            <FormContainer className="grid grid-cols-2 gap-6">
                                                <FormItem label="First Name" className="col-span-1">
                                                    <Field
                                                        name={`riders.${index}.first_name`}
                                                        component={Input}
                                                        placeholder="Enter First Name"
                                                    />
                                                </FormItem>

                                                {RiderFieldArray?.map((item, key) => (
                                                    <FormItem key={key} label={item?.label} className="col-span-1">
                                                        <Field
                                                            type={item.type}
                                                            name={`riders.${index}.${item.name}`}
                                                            placeholder={`Enter ${item?.label}`}
                                                            component={item.type === 'checkbox' ? Checkbox : Input}
                                                            maxLength={item?.name === 'mobile' ? 10 : undefined}
                                                            className="w-full"
                                                            disabled={rider.isExisting && item.name === 'mobile'}
                                                        />
                                                    </FormItem>
                                                ))}

                                                <FormItem label="Rider Type" className="col-span-1">
                                                    <Field name={`riders.${index}.rider_type`}>
                                                        {({ form, field }: FieldProps) => {
                                                            const selectedCompany = RiderTypeArray.find(
                                                                (option) => option.label === field?.value,
                                                            )
                                                            return (
                                                                <div className="w-full">
                                                                    <Select
                                                                        isClearable
                                                                        className="w-1/2"
                                                                        options={RiderTypeArray}
                                                                        getOptionLabel={(option) => option.label}
                                                                        getOptionValue={(option) => option.value}
                                                                        value={selectedCompany || null}
                                                                        onChange={(newVal) => {
                                                                            form.setFieldValue(`riders.${index}.rider_type`, newVal?.value)
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        }}
                                                    </Field>
                                                </FormItem>

                                                <FormItem label="Store">
                                                    <Field name={`riders.${index}.store`}>
                                                        {({ form, field }: FieldProps) => {
                                                            const selectedStores = storeResults.filter((option) =>
                                                                field.value?.some((store: any) => store === option.id),
                                                            )
                                                            return (
                                                                <div className="flex flex-col gap-1 w-full max-w-md">
                                                                    <Select
                                                                        isMulti
                                                                        className="w-full"
                                                                        options={storeResults}
                                                                        getOptionLabel={(option) => option.code}
                                                                        getOptionValue={(option) => option.id}
                                                                        value={selectedStores || null}
                                                                        onChange={(newVal) => {
                                                                            form.setFieldValue(
                                                                                `riders.${index}.store`,
                                                                                newVal?.map((item) => item?.id),
                                                                            )
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        }}
                                                    </Field>
                                                </FormItem>

                                                <FullTimePicker
                                                    label="SHIFT START"
                                                    name={`riders.${index}.shift_start_time`}
                                                    fieldname={`riders.${index}.shift_start_time`}
                                                />
                                                <FullTimePicker
                                                    label="SHIFT END"
                                                    name={`riders.${index}.shift_end_time`}
                                                    fieldname={`riders.${index}.shift_end_time`}
                                                />
                                                <FormItem label="Latitude" className="col-span-1">
                                                    <Field
                                                        name={`riders.${index}.service_latitude`}
                                                        component={Input}
                                                        type="number"
                                                        placeholder="Enter Service latitude"
                                                    />
                                                </FormItem>
                                                <FormItem label="Longitude" className="col-span-1">
                                                    <Field
                                                        name={`riders.${index}.service_longitude`}
                                                        component={Input}
                                                        type="number"
                                                        placeholder="Enter Service Longitude"
                                                    />
                                                </FormItem>
                                            </FormContainer>
                                        </div>
                                    ))}

                                    <Button type="button" variant="pending" className="mt-4" onClick={() => push(initialRiderValue())}>
                                        Add Another Rider
                                    </Button>
                                </>
                            )}
                        </FieldArray>

                        <FormContainer className="mt-8 flex justify-end">
                            <Button variant="accept" type="submit">
                                Submit All Riders
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default BulkAddRiders
