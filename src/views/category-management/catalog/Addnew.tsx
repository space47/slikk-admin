/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { INITIALVALUES } from './ProductCommon'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { textParser } from '@/common/textParser'
import { handleimage, handleVideo } from './handlingProductImage'
import ProductFormCommon from './productutils/ProductForm'

const AddProduct = () => {
    const navigate = useNavigate()
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyData, setCompanyData] = useState<number>()
    const [domainWatcher, setDomainWatcher] = useState<string | string[] | undefined>('')
    const [segmentKeys, setSegmentKeys] = useState<string[] | undefined>([])

    const fetchSegmentByDomain = async () => {
        const domainParam = Array.isArray(domainWatcher) ? domainWatcher.join(',') : domainWatcher

        try {
            const res = await axioisInstance.get(`/product-field-configuration?domain=${domainParam}`)
            const data = Object.keys(res.data)
            setSegmentKeys(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchSegmentByDomain()
    }, [domainWatcher])

    const handleImageCheck = async (field: any) => {
        return field && field.length > 0 ? await handleimage(field) : null
    }
    const handleVideoCheck = async (field: any) => {
        return field && field.length > 0 ? await handleVideo(field) : null
    }

    const fileShow = (uploadFile: any, value: any) => {
        if (uploadFile && value) {
            return [uploadFile, value].join(',')
        }
        return uploadFile || value || null
    }

    const handleSubmit = async (values: any) => {
        const parsedDescription = values?.description ?? textParser(values?.description)
        const imageUpload = await handleImageCheck(values.images)
        const colorlink = await handleImageCheck(values.color_code)
        const videoUpload = await handleVideoCheck(values.video)
        const sizeUpload = await handleImageCheck(values.size_chart_image_array)

        const imageShow = fileShow(imageUpload, values.image)
        const videoShow = fileShow(videoUpload, values.video_link)
        const sizeShow = fileShow(sizeUpload, values.size_chart_image_array)

        const formData = {
            ...values,
            color_code_link: colorlink ? colorlink : values.color_code_link,
            image: imageShow,
            size_chart_image: sizeShow,
            company: companyData,
            description: parsedDescription,
            colorfamily: values.colorfamily,
            video_link: videoShow,
        }
        console.log('body  of add', formData)

        try {
            const response = await axioisInstance.post('product/add', formData)
            console.log(response)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Product created Successfully',
            })
            navigate('/app/catalog/products')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Product not created ',
            })
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <div>
            <h3 className="mb-5 text-neutral-900">ADD NEW PRODUCT</h3>
            <Formik
                enableReinitialize
                initialValues={INITIALVALUES}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, resetForm }) => (
                    <Form className="p-4 w-full shadow-xl rounded-xl" onKeyDown={handleKeyDown}>
                        <ProductFormCommon
                            companyList={companyList}
                            isEdit={false}
                            setCompanyData={setCompanyData}
                            setDomainWatcher={setDomainWatcher}
                            values={values}
                            segmentKeys={segmentKeys}
                        />
                        <FormContainer className="flex justify-end mt-5">
                            <Button type="reset" className="mr-2" onClick={() => resetForm()}>
                                Reset
                            </Button>
                            <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddProduct
