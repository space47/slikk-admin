/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import SellerForm from '../sellerForm/SellerForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'

const AddSeller = () => {
    const navigate = useNavigate()

    const handleSubmit = async (values: any) => {
        const formData = new FormData()

        const appendIfValid = (key: string, value: any) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value)
            }
        }
        const simpleFields = [
            'registered_name',
            'is_active',
            'code',
            'head_name',
            'head_contact',
            'head_email',
            'gstin',
            'pan_number',
            'tan_number',
            'cin',
            'address',
            'contact_number',
            'alternate_contact_number',
            'poc_email',
            'poc_name',
            'finance_name',
            'finance_email',
            'finance_contact_number',
            'account_number',
            'account_holder_name',
            'ifsc',
            'bank_name',
            'branch_name',
            'account_type',
            'segment',
            'settlement_days',
            'revenue_share',
            'handling_charges_per_order',
            'warehouse_charge_per_sku',
            'damages_per_sku',
            'removal_fee_per_sku',
            'approved_payment_term',
            'business_nature',
            'sp_type',
            'pf_declaration',
            'is_msme',
            'msme_category',
            'authorized_person',
            'declaration_statement',
            'name',
        ]
        simpleFields.forEach((key) => appendIfValid(key, values?.[key]))
        const fileFields = [
            'gst_certificate',
            'pan_copy',
            'tan_copy',
            'cancelled_cheque',
            'pf_declaration_doc',
            'trade_mark_certificate',
            'msme_certificate',
            'commercial_approval_doc',
            'approved_onboarding_doc',
        ]
        fileFields.forEach((key) => appendIfValid(key, values?.[key]?.[0]))

        const updatedDetails = (values?.gst_details || []).map((warehouse: any, index: number) => {
            if (warehouse?.gst_certificate?.[0] instanceof File) {
                const certKey = `cert${index + 1}`
                formData.append(certKey, warehouse.gst_certificate[0])
                return {
                    ...warehouse,
                    gst_certificate: certKey,
                }
            }
            return {
                ...warehouse,
            }
        })

        appendIfValid('gst_details', JSON.stringify(updatedDetails))

        try {
            const res = await axioisInstance.post(`/merchant/company`, formData)
            successMessage(res)
            navigate(-1)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
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
