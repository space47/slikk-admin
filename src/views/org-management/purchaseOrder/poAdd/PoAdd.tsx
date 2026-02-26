/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { buildFormData } from '@/utils/formDataBuilder'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { FormContainer } from '@/components/ui'
import PoFormStepOne from '../poUtils/PoFormStepOne'
import FormButton from '@/components/ui/Button/FormButton'
import { useMemo, useState } from 'react'
import FormUploadFile from '@/common/FormUploadFile'
import { PoField } from '../poUtils/poFormCommon'

const PoAdd = () => {
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const commercial_approval_doc = useMemo(() => selectedCompany?.commercial_approval_doc, [selectedCompany])
    const [stateCode, setStateCode] = useState('')

    const VendorEntity = selectedCompany?.business_nature_company_details?.map((item) => ({
        label: item?.company_name,
        value: item.code,
    }))

    const initialValue = {
        [PoField.ORDER_BILLING_ENTITY]: '',
        [PoField.ORDER_SHIPPING_ADDRESS]: '',
        [PoField.ORDER_BILLING_ADDRESS]: '',
        [PoField.PAYMENT_TERMS]: selectedCompany?.approved_payment_term,
    }

    const handleSubmit = async (values: any) => {
        console.log('clicked hjere', values)
        try {
            const payload = {
                store: values.store,
                company: selectedCompany?.id,
                order_billing_entity: values[PoField.ORDER_BILLING_ENTITY],
                order_billing_address: values[PoField.ORDER_BILLING_ADDRESS],
                order_shipping_address: values[PoField.ORDER_SHIPPING_ADDRESS],
                commercial_terms: values[PoField.COMMERCIAL_TERMS],
                payment_terms: values[PoField.PAYMENT_TERMS],
                discount_sharing_applicable: values[PoField.DISCOUNT_SHARING],
                special_terms: values[PoField.SPECIAL_TERMS],
                expected_delivery_date: values[PoField.EXPECTED_DELIVERY],
                po_nature: values[PoField.PO_NATURE],
                state_code: stateCode,
                company_gst: values[PoField.COMPANY_GST]?.id,
                payment_mode: values[PoField.PAYMENT_MODE],
            }

            const formData = buildFormData(payload)
            if (!commercial_approval_doc && values?.commercial_terms?.length > 0) {
                formData.append(PoField.COMMERCIAL_TERMS, values.commercial_terms[0])
            }
            const res = await axioisInstance.post(`/merchant/purchase/order`, formData)
            if (res?.data) {
                navigate(`/app/po/orderItems/${res?.data?.data?.id}`)
            }
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    return (
        <div>
            <h3 className="text-xl font-bold">Create Purchase Order</h3>
            <Formik enableReinitialize initialValues={initialValue as any} onSubmit={handleSubmit}>
                {({ values }) => {
                    const wareHouseDetails = selectedCompany?.gst_details?.find((item) => item?.id === values.company_gst?.id)
                    setStateCode(wareHouseDetails?.gstin?.slice(0, 2) || '')
                    return (
                        <Form className=" w-full p-5 bg-gray-50 rounded-xl shadow-xl ">
                            <FormContainer>
                                <PoFormStepOne
                                    VendorEntity={VendorEntity}
                                    wareHouseDetails={wareHouseDetails}
                                    businessNatureCompany={selectedCompany?.business_nature_company_details || []}
                                    values={values}
                                />
                                {!commercial_approval_doc && (
                                    <>
                                        <FormUploadFile
                                            asterisk
                                            label="Upload Commercial Terms"
                                            fileList={values?.commercialFile}
                                            name={PoField.COMMERCIAL_TERMS}
                                            existingFile={values?.commercial_terms}
                                        />
                                    </>
                                )}
                                <FormButton value="Create" />
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default PoAdd
