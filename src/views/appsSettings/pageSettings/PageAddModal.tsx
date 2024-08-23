/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Modal, notification } from 'antd'
import { Field, Form, Formik } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Dropdown, Button } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { COMPONENT_CATEGORY_TYPES, BANNER_UPLOAD_DATA } from '@/common/banner'
import Select from '@/components/ui/Select'
import CreatePostTable from '@/views/creatorPost/uploadPost/createPost/CreatePostTable'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { FILTER_STATE } from '@/store/types/filters.types'

interface DataType {
    type: string
    filters: any[]
    barcodes: string
    posts: string
    brands: string
    handles: string
}

interface Config {
    icon: string
    text: string
    image: string
    style: string
    position: string
}

type ProductTable = {
    sku: string
    barcode: string
    product: string
    image: string[]
    brand: string
}

type WebType = {
    data_type: DataType
    footer_config: Config
    header_config: Config
    component_type: string
    section_heading: string
    background_image: string
    sub_header_config: Config
    mobile_background_array: File[]
    background_image_array: File[]
    footer_config_icon_Array: File[] //.........
    footer_config_image_Array: File[]
    header_config_icon_Array: File[]
    header_config_image_Array: File[]
    sub_header_config_icon_Array: File[]
    sub_header_config_image_Array: File[]
    is_section_clickable: boolean
    section_filters: string
}

type modalProps = {
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void
    handleOk: () => void
    handleCancel: () => void
    formikRef: React.RefObject<any>
    data: any
    setData: (data: any) => void
}

const DROPDOWNARRAY = [
    { label: 'Name', value: 'name' },
    { label: 'SKU', value: 'sku' }
]

const dataType = [
    { name: 'Barcodes', value: 'barcodes' },
    { name: 'Brands', value: 'brands' },
    { name: 'Handles', value: 'handles' },
    { name: 'Posts', value: 'posts' }
]

const PageAddModal: React.FC<modalProps> = ({
    isModalOpen,
    setIsModalOpen,
    handleOk,
    handleCancel,
    formikRef,
    data,
    setData
}) => {
    const [currentSelectedPage, setCurrentSelectedPage] =
        useState<Record<string, string>>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [showTable, setShowTable] = useState(false)
    const [tableData, setTableData] = useState<ProductTable[]>([])
    const [productData, setProductData] = useState<string[]>([])
    const [textAreaValue, setTextAreaValue] = useState()
    const MAX_UPLOAD = 10000
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>(
        (state) => state.subCategory
    )
    const product_type = useAppSelector<PRODUCTTYPE_STATE>(
        (state) => state.product_type
    )
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

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

    const filterOptions = filters.filters.map((item) => ({
        label: item.name,
        value: item.id
    }))

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

    const [initialValue, setInitalValue] = useState<any>({
        data_type: {
            type: '',
            filters: [],
            barcodes: '',
            posts: '',
            brands: '',
            handles: ''
        },
        footer_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: ''
        },
        header_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: ''
        },
        component_type: '',
        section_heading: '',
        background_image: '',
        sub_header_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: ''
        },
        background_image_array: [],
        footer_config_icon_Array: [],
        footer_config_image_Array: [],
        header_config_icon_Array: [],
        header_config_image_Array: [],
        sub_header_config_icon_Array: [],
        sub_header_config_image_Array: [],
        is_section_clickable: false,
        section_filters: ''
    })
    const [selectedType, setSelectedType] = useState('')

    const [inputValue, setInputValue] = useState('')

    // const handleSelectdrop = (key: string) => {
    //     console.log('ddddddddddd', key)
    //     setSelectedType(key)
    // }

    // const handleInputDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setInputValue(e.target.value)
    // }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        setShowTable(true)
    }

    const handleMultiSelect = (field: string, value: string) => {
        if (formikRef.current) {
            formikRef.current.setFieldValue(field, value)
        }
    }

    const fetchInput = async () => {
        try {
            if (searchInput) {
                const qname = currentSelectedPage?.value === 'sku' ? 'sku' : 'q'
                const response = await axioisInstance.get(
                    `/search/product?dashboard=true&${qname}=${searchInput}`
                )
                const data = response.data.results
                setTableData(data)
                console.log(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchInput()
    }, [searchInput])

    const handleActionClick = (value: any) => {
        console.log('Barcode', value)
        setProductData((prev) => (prev ? [...prev, value] : [value]))
        setShowTable(false)
        setSearchInput('')
    }

    const handleimage = async (files: File[]) => {
        if (!files || files?.length == 0) {
            return
        }

        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')
        try {
            return await axioisInstance
                .post('fileupload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((response) => {
                    console.log(response)
                    const newData = response.data.url
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Image uploaded successfully'
                    })
                    return newData
                })
                .catch((error) => {
                    console.error(error)
                    notification.error({
                        message: 'Upload Failed',
                        description:
                            error?.response?.data?.message ||
                            'Image upload failed'
                    })
                    return ''
                })
        } catch (error: any) {
            console.error('Error uploading files:', error)
            return ''
        }
    }

    const handleSelect = (value: any) => {
        const selected = DROPDOWNARRAY.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const handleSubmit = async (row: any) => {
        console.log(row)

        console.log('proddduct', productData)
        console.log('joined', productData.join(','))
        const imageUpload = await handleimage(row.background_image_array)

        const mobileImageUpload = await handleimage(row.mobile_background_array)

        const footerImageUpload = await handleimage(
            row.footer_config_image_Array
        )

        const headerImageUpload = await handleimage(
            row.header_config_image_Array
        )

        const subHeaderImageUpload = await handleimage(
            row.sub_header_config_image_Array
        )

        const sectionFilter = `${row.division},${row.category},${row.subcategory},${row.product_type},${row.brand},${row.filters}`
        console.log('object,', sectionFilter)

        const newRowAdd = {
            ...row,
            background_image: imageUpload,
            mobile_background_image: mobileImageUpload,
            footer_config: {
                ...row.footer_config,
                image:
                    row.footer_config_image_Array.length > 0
                        ? footerImageUpload
                        : ''
            },
            header_config: {
                ...row.header_config,
                image:
                    row.header_config_image_Array.length > 0
                        ? headerImageUpload
                        : ''
            },
            sub_header_config: {
                ...row.sub_header_config,
                image:
                    row.sub_header_config_image_Array.length > 0
                        ? subHeaderImageUpload
                        : ''
            },
            data_type: {
                ...row.data_type,
                barcodes: productData.join(',')
            },
            section_filter: sectionFilter.split(','),
            section_heading: row.section_heading.split(',')
        }

        setData((prevData: WebType[]) => [...prevData, newRowAdd])
        setSelectedType('')
        setInitalValue('')

        setIsModalOpen(false)
    }

    console.log('---------------')

    return (
        <>
            <Modal
                title="ADD PAGE SECTION"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1500}
                okText="Edit"
            >
                <Formik
                    enableReinitialize
                    initialValues={initialValue}
                    innerRef={formikRef}
                    // validationSchema={validationSchema}
                    // ONSUBMIT LOGICCCCCCC....................................................................................................
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        touched,
                        errors,
                        resetForm,
                        setFieldValue
                    }) => (
                        <Form className="w-full">
                            <FormContainer className="grid grid-cols-2 gap-3">
                                <FormItem
                                    asterisk
                                    label="Section Header"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="section_heading"
                                        placeholder="Place your Section heading"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Component Types"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field name="component_type">
                                        {({ field, form }: FieldProps<any>) => {
                                            const componentOptions =
                                                COMPONENT_CATEGORY_TYPES

                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={componentOptions}
                                                    value={componentOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value
                                                    )}
                                                    onChange={(option) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            option?.value
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        e.key === 'Enter' &&
                                                        e.preventDefault()
                                                    }
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>

                                {/* image */}
                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    <div className="font-semibold mb-1">
                                        Background Image
                                    </div>

                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="background_image_array">
                                                {({
                                                    field,
                                                    form
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.background_image_array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.background_image_array
                                                                )
                                                                form.setFieldValue(
                                                                    'background_image_array',
                                                                    files
                                                                )
                                                            }}
                                                            className="items-center flex justify-center"
                                                            onFileRemove={(
                                                                files
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'background_image_array',
                                                                    files
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    <div className="font-semibold mb-1 text-md">
                                        Mobile Background Image
                                    </div>

                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="mobile_background_array">
                                                {({
                                                    field,
                                                    form
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.mobile_background_array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.mobile_background_array
                                                                )
                                                                form.setFieldValue(
                                                                    'mobile_background_array',
                                                                    files
                                                                )
                                                            }}
                                                            className="flex justify-center"
                                                            onFileRemove={(
                                                                files
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'mobile_background_array',
                                                                    files
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>

                                {/* ............Header Config................................................. */}

                                <FormItem
                                    asterisk
                                    label="Header Style"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="header_config.style"
                                        placeholder="Place your header Style"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Header Text"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="header_config.text"
                                        placeholder="Place your header Text"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* .................................................................... */}
                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    <div className="font-semibold mb-1">
                                        Header Image
                                    </div>

                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="header_config_image_Array">
                                                {({
                                                    field,
                                                    form
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.header_config_image_Array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.header_config_image_Array
                                                                )
                                                                form.setFieldValue(
                                                                    'header_config_image_Array',
                                                                    files
                                                                )
                                                            }}
                                                            className="flex justify-center"
                                                            onFileRemove={(
                                                                files
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'header_config_image_Array',
                                                                    files
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>
                                <FormItem
                                    asterisk
                                    label="Header Position"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="header_config.position"
                                        placeholder="Place your header Position"
                                        component={Input}
                                    />
                                </FormItem>
                                {/* ................................................................................ */}
                                {/* .......sub_header....................... */}
                                <FormItem
                                    asterisk
                                    label="Sub Header Style"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="sub_header_config.style"
                                        placeholder="Place your header Style"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Sub Header Text"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="sub_header_config.text"
                                        placeholder="Place your header Text"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    <div className="font-semibold mb-1">
                                        Sub Header Image
                                    </div>

                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="sub_header_config_image_Array">
                                                {({
                                                    field,
                                                    form
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.sub_header_config_image_Array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.sub_header_config_image_Array
                                                                )
                                                                form.setFieldValue(
                                                                    'sub_header_config_image_Array',
                                                                    files
                                                                )
                                                            }}
                                                            className="flex justify-center"
                                                            onFileRemove={(
                                                                files
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'sub_header_config_image_Array',
                                                                    files
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>
                                <FormItem
                                    asterisk
                                    label="Sub Header Position"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="sub_header_config.position"
                                        placeholder="Place your header Position"
                                        component={Input}
                                    />
                                </FormItem>
                                {/* ........................................................ */}

                                {/* ............Footer COnfig>>>>>>>>>>>>>>>>>>>>>> */}

                                <FormItem
                                    asterisk
                                    label="Footer Style"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="footer_config.style"
                                        placeholder="Place your header Style"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Footer Text"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="footer_config.text"
                                        placeholder="Place your header Text"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    <div className="font-semibold mb-1">
                                        Footer Image
                                    </div>

                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="footer_config_image_Array">
                                                {({
                                                    field,
                                                    form
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.footer_config_image_Array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.footer_config_image_Array
                                                                )
                                                                form.setFieldValue(
                                                                    'footer_config_image_Array',
                                                                    files
                                                                )
                                                            }}
                                                            className="flex justify-center"
                                                            onFileRemove={(
                                                                files
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'footer_config_image_Array',
                                                                    files
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>
                                <FormItem
                                    asterisk
                                    label="Footer Position"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="footer_config.position"
                                        placeholder="Place your header Position"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* ..................................................... */}

                                {/* Data Types.......................................... */}

                                <FormItem
                                    asterisk
                                    label="Data Type"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.type"
                                        placeholder="Place your header Style"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Filters"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.filters"
                                        placeholder="Place your header Text"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Data Type Key"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.type"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormContainer className="flex flex-col gap-4 ">
                                    <div className="text-xl">Barcode</div>
                                    <div className="flex gap-10">
                                        <div className="flex justify-start ">
                                            <input
                                                type="search"
                                                name="search"
                                                id=""
                                                placeholder="search SKU for product"
                                                value={searchInput}
                                                className=" w-[250px] rounded-[10px]"
                                                onChange={handleSearch}
                                            />
                                        </div>
                                        <div className="bg-gray-200 rounded-[10px] font-bold text-lg ">
                                            <Dropdown
                                                className=" text-xl text-black bg-gray-200 font-bold "
                                                title={
                                                    currentSelectedPage?.value
                                                        ? currentSelectedPage.label
                                                        : 'SELECT'
                                                }
                                                onSelect={handleSelect}
                                            >
                                                {DROPDOWNARRAY?.map(
                                                    (item, key) => {
                                                        return (
                                                            <DropdownItem
                                                                key={key}
                                                                eventKey={
                                                                    item.value
                                                                }
                                                            >
                                                                <span>
                                                                    {item.label}
                                                                </span>
                                                            </DropdownItem>
                                                        )
                                                    }
                                                )}
                                            </Dropdown>
                                        </div>
                                    </div>

                                    {showTable && searchInput && (
                                        <CreatePostTable
                                            data={tableData}
                                            handleActionClick={
                                                handleActionClick
                                            }
                                        />
                                    )}

                                    <FormItem
                                        label="Barcodes"
                                        className="w-full"
                                    >
                                        <Field
                                            type="text"
                                            name="data_type.barcodes"
                                            value={productData}
                                            onChange={(e: any) => {
                                                setProductData(e.target.value)
                                                setFieldValue(
                                                    'products',
                                                    e.target.value
                                                )
                                            }}
                                            placeholder="Enter product barcode"
                                        />
                                    </FormItem>
                                </FormContainer>
                                {/* <FormItem
                                    label="Data Type Barcode"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.barcodes"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem> */}
                                <FormItem
                                    label="Data Type Posts"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.posts"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Data Type Brands"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.brands"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Data Type Handles"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.handles"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Is Section Clickable"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        name="is_section_clickable"
                                        component={Checkbox}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Section Filter"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="section_filter"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormContainer className="grid grid-cols-2 gap-4 w-3/4">
                                    <FormItem label="Division">
                                        <Select
                                            isMulti
                                            name="division"
                                            options={divisionOptions}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            getOptionValue={(option) =>
                                                option.value.toString()
                                            }
                                            onChange={(newVal, actionMeta) => {
                                                console.log(newVal, actionMeta)
                                                handleMultiSelect(
                                                    'division',
                                                    newVal
                                                        ?.map(
                                                            (val) => val.label
                                                        )
                                                        ?.join(',')
                                                )
                                            }}
                                        />
                                    </FormItem>

                                    {/* Category */}
                                    <FormItem label="Category">
                                        <Select
                                            isMulti
                                            name="category"
                                            options={categoryOptions}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            getOptionValue={(option) =>
                                                option.value.toString()
                                            }
                                            onChange={(newVal, actionMeta) => {
                                                console.log(newVal, actionMeta)
                                                handleMultiSelect(
                                                    'category',
                                                    newVal
                                                        ?.map(
                                                            (val) => val.label
                                                        )
                                                        ?.join(',')
                                                )
                                            }}
                                        />
                                    </FormItem>

                                    {/* Subcategory */}
                                    <FormItem label="Subcategory">
                                        <Select
                                            isMulti
                                            name="subcategory"
                                            options={subcategoryOptions}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            getOptionValue={(option) =>
                                                option.value.toString()
                                            }
                                            onChange={(newVal, actionMeta) => {
                                                console.log(newVal, actionMeta)
                                                handleMultiSelect(
                                                    'subcategory',
                                                    newVal
                                                        ?.map(
                                                            (val) => val.label
                                                        )
                                                        ?.join(',')
                                                )
                                            }}
                                        />
                                    </FormItem>

                                    {/* Product Type */}
                                    <FormItem label="Product Type">
                                        <Select
                                            isMulti
                                            name="product_type"
                                            options={productTypeOptions}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            getOptionValue={(option) =>
                                                option.value.toString()
                                            }
                                            onChange={(newVal, actionMeta) => {
                                                console.log(newVal, actionMeta)
                                                handleMultiSelect(
                                                    'product_type',
                                                    newVal
                                                        ?.map(
                                                            (val) => val.label
                                                        )
                                                        ?.join(',')
                                                )
                                            }}
                                        />
                                    </FormItem>

                                    {/* Brand */}
                                    <FormItem label="Brand">
                                        <Select
                                            isMulti
                                            name="brand"
                                            options={brandOptions}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            getOptionValue={(option) =>
                                                option.value.toString()
                                            }
                                            onChange={(newVal, actionMeta) => {
                                                console.log(newVal, actionMeta)
                                                handleMultiSelect(
                                                    'brand',
                                                    newVal
                                                        ?.map(
                                                            (val) => val.label
                                                        )
                                                        ?.join(',')
                                                )
                                            }}
                                        />
                                    </FormItem>

                                    {/* Filters */}
                                    <FormItem label="Filters">
                                        <Select
                                            isMulti
                                            name="filters"
                                            options={filterOptions}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            getOptionValue={(option) =>
                                                option.value.toString()
                                            }
                                            onChange={(newVal, actionMeta) => {
                                                console.log(newVal, actionMeta)
                                                handleMultiSelect(
                                                    'filters',
                                                    newVal
                                                        ?.map(
                                                            (val) => val.label
                                                        )
                                                        ?.join(',')
                                                )
                                            }}
                                        />
                                    </FormItem>
                                </FormContainer>

                                {/* ..................................................... */}
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    )
}

export default PageAddModal
