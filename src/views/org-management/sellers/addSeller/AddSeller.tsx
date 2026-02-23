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
    CategoryMailOptions,
    CategoryNameOptions,
    CategoryNumberOptions,
    fileFields,
    NOBOptions,
    SellerCommercialsArray,
    SellerInternalArray,
    simpleFields,
} from '../sellerUtils/sellerFormCommon'
import { useState } from 'react'
import { Button, FormContainer, FormItem, Input, Select, Switcher } from '@/components/ui'

import { GrDocument } from 'react-icons/gr'
import { SegmentOptions } from '@/constants/commonArray.constant'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { FcViewDetails } from 'react-icons/fc'
import { SellerKeys } from '../sellerCommon'
import { textParser } from '@/common/textParser'
import { getProfileData } from '@/store/action/authAction'
import { useAppDispatch } from '@/store'
import { handlePhoneInputValidation } from '../sellerUtils/sellerFunctions'

const AddSeller = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOther, setIsOther] = useState(false)
    const dispatch = useAppDispatch()
    const initialValue = {
        int_finance_name: 'Dinesha',
        int_finance_email: 'dinesha@slikk.club',
        int_finance_contact_number: '8892377371',
    }

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true)
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
            if (warehouse?.gst_certificate?.[0] instanceof File) {
                const certKey = `cert${index + 1}`
                formData.append(certKey, warehouse.gst_certificate[0])
                return { ...warehouse, gst_certificate: certKey }
            }
            return { ...warehouse }
        })

        if (isOther) {
            appendIfValid('gst_details', JSON.stringify(updatedDetails))
        }

        try {
            const res = await axioisInstance.post(`/merchant/company`, formData)
            successMessage(res)
            await dispatch(getProfileData())
            navigate(-1)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputHandlers: Record<string, (e: React.FormEvent<HTMLInputElement>) => void> = {
        [SellerKeys.HEAD_CONTACT]: handlePhoneInputValidation,
        [SellerKeys.CONTACT_NUMBER]: handlePhoneInputValidation,
    }

    return (
        <div>
            <h3 className="text-xl font-bold">Add New Seller</h3>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }) => (
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

                                        <CommonSelect
                                            asterisk
                                            label="Internal Category Head Name"
                                            name={SellerKeys.INT_POC_NAME}
                                            options={CategoryNameOptions}
                                        />
                                        <CommonSelect
                                            asterisk
                                            label="Internal Category Head Email"
                                            name={SellerKeys.INT_POC_EMAIL}
                                            options={CategoryMailOptions}
                                        />
                                        <CommonSelect
                                            asterisk
                                            label="Internal Category Head Number"
                                            name={SellerKeys.INT_POC_CONTACT}
                                            options={CategoryNumberOptions}
                                        />

                                        {SellerInternalArray?.map((item, idx) => {
                                            return (
                                                <FormItem key={idx} label={item?.label} asterisk={item?.isRequired}>
                                                    <Field
                                                        type={item?.type}
                                                        name={item?.name}
                                                        placeholder={`Enter ${item?.label}`}
                                                        component={item?.type === 'checkbox' ? Switcher : Input}
                                                    />
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
                                        <CommonSelect
                                            asterisk
                                            name={SellerKeys.BUSINESS_NATURE}
                                            options={NOBOptions()}
                                            label="Nature of Business"
                                        />
                                    </FormContainer>
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
                )}
            </Formik>
        </div>
    )
}

export default AddSeller
