/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useState } from 'react'
import { notification } from 'antd'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import StoreCommonForm from '../storeUtil/StoreCommonForm'

const AddStore = () => {
    const [imagview, setImageView] = useState<string[]>([])
    const [descriptiontextarea, setDescriptiontextarea] = useState()
    const [instructiontextarea, setInstructiontextarea] = useState()
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
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

    const handleDescriptionChange = (e: any) => {
        setDescriptiontextarea(e.target.value)
    }

    const handleInstructionChange = (e: any) => {
        setInstructiontextarea(e.target.value)
    }

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

    const handleFileupload = async (files: File[]) => {
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'category')

        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const newData = response.data.url
            setImageView(newData)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    const handleSubmit = async (values: any) => {
        console.log('values of store', values)
        let uploadedImage = ''
        if (values?.images_array && values?.images_array?.length > 0) {
            uploadedImage = await handleFileupload(values?.images_array)
            setImageView([uploadedImage])
        }

        const formData = {
            ...values,
            area: address.area,
            city: address.city,
            pincode: address.pincode,
            state: address.state,
            return_area: returnAddress.return_area,
            return_city: returnAddress.return_city,
            return_pincode: returnAddress.return_pincode,
            return_state: returnAddress.return_state,
            description: descriptiontextarea,
            instruction: instructiontextarea,
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
                {({ values, resetForm }) => (
                    <Form className="w-2/3" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                        <StoreCommonForm
                            companyList={companyList}
                            descriptiontextarea={descriptiontextarea}
                            imagview={imagview}
                            instructiontextarea={instructiontextarea}
                            values={values}
                            handleAddress={handleAddress}
                            handleCheckbox={handleCheckbox}
                            handleDescriptionChange={handleDescriptionChange}
                            handleInstructionChange={handleInstructionChange}
                            handleReturnAddress={handleReturnAddress}
                            resetForm={resetForm}
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
