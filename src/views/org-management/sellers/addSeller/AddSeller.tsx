/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, FieldProps, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import SellerForm from '../sellerForm/SellerForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import {
    BasicExtra,
    BasicSellerInformation,
    fileFields,
    NOBOptions,
    SellerCommercialsArray,
    simpleFields,
} from '../sellerUtils/sellerFormCommon'
import { useEffect, useRef, useState } from 'react'
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'

import { GrDocument } from 'react-icons/gr'
import { SegmentOptions } from '@/constants/commonArray.constant'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { FcViewDetails } from 'react-icons/fc'
import { SellerKeys } from '../sellerCommon'
import { textParser } from '@/common/textParser'
import { getProfileData } from '@/store/action/authAction'
import { useAppDispatch, useAppSelector } from '@/store'
import { handlePhoneInputValidation } from '../sellerUtils/sellerFunctions'
import { vendorService } from '@/store/services/vendorService'
import { setConfigValues, VendorStateType } from '@/store/slices/vendorsSlice/vendors.slice'
import { Spin } from 'antd'

const AddSeller = () => {
    const navigate = useNavigate()
    const submittingRef = useRef(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOther, setIsOther] = useState(false)
    const dispatch = useAppDispatch()
    const vendorConfigApiCall = vendorService.useVendorOnboardingConfigurationQuery({})

    const { configValues } = useAppSelector<VendorStateType>((state) => state.vendor)

    useEffect(() => {
        if (vendorConfigApiCall.isSuccess) {
            dispatch(setConfigValues(vendorConfigApiCall.data.config))
        }
    }, [vendorConfigApiCall.isSuccess, vendorConfigApiCall.data?.config, dispatch])

    const initialValue = {}

    const handleSubmit = async (values: any) => {
        if (submittingRef.current) return
        submittingRef.current = true
        const formData = new FormData()
        if (values.address) {
            formData.append(SellerKeys.ADDRESS, textParser(values.address))
        }
        const appendIfValid = (key: string, value: any) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value)
            }
        }

        simpleFields.forEach((key) => appendIfValid(key, values?.[key]))
        fileFields.forEach((key) => appendIfValid(key, values?.[key]?.[0]))

        const updatedDetails = (values?.gst_details || []).map((warehouse: any, index: number) => {
            const cleanGstin = warehouse?.gstin?.replace(/\s+/g, '') || ''

            if (warehouse?.gst_certificate?.[0] instanceof File) {
                const certKey = `cert${index + 1}`
                formData.append(certKey, warehouse.gst_certificate[0])

                return {
                    ...warehouse,
                    gst_certificate: certKey,
                    state_code: cleanGstin.slice(0, 2),
                    warehouse_address: textParser(warehouse.warehouse_address),
                }
            }

            return {
                ...warehouse,
                state_code: cleanGstin.slice(0, 2),
                warehouse_address: textParser(warehouse.warehouse_address),
            }
        })

        if (isOther) {
            appendIfValid('gst_details', JSON.stringify(updatedDetails))
        }

        if (values.int_poc_details && values.int_poc_details?.length > 0) {
            appendIfValid('int_poc_details', JSON.stringify(values?.int_poc_details?.map((item: Record<string, string>) => item.value)))
        }

        try {
            setIsSubmitting(true)
            const res = await axioisInstance.post(`/merchant/company`, formData)
            successMessage(res)
            await dispatch(getProfileData())
            navigate(-1)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setIsSubmitting(false)
            submittingRef.current = false
        }
    }

    const inputHandlers: Record<string, (e: React.FormEvent<HTMLInputElement>) => void> = {
        [SellerKeys.HEAD_CONTACT]: handlePhoneInputValidation,
        [SellerKeys.CONTACT_NUMBER]: handlePhoneInputValidation,
    }

    return (
        <Spin spinning={isSubmitting}>
            <h3 className="text-xl font-bold">Add New Seller</h3>
            <Formik enableReinitialize initialValues={initialValue as any} onSubmit={handleSubmit}>
                {({ values }) => {
                    const internalData =
                        values?.segment?.split(',')?.reduce((acc: Record<string, any>, item: string) => {
                            acc[item] = configValues?.value?.category_team[item?.toUpperCase()] || []
                            return acc
                        }, {}) || {}

                    const BusinessCompanyData = configValues?.value?.[values?.business_nature as 'SOR' | 'OR']?.map((item) => ({
                        label: item?.company_name,
                        value: item?.code,
                    }))

                    const internalPOC = Object.entries(internalData).flatMap(([category, people]: any) =>
                        people.map((person: any) => ({
                            label: `${person.name} (${category})`,
                            value: person,
                        })),
                    )

                    return (
                        <Form className="xl:w-[90%] w-full p-5 ">
                            {!isOther && (
                                <FormContainer>
                                    <FormContainer className="bg-gradient-to-r  p-6 rounded-xl border-l-4 border-blue-500 shadow-lg mb-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FcViewDetails className="text-2xl text-blue-600" />
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-800">Seller Basic Details</h4>
                                        </div>

                                        <FormContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                            {BasicSellerInformation.map((item, key) => {
                                                return (
                                                    <FormItem key={key} label={item.label} className="w-full" asterisk={item.isRequired}>
                                                        <div className="relative">
                                                            <Field
                                                                type={item.type}
                                                                name={item?.name}
                                                                placeholder={`Enter ${item.label}`}
                                                                component={Input}
                                                                className="pl-10"
                                                                onInput={inputHandlers[item.name]}
                                                            />
                                                        </div>
                                                    </FormItem>
                                                )
                                            })}
                                            {BasicExtra.map((item, key) => {
                                                return (
                                                    <FormItem key={key} label={item.label} className="w-full" asterisk={item.isRequired}>
                                                        <div className="relative">
                                                            <Field
                                                                type={item.type}
                                                                name={item?.name}
                                                                placeholder={`Enter ${item.label}`}
                                                                component={Input}
                                                                className="pl-10"
                                                            />
                                                        </div>
                                                    </FormItem>
                                                )
                                            })}
                                        </FormContainer>
                                    </FormContainer>
                                    {/* Commercials */}
                                    <div className="bg-gradient-to-r  p-6 rounded-xl border-l-4 border-orange-500 shadow-lg mb-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <GrDocument className="text-2xl text-orange-600" />
                                            </div>
                                            <h4 className="text-xl font-bold text-gray-800">Commercials</h4>
                                        </div>

                                        <FormContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                            <CommonSelect
                                                asterisk
                                                name={SellerKeys.BUSINESS_NATURE}
                                                options={NOBOptions()}
                                                label="Nature of Business"
                                            />
                                            <FormItem asterisk label="Business Company" className="col-span-1 w-full">
                                                <Field name={SellerKeys.BUSINESS_NATURE_COMPANY}>
                                                    {({ field, form }: FieldProps) => {
                                                        const fieldValueArray = Array.isArray(field?.value)
                                                            ? field?.value
                                                            : field?.value?.split(',') || []
                                                        const selectedOptions = BusinessCompanyData?.filter((option: any) =>
                                                            fieldValueArray.includes(option.value?.toString()),
                                                        )

                                                        return (
                                                            <Select
                                                                isMulti
                                                                isClearable
                                                                className="w-full"
                                                                options={BusinessCompanyData}
                                                                getOptionLabel={(option) => option?.label}
                                                                getOptionValue={(option) => option?.value?.toString()}
                                                                value={selectedOptions}
                                                                onChange={(newVals: any) => {
                                                                    const selectedValues =
                                                                        newVals?.map((val: any) => val.value?.toString()) || []

                                                                    form.setFieldValue(
                                                                        SellerKeys.BUSINESS_NATURE_COMPANY,
                                                                        selectedValues.join(','),
                                                                    )
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                </Field>
                                            </FormItem>
                                            {SellerCommercialsArray.map((item, key) => {
                                                return (
                                                    <FormItem key={key} label={item.label} className="w-full" asterisk={item.isRequired}>
                                                        <div className="relative">
                                                            <Field
                                                                type={item.type}
                                                                name={item?.name}
                                                                placeholder={`Enter ${item.label}`}
                                                                component={Input}
                                                                className="pl-10"
                                                            />
                                                        </div>
                                                    </FormItem>
                                                )
                                            })}
                                            <FormItem asterisk label="Fashion Style" className="col-span-1 w-full">
                                                <Field name={SellerKeys.SEGMENT}>
                                                    {({ field, form }: FieldProps) => {
                                                        const fieldValueArray = Array.isArray(field?.value)
                                                            ? field?.value
                                                            : field?.value?.split(',') || []
                                                        const selectedOptions = fieldValueArray?.map((item: any) => {
                                                            const selectedOption = SegmentOptions()?.find((options: any) => {
                                                                return options?.label === item
                                                            })
                                                            return selectedOption
                                                        })
                                                        return (
                                                            <Select
                                                                isMulti
                                                                isClearable
                                                                className="w-full"
                                                                options={SegmentOptions()}
                                                                getOptionLabel={(option) => option?.label}
                                                                getOptionValue={(option) => option?.value?.toString()}
                                                                value={selectedOptions}
                                                                onChange={(newVals) => {
                                                                    const selectedValues = newVals?.map((val: any) => val.value) || []
                                                                    form.setFieldValue(SellerKeys.SEGMENT, selectedValues?.join(','))
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                </Field>
                                            </FormItem>
                                            <FormItem asterisk label="Select POC" className="col-span-1 w-full">
                                                <Field name={'int_poc_details'}>
                                                    {({ field, form }: FieldProps) => {
                                                        const selectedOptions = field?.value || []

                                                        return (
                                                            <Select
                                                                isMulti
                                                                isClearable
                                                                className="w-full"
                                                                options={internalPOC}
                                                                getOptionLabel={(option: any) => option.label}
                                                                getOptionValue={(option: any) => option.value.email}
                                                                value={selectedOptions}
                                                                onChange={(newVals: any) => {
                                                                    form.setFieldValue('int_poc_details', newVals || [])
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                </Field>
                                            </FormItem>
                                        </FormContainer>
                                    </div>
                                    <div className="mt-10 space-y-6">
                                        {Object.entries(internalData).map(([category, people]: any) => (
                                            <div key={category} className="border rounded-xl bg-white shadow-sm overflow-hidden">
                                                <div className="px-5 py-3 bg-gray-100 border-b">
                                                    <h5 className="text-lg font-semibold text-gray-800">{category}</h5>
                                                </div>
                                                <div className="p-4">
                                                    {people?.length > 0 ? (
                                                        <div className="divide-y">
                                                            {people.map((person: any, index: number) => (
                                                                <div
                                                                    key={index}
                                                                    className="py-2 grid grid-cols-1 md:grid-cols-3 gap-1 text-sm"
                                                                >
                                                                    <div>
                                                                        <p className="text-blue-500 text-xs">Name</p>
                                                                        <p className="font-medium text-gray-800">{person.name}</p>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-blue-500 text-xs">Mobile</p>
                                                                        <p className="font-medium text-gray-800">{person.mobile}</p>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-blue-500 text-xs">Email</p>
                                                                        <p className="font-medium text-gray-800 break-all">
                                                                            {person.email}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-400">No team members available</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </FormContainer>
                            )}
                            {isOther && <SellerForm isAdd values={values} isSubmitting={isSubmitting} />}
                            <div className="flex justify-end mt-8 gap-4">
                                <Button type="button" variant={isOther ? 'gray' : 'pending'} onClick={() => setIsOther((prev) => !prev)}>
                                    {isOther ? 'Go to basic Details' : 'Fill Other Data'}
                                </Button>

                                <div>
                                    {!isOther ? (
                                        <>
                                            <Button type="submit" variant="blue" loading={isSubmitting} disabled={isSubmitting}>
                                                Email To Vendor
                                            </Button>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </Spin>
    )
}

export default AddSeller
