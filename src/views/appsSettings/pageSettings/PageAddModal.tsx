/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { COMPONENT_CATEGORY_TYPES } from '@/common/banner'
import Select from '@/components/ui/Select'
import CreatePostTable from '@/views/creatorPost/uploadPost/createPost/CreatePostTable'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import {
    ALIGNVALUES,
    BackGroundArray,
    borrderStyleArray,
    genericComponentArray,
    NAMEPOSITION,
    sectionBorrderStyleArray,
    webBorrderStyleArray,
} from './genericComp'
import PageAddCommonImage from './PageAddCommonImage'
import { MdCancel } from 'react-icons/md'
import PageSettingsPostTable from './PageSettingsPostTable'
import CommonSelect from './CommonSelect'
import { DATATYPEVALUES, FOOTERCONFIGARRAY, HEADERCONFIGARRAY, SUBHEADERCONFIGARRAY } from './configurationCommon'
import TagsEdit from './TagsEdit'

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
    headerIcon_image_array: File[]
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
    { label: 'SKU', value: 'sku' },
]

const dataType = [
    { name: 'Barcodes', value: 'barcodes' },
    { name: 'Brands', value: 'brands' },
    { name: 'Handles', value: 'handles' },
    { name: 'Posts', value: 'posts' },
]

const PageAddModal: React.FC<modalProps> = ({ isModalOpen, setIsModalOpen, handleOk, handleCancel, formikRef, data, setData }) => {
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [showTable, setShowTable] = useState(false)
    const [tableData, setTableData] = useState<ProductTable[]>([])
    const [productData, setProductData] = useState<string[]>([])

    const [postInput, setPOstInput] = useState('')
    const [showPostTable, setShowPostTable] = useState(false)
    const [postTableData, setPostTableData] = useState([])
    const [postData, setPostData] = useState<string[]>([])
    const [webBorderForm, setWebBorderForm] = useState<boolean>()
    const [textAreaValue, setTextAreaValue] = useState('')
    const MAX_UPLOAD = 10000
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [nameForm, setNameForm] = useState<boolean>()
    const [webNameForm, setWebNameForm] = useState<boolean>()
    const [footerAlignForm, setFooterAlignForm] = useState<boolean>()
    const [webFooterAlignForm, setWebFooterAlignForm] = useState<boolean>()
    const [sectionBorderShow, setSectioBorderShow] = useState('')
    const [webSectionBorderShow, setWebSectioBorderShow] = useState('')
    const [componentOption, setComponentOptions] = useState('')

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

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

    const [initialValue, setInitalValue] = useState<any>({
        data_type: {
            type: '',
            filters: [],
            barcodes: '',
            posts: '',
            brands: '',
            handles: '',
        },
        footer_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: '',
        },
        header_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: '',
        },
        component_type: '',
        section_heading: '',
        background_image: '',
        sub_header_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: '',
        },
        background_image_array: [],
        footer_config_icon_Array: [],
        footer_config_image_Array: [],
        header_config_icon_Array: [],
        header_config_image_Array: [],
        sub_header_config_icon_Array: [],
        sub_header_config_image_Array: [],
        headerIcon_image_array: [],
        is_section_clickable: false,
        section_filters: '',
    })
    const [selectedType, setSelectedType] = useState('')

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        setShowTable(true)
    }

    const fetchInput = async () => {
        try {
            if (searchInput) {
                const qname = currentSelectedPage?.value === 'sku' ? 'sku' : 'name'
                const response = await axioisInstance.get(`/search/product?dashboard=true&${qname}=${searchInput}`)
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

    const fetchPost = async () => {
        try {
            if (postInput) {
                // const qname = currentSelectedPage?.value === 'sku' ? 'sku' : 'name'
                const response = await axioisInstance.get(`/posts?name=${postInput}`)
                const data = response.data.data.results
                setPostTableData(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [postInput])

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
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    console.log(response)
                    const newData = response.data.url
                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Image uploaded successfully',
                    })
                    return newData
                })
                .catch((error) => {
                    console.error(error)
                    notification.error({
                        message: 'Upload Failed',
                        description: error?.response?.data?.message || 'Image upload failed',
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
    const dataTypeArray = [
        { label: 'banner', value: 'banner' },
        { label: 'wishlist', value: 'wishlist' },
        { label: 'purchases', value: 'purchases' },
        { label: 'searches', value: 'searches' },
        { label: 'spotlight', value: 'spotlight' },
        { label: 'products', value: 'products' },
        { label: 'brands', value: 'brands' },
        { label: 'post', value: 'post' },
        { label: 'creator', value: 'creator' },
    ]

    const SECTIONARRAY = [
        { label: 'Flex Start', value: 'flex-start' },
        { label: 'Flex End', value: 'flex-end' },
        { label: 'Center', value: 'center' },
        { label: 'Space Between', value: 'space-between' },
        { label: 'Space Around', value: 'space-around' },
        { label: 'Space Evenly', value: 'space-evenly' },
    ]

    const handleSubmit = async (row: any) => {
        console.log('satrt')
        const imageUpload = await handleimage(row.background_image_array)

        const mobileImageUpload = await handleimage(row.mobile_background_array)

        const footerImageUpload = await handleimage(row.footer_config_image_Array)

        const headerImageUpload = await handleimage(row.header_config_image_Array)

        const subHeaderImageUpload = await handleimage(row.sub_header_config_image_Array)

        const headerIconImageUpload = await handleimage(row.header_config_icon_Array)

        console.log('headerIconImage')

        const newRowAdd = {
            ...row,
            background_image: imageUpload || null,
            mobile_background_image: mobileImageUpload || null,
            footer_config: {
                ...row.footer_config,
                image: row.footer_config_image_Array?.length > 0 ? footerImageUpload : '',
            },
            header_config: {
                ...row.header_config,
                icon: row.header_config_icon_Array?.length > 0 ? headerIconImageUpload : '',
                image: row.header_config_image_Array?.length > 0 ? headerImageUpload : '',
            },
            sub_header_config: {
                ...row.sub_header_config,
                image: row.sub_header_config_image_Array?.length > 0 ? subHeaderImageUpload : '',
            },
            data_type: {
                ...row.data_type,
                posts: Array.isArray(postData) ? postData.join(',') : row.data_type?.posts || '',
                barcodes: Array.isArray(productData) ? productData.join(',') : row.data_type?.barcodes || '',
            },
            background_config: {
                background_color: row.background_config?.background_color || '',
                desktop_position: row.background_config?.desktop_position || '',
                mobile_position: row.background_config?.mobile_position || '',
                background_topMargin: Number(row.background_config?.background_topMargin) || 0,
                background_bottomMargin: Number(row.background_config?.background_bottomMargin) || 0,
                mobile_width: Number(row.background_config?.mobile_width) || 0,
                web_width: Number(row.background_config?.web_width) || 0,
                background_image: imageUpload || null,
                mobile_background_image: mobileImageUpload || null,
            },
            component_config: {
                ...row.component_config,
            },
            section_filters: row.data_type?.filters || '',
        }

        console.log('End of row')

        setData((prevData: WebType[]) => [...prevData, newRowAdd])
        setSelectedType('')
        setInitalValue('')

        console.log('Main Data That is to be send in the API', newRowAdd)
        console.log('The row which is set', row)
        setIsModalOpen(false)
    }
    console.log('compo', componentOption)

    const [borderForm, setBorderForm] = useState('')

    const borderStyleArray = [
        { label: 'Dotted', value: 'dotted' },
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
    ]

    const FontSizeArray = [
        { label: 'Bold', value: 'bold' },
        { label: 'Regular', value: 'regular' },
        { label: 'Underline', value: 'underline' },
        { label: 'Italic', value: 'italic' },
    ]

    const handlePOSTSearch = (e) => {
        setPOstInput(e.target.value)
        setShowPostTable(true)
    }

    const handlePostClick = (value: any) => {
        setPostData((prev) => (prev ? [...prev, value] : [value]))
        setShowPostTable(false)
        setPOstInput('')
    }

    return (
        <>
            <Modal title="ADD PAGE SECTION" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1500} okText="ADD">
                <Formik
                    enableReinitialize
                    initialValues={initialValue}
                    innerRef={formikRef}
                    // validationSchema={validationSchema}

                    onSubmit={handleSubmit}
                >
                    {({ values, touched, errors, resetForm, setFieldValue }) => (
                        <Form className="w-full ">
                            <FormContainer className="grid grid-cols-2 gap-3">
                                <FormItem asterisk label="Section Header" className="col-span-1 w-[60%] h-[80%]">
                                    <Field type="text" name="section_heading" placeholder="Place your Section heading" component={Input} />
                                </FormItem>

                                <FormItem asterisk label="Component Types" className="col-span-1 w-[60%] h-[80%]">
                                    <Field name="component_type">
                                        {({ field, form }: FieldProps<any>) => {
                                            const componentOptions = COMPONENT_CATEGORY_TYPES

                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={componentOptions}
                                                    value={componentOptions.find((option) => option.value === field.value)}
                                                    onChange={(option) => {
                                                        const value = option ? option.value : ''
                                                        form.setFieldValue(field.name, value)
                                                        setComponentOptions(value)
                                                    }}
                                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                                {/* Generic Fields........................................................ */}

                                <div className=" grid grid-cols-2">
                                    <div className="font-bold mt-1">Mobile Configurations :</div>
                                    {genericComponentArray.slice(0, 19).map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-2/3">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                    <CommonSelect
                                        name="component_config.font_style"
                                        label="Font Style"
                                        options={FontSizeArray}
                                        needClassName
                                        className="col-span-1 w-1/2"
                                    />
                                    <CommonSelect
                                        name="component_config.footer_font_style"
                                        label="Footer Font Style"
                                        options={FontSizeArray}
                                        needClassName
                                        className="col-span-1 w-1/2"
                                    />
                                    <CommonSelect
                                        name="component_config.section_alignment"
                                        label="Section Alignment"
                                        options={SECTIONARRAY}
                                        needClassName
                                        className=" col-span-1 w-1/2"
                                    />
                                    <CommonSelect
                                        name="component_config.content_alignment"
                                        label="Content Alignment"
                                        options={SECTIONARRAY}
                                        needClassName
                                        className=" col-span-1 w-1/2"
                                    />
                                </div>

                                <FormContainer className=" grid grid-cols-2">
                                    <div className="font-bold mt-1">Web Configurations :</div>
                                    {genericComponentArray.slice(19).map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-2/3">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                    <CommonSelect
                                        name="component_config.web_font_style"
                                        label="Font Style"
                                        options={FontSizeArray}
                                        needClassName
                                        className="col-span-1 w-1/2"
                                    />
                                    <CommonSelect
                                        name="component_config.web_footer_font_style"
                                        label="Footer Font Style"
                                        options={FontSizeArray}
                                        needClassName
                                        className="col-span-1 w-1/2"
                                    />
                                    <CommonSelect
                                        name="component_config.web_section_alignment"
                                        label="Web Section Alignment"
                                        options={SECTIONARRAY}
                                        needClassName
                                        className=" col-span-1 w-1/2"
                                    />
                                    <CommonSelect
                                        name="component_config.web_content_alignment"
                                        label="Web Content Alignment"
                                        options={SECTIONARRAY}
                                        needClassName
                                        className=" col-span-1 w-1/2"
                                    />
                                </FormContainer>

                                <FormItem label="Border" className="col-span-1 w-1/4">
                                    <Field
                                        type="checkbox"
                                        name="border"
                                        placeholder="Enter border"
                                        component={Input}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const isChecked = e.target.checked
                                            setFieldValue('border', isChecked)
                                            setBorderForm(isChecked ? 'yes' : 'no')
                                        }}
                                    />
                                    {borderForm === 'yes' && (
                                        <FormContainer>
                                            <CommonSelect
                                                name="component_config.border_style"
                                                label="Border Style"
                                                options={borderStyleArray}
                                            />
                                            {borrderStyleArray.map((item, key) => (
                                                <FormItem key={key} label={item.label} className="w-full">
                                                    <Field
                                                        type={item.type}
                                                        name={item.name}
                                                        placeholder={item.placeholder}
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            ))}
                                        </FormContainer>
                                    )}
                                </FormItem>
                                {/* Section Border */}
                                <FormItem label="Section Border" className="col-span-1 w-1/4">
                                    <Field
                                        type="checkbox"
                                        name="section_border"
                                        placeholder="Enter section border"
                                        component={Input}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const isChecked = e.target.checked
                                            setFieldValue('section_border', isChecked)
                                            setSectioBorderShow(isChecked ? 'yes' : 'no')
                                        }}
                                    />
                                    {sectionBorderShow === 'yes' && (
                                        <FormContainer>
                                            <CommonSelect
                                                name="component_config.section_border_style"
                                                label="Section Border Style"
                                                options={borderStyleArray}
                                            />
                                            {sectionBorrderStyleArray.map((item, key) => (
                                                <FormItem key={key} label={item.label} className="w-full">
                                                    <Field
                                                        type={item.type}
                                                        name={item.name}
                                                        placeholder={item.placeholder}
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            ))}
                                        </FormContainer>
                                    )}
                                </FormItem>
                                <FormItem label="Web Border" className="col-span-1 w-1/4">
                                    <Field
                                        type="checkbox"
                                        name="web_border"
                                        placeholder="Enter border"
                                        component={Input}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const isChecked = e.target.checked
                                            setFieldValue('web_border', isChecked)
                                            setWebBorderForm(isChecked)
                                        }}
                                    />{' '}
                                    <br />
                                    <br />
                                    {webBorderForm === true && (
                                        <FormContainer>
                                            <CommonSelect
                                                name="component_config.web_border_style"
                                                label="Web Border Style"
                                                options={borderStyleArray}
                                            />
                                            {webBorrderStyleArray.map((item, key) => (
                                                <FormItem key={key} label={item.label} className="w-full">
                                                    <Field
                                                        type={item.type}
                                                        name={item.name}
                                                        placeholder={item.placeholder}
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            ))}
                                        </FormContainer>
                                    )}
                                </FormItem>
                                {/* Web Section Border */}
                                <FormItem label="Web Section Border" className="col-span-1 w-1/4">
                                    <Field
                                        type="checkbox"
                                        name="web_section_border"
                                        placeholder="Enter web section border"
                                        component={Input}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const isChecked = e.target.checked
                                            setFieldValue('web_section_border', isChecked)
                                            setWebSectioBorderShow(isChecked ? 'yes' : 'no')
                                        }}
                                    />
                                    {webSectionBorderShow === 'yes' && (
                                        <FormContainer>
                                            <CommonSelect
                                                name="component_config.web_section_border_style"
                                                label="Web Section Border Style"
                                                options={borderStyleArray}
                                            />
                                            {webBorrderStyleArray.map((item, key) => (
                                                <FormItem key={key} label={item.label} className="w-full">
                                                    <Field
                                                        type={item.type}
                                                        name={item.name}
                                                        placeholder={item.placeholder}
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            ))}
                                        </FormContainer>
                                    )}
                                </FormItem>

                                {/*  */}

                                <FormItem label="Name" className="col-span-1 w-1/4">
                                    <Field
                                        type="checkbox"
                                        name="name"
                                        placeholder="Enter name"
                                        component={Input}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const isChecked = e.target.checked
                                            setFieldValue('name', isChecked)
                                            setNameForm(isChecked) // Set borderForm to 'yes' or 'no'
                                        }}
                                    />{' '}
                                    <br />
                                    <br />
                                    {nameForm && (
                                        <>
                                            <CommonSelect label="Position" name="component_config.name_position" options={NAMEPOSITION} />
                                            <CommonSelect label="Align" name="component_config.name_align" options={ALIGNVALUES} />
                                        </>
                                    )}
                                    <FormItem label="Footer" className="w-1/2">
                                        <Field
                                            type="checkbox"
                                            name="name_footer"
                                            component={Input}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const isChecked = e.target.checked
                                                setFieldValue('name_footer', isChecked)
                                                setFooterAlignForm(isChecked)
                                            }}
                                        />

                                        {footerAlignForm && (
                                            <>
                                                <CommonSelect
                                                    label="Align Footer"
                                                    name="component_config.name_footer_align"
                                                    options={ALIGNVALUES}
                                                />
                                            </>
                                        )}
                                    </FormItem>
                                </FormItem>

                                <FormItem label="Web Name" className="col-span-1 w-1/4">
                                    <Field
                                        type="checkbox"
                                        name="web_name"
                                        component={Input}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const isChecked = e.target.checked
                                            setFieldValue('web_name', isChecked)
                                            setWebNameForm(isChecked)
                                        }}
                                    />{' '}
                                    <br />
                                    <br />
                                    {webNameForm === true && (
                                        <>
                                            <CommonSelect
                                                label="Web position"
                                                name="component_config.web_name_position"
                                                options={NAMEPOSITION}
                                            />
                                            <CommonSelect label="Web Align" name="component_config.web_name_align" options={ALIGNVALUES} />
                                        </>
                                    )}
                                    <FormItem label="Web Footer" className="w-1/2">
                                        <Field
                                            type="checkbox"
                                            name="web_name_footer"
                                            component={Input}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const isChecked = e.target.checked
                                                setFieldValue('web_name_footer', isChecked)
                                                setWebFooterAlignForm(isChecked)
                                            }}
                                        />

                                        {webFooterAlignForm && (
                                            <>
                                                <CommonSelect
                                                    label="Web Align Footer"
                                                    name="component_config.web_name_footer_align"
                                                    options={ALIGNVALUES}
                                                />
                                            </>
                                        )}
                                    </FormItem>
                                </FormItem>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    <div className="font-semibold mb-1">Background Image</div>

                                    <FormContainer className=" mt-5 ">
                                        <FormItem label="" className="grid grid-rows-2">
                                            <Field name="background_image_array">
                                                {({ field, form }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={beforeUpload}
                                                            fileList={values.background_image_array}
                                                            onChange={(files) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.background_image_array,
                                                                )
                                                                form.setFieldValue('background_image_array', files)
                                                            }}
                                                            className="items-center flex justify-center"
                                                            onFileRemove={(files) => form.setFieldValue('background_image_array', files)}
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    <div className="font-semibold mb-1 text-md">Mobile Background Image</div>

                                    <FormContainer className=" mt-5 ">
                                        <FormItem label="" className="grid grid-rows-2">
                                            <Field name="mobile_background_array">
                                                {({ field, form }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={beforeUpload}
                                                            fileList={values.mobile_background_array} // uploadedd the file
                                                            onChange={(files) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.mobile_background_array,
                                                                )
                                                                form.setFieldValue('mobile_background_array', files)
                                                            }}
                                                            className="flex justify-center"
                                                            onFileRemove={(files) => form.setFieldValue('mobile_background_array', files)}
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>

                                {BackGroundArray.map((item, key) => (
                                    <FormItem asterisk label={item.label} className="w-1/2" key={key}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                {/* ............Header Config................................................. */}
                                <CommonSelect
                                    name="header_config.style"
                                    label="Header config Style"
                                    options={FontSizeArray}
                                    needClassName
                                    className="col-span-1 w-1/2"
                                />
                                {HEADERCONFIGARRAY.map((item, key) => (
                                    <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
                                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} />
                                    </FormItem>
                                ))}

                                <PageAddCommonImage
                                    label="Header Icon Image"
                                    name="header_config_icon_Array"
                                    fieldName="header_config_icon_Array"
                                    fileList={values.header_config_icon_Array}
                                    beforeUpload={beforeUpload}
                                />

                                <PageAddCommonImage
                                    label="Header Image"
                                    name="header_config_image_Array"
                                    fieldName="header_config_image_Array"
                                    fileList={values.header_config_image_Array}
                                    beforeUpload={beforeUpload}
                                />

                                {/* ................................................................................ */}
                                {/* .......sub_header....................... */}
                                <CommonSelect
                                    name="sub_header_config.style"
                                    label="Sub-Header config Style"
                                    options={FontSizeArray}
                                    needClassName
                                    className="col-span-1 w-1/2"
                                />
                                {SUBHEADERCONFIGARRAY.map((item, key) => (
                                    <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
                                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} />
                                    </FormItem>
                                ))}

                                <PageAddCommonImage
                                    label="Sub Header Image"
                                    name="sub_header_config_image_Array"
                                    fieldName="sub_header_config_image_Array"
                                    fileList={values.sub_header_config_image_Array}
                                    beforeUpload={beforeUpload}
                                />

                                {/* FOOOTER.......................................................... */}
                                <CommonSelect
                                    name="footer_config.style"
                                    label="Footer config Style"
                                    options={FontSizeArray}
                                    needClassName
                                    className="col-span-1 w-1/2"
                                />
                                {FOOTERCONFIGARRAY.map((item, key) => (
                                    <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
                                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} />
                                    </FormItem>
                                ))}

                                <PageAddCommonImage
                                    label="Footer Image"
                                    name="footer_config_image_Array"
                                    fieldName="footer_config_image_Array"
                                    fileList={values.footer_config_image_Array}
                                    beforeUpload={beforeUpload}
                                />

                                <FormItem asterisk label="Data Type" className="col-span-1 w-[60%] h-[80%]">
                                    <Field name="data_type.type">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={dataTypeArray}
                                                    value={dataTypeArray.find((option) => option.value === field.value)}
                                                    onChange={(option) => {
                                                        const value = option?.value || ''
                                                        form.setFieldValue(field.name, value)
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>

                                <FormItem asterisk label="Filters" className="col-span-1 w-[60%] h-[80%]">
                                    <Field type="text" name="data_type.filters" placeholder="Place your header Text" component={Input} />
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
                                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                                onSelect={handleSelect}
                                            >
                                                {DROPDOWNARRAY?.map((item, key) => {
                                                    return (
                                                        <DropdownItem key={key} eventKey={item.value}>
                                                            <span>{item.label}</span>
                                                        </DropdownItem>
                                                    )
                                                })}
                                            </Dropdown>
                                        </div>
                                    </div>

                                    {showTable && searchInput && <CreatePostTable data={tableData} handleActionClick={handleActionClick} />}

                                    <FormItem label="Barcodes" className="w-full flex gap-3">
                                        <input
                                            disabled
                                            type="text"
                                            name="data_type.barcodes"
                                            value={productData}
                                            onChange={(e: any) => {
                                                setProductData(e.target.value)
                                                setFieldValue('products', e.target.value)
                                            }}
                                            placeholder="Enter product barcode"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProductData([])
                                                setFieldValue('products', '')
                                            }}
                                        >
                                            <MdCancel className="text-red-500 text-xl" />
                                        </button>
                                    </FormItem>
                                </FormContainer>

                                <FormContainer className="flex flex-col gap-4 ">
                                    <div className="text-xl">Posts</div>
                                    <div className="flex gap-10">
                                        <div className="flex justify-start ">
                                            <input
                                                type="search"
                                                name="search"
                                                id=""
                                                placeholder="search SKU for product"
                                                value={postInput}
                                                className=" w-[250px] rounded-[10px]"
                                                onChange={handlePOSTSearch}
                                            />
                                        </div>
                                    </div>

                                    {showPostTable && postInput && (
                                        <PageSettingsPostTable data={postTableData} handleActionClick={handlePostClick} />
                                    )}

                                    <FormItem label="Posts" className="w-full flex gap-7">
                                        <input
                                            disabled
                                            type="text"
                                            name="data_type.posts"
                                            value={postData}
                                            onChange={(e: any) => {
                                                setPostData(e.target.value)
                                                setFieldValue('products', e.target.value)
                                            }}
                                            placeholder="Enter product barcode"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPostData([])
                                                setFieldValue('products', '')
                                            }}
                                        >
                                            <MdCancel className="text-red-500 text-xl" />
                                        </button>
                                    </FormItem>
                                </FormContainer>

                                {DATATYPEVALUES.map((item, key) => (
                                    <FormItem label={item.label.toUpperCase()} className="col-span-1 w-[60%] h-[80%]" key={key}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={`place ${item.label.toUpperCase()}`}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}
                                <TagsEdit filterOptions={filters.filters} isValue />

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
