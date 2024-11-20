/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps, ErrorMessage } from 'formik'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { BANNER_FIELDS_TYPE } from './EditCommon'
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
import DateAndTimePicker from '@/common/DateAndTime'

const EditBanner = () => {
    const [bannerData, setBannerData] = useState<BANNERMODEL>()
    const [webImagview, setWebImageView] = useState<string[]>([])
    const [mobileImagview, setMobileImageView] = useState<string[]>([])
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
    const [fromDateAndTime, setFromDateAndTime] = useState('')
    const [toDateAndTime, setToDateAndTime] = useState('')

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
            setFromDateAndTime(moment(data?.from_date).format('YYYY-MM-DD HH:mm:ss'))
            setToDateAndTime(moment(data?.to_date).format('YYYY-MM-DD HH:mm:ss'))
            setMobileImageView(data.image_mobile ? [data.image_mobile] : [])
            setWebImageView(data.image_web ? [data.image_web] : [])
            setSectionBGweb(data.section_background_web ? [data.section_background_web] : [])
            setSectionBGmobile(data.section_background_mobile ? [data.section_background_mobile] : [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBannerData()
    }, [id])

    const initialValue: BANNERMODEL = {
        id: bannerData?.id || 0,
        name: bannerData?.name || '',
        section_heading: bannerData?.section_heading || '',
        parent_banner: bannerData?.parent_banner || null,
        quick_filter_tags: bannerData?.quick_filter_tags || [],
        brand: bannerData?.brand || [],
        division: bannerData?.division || [],
        category: bannerData?.category || [],
        image_web_array: [],
        image_mobile_array: [],
        sub_category: bannerData?.sub_category || [],
        product_type: bannerData?.product_type || [],
        type: bannerData?.type || null,
        image_web: bannerData?.image_web || '',
        image_mobile: bannerData?.image_mobile || '',
        offers: bannerData?.offers || false,
        offer_id: bannerData?.offer_id || '',
        page: bannerData?.page || '',
        from_date: moment(bannerData?.from_date).format('YYYY-MM-DD HH:mm:ss') || '',
        to_date: moment(bannerData?.to_date).format('YYYY-MM-DD HH:mm:ss') || '',
        uptooff: bannerData?.uptooff || '',
        tags: bannerData?.tags || [],
        footer: bannerData?.footer || null,
        coupon_code: bannerData?.coupon_code || null,
        is_clickable: bannerData?.is_clickable || false,
        section_background_web: bannerData?.section_background_web || '',
        section_background_web_array: [],
        section_background_mobile_array: [],
        section_background_mobile: bannerData?.section_background_mobile || '',
        max_price: bannerData?.max_price || 0,
        min_price: bannerData?.min_price || 0,
        max_off: bannerData?.max_off || 0,
        min_off: bannerData?.min_off || 0,
        barcodes: bannerData?.barcodes || '',
        redirection_url: bannerData?.redirection_url || null,
        tags_input: bannerData?.tags.join(',') || '',
        position: bannerData?.position || null,
    }

    console.log('InitialValue', initialValue?.from_date)
    console.log('InitialValue To', initialValue?.to_date)

    console.log('fromDate from Edit', fromDateAndTime)

    const handleImageRemove = (index: number, type: string) => {
        if (type === 'mobile') {
            setMobileImageView((item) => item.filter((_, id) => id !== index))
        }
        if (type === 'web') {
            setWebImageView((item) => item.filter((_, id) => id !== index))
        }
        if (type === 'SecWeb') {
            setSectionBGweb((item) => item.filter((_, id) => id !== index))
        }
        if (type === 'SecMob') {
            setSectionBGmobile((item) => item.filter((_, id) => id !== index))
        }
    }

    console.log('fromDate', fromDateAndTime)

    const handleSubmit = async (values: BANNERMODEL) => {
        const processImageUpload = async (imageArray: any[], currentImage: string) => {
            return imageArray.length > 0 ? await handleimage('product', imageArray) : currentImage
        }
        const webImageUpload = await processImageUpload(values.image_web_array, values.image_web)
        const mobileImageUpload = await processImageUpload(values.image_mobile_array, values.image_mobile)
        const sectionBgWebUpload = await processImageUpload(values.section_background_web_array, values.section_background_web)
        const sectionBgMobileUpload = await processImageUpload(values.section_background_mobile_array, values.section_background_mobile)
        const { max_off, min_off, ...rest } = values
        console.log(max_off, min_off)

        const formData = {
            ...rest,
            banner_id: values.id || '',
            image_web: webImageUpload || '',
            image_mobile: mobileImageUpload || '',
            section_background_web: sectionBgWebUpload || '',
            section_background_mobile: sectionBgMobileUpload || '',
            image_web_array: null,
            from_date: fromDateAndTime,
            to_date: toDateAndTime,
            image_mobile_array: null,
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

        console.log('FormData', formData)

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
            <Formik enableReinitialize initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                                <DateAndTimePicker
                                    fromDate={fromDateAndTime}
                                    toDate={toDateAndTime}
                                    setFromDateAndTime={setFromDateAndTime}
                                    setToDateAndTime={setToDateAndTime}
                                />
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
                                    initialValue={initialValue}
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
                                    defaultValue={initialValue.brand}
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
