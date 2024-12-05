/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps, ErrorMessage } from 'formik'
import { useEffect, useState } from 'react'
import { DatePicker, notification } from 'antd'
import { useParams } from 'react-router-dom'
import { BANNER_FIELDS_TYPE, getInitialBannerValue } from './EditCommon'
import { BANNERMODEL } from '../BannerCommon'
import { useAppDispatch, useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import ImageComponent from './component/ImageComponent'
import SectionsComponent from './component/SectionsComponent'
import * as Yup from 'yup'
import LoadingSpinner from '@/common/LoadingSpinner'
import { beforeUpload } from '@/common/beforeUpload'
import BannerCategories from './component/BannerCategories'
import { handleimage } from '@/common/handleImage'
import moment from 'moment'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import VideoComponent from './component/VideoComponent'

const EditBanner = () => {
    const [bannerData, setBannerData] = useState<BANNERMODEL>()
    const [webImagview, setWebImageView] = useState<string[]>([])
    const [mobileImagview, setMobileImageView] = useState<string[]>([])

    const [webVideoview, setWebVideoView] = useState<string[]>([])
    const [mobileVideoview, setMobileVideoView] = useState<string[]>([])
    const [sectionBGweb, setSectionBGweb] = useState<string[]>([])
    const [sectionBGmobile, setSectionBGmobile] = useState<string[]>([])
    // const navigate = useNavigate()
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [showSpinner, setShowSpinner] = useState(false)
    const [filteredCategories, setFilteredCategories] = useState([])
    const [filteredSubCategories, setFilteredSubCategories] = useState([])
    const [filteredProductTypes, setFilteredProductTypes] = useState([])

    const validationSchema = Yup.object().shape({
        min_off: Yup.number().max(Yup.ref('max_off'), 'min_off must be less than or equal to max_off'),
        max_off: Yup.number(),
    })

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const { id } = useParams()

    const fetchBannerData = async () => {
        try {
            const response = await axioisInstance.get(`banners?banner_id=${id}`)
            const data = response.data.data
            setBannerData(data)
            setMobileImageView(data.image_mobile ? [data.image_mobile] : [])
            setWebImageView(data.image_web ? [data.image_web] : [])
            setWebVideoView(data.video_web ? [data.video_web] : [])
            setMobileVideoView(data.video_mobile ? [data.video_mobile] : [])
            setSectionBGweb(data.section_background_web ? [data.section_background_web] : [])
            setSectionBGmobile(data.section_background_mobile ? [data.section_background_mobile] : [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBannerData()
    }, [id])

    const handleImageRemove = (index: number, type: string) => {
        const typeToUpdater = {
            mobile: setMobileImageView,
            web: setWebImageView,
            SecWeb: setSectionBGweb,
            SecMob: setSectionBGmobile,
            mobile_video: setMobileVideoView,
            web_video: setWebVideoView,
        }

        const updater = typeToUpdater[type as keyof typeof typeToUpdater]
        if (updater) {
            updater((items) => items.filter((_, id) => id !== index))
        }
    }

    const handleVideo = async (files: File[]) => {
        if (files) {
            const formData = new FormData()

            files.forEach((file) => {
                formData.append('file', file)
            })
            formData.append('file_type', 'product')

            notification.info({
                message: 'Video Upload In Process',
            })
            try {
                setShowSpinner(true)
                console.log(formData.get('file'))
                const response = await axioisInstance.post('fileupload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                console.log(response)
                notification.success({
                    message: 'Video Updated',
                })
                const newData = response.data.url
                return newData
            } catch (error: any) {
                console.error('Error uploading files:', error)
                notification.error({
                    message: 'Failure',
                    description: error?.response?.data?.message || 'Video Not uploaded',
                })
                return 'Error'
            } finally {
                setShowSpinner(false)
            }
        }
    }

    const handleSubmit = async (values: BANNERMODEL) => {
        const processImageUpload = async (imageArray: any[], currentImage: string) => {
            return imageArray.length > 0 ? await handleimage('product', imageArray) : currentImage
        }
        const processVideoUpload = async (videoArray: any[], currentvideo: string) => {
            return videoArray.length > 0 ? await handleVideo(videoArray) : currentvideo
        }
        const webImageUpload = await processImageUpload(values.image_web_array, values.image_web)
        const mobileImageUpload = await processImageUpload(values.image_mobile_array, values.image_mobile)
        const sectionBgWebUpload = await processImageUpload(values.section_background_web_array, values.section_background_web)
        const sectionBgMobileUpload = await processImageUpload(values.section_background_mobile_array, values.section_background_mobile)

        const webVideoUpload = await processVideoUpload(values?.video_web_array, values?.video_web)
        const mobileVideoUpload = await processVideoUpload(values?.video_mobile_array, values?.video_mobile)
        const { max_off, min_off, image_web_array, image_mobile_array, video_web_array, video_mobile_array, ...rest } = values
        console.log(max_off, min_off, image_web_array, image_mobile_array, video_web_array, video_mobile_array)

        const formData = {
            ...rest,
            banner_id: values.id || '',
            image_web: webImageUpload || '',
            image_mobile: mobileImageUpload || '',
            video_web: webVideoUpload || '',
            video_mobile: mobileVideoUpload || '',
            section_background_web: sectionBgWebUpload || '',
            section_background_mobile: sectionBgMobileUpload || '',
            division: values.division ? values.division.map((item) => item.name).join(',') : '',
            category: values.category ? values.category.map((item) => item.name).join(',') : '',
            sub_category: values.sub_category ? values.sub_category.map((item) => item.name).join(',') : '',
            product_type: values.product_type ? values.product_type.map((item) => item.name).join(',') : '',
            brand: values.brand ? values.brand.map((item) => item.name).join(',') : '',
            tags: [
                ...(values.tags_input
                    ? values.tags_input.split(',').filter((tag) => !tag.startsWith('maxoff_') && !tag.startsWith('minoff_'))
                    : []),
                BANNER_FIELDS_TYPE.map((item) => item.name).includes('max_off') && values?.max_off && `maxoff_${values?.max_off}`,
                BANNER_FIELDS_TYPE.map((item) => item.name).includes('min_off') && values?.min_off && `minoff_${values?.min_off}`,
            ].filter((item) => item),
        }
        try {
            setShowSpinner(true)
            const response = await axioisInstance.patch(`banners`, formData)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Banner Edited Successfully',
            })
            // navigate('/app/appSettings/banners')
        } catch (error: any) {
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Banner not Edited',
            })
        } finally {
            setShowSpinner(false)
        }
    }

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Edit Banner</h3>
            <Formik
                enableReinitialize
                initialValues={getInitialBannerValue(bannerData)}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="w-2/3" onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}>
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {BANNER_FIELDS_TYPE.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        <ErrorMessage name={item.name} component="div" className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                ))}
                                <FormItem label="From date" className="col-span-1 w-full">
                                    <Field name="from_date">
                                        {({ field, form }: any) => (
                                            <DatePicker
                                                showTime
                                                placeholder=""
                                                value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                onChange={(value) => {
                                                    form.setFieldValue('from_date', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem label="To date" className="col-span-1 w-full">
                                    <Field name="to_date">
                                        {({ field, form }: any) => (
                                            <DatePicker
                                                showTime
                                                placeholder=""
                                                value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                onChange={(value) => {
                                                    form.setFieldValue('to_date', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/* ................I.....M......A.....G.....E....S.................... */}
                            <div>Mobile Image</div>
                            <ImageComponent
                                imageView={mobileImagview}
                                imageremove="mobile"
                                handleImageRemove={handleImageRemove}
                                name="image_mobile_array"
                                beforeUpload={beforeUpload}
                                fileList={values.image_mobile_array}
                            />

                            {/* 2nd image */}

                            <div>Web Image</div>
                            <ImageComponent
                                imageView={webImagview}
                                imageremove="web"
                                handleImageRemove={handleImageRemove}
                                name="image_web_array"
                                beforeUpload={beforeUpload}
                                fileList={values.image_web_array}
                            />

                            <div>Mobile Video</div>
                            <VideoComponent
                                videoView={mobileVideoview}
                                videoRemove="mobile_video"
                                handleVideoRemove={handleImageRemove}
                                name="video_mobile_array"
                                beforeUpload={beforeVideoUpload}
                                fileList={values.video_mobile_array}
                            />

                            <div>Web Video</div>
                            <VideoComponent
                                videoView={webVideoview}
                                videoRemove="web_video"
                                handleVideoRemove={handleImageRemove}
                                name="video_web_array"
                                beforeUpload={beforeVideoUpload}
                                fileList={values.video_web_array}
                            />

                            {/* ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, */}

                            <div>Section BG Web</div>
                            <ImageComponent
                                imageView={sectionBGweb}
                                imageremove="SecWeb"
                                handleImageRemove={handleImageRemove}
                                name="section_background_web_array"
                                beforeUpload={beforeUpload}
                                fileList={values.section_background_web_array}
                            />

                            {/* MOBILE................................... */}

                            <div>Section BG Mobile</div>
                            <ImageComponent
                                imageView={sectionBGmobile}
                                imageremove="SecMob"
                                handleImageRemove={handleImageRemove}
                                name="section_background_mobile_array"
                                beforeUpload={beforeUpload}
                                fileList={values.section_background_mobile_array}
                            />

                            {/* ...................................................................... */}
                            <FormContainer className="">
                                <BannerCategories
                                    initialValue={getInitialBannerValue(bannerData)}
                                    options={divisions.divisions}
                                    setFieldValue={setFieldValue}
                                    filteredCategories={filteredCategories}
                                    filteredProductTypes={filteredProductTypes}
                                    filteredSubCategories={filteredSubCategories}
                                    setFilteredCategories={setFilteredCategories}
                                    setFilteredProductTypes={setFilteredProductTypes}
                                    setFilteredSubCategories={setFilteredSubCategories}
                                />
                                {/* BRAND   */}

                                <SectionsComponent
                                    name="brand"
                                    label="Brand"
                                    defaultValue={getInitialBannerValue(bannerData).brand}
                                    setFieldValue={setFieldValue}
                                    options={brands.brands}
                                    fieldValues="brand"
                                />

                                {/* Tags */}

                                <FormContainer>
                                    <FormItem asterisk label="Filter Tags" className="col-span-1 w-full">
                                        <Field name="quick_filter_tags">
                                            {({ field, form }: FieldProps<any>) => {
                                                const selectedTags = field.value.map((tag: any) => {
                                                    const matchedOption = filters.filters.find((option) => option.value === tag)
                                                    return (
                                                        matchedOption || {
                                                            value: tag,
                                                            label: tag,
                                                        }
                                                    )
                                                })

                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Select Filter Tags"
                                                        options={filters.filters}
                                                        value={selectedTags}
                                                        getOptionLabel={(option) => option.label}
                                                        getOptionValue={(option) => option.value}
                                                        onChange={(newVal) => {
                                                            const newValues = newVal ? newVal.map((val) => val.value) : []
                                                            form.setFieldValue(field.name, newValues)
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>
                            </FormContainer>

                            <FormContainer>
                                <FormItem className="mt-5">
                                    <Button type="submit" variant="solid">
                                        Submit
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditBanner
