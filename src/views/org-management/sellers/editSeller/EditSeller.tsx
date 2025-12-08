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
import dayjs from 'dayjs'
import { fileFields, simpleFields } from '../sellerUtils/sellerFormCommon'

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
        gst_details: sellerData?.gst_details || [],
        date: dayjs().format('YYYY-MM-DD HH:mm:ss a'),
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
        simpleFields.forEach((key) => appendIfValid(key, values?.[key]))
        fileFields.forEach((key) => appendIfValid(key, values?.[key]?.[0]))
        const existingDetails = initialValue?.gst_details || []
        const updatedDetails = (values?.gst_details || []).map((warehouse: any, index: number) => {
            const existing = existingDetails[index] || {}
            if (warehouse?.gst_certificate?.[0] instanceof File) {
                const certKey = `cert${index + 1}`
                formData.append(certKey, warehouse.gst_certificate[0])
                return { ...warehouse, gst_certificate: certKey }
            }
            return { ...warehouse, gst_certificate: existing?.gst_certificate }
        })
        const gstChanged = JSON.stringify(existingDetails) !== JSON.stringify(updatedDetails)
        if (gstChanged) {
            appendIfValid('gst_details', JSON.stringify(updatedDetails))
        }
        const changedValue = getChangedFormData(formData, initialValue)

        try {
            const res = await axioisInstance.patch(`/merchant/company/${id}`, changedValue)
            successMessage(res)
            navigate(-1)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
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
