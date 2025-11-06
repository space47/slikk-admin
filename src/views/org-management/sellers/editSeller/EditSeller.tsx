/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import SellerForm from '../sellerForm/SellerForm'
import { vendorService } from '@/store/services/vendorService'
import { Spinner } from '@/components/ui'
import { AxiosError } from 'axios'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { getChangedFormData } from '@/utils/apiBodyUtility'

const EditSeller = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [sellerData, setSellerData] = useState<any>()
    const { data, isSuccess, isError, isLoading, error } = vendorService.useGetSingleVendorListQuery({ id: id as string }, { skip: !id })

    useEffect(() => {
        if (isSuccess) setSellerData(data?.data)
        if (isError) {
            notification.error({ message: (error as any)?.data?.message })
        }
    }, [isSuccess, isError])

    const initialValue: any = {
        registered_name: sellerData?.registered_name || '',
        is_active: sellerData?.is_active || false,
        code: sellerData?.code || '',
        head_name: sellerData?.head_name || '',
        head_contact: sellerData?.head_contact || '',
        head_email: sellerData?.head_email || '',
        gst_certificate: sellerData?.gst_certificate || null, // file
        gstin: sellerData?.gstin || '',
        pan_copy: sellerData?.pan_copy || null, // file
        pan_number: sellerData?.pan_number || '',
        tan_number: sellerData?.tan_number || '',
        tan_copy: sellerData?.tan_copy || null, // file
        cin: sellerData?.cin || '',
        address: sellerData?.address || '',
        contact_number: sellerData?.contact_number || '',
        alternate_contact_number: sellerData?.alternate_contact_number || '',
        poc_email: sellerData?.poc_email || '',
        poc: sellerData?.poc || '',
        finance_name: sellerData?.finance_name || '',
        finance_email: sellerData?.finance_email || '',
        finance_contact_number: sellerData?.finance_contact_number || '',
        account_number: sellerData?.account_number || '',
        account_holder_name: sellerData?.account_holder_name || '',
        ifsc: sellerData?.ifsc || '',
        bank_name: sellerData?.bank_name || '',
        branch_name: sellerData?.branch_name || '',
        account_type: sellerData?.account_type || '',
        cancelled_cheque: sellerData?.cancelled_cheque || null, // file
        segment: sellerData?.segment || '',
        settlement_days: sellerData?.settlement_days || 0,
        revenue_share: sellerData?.revenue_share || 0,
        handling_charges_per_order: sellerData?.handling_charges_per_order || 0,
        warehouse_charge_per_sku: sellerData?.warehouse_charge_per_sku || 0,
        damages_per_sku: sellerData?.damages_per_sku || 0,
        removal_fee_per_sku: sellerData?.removal_fee_per_sku || 0,
        approved_payment_term: sellerData?.approved_payment_term || '',
        business_nature: sellerData?.business_nature || '',
        sp_type: sellerData?.sp_type || '',
        pf_declaration: sellerData?.pf_declaration || '',
        pf_declaration_doc: sellerData?.pf_declaration_doc || null, // file
        trade_mark_certificate: sellerData?.trade_mark_certificate || null, // file
        is_msme: sellerData?.is_msme || false,
        msme_category: sellerData?.msme_category || '',
        msme_certificate: sellerData?.msme_certificate || null, // file
        commercial_approval_doc: sellerData?.commercial_approval_doc || null, // file
        approved_onboarding_doc: sellerData?.approved_onboarding_doc || null, // file
        warehouse_name: sellerData?.warehouse_name || '',
        authorized_person: sellerData?.authorized_person || '',
        name: sellerData?.name || '',
        create_date: sellerData?.create_date || '',
        update_date: sellerData?.update_date || '',
        id: sellerData?.id || 0,
        confirm: sellerData?.account_number || '',
    }

    const handleSubmit = async (values: any) => {
        if (values.contact_number === values.alternate_contact_number) {
            notification.error({ message: 'Failure !! Alternate Mobile Number Should be different' })
            return
        }
        const formData = new FormData()
        const appendIfValid = (key: string, value: any) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value)
            }
        }
        appendIfValid('registered_name', values?.registered_name)
        appendIfValid('is_active', values?.is_active)
        appendIfValid('code', values?.code)
        appendIfValid('head_name', values?.head_name)
        // appendIfValid('cert01', cert1)
        // appendIfValid('cert02', cert2)
        appendIfValid('head_contact', values?.head_contact)
        appendIfValid('head_email', values?.head_email)
        appendIfValid('gst_certificate', values?.gst_certificate)
        appendIfValid('gstin', values?.gstin)
        appendIfValid('pan_copy', values?.pan_copy)
        appendIfValid('pan_number', values?.pan_number)
        appendIfValid('tan_number', values?.tan_number)
        appendIfValid('tan_copy', values?.tan_copy)
        appendIfValid('cin', values?.cin)
        appendIfValid('address', values?.address)
        appendIfValid('contact_number', values?.contact_number)
        appendIfValid('alternate_contact_number', values?.alternate_contact_number)
        appendIfValid('poc_email', values?.poc_email)
        appendIfValid('poc', values?.poc_name)
        appendIfValid('finance_name', values?.finance_name)
        appendIfValid('finance_email', values?.finance_email)
        appendIfValid('finance_contact_number', values?.finance_contact_number)
        appendIfValid('account_number', values?.account_number)
        appendIfValid('account_holder_name', values?.account_holder_name)
        appendIfValid('ifsc', values?.ifsc)
        appendIfValid('bank_name', values?.bank_name)
        appendIfValid('branch_name', values?.branch_name)
        appendIfValid('account_type', values?.account_type)
        appendIfValid('cancelled_cheque', values?.cancelled_cheque)
        appendIfValid('segment', values?.segment)
        appendIfValid('settlement_days', values?.settlement_days)
        appendIfValid('revenue_share', values?.revenue_share)
        appendIfValid('handling_charges_per_order', values?.handling_charges_per_order)
        appendIfValid('warehouse_charge_per_sku', values?.warehouse_charge_per_sku)
        appendIfValid('damages_per_sku', values?.damages_per_sku)
        appendIfValid('removal_fee_per_sku', values?.removal_fee_per_sku)
        appendIfValid('approved_payment_term', values?.approved_payment_term)
        appendIfValid('business_nature', values?.business_nature)
        appendIfValid('sp_type', values?.sp_type)
        appendIfValid('pf_declaration', values?.pf_declaration)
        appendIfValid('pf_declaration_doc', values?.pf_declaration_doc)
        appendIfValid('trade_mark_certificate', values?.trade_mark_certificate)
        appendIfValid('is_msme', values?.is_msme)
        appendIfValid('msme_category', values?.msme_category)
        appendIfValid('msme_certificate', values?.msme_certificate)
        appendIfValid('commercial_approval_doc', values?.commercial_approval_doc)
        appendIfValid('approved_onboarding_doc', values?.approved_onboarding_doc)

        appendIfValid(
            'gst_details',
            JSON.stringify([
                {
                    warehouse_name: values?.warehouse_name,
                    warehouse_address: values?.address,
                    gstin: values?.gstin,
                    poc_name: values?.poc_name,
                    poc_email: values?.poc_email,
                },
            ]),
        )

        appendIfValid('authorized_person', values?.authorized_person)
        appendIfValid('name', values?.name)

        const changedValue = getChangedFormData(formData, initialValue)

        try {
            const res = await axioisInstance.patch(`/merchant/company/${id}`, changedValue)
            successMessage(res)
            navigate(-1)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    return (
        <div>
            <h3 className="text-xl font-bold">Onboarding Process</h3>
            {isLoading && (
                <div className="flex items-center justify-center mt-10">
                    <Spinner size={30} />
                </div>
            )}
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="xl:w-[90%] w-full p-5 ">
                        <SellerForm values={values} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditSeller
