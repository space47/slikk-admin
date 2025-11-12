/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import SellerForm from '../sellerForm/SellerForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'

const AddSeller = () => {
    const navigate = useNavigate()

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
        appendIfValid('head_contact', values?.head_contact)
        appendIfValid('head_email', values?.head_email)
        appendIfValid('gst_certificate', values?.gst_certificate[0])
        appendIfValid('gstin', values?.gstin)
        appendIfValid('pan_copy', values?.pan_copy[0])
        appendIfValid('pan_number', values?.pan_number)
        appendIfValid('tan_number', values?.tan_number)
        appendIfValid('tan_copy', values?.tan_copy[0])
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
        appendIfValid('cancelled_cheque', values?.cancelled_cheque[0])
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
        appendIfValid('pf_declaration_doc', values?.pf_declaration_doc[0])
        appendIfValid('trade_mark_certificate', values?.trade_mark_certificate[0])
        appendIfValid('is_msme', values?.is_msme)
        appendIfValid('msme_category', values?.msme_category)
        appendIfValid('msme_certificate', values?.msme_certificate[0])
        appendIfValid('commercial_approval_doc', values?.commercial_approval_doc[0])
        appendIfValid('approved_onboarding_doc', values?.approved_onboarding_doc[0])

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

        try {
            const res = await axioisInstance.post(`/merchant/company`, formData)
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
            <h3 className="text-xl font-bold">Add New Seller</h3>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="xl:w-[90%] w-full p-5 ">
                        <SellerForm values={values} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddSeller
