/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react'
import { Modal, notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import CommonMainPageSettings from './CommonMainPageSettings'
import { ProductTable, WebType } from './pageSettings.types'
import { handleVideo } from '@/common/handleVideo'

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

    const initialValue = {}
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
        if (!files || files.length === 0) {
            return
        }

        const formData = new FormData()

        for (const file of files) {
            const image = new Image()
            const fileURL = URL.createObjectURL(file)

            image.src = fileURL

            await new Promise<void>((resolve) => {
                image.onload = () => {
                    console.log('Image width:', image.width, 'Image height:', image.height)
                    URL.revokeObjectURL(fileURL)
                    resolve()
                }
            })

            formData.append('file', file)
        }

        formData.append('file_type', 'banners')

        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            const newData = response.data.url
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Image uploaded successfully',
            })

            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Upload Failed',
                description: error?.response?.data?.message || 'Image upload failed',
            })

            return ''
        }
    }
    const handleSelect = (value: any) => {
        const selected = DROPDOWNARRAY.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
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

    const handleSubmit = async (row: any) => {
        console.log('satrt')
        const imageUpload = await handleimage(row.background_image_array)

        const mobileImageUpload = await handleimage(row.mobile_background_array)

        const footerImageUpload = await handleimage(row.footer_config_image_Array)

        const headerImageUpload = await handleimage(row.header_config_image_Array)

        const subHeaderImageUpload = await handleimage(row.sub_header_config_image_Array)

        const headerIconImageUpload = await handleimage(row.header_config_icon_Array)

        const footervideoUpload = await handleVideo(row.footer_config_video_Array)
        const headerVideoUpload = await handleVideo(row.header_config_video_Array)
        const subHeaderVideoUpload = await handleVideo(row.sub_header_config_video_Array)
        const backgroundVideoUpload = await handleVideo(row?.background_video_array)

        console.log('headerIconImage')

        const backgroundImageAspectRatios = await calculateAspectRatio(row.background_image_array)
        const mobileImageAspectRatios = await calculateAspectRatio(row.mobile_background_array)
        const headerImageAspectRatios = await calculateAspectRatio(row.header_config_image_Array)
        const subHeaderImageAspectRatios = await calculateAspectRatio(row.sub_header_config_image_Array)
        const footerImageAspectRatios = await calculateAspectRatio(row.footer_config_image_Array)

        console.log('Start Api')

        const newRowAdd = {
            ...row,
            background_image: imageUpload ?? undefined,
            mobile_background_image: mobileImageUpload ?? undefined,
            footer_config: {
                ...row.footer_config,
                image: row.footer_config_image_Array?.length > 0 ? footerImageUpload : undefined,
                aspect_ratio: footerImageAspectRatios[0].toFixed(2) ?? undefined,
                video: footervideoUpload ?? undefined,
            },
            header_config: {
                ...row.header_config,
                icon: row.header_config_icon_Array?.length > 0 ? headerIconImageUpload : undefined,
                image: row.header_config_image_Array?.length > 0 ? headerImageUpload : undefined,
                aspect_ratio: headerImageAspectRatios[0].toFixed(2) ?? undefined,
                video: headerVideoUpload ?? undefined,
            },
            sub_header_config: {
                ...row.sub_header_config,
                image: row.sub_header_config_image_Array?.length > 0 ? subHeaderImageUpload : undefined,
                aspect_ratio: subHeaderImageAspectRatios[0].toFixed(2) ?? undefined,
                video: subHeaderVideoUpload ?? undefined,
            },
            data_type: {
                ...row.data_type,
                posts: Array.isArray(postData) ? postData.join(',') : (row.data_type?.posts ?? undefined),
                barcodes: Array.isArray(productData) ? productData.join(',') : (row.data_type?.barcodes ?? undefined),
            },
            background_config: {
                background_color: row.background_config?.background_color ?? undefined,
                desktop_position: row.background_config?.desktop_position ?? undefined,
                mobile_position: row.background_config?.mobile_position ?? undefined,
                background_topMargin: row.background_config?.background_topMargin
                    ? Number(row.background_config?.background_topMargin)
                    : undefined,
                background_bottomMargin: row.background_config?.background_bottomMargin
                    ? Number(row.background_config?.background_bottomMargin)
                    : undefined,
                web_background_topMargin: row.background_config?.web_background_topMargin
                    ? Number(row.background_config?.web_background_topMargin)
                    : undefined,
                web_background_bottomMargin: row.background_config?.web_background_bottomMargin
                    ? Number(row.background_config?.web_background_bottomMargin)
                    : undefined,
                mobile_width: row.background_config?.mobile_width ? Number(row.background_config?.mobile_width) : undefined,
                web_width: row.background_config?.web_width ? Number(row.background_config?.web_width) : undefined,
                background_image: imageUpload ?? null,
                mobile_background_image: mobileImageUpload ?? null,
                background_image_aspect_ratio: backgroundImageAspectRatios[0].toFixed(2) ?? undefined,
                mobile_image_aspect_ratio: mobileImageAspectRatios[0].toFixed(2) ?? undefined,
                is_background_video: row?.background_config?.bg_video ?? false,
                background_video: backgroundVideoUpload ?? row?.background_video,
            },
            component_config: {
                ...row.component_config,
                border: row?.component_config?.border ?? false,
                name: row?.component_config?.name ?? false,
                name_footer: row?.component_config?.name_footer ?? false,
                section_border: row?.component_config?.section_border ?? false,
                web_border: row?.component_config?.web_border ?? false,
                web_name: row?.component_config?.web_name ?? false,
                web_name_footer: row?.component_config?.web_name_footer ?? false,
                web_section_border: row?.component_config?.web_section_border ?? false,
            },
            section_filters: row.data_type?.filters ?? undefined,
            section_type: row.section_type ?? undefined,
        }

        console.log('End of row')

        setData((prevData: WebType[]) => [...prevData, newRowAdd])
        setSelectedType('')
        // setInitalValue('')

        console.log('Main Data That is to be send in the API', newRowAdd)
        console.log('The row which is set', row)
        // setIsModalOpen(false)
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
