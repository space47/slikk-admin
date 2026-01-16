/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useState } from 'react'
import { notification } from 'antd'
import StoreCommonForm from '../storeUtil/StoreCommonForm'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'

const AddStore = () => {
    const [imagview, setImageView] = useState<string[]>([])
    const [address, setAddress] = useState({
        area: '',
        pincode: '',
        state: '',
        city: '',
    })
    const [returnAddress, setReturnAddress] = useState({
        return_area: '',
        return_pincode: '',
        return_state: '',
        return_city: '',
    })
    const [isSameAddress, setIsSameAddress] = useState(false)

    const handleCheckbox = () => {
        setIsSameAddress((prev) => !prev)
        if (!isSameAddress) {
            setReturnAddress({
                return_area: address.area,
                return_pincode: address.pincode,
                return_state: address.state,
                return_city: address.city,
            })
        } else {
            setReturnAddress({
                return_area: '',
                return_pincode: '',
                return_state: '',
                return_city: '',
            })
        }
    }

    const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleReturnAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setReturnAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubmit = async (values: any) => {
        let uploadedImage = ''
        if (values?.images_array && values?.images_array?.length > 0) {
            uploadedImage = await handleimage('category', values?.images_array)
            setImageView([uploadedImage])
        }

        const formData = {
            ...values,
            company: 1,
            area: address.area,
            city: address.city,
            pincode: address.pincode,
            state: address.state,
            return_area: returnAddress.return_area,
            return_city: returnAddress.return_city,
            return_pincode: returnAddress.return_pincode,
            return_state: returnAddress.return_state,
            description: values?.description ? textParser(values.description) : '',
            instruction: values?.instruction ? textParser(values.instruction) : '',
            image: uploadedImage ?? '',
            is_volumetric_store: values.is_volumetric_store || false,
        }
        try {
            const response = await axioisInstance.post('merchant/store', formData)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Store created successfully',
            })
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Failed to create Store',
            })
        }
    }

    return (
        <div>
            <div className="text-xl mb-10 font-bold">Add New Store</div>
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="w-full" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                        <StoreCommonForm
                            imagview={imagview}
                            setFieldValue={setFieldValue}
                            values={values}
                            handleAddress={handleAddress}
                            handleCheckbox={handleCheckbox}
                            handleReturnAddress={handleReturnAddress}
                            address={address}
                            returnAddress={returnAddress}
                        />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddStore
