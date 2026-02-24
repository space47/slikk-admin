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
import { useMemo } from 'react'
import FormUploadFile from '@/common/FormUploadFile'

const PoAdd = () => {
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const commercial_approval_doc = useMemo(() => selectedCompany?.commercial_approval_doc, [selectedCompany])

    const VendorEntity = selectedCompany?.business_nature_company?.map((item) => ({
        label: item?.company_name,
        value: item.code,
    }))

    const initialValue = {
        order_billing_entity: '',
        order_billing_address: '',
        order_shipping_address: '',
        payment_terms: selectedCompany?.approved_payment_term,
    }

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                store: values.store,
                company: selectedCompany?.id,
                order_billing_entity: values.order_billing_entity,
                order_billing_address: values.order_billing_address,
                order_shipping_address: values.order_shipping_address,
                commercial_terms: values.commercial_terms,
                payment_terms: values.payment_terms,
                discount_sharing_applicable: values.discount_sharing_applicable,
                special_terms: values.special_terms,
                expected_delivery_date: values.expected_delivery_date,
                po_nature: values.po_nature,
                company_gst: values?.company_gst?.id,
                payment_mode: values?.payment_mode,
            }

            const formData = buildFormData(payload)
            if (!commercial_approval_doc && values?.commercial_terms?.length > 0) {
                formData.append('commercial_terms', values.commercial_terms[0])
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
                    console.log(values?.company_gst)
                    const wareHouseDetails = selectedCompany?.gst_details?.find((item) => item?.id === values.company_gst?.id)
                    return (
                        <Form className=" w-full p-5 bg-gray-50 rounded-xl shadow-xl ">
                            <FormContainer>
                                <PoFormStepOne
                                    VendorEntity={VendorEntity}
                                    wareHouseDetails={wareHouseDetails}
                                    businessNatureCompany={selectedCompany?.business_nature_company || []}
                                />
                                {!commercial_approval_doc && (
                                    <>
                                        <FormUploadFile
                                            asterisk
                                            label="Upload Commercial Terms"
                                            fileList={values?.commercialFile}
                                            name="commercial_terms"
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
