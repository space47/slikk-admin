/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { Field, Form, Formik, FieldProps } from 'formik'
// import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { BANNER_FIELDS_TYPE } from './EditCommon'
import { BANNERMODEL } from '../BannerCommon'
import { useAppDispatch, useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import Upload from '@/components/ui/Upload'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { formatDate } from '@/common/date'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'

const EditBanner = () => {
    const [bannerData, setBannerData] = useState<BANNERMODEL>()
    const [webImagview, setWebImageView] = useState<string[]>([])
    const [mobileImagview, setMobileImageView] = useState<string[]>([])
    const [sectionBGweb, setSectionBGweb] = useState<string[]>([])
    const [sectionBGmobile, setSectionBGmobile] = useState<string[]>([])
    const navigate = useNavigate()
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>(
        (state) => state.subCategory,
    )
    const product_type = useAppSelector<PRODUCTTYPE_STATE>(
        (state) => state.product_type,
    )
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    console.log('SSSSSSSSSS', filters)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
        dispatch(getAllFiltersAPI())
    }, [])

    const MAX_UPLOAD = 8

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

    console.log(
        'CAATEGORY',
        category.categories.map((item) => item.name),
    )
    console.log('FILTERS', filters.filters)

    const { id } = useParams()

    const fetchsellerData = async () => {
        try {
            const response = await axioisInstance.get(`banners?banner_id=${id}`)
            const data = response.data.data
            setBannerData(data)
            setMobileImageView(data.image_mobile ? [data.image_mobile] : [])
            setWebImageView(data.image_web ? [data.image_web] : [])
            setSectionBGweb(
                data.section_background_web
                    ? [data.section_background_web]
                    : [],
            )
            setSectionBGmobile(
                data.section_background_mobile
                    ? [data.section_background_mobile]
                    : [],
            )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchsellerData()
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
        from_date: formatDate(bannerData?.from_date || ''),
        to_date: formatDate(bannerData?.to_date || ''),
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
        barcodes: bannerData?.barcodes || '',
        redirection_url: bannerData?.redirection_url || null,
    }

    console.log(
        'DIVISION',
        initialValue.division.map((item) => item.name),
    )

    const handleimage = async (files: File[]) => {
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

            console.log(newData)
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            // notification.error({
            //     message: 'Failure',
            //     description:
            //         error?.response?.data?.message || 'File Not uploaded',
            // })
            return 'Error'
        }
    }

    // const transformArray = (arr) => {
    //     const result = []

    //     arr.forEach((item) => {
    //         // Split the string into type (brand/cat) and name
    //         const [type, name] = item.split('_')

    //         // Find the existing category in the result array
    //         let category = result.find((obj) => obj.label === type)

    //         // If the category doesn't exist, create a new one
    //         if (!category) {
    //             category = { label: type, options: [] }
    //             result.push(category)
    //         }

    //         // Add the item to the options array of the found or created category
    //         category.options.push({ name: name, label: name, value: item })
    //     })

    //     return result
    // }

    console.log('DIVISIONDATA', initialValue.division)

    // const getInitialValues = (division: any) => {
    //     return division.map((div) => ({
    //         value: div.id,
    //         label: div.name,
    //     }))
    // }

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

    const handleSubmit = async (values: BANNERMODEL) => {
        let webImageUpload = values.image_web
        let mobileImageUpload = values.image_mobile
        let sectiioBgWebUpload = values.section_background_web
        let sectionBgMobileUpload = values.section_background_mobile

        if (values.image_web_array.length > 0) {
            webImageUpload = await handleimage(values.image_web_array)
        }

        if (values.image_mobile_array.length > 0) {
            mobileImageUpload = await handleimage(values.image_mobile_array)
        }
        if (values.section_background_mobile_array.length > 0) {
            sectionBgMobileUpload = await handleimage(
                values.section_background_mobile_array,
            )
        }
        if (values.section_background_web_array.length > 0) {
            sectiioBgWebUpload = await handleimage(
                values.section_background_web_array,
            )
        }

        console.log('tags', values)

        const formData = {
            ...values,
            banner_id: values.id,
            image_web: webImageUpload,
            image_mobile: mobileImageUpload,
            section_background_web: sectiioBgWebUpload,
            section_background_mobile: sectionBgMobileUpload,
            image_web_array: null,
            image_mobile_array: null,
            // // division: values.division.map((item) => item.name).join(','),
            // category: values.category.map((item) => item.name).join(','),
            // sub_category: values.sub_category
            //     .map((item) => item.name)
            //     .join(','),
            // product_type: values.product_type
            //     .map((item) => item.name)
            //     .join(','),
            // brand: values.brand.map((item) => item.name).join(','),
        }

        try {
            const response = await axioisInstance.patch(`banners`, formData)

            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Banner Edited Successfully',
            })

            // navigate('/app/appSettings/banners')
        } catch (error: any) {
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'Banner not Edited',
            })
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Edit Banner</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form
                        className="w-2/3"
                        onKeyDown={(e: any) =>
                            e.key === 'Enter' && e.preventDefault()
                        }
                    >
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {BANNER_FIELDS_TYPE.map((item, key) => (
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
                            </FormContainer>
                            {/* ................I.....M......A.....G.....E....S.................... */}
                            <div>Mobile Image</div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex flex-col items-center justify-center rounded-xl mb-4">
                                <div className="mt-5">
                                    <div className="flex gap-2">
                                        {mobileImagview &&
                                        mobileImagview.length > 0 ? (
                                            mobileImagview.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`image-${index}`}
                                                        className="rounded-sm w-[50px] h-[50px]"
                                                    />

                                                    <button
                                                        onClick={() =>
                                                            handleImageRemove(
                                                                index,
                                                                'mobile',
                                                            )
                                                        }
                                                        className="text-red-600 font-bold"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No image</p>
                                        )}

                                        <div></div>
                                    </div>
                                    <FormItem label="" className="mt-4">
                                        <Field name="image_mobile_array">
                                            {({ form }: FieldProps<any>) => (
                                                <Upload
                                                    multiple
                                                    beforeUpload={beforeUpload}
                                                    fileList={
                                                        values.image_mobile_array
                                                    }
                                                    onChange={(files) =>
                                                        form.setFieldValue(
                                                            'image_mobile_array',
                                                            files,
                                                        )
                                                    }
                                                    onFileRemove={(files) =>
                                                        form.setFieldValue(
                                                            'image_mobile_array',
                                                            files,
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </FormContainer>

                            {/* 2nd image */}

                            <div>Web Image</div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex flex-col items-center justify-center rounded-xl mb-4">
                                <div className="mt-5">
                                    <div className="flex gap-2">
                                        {webImagview &&
                                        webImagview.length > 0 ? (
                                            webImagview.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`image-${index}`}
                                                        className="rounded-sm w-[50px] h-[50px]"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleImageRemove(
                                                                index,
                                                                'web',
                                                            )
                                                        }
                                                        className="text-red-600 font-bold"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No image</p>
                                        )}
                                    </div>
                                    <FormItem label="" className="mt-4">
                                        <Field name="image_web_array">
                                            {({ form }: FieldProps<any>) => (
                                                <Upload
                                                    multiple
                                                    beforeUpload={beforeUpload}
                                                    fileList={
                                                        values.image_web_array
                                                    }
                                                    onChange={(files) =>
                                                        form.setFieldValue(
                                                            'image_web_array',
                                                            files,
                                                        )
                                                    }
                                                    onFileRemove={(files) =>
                                                        form.setFieldValue(
                                                            'image_web_array',
                                                            files,
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </FormContainer>
                            {/* ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, */}

                            <div>Section BG Web</div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex flex-col items-center justify-center rounded-xl mb-4">
                                <div className="mt-5">
                                    <div className="flex gap-2">
                                        {sectionBGweb &&
                                        sectionBGweb.length > 0 ? (
                                            sectionBGweb.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`image-${index}`}
                                                        className="rounded-sm w-[50px] h-[50px]"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleImageRemove(
                                                                index,
                                                                'SecWeb',
                                                            )
                                                        }
                                                        className="text-red-600 font-bold"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No image</p>
                                        )}
                                    </div>
                                    <FormItem label="" className="mt-4">
                                        <Field name="section_background_web_array">
                                            {({ form }: FieldProps<any>) => (
                                                <Upload
                                                    multiple
                                                    beforeUpload={beforeUpload}
                                                    fileList={
                                                        values.section_background_web_array
                                                    }
                                                    onChange={(files) =>
                                                        form.setFieldValue(
                                                            'section_background_web_array',
                                                            files,
                                                        )
                                                    }
                                                    onFileRemove={(files) =>
                                                        form.setFieldValue(
                                                            'section_background_web_array',
                                                            files,
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </FormContainer>

                            {/* MOBILE................................... */}

                            <div>Section BG Mobile</div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex flex-col items-center justify-center rounded-xl mb-4">
                                <div className="mt-5">
                                    <div className="flex gap-2">
                                        {sectionBGmobile &&
                                        sectionBGmobile.length > 0 ? (
                                            sectionBGmobile.map(
                                                (img, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-col"
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`image-${index}`}
                                                            className="rounded-sm w-[50px] h-[50px]"
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                handleImageRemove(
                                                                    index,
                                                                    'SecMob',
                                                                )
                                                            }
                                                            className="text-red-600 font-bold"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <p>No image</p>
                                        )}
                                    </div>
                                    <FormItem label="" className="mt-4">
                                        <Field name="section_background_mobile_array">
                                            {({ form }: FieldProps<any>) => (
                                                <Upload
                                                    multiple
                                                    beforeUpload={beforeUpload}
                                                    fileList={
                                                        values.section_background_mobile_array
                                                    }
                                                    onChange={(files) =>
                                                        form.setFieldValue(
                                                            'section_background_mobile_array',
                                                            files,
                                                        )
                                                    }
                                                    onFileRemove={(files) =>
                                                        form.setFieldValue(
                                                            'section_background_mobile_array',
                                                            files,
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </FormContainer>

                            {/* ...................................................................... */}
                            <FormContainer className="grid grid-cols-2 gap-10">
                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="division"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="division">
                                            {({ field }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        options={
                                                            divisions.divisions
                                                        }
                                                        getOptionLabel={(
                                                            option,
                                                        ) => option.name}
                                                        getOptionValue={(
                                                            option,
                                                        ) =>
                                                            option.id.toString()
                                                        }
                                                        onChange={(
                                                            newVal,
                                                            actionMeta,
                                                        ) => {
                                                            console.log(
                                                                newVal,
                                                                actionMeta,
                                                            )
                                                            setFieldValue(
                                                                'division',
                                                                newVal
                                                                    ?.map(
                                                                        (val) =>
                                                                            val.name,
                                                                    )
                                                                    .join(','),
                                                            )
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                {/* CATEGORY...................................... */}
                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="Category"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="category">
                                            {({ field }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        options={
                                                            category.categories
                                                        }
                                                        getOptionLabel={(
                                                            option,
                                                        ) => option.name}
                                                        getOptionValue={(
                                                            option,
                                                        ) =>
                                                            option.id.toString()
                                                        }
                                                        onChange={(
                                                            newVal,
                                                            actionMeta,
                                                        ) => {
                                                            console.log(
                                                                newVal,
                                                                actionMeta,
                                                            )
                                                            setFieldValue(
                                                                'category',
                                                                newVal
                                                                    ?.map(
                                                                        (val) =>
                                                                            val.name,
                                                                    )
                                                                    .join(','),
                                                            )
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                {/* SUB CATEGORY................................................. */}

                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="sub_category"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="sub_category">
                                            {({ field }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        options={
                                                            subCategory.subcategories
                                                        }
                                                        getOptionLabel={(
                                                            option,
                                                        ) => option.name}
                                                        getOptionValue={(
                                                            option,
                                                        ) =>
                                                            option.id.toString()
                                                        }
                                                        onChange={(
                                                            newVal,
                                                            actionMeta,
                                                        ) => {
                                                            console.log(
                                                                newVal,
                                                                actionMeta,
                                                            )
                                                            setFieldValue(
                                                                'sub_category',
                                                                newVal
                                                                    ?.map(
                                                                        (val) =>
                                                                            val.name,
                                                                    )
                                                                    .join(','),
                                                            )
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="product_type"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="product_type">
                                            {({ field }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        options={
                                                            product_type.product_types
                                                        }
                                                        getOptionLabel={(
                                                            option,
                                                        ) => option.name}
                                                        getOptionValue={(
                                                            option,
                                                        ) =>
                                                            option.id.toString()
                                                        }
                                                        onChange={(
                                                            newVal,
                                                            actionMeta,
                                                        ) => {
                                                            console.log(
                                                                newVal,
                                                                actionMeta,
                                                            )
                                                            setFieldValue(
                                                                'product_type',
                                                                newVal
                                                                    ?.map(
                                                                        (val) =>
                                                                            val.name,
                                                                    )
                                                                    .join(','),
                                                            )
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                {/* BRAND   */}

                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="BRAND"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="brand">
                                            {({ field }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        options={brands.brands}
                                                        getOptionLabel={(
                                                            option,
                                                        ) => option.name}
                                                        getOptionValue={(
                                                            option,
                                                        ) =>
                                                            option.id.toString()
                                                        }
                                                        onChange={(
                                                            newVal,
                                                            actionMeta,
                                                        ) => {
                                                            console.log(
                                                                newVal,
                                                                actionMeta,
                                                            )
                                                            setFieldValue(
                                                                'brand',
                                                                newVal
                                                                    ?.map(
                                                                        (val) =>
                                                                            val.name,
                                                                    )
                                                                    .join(','),
                                                            )
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                {/* Tags */}

                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="Filter Tags"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="tags">
                                            {({ field }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Select Filter Tags"
                                                        options={
                                                            filters.filters
                                                        }
                                                        // value={transformArray(
                                                        //     initialValue.tags,
                                                        // )}
                                                        // defaultOptions={transformArray(
                                                        //     initialValue.tags,
                                                        // )}
                                                getOptionLabel={(
                                                            option,
                                                        ) => option.label}
                                                        getOptionValue={(
                                                            option,
                                                        ) => option.value}
                                                        onChange={(
                                                            newVal,
                                                            actionMeta,
                                                        ) => {
                                                            console.log(
                                                                'OKKKK',
                                                                newVal,
                                                                actionMeta,
                                                            )
                                                            setFieldValue(
                                                                'tags',
                                                                newVal?.map(
                                                                    (val) =>
                                                                        val.value,
                                                                ),
                                                            )
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
