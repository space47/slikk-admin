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
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import Upload from '@/components/ui/Upload'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'

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
        (state) => state.subCategory
    )
    const product_type = useAppSelector<PRODUCTTYPE_STATE>(
        (state) => state.product_type
    )
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)

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
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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

    const categoryOptions = category.categories.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const divisionOptions = divisions.divisions.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const subcategoryOptions = subCategory.subcategories.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const productTypeOptions = product_type.product_types.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const brandOptions = brands.brands.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const { id } = useParams()

    const fetchsellerData = async () => {
        try {
            const response = await axioisInstance.get(`banners?banner_id=${id}`)
            const data = response.data.data
            setBannerData(data)
            setMobileImageView(data.image_mobile ? [data.image_mobile] : [])
            setWebImageView(data.image_web ? [data.image_web] : [])
            setSectionBGweb(
                data.section_background_web ? [data.section_background_web] : []
            )
            setSectionBGmobile(
                data.section_background_mobile
                    ? [data.section_background_mobile]
                    : []
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
        from_date: moment(bannerData?.from_date).format('MM/DD/YYYY') || '',
        to_date: moment(bannerData?.to_date).format('MM/DD/YYYY') || '',
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
        redirection_url: bannerData?.redirection_url || null
    }

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
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response)
            const newData = response.data.url

            console.log(newData)
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Image uploaded successfully'
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
                values.section_background_mobile_array
            )
        }
        if (values.section_background_web_array.length > 0) {
            sectiioBgWebUpload = await handleimage(
                values.section_background_web_array
            )
        }

        const formData = {
            ...values,
            banner_id: values.id,
            image_web: webImageUpload,
            image_mobile: mobileImageUpload,
            section_background_web: sectiioBgWebUpload,
            section_background_mobile: sectionBgMobileUpload,
            image_web_array: null,
            image_mobile_array: null,
            division: values.division.map((item) => item.name).join(','),
            category: values.category.map((item) => item.name).join(','),
            sub_category: values.sub_category
                .map((item) => item.name)
                .join(','),
            product_type: values.product_type
                .map((item) => item.name)
                .join(','),
            brand: values.brand.map((item) => item.name).join(',')
        }

        try {
            const response = await axioisInstance.patch(`banners`, formData)

            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Banner Edited Successfully'
            })

            // navigate('/app/appSettings/banners')
        } catch (error: any) {
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'Banner not Edited'
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
                            {/* <FormItem
                                asterisk
                                label="From Date"
                                className="col-span-1 w-1/2"
                            >
                                <Field name="from_date" placeholder="Date">
                                    {({ field, form }: FieldProps<any>) => (
                                        <DatePicker
                                            field={field}
                                            form={form}
                                            value={field.value}
                                            onChange={(date) => {
                                                console.log(field.name)
                                                form.setFieldValue(
                                                    field.name,
                                                    date
                                                )
                                            }}
                                             
                                        />
                                    )}
                                </Field>
                            </FormItem> */}

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
                                                                'mobile'
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
                                                            files
                                                        )
                                                    }
                                                    onFileRemove={(files) =>
                                                        form.setFieldValue(
                                                            'image_mobile_array',
                                                            files
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
                                                                'web'
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
                                                            files
                                                        )
                                                    }
                                                    onFileRemove={(files) =>
                                                        form.setFieldValue(
                                                            'image_web_array',
                                                            files
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
                                                                'SecWeb'
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
                                                            files
                                                        )
                                                    }
                                                    onFileRemove={(files) =>
                                                        form.setFieldValue(
                                                            'section_background_web_array',
                                                            files
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
                                                                    'SecMob'
                                                                )
                                                            }
                                                            className="text-red-600 font-bold"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                )
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
                                                            files
                                                        )
                                                    }
                                                    onFileRemove={(files) =>
                                                        form.setFieldValue(
                                                            'section_background_mobile_array',
                                                            files
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
                                        label="Category Name"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="category">
                                            {({
                                                field,
                                                form
                                            }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Select Category"
                                                        options={
                                                            categoryOptions
                                                        }
                                                        value={field.value.map(
                                                            (value: any) =>
                                                                categoryOptions.find(
                                                                    (option) =>
                                                                        option.value ===
                                                                        value.id
                                                                )
                                                        )}
                                                        onChange={(
                                                            selected
                                                        ) => {
                                                            console.log(
                                                                'Selected',
                                                                selected
                                                            )
                                                            setFieldValue(
                                                                field.name,
                                                                selected.map(
                                                                    (
                                                                        option: any
                                                                    ) => ({
                                                                        id: option.value,
                                                                        name: option.label
                                                                    })
                                                                )
                                                            )
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                {/* Division */}

                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="Division Name"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="division">
                                            {({
                                                field,
                                                form
                                            }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Select Division"
                                                        options={
                                                            divisionOptions
                                                        }
                                                        value={field.value.map(
                                                            (value: any) =>
                                                                divisionOptions.find(
                                                                    (option) =>
                                                                        option.value ===
                                                                        value.id
                                                                )
                                                        )}
                                                        onChange={(selected) =>
                                                            setFieldValue(
                                                                field.name,
                                                                selected.map(
                                                                    (
                                                                        option: any
                                                                    ) => ({
                                                                        id: option.value,
                                                                        name: option.label
                                                                    })
                                                                )
                                                            )
                                                        }
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                {/* Subcategory */}

                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="Sub Category Name"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="sub_category">
                                            {({
                                                field,
                                                form
                                            }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Select Subcategory"
                                                        options={
                                                            subcategoryOptions
                                                        }
                                                        value={field.value.map(
                                                            (value: any) =>
                                                                subcategoryOptions.find(
                                                                    (option) =>
                                                                        option.value ===
                                                                        value.id
                                                                )
                                                        )}
                                                        onChange={(selected) =>
                                                            setFieldValue(
                                                                field.name,
                                                                selected.map(
                                                                    (
                                                                        option: any
                                                                    ) => ({
                                                                        id: option.value,
                                                                        name: option.label
                                                                    })
                                                                )
                                                            )
                                                        }
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                {/* Product Type */}

                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="Product Type"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="product_type">
                                            {({
                                                field,
                                                form
                                            }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Select Product Type"
                                                        options={
                                                            productTypeOptions
                                                        }
                                                        value={field.value.map(
                                                            (value: any) =>
                                                                productTypeOptions.find(
                                                                    (option) =>
                                                                        option.value ===
                                                                        value.id
                                                                )
                                                        )}
                                                        onChange={(selected) =>
                                                            setFieldValue(
                                                                field.name,
                                                                selected.map(
                                                                    (
                                                                        option: any
                                                                    ) => ({
                                                                        id: option.value,
                                                                        name: option.label
                                                                    })
                                                                )
                                                            )
                                                        }
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

                                {/* Brand */}

                                <FormContainer>
                                    <FormItem
                                        asterisk
                                        label="Brand"
                                        className="col-span-1 w-full"
                                    >
                                        <Field name="brand">
                                            {({
                                                field,
                                                form
                                            }: FieldProps<any>) => {
                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Select Brand"
                                                        options={brandOptions}
                                                        value={field.value.map(
                                                            (value: any) =>
                                                                brandOptions.find(
                                                                    (option) =>
                                                                        option.value ===
                                                                        value.id
                                                                )
                                                        )}
                                                        onChange={(selected) =>
                                                            setFieldValue(
                                                                field.name,
                                                                selected.map(
                                                                    (
                                                                        option: any
                                                                    ) => ({
                                                                        id: option.value,
                                                                        name: option.label
                                                                    })
                                                                )
                                                            )
                                                        }
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
