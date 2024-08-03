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

const EditProduct = () => {
    const [datas, setDatas] = useState()
    const [imagview, setImageView] = useState<string>('')
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const navigate = useNavigate()

    const [initialValue, setInitialValue] = useState<Product>({
        company: 1,
        brand_name: '',
        name: '',
        description: '',
        about: '',
        benefits: '',
        includes: '',
        other_product_info: '',
        variant_type: '',
        variant_id: '',
        tax_rate: 0,
        mrp: 0,
        sp: 0,
        barcode: '',
        hsn: '',
        sku: '',
        usage: '',
        imported_by: '',
        shelf_life: 0,
        height: 0,
        width: 0,
        depth: 0,
        video_link: '',
        video: [],
        minimum_quantity: 1,
        reserve_quantity: 1,
        Status: 'Available',
        image: '',
        images: [],
        color_code: [],
        category_name: '',
        is_premium: false,
        is_try_and_buy: false,
        is_returnable: false,
        sub_category_name: '',
        product_type_name: '',
        division_name: '',
        color: '', //
        colorshade: '',
        skinType: '',
        formulation: '',
        hairType: '',
        gender: 'Women',
        finish: '',
        skintone: '',
        coverage: '',
        sunprotection: '',

        concious: '',
        productHexCode: '',
        packsize: '',
        size: '',
        ingrediants: '',
        vegnonveg: '',
        ingrediantsPreferences: '',
        concern: '',
        recommendationfor: '',
        scenttopnotes: '',
        scentheartnotes: '',
        scentbasenotes: '',
        color_code_link: '',
        origincountry: 'India',
        careinstruction: '',
        antiodour: '',
        pattern: '',
        closuretype: '',
        length: '',
        necktype: '',
        risetype: '',
        sleevtype: '',
        trend: '',
        trendtype: '',
        fit: '',
        fabric: '',
    })

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
            setInitialValue({
                company: 1,
                brand_name: userData.brand,
                name: userData.name,
                description: userData.description,
                about: userData.about,
                benefits: userData.benefits,
                includes: userData.includes,
                other_product_info: userData.other_product_info,
                variant_type: userData.variant_type,
                variant_id: userData.variant_id,
                tax_rate: userData.tax_rate,
                mrp: userData.mrp,
                sp: userData.sp,
                barcode: userData.barcode,
                hsn: userData.hsn,
                sku: userData.sku,
                usage: userData.usage,
                imported_by: userData.imported_by,
                shelf_life: userData.shelf_life,
                height: userData.height,
                width: userData.width,
                depth: userData.depth,
                video_link: userData.video_link,
                video: userData.video,
                minimum_quantity: userData.minimum_quantity || 1,
                reserve_quantity: userData.reserve_quantity || 1,
                Status: userData.status || 'Available', //
                image: userData.image,
                images: [],
                color_code: userData.color_code,
                category_name: userData.filter_to_display_map.category,
                is_premium: userData.is_premium || false,
                is_try_and_buy: userData.is_try_and_buy || false,
                is_returnable: userData.is_returnable || false,
                sub_category_name: userData.filter_to_display_map.subcategory,
                product_type_name: userData.filter_to_display_map.producttype,
                division_name: userData.filter_to_display_map.division,
                color: userData.color,
                colorshade: userData.filter_to_display_map.colorshade,
                skinType: userData.filter_to_display_map.skintype,
                formulation: userData.filter_to_display_map.formulation,
                hairType: userData.hairtype,
                gender: userData.filter_tags.gender || 'Women',
                finish: userData.filter_to_display_map.finish,
                skintone: userData.skintone,
                coverage: userData.filter_to_display_map.coverage,
                sunprotection: userData.filter_to_display_map.sunprotection,
                concious: userData.concious,
                productHexCode: userData.productHexCode,
                packsize: userData.filter_to_display_map.size,
                size: userData.filter_tags.size,
                ingrediants: userData.filter_to_display_map.ingredients,
                vegnonveg: userData.filter_to_display_map.vegnonveg,
                ingrediantsPreferences:
                    userData.filter_to_display_map.ingrediantsPreferences,
                concern: userData.filter_to_display_map.concerns,
                recommendationfor:
                    userData.filter_to_display_map.recommendationfor,
                scenttopnotes: userData.filter_to_display_map.scenttopnotes,
                scentheartnotes: userData.filter_to_display_map.scentheartnotes,
                scentbasenotes: userData.filter_to_display_map.scentbasenotes,
                color_code_link: userData.color_code_link,
                origincountry: userData.filter_tags.origincountry || 'India',
                careinstruction:
                    userData.filter_to_display_map.careinstructions,
                antiodour: userData.filter_to_display_map.antiodour,
                pattern: userData.filter_to_display_map.pattern,
                closuretype: userData.filter_to_display_map.closuretype,
                length: userData.filter_to_display_map.length,
                necktype: userData.filter_to_display_map.necktype,
                risetype: userData.filter_to_display_map.risetype,
                sleevtype: userData.filter_to_display_map.sleevtype,
                trend: userData.filter_tags.trend,
                trendtype: userData.filter_to_display_map.trendtype,
                fit: userData.filter_to_display_map.fit,
                fabric: userData.filter_to_display_map.fabric,
            })

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

    // useEffect(() => {
    //     console.log('ccccc', initialValue.images, initialValue.image)
    //     setInitialValue({
    //         ...initialValue,
    //         image: allImage?.join(','),
    //     })
    // }, [allImage])

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
            e.preventDefault() // Prevent form submission on Enter key
        }
    }

    return (
        <div>
            <h3 className="mb-5 text-neutral-900">ADD NEW PRODUCT</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form
                        className="w-full"
                        onKeyDown={handleKeyDown}
                        onChange={() => console.log(values)}
                    >
                        <FormContainer>
                            <div className="grid grid-cols-2 gap-4">
                                <FormItem label="Barcode">
                                    <Field
                                        type="text"
                                        name="barcode"
                                        placeholder="Enter Barcode"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="SKU">
                                    <Field
                                        type="text"
                                        name="sku"
                                        placeholder="Enter SKU"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Brand Name">
                                    <Field
                                        type="text"
                                        name="brand_name"
                                        placeholder="Enter Brand Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Name">
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Enter Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Description">
                                    <Field
                                        type="text"
                                        name="description"
                                        placeholder="Enter Description"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="About">
                                    <Field
                                        type="text"
                                        name="about"
                                        placeholder="Enter About"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Benefits">
                                    <Field
                                        type="text"
                                        name="benefits"
                                        placeholder="Enter Benefits"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Includes">
                                    <Field
                                        type="text"
                                        name="includes"
                                        placeholder="Enter Includes"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label=" Other Product Info">
                                    <Field
                                        type="text"
                                        name="other_product_info"
                                        placeholder="Enter Other Product Info"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label=" Variant Type">
                                    <Field
                                        type="text"
                                        name="variant_type"
                                        placeholder="Enter Variant Type"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label=" Style Code">
                                    <Field
                                        type="text"
                                        name="variant_id"
                                        placeholder="Enter Variant ID"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Tax Rate">
                                    <Field
                                        type="number"
                                        name="tax_rate"
                                        placeholder="Enter Tax Rate"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="MRP">
                                    <Field
                                        type="text"
                                        name="mrp"
                                        placeholder="Enter MRP"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="SP">
                                    <Field
                                        type="text"
                                        name="sp"
                                        placeholder="Enter SP"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="HSN">
                                    <Field
                                        type="text"
                                        name="hsn"
                                        placeholder="Enter HSN"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Usage">
                                    <Field
                                        type="text"
                                        name="usage"
                                        placeholder="Enter Usage"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Imported By/Manufactured By">
                                    <Field
                                        type="text"
                                        name="imported_by"
                                        placeholder="Enter Imported By"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label=" Shelf Life">
                                    <Field
                                        type="number"
                                        name="shelf_life"
                                        placeholder="Enter Shelf Life"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Status">
                                    <Field
                                        type="text"
                                        name="status"
                                        placeholder="Enter Status"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl">
                                    Image
                                    <FormContainer className=" mt-5  flex flex-col justify-normal items-center gap-4">
                                        <div className="flex flex-row overflow-x-scroll w-[96%] gap-2">
                                            {allImage.map((item, key) => (
                                                <div
                                                    key={key}
                                                    className="flex flex-col items-center min-w-fit"
                                                >
                                                    <img
                                                        src={item}
                                                        alt={`Image ${key}`}
                                                        className="w-[150px] h-[100px] flex object-contain "
                                                    />
                                                    <button
                                                        className="text-red-500 text-xl "
                                                        onClick={(e) =>
                                                            handleRemoveImage(
                                                                e,
                                                                key,
                                                            )
                                                        }
                                                    >
                                                        <IoMdCloseCircle className="text-red-500" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <FormItem
                                            label=""
                                            invalid={Boolean(
                                                errors.images && touched.images,
                                            )}
                                            errorMessage={
                                                errors.images as string
                                            }
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="images">
                                                {({
                                                    form,
                                                }: FieldProps<Product>) => (
                                                    <>
                                                        <Upload
                                                            multiple
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
                                    {/* <FormItem
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
                                    </FormItem> */}
                                </FormContainer>

                                {/* .............................................................. */}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                    Color Code Thumbnail
                                    <FormContainer className=" mt-5  flex flex-col justify-normal items-center gap-4 ">
                                        <div className="flex flex-row  w-[96%] gap-2">
                                            {allColor.map((item, key) => (
                                                <div
                                                    key={key}
                                                    className="flex flex-col items-center"
                                                >
                                                    <img
                                                        src={item}
                                                        alt={`Image ${key}`}
                                                        className="w-[150px] h-[150px] flex object-contain "
                                                    />
                                                    <button
                                                        className="text-red-500 text-xl "
                                                        onClick={(e) =>
                                                            handleRemoveColor(
                                                                e,
                                                                key,
                                                            )
                                                        }
                                                    >
                                                        <IoMdCloseCircle className="text-red-500" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <FormItem
                                            label=""
                                            invalid={Boolean(
                                                errors.color_code &&
                                                    touched.color_code,
                                            )}
                                            errorMessage={
                                                errors.color_code as string
                                            }
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="color_code_link">
                                                {({
                                                    form,
                                                }: FieldProps<Product>) => (
                                                    <>
                                                        <Upload
                                                            multiple
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.color_code
                                                            }
                                                            onChange={(files) =>
                                                                form.setFieldValue(
                                                                    'image',
                                                                    files,
                                                                )
                                                            }
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'image',
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

                                {/* .......................video........................................ */}

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                    Video
                                    <FormContainer className=" mt-5  flex flex-col justify-normal items-center gap-4 ">
                                        <div className="flex flex-row">
                                            {allVideo.map((item, key) => (
                                                <div
                                                    key={key}
                                                    className="flex flex-col items-center"
                                                >
                                                    <video
                                                        src={item}
                                                        controls
                                                        className="w-[100px] h-[150px] object-cover"
                                                    />
                                                    <button
                                                        onClick={(e) =>
                                                            handleRemoveVideo(
                                                                e,
                                                                key,
                                                            )
                                                        }
                                                        className="text-red-500 font-bold"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
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
                                            <Field name="video">
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
                                                                    'video',
                                                                    files,
                                                                )
                                                            }
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'video',
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
                                <FormItem label="Category Name">
                                    <Field
                                        type="text"
                                        name="category_name"
                                        placeholder="Enter Category Name"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* .............................................. */}

                                {/*  */}
                                <FormItem label=" Sub Category Name">
                                    <Field
                                        type="text"
                                        name="sub_category_name"
                                        placeholder="Enter Sub Category Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Product Type Name">
                                    <Field
                                        type="text"
                                        name="product_type_name"
                                        placeholder="Enter Product Type Name"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* ....................................................................... */}

                                {/* ................................................................................ */}
                                <FormItem label=" Division Name">
                                    <Field
                                        type="text"
                                        name="division_name"
                                        placeholder="Enter Division Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Colour Shade Name">
                                    <Field
                                        type="text"
                                        name="colorshade"
                                        placeholder="Enter Colour Shade Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Skin Type">
                                    <Field
                                        type="text"
                                        name="skinType"
                                        placeholder="Enter Skin Type"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Formulation">
                                    <Field
                                        type="text"
                                        name="formulation"
                                        placeholder="Enter Formulation"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Hair Type">
                                    <Field
                                        type="text"
                                        name="hairType"
                                        placeholder="Enter Hair Type"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Gender">
                                    <Field
                                        type="text"
                                        name="gender"
                                        placeholder="Enter Gender"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Finish">
                                    <Field
                                        type="text"
                                        name="finish"
                                        placeholder="Enter Finish"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Skin Tone">
                                    <Field
                                        type="text"
                                        name="skintone"
                                        placeholder="Enter Skin Tone"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Coverage">
                                    <Field
                                        type="text"
                                        name="coverage"
                                        placeholder="Enter Coverage"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Sun Protection">
                                    <Field
                                        type="text"
                                        name="sunprotection"
                                        placeholder="Enter Sun Protection"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Conscious">
                                    <Field
                                        type="text"
                                        name="concious"
                                        placeholder="Enter Conscious"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label=" Product Hex Code">
                                    <Field
                                        type="text"
                                        name="productHexCode"
                                        placeholder="Enter Product Hex Code"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Pack Size">
                                    <Field
                                        type="text"
                                        name="packsize"
                                        placeholder="Enter Pack Size"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Product Size">
                                    <Field
                                        type="text"
                                        name="size"
                                        placeholder="Enter Product Size"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Ingredients">
                                    <Field
                                        type="text"
                                        name="ingrediants"
                                        placeholder="Enter Ingredients"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label=" Veg/Non-Veg">
                                    <Field
                                        type="text"
                                        name="vegnonveg"
                                        placeholder="Enter Veg/Non-Veg"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Ingredients Preferences">
                                    <Field
                                        type="text"
                                        name="ingrediantsPreferences"
                                        placeholder="Enter Ingredients Preferences"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Concern">
                                    <Field
                                        type="text"
                                        name="concern"
                                        placeholder="Enter Concern"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Recommendation For">
                                    <Field
                                        type="text"
                                        name="recommendationfor"
                                        placeholder="Enter Recommendation For"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Scent Top Notes">
                                    <Field
                                        type="text"
                                        name="scenttopnotes"
                                        placeholder="Enter Scent Top Notes"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="SCENT HEART NOTRS">
                                    <Field
                                        type="text"
                                        name="scentheartnotes"
                                        placeholder="Enter Scent Heart Notes"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Scent Base Notes">
                                    <Field
                                        type="text"
                                        name="scentbasenotes"
                                        placeholder="Enter Scent Base Notes"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Origin Country">
                                    <Field
                                        type="text"
                                        name="origincountry"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                {/* ........................... */}
                                <FormItem label="Care Instruction">
                                    <Field
                                        type="text"
                                        name="careinstruction"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Antiodour ">
                                    <Field
                                        type="text"
                                        name="antiodour"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Pattern">
                                    <Field
                                        type="text"
                                        name="pattern"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Closure Type">
                                    <Field
                                        type="text"
                                        name="closuretype"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Length">
                                    <Field
                                        type="text"
                                        name="length"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Neck Type">
                                    <Field
                                        type="text"
                                        name="necktype"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Risk Type">
                                    <Field
                                        type="text"
                                        name="risetype"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Sleeve Type">
                                    <Field
                                        type="text"
                                        name="sleevtype"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Trend">
                                    <Field
                                        type="text"
                                        name="trend"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Trend Type">
                                    <Field
                                        type="text"
                                        name="trendtype"
                                        placeholder="Enter Origin Country"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Fit">
                                    <Field
                                        type="text"
                                        name="fit"
                                        placeholder="Enter Fit"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Fabric">
                                    <Field
                                        type="text"
                                        name="fabric"
                                        placeholder="Enter Fabric"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* CheckBoxes............................................. */}

                                {/* ............................................................... */}
                            </div>
                            <FormItem label="Is Premium">
                                <Field name="is_premium" component={Checkbox}>
                                    Premium
                                </Field>
                            </FormItem>
                            <FormItem label="Is Returnable">
                                <Field
                                    name="is_returnable"
                                    component={Checkbox}
                                >
                                    Returnable
                                </Field>
                            </FormItem>
                            <FormItem label="Is Premium">
                                <Field
                                    name="is_try_and_buy"
                                    component={Checkbox}
                                >
                                    Try & Buy
                                </Field>
                            </FormItem>
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
