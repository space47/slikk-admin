/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import Upload from '@/components/ui/Upload'
import Product from '@/views/category-management/catalog/CommonType'
import { Checkbox } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { IoMdCloseCircle } from 'react-icons/io'
import { PRODUCT_EDIT_COMMON, PRODUCT_EDIT_COMMON_DOWN } from './ProductCommon'
import { MdCancel } from 'react-icons/md'
import ImageCommonProduct from './ImageCommonProduct'
import { handleimage, handleVideo } from './handlingProductImage'

const EditProduct = () => {
    const navigate = useNavigate()
    const [productData, setProductData] = useState<any>()
    const [allImage, setAllImage] = useState<string[]>([])
    const [allVideo, setAllVideo] = useState<string[]>([])
    const [allColor, setAllColor] = useState<string[]>([])

    const { barcode } = useParams()

    const fetchUser = async () => {
        try {
            const response = await axioisInstance.get(`product/${barcode}`) //.........................................................

            const userData = response.data.data
            console.log('DATASSS', userData)
            setProductData(userData)

            console.log('user Objeccct....', userData.image)

            const colorList = userData.color_code_link ? userData.color_code_link.split(',') : []
            const imageList = userData.image.split(',')
            const videoList = userData.video_link ? userData.video_link.split(',') : []

            console.log('object...........', imageList)

            setAllImage(imageList)
            setAllVideo(videoList)
            setAllColor(colorList)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const initialValue = {
        company: productData?.company,
        brand_name: productData?.brand,
        name: productData?.name,
        description: productData?.description,
        about: productData?.about,
        benefits: productData?.benefits,
        includes: productData?.includes,
        other_product_info: productData?.other_product_info,
        variant_type: productData?.variant_type,
        variant_id: productData?.variant_id,
        tax_rate: productData?.tax_rate,
        mrp: productData?.mrp,
        sp: productData?.sp,
        barcode: productData?.barcode,
        hsn: productData?.hsn,
        sku: productData?.sku,
        usage: productData?.usage,
        imported_by: productData?.imported_by,
        shelf_life: productData?.shelf_life,
        height: productData?.height,
        width: productData?.width,
        depth: productData?.depth,
        video_link: productData?.video_link,
        video: productData?.video,
        minimum_quantity: productData?.minimum_quantity || 1,
        reserve_quantity: productData?.reserve_quantity || 1,
        Status: productData?.status || 'Available', //
        image: productData?.image,
        images: [],
        color_code: productData?.color_code,
        category_name: productData?.category,
        is_premium: productData?.is_premium || false,
        is_try_and_buy: productData?.is_try_and_buy || false,
        is_returnable: productData?.is_returnable || false,
        sub_category_name: productData?.sub_category,
        product_type_name: productData?.product_type,
        division_name: productData?.division,
        color: productData?.color,
        colorshade: productData?.colorshade,
        skinType: productData?.skintype,
        formulation: productData?.formulation,
        hairType: productData?.hairtype,
        gender: productData?.gender,
        finish: productData?.finish,
        skintone: productData?.skintone,
        coverage: productData?.coverage,
        sunprotection: productData?.sunprotection,
        concious: productData?.concious,
        productHexCode: productData?.productHexCode,
        packsize: productData?.size,
        size: productData?.filter_tags?.size?.join('/'),
        ingrediants: productData?.ingredients,
        vegnonveg: productData?.vegnonveg,
        ingrediantsPreferences: productData?.ingrediantsPreferences,
        concern: productData?.concerns,
        recommendationfor: productData?.recommendationfor,
        scenttopnotes: productData?.scenttopnotes,
        scentheartnotes: productData?.scentheartnotes,
        scentbasenotes: productData?.scentbasenotes,
        color_code_link: productData?.color_code_link,
        origincountry: productData?.origincountry || 'India',
        careinstruction: productData?.careinstructions,
        antiodour: productData?.antiodour,
        pattern: productData?.pattern,
        closuretype: productData?.closuretype,
        length: productData?.length,
        necktype: productData?.necktype,
        risetype: productData?.risetype,
        colorfamily: productData?.filter_tags.colorfamily?.map((item) => item).join(','),

        sleevtype: productData?.sleevtype,
        trend: productData?.filter_tags?.trend?.join('/'),
        trendtype: productData?.filter_tags?.trendtype?.join('/'),
        fit: productData?.filter_tags?.fit?.join('/'),
        fabric: productData?.filter_tags?.fabric?.join('/'),
    }

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

    const handleRemoveColor = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault()
        const updatedColor = allColor.filter((_, i) => i !== index)
        setAllColor(updatedColor)
    }

    const handleSubmit = async (values: Product) => {
        let img_url = allImage.join(','),
            video_url = allVideo.join(','),
            color_code_url = allColor.join(',')
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

        console.log('COLORCODEURL', color_code_url)

        const formData = {
            ...values,

            color_code_link: color_code_url,
            image: img_url,
            video_link: video_url,
        }

        console.log('FORMDATA', formData)

        try {
            const response = await axioisInstance.patch(`product/${barcode}`, formData)

            console.log(response)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Product Edited Successfully',
            })
            // navigate('/app/catalog/products')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Product not Updated ',
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
            <h3 className="mb-5 text-neutral-900">
                EDIT PRODUCT <span className="font-light text-md">#{barcode}</span>
            </h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3" onKeyDown={handleKeyDown}>
                        <FormContainer>
                            <div className="grid grid-cols-2 gap-4">
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

                                {PRODUCT_EDIT_COMMON_DOWN?.map((item, key) => (
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
