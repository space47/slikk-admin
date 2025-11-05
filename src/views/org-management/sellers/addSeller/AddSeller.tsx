/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { SellerFormTypes } from '../sellerCommon'
import SellerForm from '../sellerForm/SellerForm'

const AddSeller = () => {
    const navigate = useNavigate()
    const handleSubmit = async (values: SellerFormTypes) => {
        if (values.account_number !== values.confirm) {
            notification.error({ message: 'Failure!! Account number does not match' })
            return
        }
        if (values.contact_number === values.alternate_contact_number) {
            notification.error({ message: 'Failure !! Alternate Mobile Number Should be different' })
            return
        }

        const { confirm, ...filteredValues } = values
        console.log(confirm)
        const formData = {
            ...filteredValues,
            handling_charges_per_order: Number(values.handling_charges_per_order),
        }

        try {
            const response = await axioisInstance.post('merchant/company', formData)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Seller created Successfully',
            })
            navigate('/app/sellers')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Seller not created',
            })
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
