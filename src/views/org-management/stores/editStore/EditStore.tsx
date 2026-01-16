/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useMemo, useState } from 'react'
import { notification } from 'antd'
import { StoreTypes } from '../commonStores'
import { useNavigate, useParams } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import { useStoresFunctions } from '../storeUtil/useStoresFunctions'
import StoreCommonForm from '../storeUtil/StoreCommonForm'
import { AxiosError } from 'axios'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'

const EditCustomerProfile = () => {
    const navigate = useNavigate()
    const [imageView, setImageView] = useState<string[]>([])
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
    const [isCopy, setIsCopy] = useState(false)
    const { id } = useParams()

    const query = useMemo(() => {
        return `merchant/store?store_id=${id}`
    }, [id])

    const { data, responseStatus } = useFetchSingleData<StoreTypes>({ url: query })

    useEffect(() => {
        setAddress({
            area: data?.area || '',
            pincode: (data?.pincode as any) || '',
            state: data?.state || '',
            city: data?.city || '',
        })
    }, [data])

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

    const { initialValue } = useStoresFunctions({ storeData: isCopy ? undefined : data })

    const handleSubmit = async (values: StoreTypes) => {
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
            const response = isCopy
                ? await axioisInstance.post('merchant/store', formData)
                : await axioisInstance.patch(`merchant/store`, formData)
            notification.success({ message: response?.data?.message || `successfully ${isCopy ? 'created' : 'updated'}` })
            navigate(-1)
        } catch (error: any) {
            console.error('Error submitting form:', error)
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.response?.data?.message || `Error occurred while ${isCopy ? 'creating' : 'updating'} Store`,
                })
            }
        }
    }

    if (responseStatus === 403) {
        return <AccessDenied />
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold">{isCopy ? 'New Store' : 'Edit Store'}</div>
                <Button
                    variant={isCopy ? 'twoTone' : 'solid'}
                    type="button"
                    size="sm"
                    onClick={() => {
                        setIsCopy(!isCopy)
                    }}
                >
                    {isCopy ? 'Set to Edit Mode' : 'Set to Copy'}
                </Button>
            </div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="p-4 w-full shadow-xl rounded-xl" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                        <StoreCommonForm
                            setFieldValue={setFieldValue}
                            imagview={imageView}
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

export default EditCustomerProfile
