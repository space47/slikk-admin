/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { handleimage, handleVideo } from './handlingProductImage'
import { InitialValues } from './EditCommonProduct'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { textParser } from '@/common/textParser'
import ProductFormCommon from './productutils/ProductForm'
import { AxiosError } from 'axios'

const EditProduct = () => {
    const navigate = useNavigate()
    const { barcode } = useParams()
    const [productData, setProductData] = useState<any>()
    const [allImage, setAllImage] = useState<string[]>([])
    const [allVideo, setAllVideo] = useState<string[]>([])
    const [allColor, setAllColor] = useState<string[]>([])
    const [allSizeChart, setAllSizeChart] = useState<string[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyData, setCompanyData] = useState<number>()
    const [domainWatcher, setDomainWatcher] = useState<string | string[] | undefined>('')
    const [segmentKeys, setSegmentKeys] = useState<string[] | undefined>([])
    const [segmentOptions, setSegmentOptions] = useState<string[] | undefined>([])

    const fetchUser = async () => {
        try {
            const response = await axioisInstance.get(`product/${barcode}`)
            const userData = response.data.data
            setProductData(userData)
            const colorList = userData.color_code_link ? userData.color_code_link.split(',') : []
            const imageList = userData.image.split(',')
            const videoList = userData.video_link ? userData.video_link.split(',') : []
            const sizeList = userData.size_chart_image ? userData.size_chart_image.split(',') : []
            setAllImage(imageList)
            setAllVideo(videoList)
            setAllColor(colorList)
            setAllSizeChart(sizeList)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (productData && companyList.length > 0) {
            const selectedCompany = companyList.find((c) => c.id === productData.company)
            setSegmentOptions(selectedCompany?.segment?.split(','))
            setDomainWatcher(selectedCompany?.segment?.split(','))
        }
    }, [productData, companyList])

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
        fetchUser()
    }, [])

    useEffect(() => {
        fetchSegmentByDomain()
    }, [domainWatcher, barcode])

    const handleRemove = (
        e: React.MouseEvent<HTMLButtonElement>,
        index: number,
        type: 'images' | 'color_code' | 'video' | 'size_chart_image_array',
    ) => {
        e.preventDefault()
        const setterMap = {
            images: setAllImage,
            color_code: setAllColor,
            video: setAllVideo,
            size_chart_image_array: setAllSizeChart,
        }
        const currentState = {
            images: allImage,
            color_code: allColor,
            video: allVideo,
            size_chart_image_array: allSizeChart,
        }
        const updatedList = currentState[type].filter((_, i) => i !== index)
        setterMap[type](updatedList)
    }

    const handleSubmit = async (values: any) => {
        let img_url = allImage.join(','),
            video_url = allVideo.join(','),
            color_code_url = allColor.join(',')

        let size_chart_url = allSizeChart?.join(',')
        const imageUpload = await handleimage(values.images)
        if (values.images && values.images.length && !imageUpload) {
            console.log('image Upload return', values.images)
            return
        } else if (values.images && imageUpload) {
            const temp = [img_url, imageUpload]
            img_url = temp.filter((t) => t).join(',')
        }
        const colorlink = await handleimage(values.color_code)
        if (values.color_code && values.color_code.length && !colorlink) {
            return
        } else if (values.color_code && colorlink) {
            const temp = [color_code_url, colorlink]
            color_code_url = temp.filter((t) => t).join(',')
        }
        const videoUpload = await handleVideo(values.video)
        if (values.video && values.video.length && !videoUpload) {
            return
        } else if (values.video && videoUpload) {
            const temp = [video_url, videoUpload]
            video_url = temp.filter((t) => t).join(',')
        }
        const sizeLink = await handleimage(values.size_chart_image_array)
        if (values.size_chart_image_array && values.size_chart_image_array.length && !sizeLink) {
            return
        } else if (values.size_chart_image_array && sizeLink) {
            const temp = [size_chart_url, sizeLink]
            size_chart_url = temp.filter((t) => t).join(',')
        }
        const { color_code, size_chart_image_array, images, ...rest } = values
        console.log(color_code, size_chart_image_array, images)
        const formData = Object.fromEntries(
            Object.entries({
                ...rest,
                color_code_link: color_code_url,
                image: img_url,
                company: companyData,
                video_link: video_url,
                description: {
                    ...values?.description,
                    description: textParser(values?.description?.description),
                },
                size_chart_image: size_chart_url,
            }).filter(([, value]) => value !== '' && value !== null && value !== undefined),
        )

        console.log('formdata us', formData)
        try {
            setShowSpinner(true)
            const response = await axioisInstance.patch(`product/${barcode}`, formData)
            console.log(response)
            notification.success({ message: response?.data?.message || 'Product Edited Successfully' })
            navigate(-1)
        } catch (error: any) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message || 'Product not Updated ' })
            }
        } finally {
            setShowSpinner(false)
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <div>
            <div className="flex xl:justify-between flex-col gap-2 mb-7 ">
                <h3 className="mb-5 text-neutral-900">
                    EDIT PRODUCT <span className="font-light xl:text-md text-sm ">#{barcode}</span>
                </h3>
                <div>
                    <Button variant="accept" size="sm" onClick={() => navigate(`/app/catalog/addCopy/${barcode}`)}>
                        Copy Product
                    </Button>
                </div>
            </div>
            <Formik
                enableReinitialize
                initialValues={InitialValues(productData, segmentOptions)}
                // validationSchema={validationSchema}

                onSubmit={handleSubmit}
            >
                {({ values, resetForm }) => (
                    <Form className="p-4 w-full shadow-xl rounded-xl" onKeyDown={handleKeyDown}>
                        <ProductFormCommon
                            companyList={companyList}
                            isEdit={true}
                            setCompanyData={setCompanyData}
                            setDomainWatcher={setDomainWatcher}
                            values={values}
                            segmentKeys={segmentKeys}
                            handleRemove={handleRemove}
                            allColor={allColor}
                            allImage={allImage}
                            allSizeChart={allSizeChart}
                            allVideo={allVideo}
                            setAllColor={setAllColor}
                            setAllImage={setAllImage}
                            setAllSizeChart={setAllSizeChart}
                            setAllVideo={setAllVideo}
                            initialValues={InitialValues(productData, segmentOptions)}
                        />
                        <FormContainer className="flex justify-end mt-5">
                            <Button type="reset" className="mr-2" onClick={() => resetForm()}>
                                Reset
                            </Button>
                            <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                <span className="flex gap-2 items-center">
                                    Submit <span>{showSpinner && <Spinner size={20} color="#ffffff" />}</span>{' '}
                                </span>
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditProduct
