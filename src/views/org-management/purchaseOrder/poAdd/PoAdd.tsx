/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import PoForm from '../poUtils/PoForm'
import { buildFormData } from '@/utils/formDataBuilder'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

const PoAdd = () => {
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

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
                state_code: values.state_code,
                expected_delivery_date: values.expected_delivery_date,
                po_nature: values.po_nature,
            }

            const formData = buildFormData(payload)
            const res = await axioisInstance.post(`/merchant/purchase/order`, formData)
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    return (
        <div>
            <h3 className="text-xl font-bold">Create Purchase Order</h3>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {() => (
                    <Form className=" w-full p-5 bg-gray-50 rounded-xl shadow-xl ">
                        <PoForm />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default PoAdd
