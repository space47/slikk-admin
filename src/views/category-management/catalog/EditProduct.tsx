/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import Product from '@/views/category-management/catalog/CommonType'
import { Checkbox, Select, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { PRODUCT_EDIT_COMMON, PRODUCT_EDIT_COMMON_DOWN } from './ProductCommon'
import ImageCommonProduct from './ImageCommonProduct'
import { handleimage, handleVideo } from './handlingProductImage'
import { InitialValues } from './EditCommonProduct'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

const EditProduct = () => {
    const navigate = useNavigate()
    const [productData, setProductData] = useState<any>()
    const [allImage, setAllImage] = useState<string[]>([])
    const [allVideo, setAllVideo] = useState<string[]>([])
    const [allColor, setAllColor] = useState<string[]>([])
    const [allSizeChart, setAllSizeChart] = useState<string[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyData, setCompanyData] = useState<number>()

    const { barcode } = useParams()

    const fetchUser = async () => {
        try {
            const response = await axioisInstance.get(`product/${barcode}`) //.........................................................

            const userData = response.data.data

            setProductData(userData)
            const colorList = userData.color_code_link ? userData.color_code_link.split(',') : []
            const imageList = userData.image.split(',')
            const videoList = userData.video_link ? userData.video_link.split(',') : []
            const sizeList = userData.size_chart_image ? userData.size_chart_image.split(',') : []

            console.log('object...........', imageList)

            setAllImage(imageList)
            setAllVideo(videoList)
            setAllColor(colorList)
            setAllSizeChart(sizeList)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault()

        const updatedImages = allImage.filter((_, i) => i !== index)
        setAllImage(updatedImages)
    }
    const handleRemoveVideo = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault()
        const updatedVideo = allVideo.filter((_, i) => i !== index)
        setAllVideo(updatedVideo)
    }
    const handleRemoveSizeChart = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault()
        const updatedChart = allSizeChart.filter((_, i) => i !== index)
        setAllSizeChart(updatedChart)
    }

    const handleRemoveColor = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault()
        const updatedColor = allColor.filter((_, i) => i !== index)
        setAllColor(updatedColor)
    }

    console.log('pack size', productData?.filter_tags?.packsize?.map((item: any) => item).join(','))

    const handleSubmit = async (values: Product) => {
        let img_url = allImage.join(','),
            video_url = allVideo.join(','),
            color_code_url = allColor.join(',')

        let size_chart_url = allSizeChart?.join(',')

        console.log('image upload start')
        const imageUpload = await handleimage(values.images)

        console.log('image uploaded')
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

        console.log('COLORCODEURL', color_code_url)

        const formData = {
            ...values,
            color_code_link: color_code_url,
            image: img_url,
            company: companyData,
            video_link: video_url,
            size_chart_image: size_chart_url,
        }
        console.log('dormDAta', formData)
        try {
            setShowSpinner(true)
            const response = await axioisInstance.patch(`product/${barcode}`, formData)
            console.log(response)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Product Edited Successfully',
            })
            navigate('/app/catalog/products')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Product not Updated ',
            })
        } finally {
            setShowSpinner(false)
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    const handleCopyProduct = () => {
        navigate(`/app/catalog/addCopy/${barcode}`)
    }

    return (
        <div>
            <div className="flex xl:justify-between flex-col gap-2 mb-7 ">
                <h3 className="mb-5 text-neutral-900">
                    EDIT PRODUCT <span className="font-light xl:text-md text-sm ">#{barcode}</span>
                </h3>
                <div>
                    <Button variant="accept" size="sm" onClick={handleCopyProduct}>
                        Copy Product
                    </Button>
                </div>
            </div>
            <Formik
                enableReinitialize
                initialValues={InitialValues(productData)}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="p-4 w-full shadow-xl rounded-xl" onKeyDown={handleKeyDown}>
                        <FormContainer>
                            <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                                {PRODUCT_EDIT_COMMON?.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                <ImageCommonProduct
                                    label="image"
                                    allName={allImage}
                                    handleRemove={handleRemoveImage}
                                    name="images"
                                    fieldname="images"
                                    fileLists={values.images}
                                    textName="image"
                                    placeholder="Enter Image Url"
                                />
                                <ImageCommonProduct
                                    label="Color Code Thumbnail"
                                    allName={allColor}
                                    handleRemove={handleRemoveColor}
                                    name="color_code"
                                    fieldname="color_code"
                                    fileLists={values.color_code}
                                    textName="color_code_link"
                                    placeholder="Enter color code Url"
                                />
                                <ImageCommonProduct
                                    isVideo
                                    label="Video"
                                    allName={allVideo}
                                    handleRemove={handleRemoveVideo}
                                    name="video"
                                    fieldname="video"
                                    fileLists={values.video}
                                    textName="video_link"
                                    placeholder="Enter Video Url"
                                />
                                <ImageCommonProduct
                                    label="Size Chart Image"
                                    allName={allSizeChart}
                                    handleRemove={handleRemoveSizeChart}
                                    name="size_chart_image_array"
                                    fieldname="size_chart_image_array"
                                    fileLists={values.size_chart_image_array}
                                    textName="size_chart_image"
                                    placeholder="Enter Size Chart Image"
                                />

                                {PRODUCT_EDIT_COMMON_DOWN?.slice(0, 5).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item.component}
                                        />
                                    </FormItem>
                                ))}
                                <Field name="company">
                                    {({ form }: FieldProps<any>) => {
                                        const selectedCompany = companyList.find((option) => option.id === form.values.company)

                                        return (
                                            <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                                <div className="font-semibold">Select Company</div>
                                                <Select
                                                    className="w-full"
                                                    options={companyList}
                                                    getOptionLabel={(option) => option.name}
                                                    getOptionValue={(option) => option.id}
                                                    value={selectedCompany || null}
                                                    onChange={(newVal) => {
                                                        form.setFieldValue('company', newVal?.id)
                                                        setCompanyData(newVal?.id)
                                                    }}
                                                />
                                            </div>
                                        )
                                    }}
                                </Field>
                                {PRODUCT_EDIT_COMMON_DOWN?.slice(5).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item.component}
                                        />
                                    </FormItem>
                                ))}
                            </div>

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                    Submit
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditProduct
