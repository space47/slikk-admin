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

const EditProduct = () => {
    const [datas, setDatas] = useState()
    const [imagview, setImageView] = useState<string>('')
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const navigate = useNavigate()
    const [productData, setProductData] = useState<any>()
    const [allImage, setAllImage] = useState<string[]>([])
    const [allVideo, setAllVideo] = useState<string[]>([])
    const [allColor, setAllColor] = useState<string[]>([])

    const { barcode } = useParams()

    const MAX_UPLOAD = 100

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]
        const MAX_FILE_SIZE = 5000000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a valid file format'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }
    const beforeVideoUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'video/mp4',
            'video/mov',
            'video/flv',
            'video/avi',
            'video/wmv',
            'video/webm',
            'video/avchd',
        ]
        const MAX_FILE_SIZE = 5000000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a valid file format'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }

    const fetchUser = async () => {
        try {
            const response = await axioisInstance.get(`product/${barcode}`) //.........................................................

            const userData = response.data.data
            console.log('DATASSS', userData)
            setProductData(userData)

            console.log('user Objeccct....', userData.image)

            const colorList = userData.color_code_link
                ? userData.color_code_link.split(',')
                : []
            const imageList = userData.image.split(',')
            const videoList = userData.video_link
                ? userData.video_link.split(',')
                : []

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
        size: productData?.filter_tags.size,
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
        sleevtype: productData?.sleevtype,
        trend: productData?.filter_tags?.trend?.map((item: any) => item),
        trendtype: productData?.filter_tags?.trendtype?.map(
            (item: any) => item,
        ),
        fit: productData?.filter_tags?.fit?.map((item: any) => item),
        fabric: productData?.filter_tags?.fabric?.map((item: any) => item),
    }

    useEffect(() => {
        console.log(
            'cccccsss',
            allImage,
            initialValue.images,
            initialValue.image,
        )
    }, [initialValue])

    const handleRemoveImage = (
        e: React.MouseEvent<HTMLButtonElement>,
        index: number,
    ) => {
        e.preventDefault()

        const updatedImages = allImage.filter((_, i) => i !== index)
        setAllImage(updatedImages)
    }
    const handleRemoveVideo = (
        e: React.MouseEvent<HTMLButtonElement>,
        index: number,
    ) => {
        e.preventDefault()
        const updatedVideo = allVideo.filter((_, i) => i !== index)
        setAllVideo(updatedVideo)
    }

    const handleRemoveColor = (
        e: React.MouseEvent<HTMLButtonElement>,
        index: number,
    ) => {
        e.preventDefault()
        const updatedColor = allColor.filter((_, i) => i !== index)
        setAllColor(updatedColor)
    }

    const handleimage = async (files: File[]) => {
        console.log('filessss', files)
        if (!files) {
            return
        }
        if (!files.length) {
            return
        }
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url
            setImageView(newData)
            console.log(newData)
            setShowImage(true)

            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    const handleVideo = async (files: File[]) => {
        if (!files) {
            return
        }
        if (!files.length) {
            return
        }
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url
            setDatas(newData)
            setShowData(true)

            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Video uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'Video Not uploaded',
            })
            return 'Error'
        }
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

        console.log('color code start')
        const colorlink = await handleimage(values.color_code)

        console.log('color uploaded')
        if (values.color_code && values.color_code.length && !colorlink) {
            return
        } else if (values.color_code && colorlink) {
            const temp = [color_code_url, colorlink]
            color_code_url = temp.filter((t) => t).join(',')
        }

        console.log('video start')
        const videoUpload = await handleVideo(values.video)
        console.log('video upload')
        if (values.video && values.video.length && !videoUpload) {
            return
        } else if (values.video && videoUpload) {
            const temp = [video_url, videoUpload]
            video_url = temp.filter((t) => t).join(',')
        }

        const formData = {
            ...values,

            color_code: color_code_url,
            image: img_url,
            video_link: video_url,
        }

        try {
            const response = await axioisInstance.patch(
                `product/${barcode}`,
                formData,
            )

            console.log(response)
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Product Edited Successfully',
            })
            navigate('/app/catalog/products')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'Product not Updated ',
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
                EDIT PRODUCT{' '}
                <span className="font-light text-md">#{barcode}</span>
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
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-scroll scrollbar-hide ">
                                    Image
                                    <FormContainer className=" mt-5 w-full ">
                                        {/* DIV */}

                                        <div className="overflow-x-scroll w-[350px] scrollbar-hide flex justify-center">
                                            <div className="image w-[80%] min-h-[100px] h-auto mt-5 flex gap-3 items-center">
                                                {allImage &&
                                                allImage.length > 0 ? (
                                                    allImage?.map(
                                                        (img, index) =>
                                                            img && (
                                                                <div
                                                                    key={index}
                                                                    className="flex flex-col gap-3"
                                                                >
                                                                    <img
                                                                        src={
                                                                            img
                                                                        }
                                                                        alt="img"
                                                                        className="w-[100px]"
                                                                    />

                                                                    <button
                                                                        className="bg-red-600 w-1/2 rounded-full text-white text-sm mb-5"
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            handleRemoveImage(
                                                                                e,
                                                                                index,
                                                                            )
                                                                        }
                                                                    >
                                                                        x
                                                                    </button>
                                                                </div>
                                                            ),
                                                    )
                                                ) : (
                                                    <p>No image</p>
                                                )}
                                            </div>
                                        </div>

                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="image">
                                                {({
                                                    form,
                                                }: FieldProps<Product>) => (
                                                    <>
                                                        <Upload
                                                            multiple
                                                            className="flex justify-center"
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.images
                                                            }
                                                            onChange={(files) =>
                                                                form.setFieldValue(
                                                                    'images',
                                                                    files,
                                                                )
                                                            }
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'images',
                                                                    files,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>

                                        <br />
                                        <br />
                                    </FormContainer>
                                    <FormItem
                                        label=""
                                        invalid={errors.image && touched.image}
                                        errorMessage={errors.image}
                                        className="col-span-1 w-[80%]"
                                    >
                                        <Field
                                            type="text"
                                            name="image"
                                            placeholder="Enter ImageUrl or Upload Image file"
                                            component={Input}
                                        />
                                    </FormItem>
                                </FormContainer>

                                {/* .............................................................. */}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-scroll scrollbar-hide">
                                    Color Code Thumbnail
                                    <FormContainer className=" mt-5 ">
                                        <div className=" overflow-x-scroll w-[350px] scrollbar-hide flex justify-center">
                                            <div className=" image w-[20%] h-[20%] mt-5 flex gap-3 items-center  ">
                                                {allColor &&
                                                allColor.length > 0 ? (
                                                    allColor?.map(
                                                        (img, index) =>
                                                            img ? (
                                                                <div
                                                                    key={index}
                                                                    className="flex flex-col gap-3"
                                                                >
                                                                    <img
                                                                        src={
                                                                            img
                                                                        }
                                                                        alt="img"
                                                                        className="rounded-xl"
                                                                    />

                                                                    <button
                                                                        className="bg-red-600 w-1/2 rounded-full text-white  text-sm mb-5"
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            handleRemoveColor(
                                                                                e,
                                                                                index,
                                                                            )
                                                                        }
                                                                    >
                                                                        x
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                ''
                                                            ),
                                                    )
                                                ) : (
                                                    <p>No image</p>
                                                )}
                                            </div>
                                        </div>
                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="color_code">
                                                {({
                                                    form,
                                                }: FieldProps<Product>) => (
                                                    <>
                                                        <Upload
                                                            multiple
                                                            className="flex justify-center"
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.color_code
                                                            }
                                                            onChange={(files) =>
                                                                form.setFieldValue(
                                                                    'color_code',
                                                                    files,
                                                                )
                                                            }
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'color_code',
                                                                    files,
                                                                )
                                                            }
                                                            // uploadButtonText="Add Files"
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>

                                        <br />
                                        <br />
                                    </FormContainer>
                                    <FormItem
                                        label=""
                                        className="col-span-1 w-[80%]"
                                    >
                                        <Field
                                            type="text"
                                            name="color_code_link"
                                            placeholder="Enter Color Url or Upload Color file"
                                            component={Input}
                                        />
                                    </FormItem>
                                </FormContainer>

                                {/* .......................video........................................ */}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                    Video
                                    <FormContainer className=" mt-5 ">
                                        <div className=" overflow-x-scroll w-[350px] ">
                                            <div className=" image w-[10%] h-[20%] mt-5 flex gap-3 items-center  ">
                                                {allVideo &&
                                                allVideo.length > 0 ? (
                                                    allVideo?.map(
                                                        (img, index) =>
                                                            img ? (
                                                                <img
                                                                    key={index}
                                                                    src={img}
                                                                    alt="img"
                                                                    className="rounded-xl"
                                                                />
                                                            ) : (
                                                                ''
                                                            ),
                                                    )
                                                ) : (
                                                    <p>No image</p>
                                                )}
                                            </div>
                                        </div>
                                        <FormItem
                                            label=""
                                            invalid={Boolean(
                                                errors.video && touched.video,
                                            )}
                                            errorMessage={
                                                errors.video as string
                                            }
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="video_link">
                                                {({
                                                    form,
                                                }: FieldProps<Product>) => (
                                                    <>
                                                        <Upload
                                                            multiple
                                                            beforeUpload={
                                                                beforeVideoUpload
                                                            }
                                                            fileList={
                                                                values.video
                                                            }
                                                            onChange={(files) =>
                                                                form.setFieldValue(
                                                                    'Video',
                                                                    files,
                                                                )
                                                            }
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'images',
                                                                    files,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>

                                        <br />
                                        <br />
                                    </FormContainer>
                                    <FormItem
                                        label=""
                                        invalid={
                                            errors.video_link &&
                                            touched.video_link
                                        }
                                        errorMessage={errors.video_link}
                                        className="col-span-1 w-[80%]"
                                    >
                                        <Field
                                            type="text"
                                            name="video_link"
                                            placeholder="Enter VideoUrl or Upload Video file"
                                            component={Input}
                                        />
                                    </FormItem>
                                </FormContainer>
                                {PRODUCT_EDIT_COMMON_DOWN?.map((item, key) => (
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.classname}
                                    >
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
                                <Button
                                    type="reset"
                                    className="mr-2"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    className="bg-blue-500 text-white"
                                >
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
