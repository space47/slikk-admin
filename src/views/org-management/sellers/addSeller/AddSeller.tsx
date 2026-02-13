/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import SellerForm from '../sellerForm/SellerForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { fileFields, simpleFields } from '../sellerUtils/sellerFormCommon'
import { useState } from 'react'

const AddSeller = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true)
        const formData = new FormData()
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

        appendIfValid('gst_details', JSON.stringify(updatedDetails))

        try {
            const res = await axioisInstance.post(`/merchant/company`, formData)
            successMessage(res)
            navigate(-1)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <h3 className="text-xl font-bold">Add New Seller</h3>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="xl:w-[90%] w-full p-5 ">
                        <SellerForm values={values} isSubmitting={isSubmitting} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddSeller
