/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Field, Form, Formik, ErrorMessage, FieldProps, FormikErrors } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { BANNER_FIELDS_TYPE, getInitialBannerValue } from './EditCommon'
import { BANNER_MODEL } from '../BannerCommon'
import { useAppDispatch, useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import ImageComponent from './component/ImageComponent'
import SectionsComponent from './component/SectionsComponent'
import * as Yup from 'yup'
import { beforeUpload } from '@/common/beforeUpload'
import BannerCategories from './component/BannerCategories'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import VideoComponent from './component/VideoComponent'
import { Checkbox, Select } from '@/components/ui'
import BannerFilterTags from './component/BannerFilterTags'
import { bannerBodyFile, ImageHandlerBanners } from './component/bannerFunctions'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import FullDateForm from '@/common/FullDateForm'
import { pageSettingsService } from '@/store/services/pageSettingService'
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import CommonSelect from '../../pageSettings/CommonSelect'
import { SortArrays } from '../../newPageSettings/newPageSettingsUtils/newPageCommons'
import FormButton from '@/components/ui/Button/FormButton'

const EditBanner = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [webImagview, setWebImageView] = useState<string[]>([])
    const [mobileImagview, setMobileImageView] = useState<string[]>([])
    const [weblottieview, setWeblottieView] = useState<string[]>([])
    const [mobilelottieview, setMobilelottieView] = useState<string[]>([])
    const [webVideoview, setWebVideoView] = useState<string[]>([])
    const [mobileVideoview, setMobileVideoView] = useState<string[]>([])
    const [sectionBGweb, setSectionBGweb] = useState<string[]>([])
    const [sectionBGmobile, setSectionBGmobile] = useState<string[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [subPageNamesData, setSubPageNamesData] = useState<any>([])
    const [selectedPage, setSelectedPage] = useState('')
    const [filterId, setFilterId] = useState<number | string>('')
    const [excludeFilterId, setExcludeFilterId] = useState<number | string>('')

    const validationSchema = Yup.object().shape({
        min_off: Yup.number().max(Yup.ref('max_off'), 'min_off must be less than or equal to max_off'),
        max_off: Yup.number(),
    })

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const query = useMemo(() => {
        return `banners?banner_id=${id}`
    }, [id])

    const { data: bannerData } = useFetchSingleData<any>({ url: query })
    const toArray = (value: string | undefined): string[] => (value ? [value] : [])
    const { data: SubPageNames } = pageSettingsService.useSubPageNamesQuery({ pageName: selectedPage })

    useEffect(() => {
        setSubPageNamesData(SubPageNames?.data || [])
    }, [SubPageNames])

    const { data: bannerFile } = useFetchApi<BANNER_MODEL>({
        url: `/banners?p=1&page_size=200&page=${bannerData?.page}&section_heading=${bannerData?.section_heading}`,
    })

    useEffect(() => {
        if (!bannerData) return
        setMobileImageView(toArray(bannerData.image_mobile))
        setWebImageView(toArray(bannerData.image_web))
        setWebVideoView(toArray(bannerData?.extra_attributes?.video_web))
        setMobileVideoView(toArray(bannerData?.extra_attributes?.video_mobile))
        setSectionBGweb(toArray(bannerData?.section_background_web))
        setSectionBGmobile(toArray(bannerData?.section_background_mobile))
        setMobilelottieView(toArray(bannerData?.extra_attributes?.lottie_mobile))
        setWeblottieView(toArray(bannerData?.extra_attributes?.lottie_web))
        setFilterId(bannerData?.filter_id)
        setSelectedPage(bannerData?.page)
        setExcludeFilterId(bannerData?.extra_attributes?.filter_id_exclude || '')
    }, [bannerData])

    const handleImageRemove = (
        type: string,
        setFieldValue: (field: string, value: any, data?: boolean) => Promise<void | FormikErrors<BANNER_MODEL>>,
    ) => {
        switch (type) {
            case 'm_image':
                setFieldValue('image_mobile_array', [])
                setFieldValue('image_mobile', '')
                setMobileImageView([])
                break
            case 'w_image':
                setFieldValue('image_web_array', [])
                setFieldValue('image_web', '')
                setWebImageView([])
                break
            case 'm_video':
                setFieldValue('video_mobile_array', [])
                setFieldValue('extra_attributes.video_mobile', '')
                setMobileVideoView([])
                break
            case 'w_video':
                setFieldValue('video_web_array', [])
                setFieldValue('extra_attributes.video_web', '')
                setWebVideoView([])
                break
            case 'm_lottie':
                setFieldValue('lottie_mobile_array', [])
                setFieldValue('extra_attributes.lottie_mobile', '')
                setMobilelottieView([])
                break
            case 'w_lottie':
                setFieldValue('lottie_web_array', [])
                setFieldValue('extra_attributes.lottie_web', '')
                setWeblottieView([])
                break
            case 'm_bg':
                setFieldValue('section_background_mobile_array', [])
                setFieldValue('extra_attributes.section_background_mobile', '')
                setSectionBGmobile([])
                break
            case 'w_bg':
                setFieldValue('section_background_web_array', [])
                setFieldValue('extra_attributes.section_background_web', '')
                setSectionBGweb([])
                break
            default:
                break
        }
    }
    const handleSubmit = async (values: BANNER_MODEL) => {
        const {
            webImageUpload,
            webAspectratio,
            mobileImageUpload,
            mobileAspectratio,
            sectionBgWebUpload,
            sectionBgMobileUpload,
            webVideoUpload,
            mobileVideoUpload,
            webLottieUpload,
            mobileLottieUpload,
        } = await ImageHandlerBanners(values, webImagview, mobileImagview)
        const body = bannerBodyFile(
            values,
            webVideoUpload,
            mobileVideoUpload,
            webAspectratio,
            mobileAspectratio,
            webLottieUpload,
            mobileLottieUpload,
            mobileImageUpload,
            webImageUpload,
            filterId,
            excludeFilterId,
            sectionBgWebUpload,
            sectionBgMobileUpload,
            BANNER_FIELDS_TYPE,
        )
        const keysToKeepEvenIfEmpty = ['division', 'category', 'sub_category', 'product_type', 'image_web', 'image_mobile', 'brand']
        const filteredBody = Object.fromEntries(
            Object.entries(body).filter(([key, value]) => keysToKeepEvenIfEmpty.includes(key) || value !== ''),
        )
        try {
            setShowSpinner(true)
            const response = await axioisInstance.patch(`banners`, filteredBody)
            notification.success({ message: response?.data?.message || 'Banner Edited Successfully' })
            navigate('/app/appSettings/banners')
        } catch (error: any) {
            notification.error({ message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Banner not Edited' })
        } finally {
            setShowSpinner(false)
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Edit Banner</h3>
            <Formik
                enableReinitialize
                initialValues={getInitialBannerValue(bannerData) as BANNER_MODEL}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form
                        className="p-4 w-full bg-gray-50 dark:bg-gray-800 shadow-xl rounded-xl"
                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                    >
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {BANNER_FIELDS_TYPE.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item?.type === 'checkbox' ? Checkbox : Input}
                                        />
                                        <ErrorMessage name={item.name} component="div" className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                ))}

                                <FullDateForm label="From Date" name="from_date" fieldname="from_date" />
                                <FullDateForm label="To Date" name="to_date" fieldname="to_date" />
                            </FormContainer>
                            <div>Mobile Image</div>
                            <ImageComponent
                                imageView={mobileImagview}
                                imageremove="mobile"
                                handleImageRemove={() => handleImageRemove('m_image', setFieldValue)}
                                name="image_mobile_array"
                                beforeUpload={beforeUpload}
                                fileList={values.image_mobile_array}
                            />
                            <div>Web Image</div>
                            <ImageComponent
                                imageView={webImagview}
                                imageremove="web"
                                handleImageRemove={() => handleImageRemove('w_image', setFieldValue)}
                                name="image_web_array"
                                beforeUpload={beforeUpload}
                                fileList={values.image_web_array}
                            />
                            <div>Mobile Video</div>
                            <VideoComponent
                                videoView={mobileVideoview}
                                videoRemove="mobile_video"
                                handleVideoRemove={() => handleImageRemove('m_video', setFieldValue)}
                                name="video_mobile_array"
                                beforeUpload={beforeVideoUpload}
                                fileList={values.video_mobile_array}
                            />
                            <div>Web Video</div>
                            <VideoComponent
                                videoView={webVideoview}
                                videoRemove="web_video"
                                handleVideoRemove={() => handleImageRemove('w_video', setFieldValue)}
                                name="video_web_array"
                                beforeUpload={beforeVideoUpload}
                                fileList={values.video_web_array}
                            />
                            <div>Mobile Lottie</div>
                            <ImageComponent
                                imageView={mobilelottieview}
                                imageremove="mobile_lottie"
                                handleImageRemove={() => handleImageRemove('m_lottie', setFieldValue)}
                                name="lottie_mobile_array"
                                beforeUpload={beforeUpload}
                                fileList={values.lottie_mobile_array}
                            />
                            <div>Web Lottie</div>
                            <ImageComponent
                                imageView={weblottieview}
                                imageremove="web_lottie"
                                handleImageRemove={() => handleImageRemove('w_lottie', setFieldValue)}
                                name="lottie_web_array"
                                beforeUpload={beforeUpload}
                                fileList={values.lottie_web_array}
                            />

                            <div>Section BG Web</div>
                            <ImageComponent
                                imageView={sectionBGweb}
                                imageremove="SecWeb"
                                handleImageRemove={() => handleImageRemove('w_bg', setFieldValue)}
                                name="section_background_web_array"
                                beforeUpload={beforeUpload}
                                fileList={values.section_background_web_array}
                            />
                            <div>Section BG Mobile</div>
                            <ImageComponent
                                imageView={sectionBGmobile}
                                imageremove="SecMob"
                                handleImageRemove={() => handleImageRemove('m_bg', setFieldValue)}
                                name="section_background_mobile_array"
                                beforeUpload={beforeUpload}
                                fileList={values.section_background_mobile_array}
                            />
                            <FormContainer className="">
                                <BannerCategories setFieldValue={setFieldValue} />
                                <SectionsComponent
                                    needClassName
                                    name="brand"
                                    label="Brand"
                                    defaultValue={getInitialBannerValue(bannerData).brand}
                                    setFieldValue={setFieldValue}
                                    options={brands.brands}
                                    fieldValues="brand"
                                />
                                <div className="mb-4">
                                    <CommonFilterSelect isEdit filterId={filterId as string} setFilterId={setFilterId} />
                                </div>
                                <div className="mb-4">
                                    <CommonFilterSelect
                                        isEdit
                                        isExclude
                                        filterId={excludeFilterId as string}
                                        setFilterId={setExcludeFilterId}
                                    />
                                </div>

                                <FormContainer className="grid grid-cols-2 gap-4">
                                    <FormItem label="Parent Banner">
                                        <Field name="parent_banner">
                                            {({ field, form }: FieldProps<any>) => {
                                                const selectedTag = bannerFile.find((item) => item.id === field.value)

                                                return (
                                                    <Select
                                                        isClearable
                                                        className=""
                                                        placeholder="Select Filter Tags"
                                                        options={bannerFile}
                                                        value={selectedTag}
                                                        getOptionLabel={(option) => option.name as string}
                                                        getOptionValue={(option) => option.id as any}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('parent_banner', newVal?.id)
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>

                                    <BannerFilterTags label="Tags" name="tags" />
                                    <BannerFilterTags label="Quick Filter Tags" name="quick_filter_tags" />
                                    <FormItem label="Sub Page" className="col-span-1">
                                        <Field name="sub_page">
                                            {({ field, form }: FieldProps<any>) => {
                                                const selectedTags = Array.isArray(field.value)
                                                    ? subPageNamesData?.filter((option: any) => field.value.includes(option.id)) || []
                                                    : []

                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Select Filter Tags"
                                                        options={subPageNamesData}
                                                        value={selectedTags}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        onChange={(newVal) => {
                                                            const newIds = newVal ? newVal.map((val) => val.id) : []
                                                            form.setFieldValue('sub_page', newIds)
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                    <FormItem label="Show Subscription Popup">
                                        <Field type="checkbox" name="show_subscription_popup" component={Checkbox} />
                                    </FormItem>
                                    <CommonSelect needClassName className="" label="Sort By" name="sort" options={SortArrays} />
                                </FormContainer>
                            </FormContainer>
                            <FormButton isSpinning={showSpinner} value="Update" />
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditBanner
