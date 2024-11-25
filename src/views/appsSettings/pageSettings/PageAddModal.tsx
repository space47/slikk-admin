/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react'
import { Modal, notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import CommonMainPageSettings from './CommonMainPageSettings'
import { ProductTable, WebType } from './pageSettings.types'

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
            section_type: row.section_type || '',
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

    const handlePOSTSearch = (e: any) => {
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
                <CommonMainPageSettings
                    setComponentOptions={setComponentOptions}
                    initialValue={initialValue}
                    formikRef={formikRef}
                    handleSubmit={handleSubmit}
                    setBorderForm={setBorderForm}
                    borderForm={borderForm}
                    setSectioBorderShow={setSectioBorderShow}
                    sectionBorderShow={sectionBorderShow}
                    setWebBorderForm={setWebBorderForm}
                    webBorderForm={webBorderForm}
                    setWebSectioBorderShow={setWebSectioBorderShow}
                    webSectionBorderShow={webSectionBorderShow}
                    setNameForm={setNameForm}
                    nameForm={nameForm}
                    setFooterAlignForm={setFooterAlignForm}
                    footerAlignForm={footerAlignForm}
                    setWebNameForm={setWebNameForm}
                    webNameForm={webNameForm}
                    setWebFooterAlignForm={setWebFooterAlignForm}
                    webFooterAlignForm={webFooterAlignForm}
                    searchInput={searchInput}
                    handleSearch={handleSearch}
                    currentSelectedPage={currentSelectedPage}
                    handleSelect={handleSelect}
                    showTable={showTable}
                    handleActionClick={handleActionClick}
                    productData={productData}
                    setProductData={setProductData}
                    postInput={postInput}
                    handlePOSTSearch={handlePOSTSearch}
                    showPostTable={showPostTable}
                    postTableData={postTableData}
                    handlePostClick={handlePostClick}
                    postData={postData}
                    setPostData={setPostData}
                    filters={filters}
                    tableData={tableData}
                />
            </Modal>
        </>
    )
}

export default PageAddModal
