/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner, Tabs } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { handleimage, handleVideo } from './handlingProductImage'
import { InitialValues } from './EditCommonProduct'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { textParser } from '@/common/textParser'
import ProductFormCommon from './productutils/ProductForm'
import { AxiosError } from 'axios'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'

const EditProduct = () => {
    const navigate = useNavigate()
    const { barcode } = useParams()
    const [allImage, setAllImage] = useState<string[]>([])
    const [allVideo, setAllVideo] = useState<string[]>([])
    const [allColor, setAllColor] = useState<string[]>([])
    const [allSizeChart, setAllSizeChart] = useState<string[]>([])
    const [allFrame, setAllFrame] = useState<string[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyData, setCompanyData] = useState<number>()
    const [domainWatcher, setDomainWatcher] = useState<string | string[] | undefined>('')
    const [segmentKeys, setSegmentKeys] = useState<string[] | undefined>([])
    const [segmentOptions, setSegmentOptions] = useState<string[] | undefined>([])
    const [activeTab, setActiveTab] = useState('edit')
    const { data: productData, loading } = useFetchSingleData<any>({ url: `product/${barcode}` })

    useEffect(() => {
        if (productData) {
            setAllImage(productData?.image.split(','))
            setAllVideo(productData?.video_link ? productData?.video_link.split(',') : [])
            setAllColor(productData?.color_code_link ? productData?.color_code_link.split(',') : [])
            setAllSizeChart(productData?.size_chart_image ? productData?.size_chart_image.split(',') : [])
            setAllFrame(productData?.framed_image_url ? productData?.framed_image_url.split(',') : [])
        }
    }, [productData])

    useEffect(() => {
        if (productData && companyList.length > 0) {
            const selectedCompany = companyList.find((c) => c.id === productData.company)
            setSegmentOptions(selectedCompany?.segment?.split(','))
            setDomainWatcher(selectedCompany?.segment?.split(','))
            setCompanyData(selectedCompany?.id)
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
        let frame_image = allFrame?.join(',')
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
        const frame = await handleimage(values.frame_image_array)
        if (values.frame_image_array && values.frame_image_array.length && !frame) {
            return
        } else if (values.frame_image_array && frame) {
            const temp = [frame_image, frame]
            frame_image = temp.filter((t) => t).join(',')
        }

        const { color_code, size_chart_image_array, frame_image_array, images, filter_tags, ...rest } = values
        console.log(color_code, size_chart_image_array, images, filter_tags, frame_image_array)
        const formData = Object.fromEntries(
            Object.entries({
                ...rest,
                color_code_link: color_code_url,
                image: img_url,
                company: companyData,
                video_link: video_url,
                description: textParser(values?.description.description || ''),
                about: textParser(values?.description.about || ''),
                use_cases: textParser(values?.description.use_cases || ''),
                includes: textParser(values?.description.includes || ''),
                other_info: textParser(values?.description.other_info || ''),
                size_chart_image: size_chart_url,
                framed_image_url: frame_image,
            }).filter(([, value]) => value !== null && value !== undefined),
        )
        try {
            setShowSpinner(true)
            const response =
                activeTab === 'add'
                    ? await axioisInstance.post(`product/add`, formData)
                    : await axioisInstance.patch(`product/${barcode}`, formData)
            notification.success({ message: response?.data?.message || `Product ${activeTab === 'add' ? 'Added' : 'Edited'} Successfully` })
            navigate(-1)
        } catch (error: any) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || `Failed to ${activeTab === 'add' ? 'Add' : 'Edit'}` })
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
            <Tabs defaultValue={'edit'} onChange={(val) => setActiveTab(val)} className="mb-5">
                <TabList>
                    <TabNav value="edit" className={`text-xl ${activeTab === 'edit' ? ' border-b-2 border-green-500' : ''} gap-2`}>
                        <span className="text-xl font-bold">Edit Product</span> (
                        <span className="font-light xl:text-md text-sm ">#{barcode}</span>)
                    </TabNav>
                    <TabNav value="add" className={`text-xl ${activeTab === 'add' ? ' border-b-2 border-green-500' : ''} `}>
                        <span className="text-xl font-bold">Create New Product</span>
                    </TabNav>
                </TabList>
            </Tabs>
            {loading && (
                <div className="flex items-center justify-center">
                    <Spinner size={30} />
                </div>
            )}
            <Formik enableReinitialize initialValues={InitialValues(productData, segmentOptions)} onSubmit={handleSubmit}>
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
                            allFrameImage={allFrame}
                            setAllFrameImage={setAllFrame}
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
