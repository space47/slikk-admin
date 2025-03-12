/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps, ErrorMessage } from 'formik'
import { useEffect, useState } from 'react'
import { DatePicker, notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
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

    // lottie
    const [weblottieview, setWeblottieView] = useState<string[]>([])
    const [mobilelottieview, setMobilelottieView] = useState<string[]>([])
    //
    const [webVideoview, setWebVideoView] = useState<string[]>([])
    const [mobileVideoview, setMobileVideoView] = useState<string[]>([])
    const [sectionBGweb, setSectionBGweb] = useState<string[]>([])
    const [sectionBGmobile, setSectionBGmobile] = useState<string[]>([])
    const navigate = useNavigate()
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
            setWebVideoView(data?.extra_attributes?.video_web ? [data?.extra_attributes?.video_web] : [])
            setMobileVideoView(data?.extra_attributes?.video_mobile ? [data?.extra_attributes?.video_mobile] : [])
            setSectionBGweb(data?.section_background_web ? [data.section_background_web] : [])
            setSectionBGmobile(data.section_background_mobile ? [data.section_background_mobile] : [])
            setMobilelottieView(data?.extra_attributes?.lottie_mobile ? [data?.extra_attributes?.lottie_mobile] : [])
            setWeblottieView(data?.extra_attributes?.lottie_web ? [data?.extra_attributes?.lottie_web] : [])
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
            mobile_lottie: setMobilelottieView,
            web_lottie: setWeblottieView,
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

    const calculateAspectRatio = async (files: File[]): Promise<number[]> => {
        if (!files || files.length === 0) {
            return []
        }

        const aspectRatios: number[] = []
        for (const file of files) {
            const image = new Image()
            const fileURL = URL.createObjectURL(file)

            image.src = fileURL

            await new Promise<void>((resolve) => {
                image.onload = () => {
                    aspectRatios.push(image.width / image.height)
                    URL.revokeObjectURL(fileURL)
                    resolve()
                }
                image.onerror = () => {
                    URL.revokeObjectURL(fileURL)
                    resolve()
                }
            })
        }
        return aspectRatios
    }

    const calculateAspectRatioFromString = async (imageUrl: string): Promise<number | null> => {
        if (!imageUrl) {
            return null
        }

        const image = new Image()
        image.src = imageUrl

        return new Promise<number | null>((resolve) => {
            image.onload = () => {
                const aspectRatio = image.width / image.height
                resolve(aspectRatio)
            }
            image.onerror = () => {
                resolve(null)
            }
        })
    }

    const calculateAspectRatioFromStrings = async (imageSources: string[]): Promise<number[]> => {
        if (!imageSources || imageSources.length === 0) {
            return []
        }

        const aspectRatios: number[] = []

        for (const src of imageSources) {
            const image = new Image()
            image.src = src

            await new Promise<void>((resolve) => {
                image.onload = () => {
                    aspectRatios.push(image.width / image.height)
                    resolve()
                }
                image.onerror = () => {
                    resolve()
                }
            })
        }

        return aspectRatios
    }

    const handleSubmit = async (values: BANNERMODEL) => {
        console.log(`Initial Value for Extra attributes`, values?.extra_attributes?.video_web)
        const processImageUpload = async (imageArray: any[], currentImage: string) => {
            return imageArray.length > 0 ? await handleimage('product', imageArray) : currentImage
        }
        const processVideoUpload = async (videoArray: any[], currentvideo: string) => {
            return videoArray.length > 0 ? await handleVideo(videoArray) : currentvideo
        }
        const webImageUpload = await processImageUpload(values.image_web_array, values.image_web)
        const webAspectratio = (await calculateAspectRatio(values.image_web_array)) || (await calculateAspectRatioFromStrings(webVideoview))
        const mobileImageUpload = await processImageUpload(values.image_mobile_array, values.image_mobile)
        const mobileAspectratio =
            (await calculateAspectRatio(values.image_mobile_array)) || (await calculateAspectRatioFromStrings(mobileVideoview))
        const sectionBgWebUpload = await processImageUpload(values.section_background_web_array, values.section_background_web)
        const sectionBgMobileUpload = await processImageUpload(values.section_background_mobile_array, values.section_background_mobile)

        console.log('Aspect ratios', webAspectratio)
        const webVideoUpload = await processVideoUpload(values?.video_web_array, values?.video_web)
        const mobileVideoUpload = await processVideoUpload(values?.video_mobile_array, values?.video_mobile)

        const webLottieUpload = await processImageUpload(values?.lottie_web_array, values?.lottie_web)
        const mobileLottieUpload = await processImageUpload(values?.lottie_mobile_array, values?.lottie_mobile)

        const {
            max_off,
            min_off,
            mobile_redirection_url,
            web_redirection_url,
            image_web_array,
            image_mobile_array,
            video_web_array,
            video_mobile_array,
            lottie_web_array,
            lottie_mobile_array,
            ...rest
        } = values
        console.log(
            max_off,
            min_off,
            image_web_array,
            image_mobile_array,
            video_web_array,
            video_mobile_array,
            lottie_web_array,
            lottie_mobile_array,
        )

        console.log('start')
        const formData = {
            ...rest,
            banner_id: values?.id || '',
            image_web: webImageUpload || '',
            image_mobile: mobileImageUpload || '',
            extra_attributes: {
                video_web: webVideoUpload ?? values?.extra_attributes?.video_web ?? null,
                video_mobile: mobileVideoUpload ?? values?.extra_attributes?.video_mobile ?? null,
                web_aspect_ratio:
                    values?.extra_attributes?.web_aspect_ratio ?? (webAspectratio?.[0] ? Number(webAspectratio[0].toFixed(2)) : null),
                mobile_aspect_ratio:
                    values?.extra_attributes?.mobile_aspect_ratio ??
                    (mobileAspectratio?.[0] ? Number(mobileAspectratio[0].toFixed(2)) : null),
                mobile_redirection_url: values?.extra_attributes?.mobile_redirection_url ?? null,
                web_redirection_url: values?.extra_attributes?.web_redirection_url ?? null,
                maxoff: values?.max_off ?? null,
                minoff: values?.min_off ?? null,
                lottie_web: webLottieUpload ?? values?.extra_attributes?.lottie_web ?? null,
                lottie_mobile: mobileLottieUpload ?? values?.extra_attributes?.lottie_mobile ?? null,
            },
            section_background_web: sectionBgWebUpload || '',
            section_background_mobile: sectionBgMobileUpload || '',
            division: values?.division?.map((item) => item.name).join(',') || '',
            category: values?.category?.map((item) => item.name).join(',') || '',
            sub_category: values?.sub_category?.map((item) => item.name).join(',') || '',
            product_type: values?.product_type?.map((item) => item.name).join(',') || '',
            brand: values?.brand?.map((item) => item.name).join(',') || '',
            tags: [
                ...(values?.tags_input
                    ? values.tags_input.split(',').filter((tag) => !tag.startsWith('maxoff_') && !tag.startsWith('minoff_'))
                    : []),
                BANNER_FIELDS_TYPE.some((item) => item.name === 'max_off') && values?.max_off && `maxoff_${values?.max_off}`,
                BANNER_FIELDS_TYPE.some((item) => item.name === 'min_off') && values?.min_off && `minoff_${values?.min_off}`,
            ].filter(Boolean),
        }

        console.log('FormData of Edit Banner:', formData)
        try {
            setShowSpinner(true)
            const response = await axioisInstance.patch(`banners`, formData)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Banner Edited Successfully',
            })
            navigate('/app/appSettings/banners')
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

                            <div>Mobile Lottie</div>
                            <ImageComponent
                                imageView={mobilelottieview}
                                imageremove="mobile_lottie"
                                handleImageRemove={handleImageRemove}
                                name="lottie_mobile_array"
                                beforeUpload={beforeUpload}
                                fileList={values.lottie_mobile_array}
                            />
                            <div>Web Lottie</div>
                            <ImageComponent
                                imageView={weblottieview}
                                imageremove="web_lottie"
                                handleImageRemove={handleImageRemove}
                                name="lottie_web_array"
                                beforeUpload={beforeUpload}
                                fileList={values.lottie_web_array}
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
                                    needClassName
                                    name="brand"
                                    label="Brand"
                                    defaultValue={getInitialBannerValue(bannerData).brand}
                                    setFieldValue={setFieldValue}
                                    options={brands.brands}
                                    fieldValues="brand"
                                />

                                {/* Tags */}

                                <FormContainer>
                                    <FormItem label="Quick Filter Tags" className="col-span-1 w-1/2">
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
