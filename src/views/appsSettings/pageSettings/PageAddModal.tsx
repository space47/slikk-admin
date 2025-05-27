/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Modal, notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import CommonMainPageSettings from './CommonMainPageSettings'
import { ProductTable, WebType } from './pageSettings.types'
// import { handleVideo } from '@/common/handleVideo'
import * as Yup from 'yup'
import { values } from 'lodash'
import { handleimage } from '@/common/handleImage'

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
    { label: 'Barcode', value: 'barcode' },
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

    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const [filterId, setFilterId] = useState()
    const [filtersData, setFiltersData] = useState([])

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const initialValue = {}
    const [selectedType, setSelectedType] = useState('')

    const validationSchema = Yup.object().shape({
        section_heading: Yup.string().required('Section Header is required'),
    })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        setShowTable(true)
    }

    const fetchInput = async () => {
        try {
            if (searchInput) {
                const qname =
                    currentSelectedPage?.value === 'sku'
                        ? 'sku'
                        : currentSelectedPage?.value === 'name'
                          ? 'name'
                          : currentSelectedPage?.value === 'barcode'
                            ? 'barcode'
                            : ''
                const response = await axioisInstance.get(`/merchant/products?dashboard=true&${qname}=${searchInput}`)
                const data = response.data.data.results
                setTableData(data)
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

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
    }

    const handleAddFilters = async (values) => {
        const newFilterData = showAddFilter.map((_, index) => values.filtersAdd[index] || [])
        setFiltersData((prev) => {
            const updatedFilters = [...prev, newFilterData]
            const lastElement = updatedFilters.at(-1)
            sendFilterData(lastElement)
            return updatedFilters
        })
    }

    const sendFilterData = async (filterData) => {
        try {
            const response = await axioisInstance.post(`/product/search/criteria`, { filter_data: filterData })
            setFilterId(response.data?.data?.id)
            notification.success({
                message: 'Filter Id Added',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to Add Filter ID',
            })
            console.error(error)
        }
    }

    const handleActionClick = (value: any) => {
        console.log('Barcode', value)
        setProductData((prev) => (prev ? [...prev, value] : [value]))
        setShowTable(false)
        setSearchInput('')
    }

    const handleImage = async (files: File[]) => {
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
            }
        }
    }

    const handleSubmit = async (row: any) => {
        const componentConfig = {
            ...Object.fromEntries(Object.entries(row?.component_config || {}).filter(([_, value]) => value !== '')),
            border: row?.border ?? false,
            name: row?.name ?? false,
            name_footer: row?.name_footer ?? false,
            section_border: row?.section_border ?? false,
            web_border: row?.web_border ?? false,
            web_name: row?.web_name ?? false,
            web_name_footer: row?.web_name_footer ?? false,
            web_section_border: row?.web_section_border ?? false,
        }
        console.log('Mobile file in Add', row?.mobile_background_video_array)
        console.log('satrt')
        const imageUpload = await handleImage(row.background_image_array)
        const mobileimageUpload = await handleImage(row.mobile_background_array)
        const footerImageUpload = await handleImage(row.footer_config_image_Array)
        const headerImageUpload = await handleImage(row.header_config_image_Array)
        const subHeaderImageUpload = await handleImage(row.sub_header_config_image_Array)
        const headerIconUpload = await handleImage(row.header_config_icon_Array)
        //videos hanlde
        const footervideoUpload = await handleVideo(row.footer_config_video_Array)
        const headerVideoUpload = await handleVideo(row.header_config_video_Array)
        const subHeaderVideoUpload = await handleVideo(row.sub_header_config_video_Array)
        const backgroundVideoUpload = await handleVideo(row?.background_video_array)
        const mobileBackgroundVideoUpload = await handleVideo(row?.mobile_background_video_array)

        const backgroundLottieUpload = await handleimage('product', row?.background_lottie_array)
        const mobileBackgroundLottieUpload = await handleimage('product', row?.mobile_background_lottie_array)

        console.log('headerIconImage')
        // Aspect Ratio handles
        const backgroundImageAspectRatios = await calculateAspectRatio(row.background_image_array)
        const mobileImageAspectRatios = await calculateAspectRatio(row.mobile_background_array)
        const headerImageAspectRatios = await calculateAspectRatio(row.header_config_image_Array)
        const subHeaderImageAspectRatios = await calculateAspectRatio(row.sub_header_config_image_Array)
        const footerImageAspectRatios = await calculateAspectRatio(row.footer_config_image_Array)

        const backgroundConfig = {
            ...Object.fromEntries(Object.entries(row?.background_config || {}).filter(([_, value]) => value !== '')),
            ...(imageUpload || row?.background_image ? { background_image: imageUpload || row?.background_image } : {}),
            ...(mobileimageUpload || row?.mobile_background_image
                ? { mobile_background_image: mobileimageUpload || row?.mobile_background_image }
                : {}),
            ...(row?.background_config?.background_image_aspect_ratio
                ? { background_image_aspect_ratio: row.background_config.background_image_aspect_ratio }
                : backgroundImageAspectRatios[0]
                  ? { background_image_aspect_ratio: backgroundImageAspectRatios[0] }
                  : {}),

            ...(row?.background_config?.mobile_image_aspect_ratio
                ? { mobile_image_aspect_ratio: row.background_config.mobile_image_aspect_ratio }
                : mobileImageAspectRatios[0]
                  ? { mobile_image_aspect_ratio: mobileImageAspectRatios[0] }
                  : {}),
            ...(backgroundVideoUpload || row?.background_video ? { background_video: backgroundVideoUpload || row?.background_video } : {}),
            ...(mobileBackgroundVideoUpload || row?.mobile_background_video
                ? { mobile_background_video: mobileBackgroundVideoUpload || row?.mobile_background_video }
                : {}),
            ...(backgroundLottieUpload || row?.background_lottie
                ? { background_lottie: backgroundLottieUpload || row?.background_lottie }
                : {}),
            ...(mobileBackgroundLottieUpload || row?.mobile_background_Lottie
                ? { mobile_background_lottie: mobileBackgroundLottieUpload || row?.mobile_background_lottie }
                : {}),
        }

        console.log('Start Api')
        //Fields
        const newRowAdd = {
            ...row,
            ...(imageUpload || row?.background_image ? { background_image: imageUpload || row?.background_image } : {}),
            ...(mobileimageUpload || row?.mobile_background_image
                ? { mobile_background_image: mobileimageUpload || row?.mobile_background_image }
                : {}),
            background_config: backgroundConfig,
            footer_config: {
                ...row?.footer_config,
                ...(footerImageUpload ? { image: footerImageUpload } : {}),
                ...(footerImageAspectRatios?.[0] ? { aspect_ratio: footerImageAspectRatios[0] } : {}),
                ...(footervideoUpload ? { video: footervideoUpload } : {}),
            },
            header_config: {
                ...row?.header_config,

                ...(headerIconUpload ? { icon: headerIconUpload } : {}),
                ...(headerImageUpload ? { image: headerImageUpload } : {}),
                ...(headerImageAspectRatios?.[0] ? { aspect_ratio: headerImageAspectRatios[0] } : {}),
                ...(headerVideoUpload ? { video: headerVideoUpload } : {}),
            },
            sub_header_config: {
                ...row?.sub_header_config,
                ...(subHeaderImageUpload ? { image: subHeaderImageUpload } : {}),
                ...(subHeaderImageAspectRatios?.[0] ? { aspect_ratio: subHeaderImageAspectRatios[0] } : {}),
                ...(subHeaderVideoUpload ? { video: subHeaderVideoUpload } : {}),
            },
            data_type: {
                ...(() => {
                    const { start_date, end_date, validation, ...rest } = row?.data_type || {}
                    return rest
                })(),
                ...(!(row?.data_type?.validation > 0) && row?.data_type?.start_date ? { start_date: row?.data_type?.start_date } : {}),
                ...(!(row?.data_type?.validation > 0) && row?.data_type?.end_date ? { end_date: row?.data_type?.end_date } : {}),
                ...(row?.data_type?.validation ? { duration: row?.data_type?.validation } : {}),
                ...(row?.data_type?.type ? { type: row?.data_type?.type } : {}),
                ...(Array.isArray(postData)
                    ? { posts: postData.join(',') }
                    : row?.data_type?.posts
                      ? { posts: row?.data_type?.posts }
                      : {}),
                ...(Array.isArray(productData)
                    ? { barcodes: productData.join(',') }
                    : row?.data_type?.barcodes
                      ? { barcodes: row?.data_type?.barcodes }
                      : {}),

                filters: [row?.division_select ? `division_${row.division_select}` : null, filterId ? `filterID_${filterId}` : null].filter(
                    Boolean,
                ),
            },
            component_config: componentConfig,
            extra_info: {
                ...row?.extra_info,
                ...(row?.extra_info?.timeout ? { timeout: row?.extra_info?.timeout } : {}),
            },
            ...(row?.section_filters ? { section_filters: row?.section_filters } : {}),
            ...(row?.section_type ? { section_type: row?.section_type } : {}),
            ...(row?.order_count ? { order_count: row?.order_count } : {}),
            ...(row?.min_order_value_for_event_pass ? { min_order_value_for_event_pass: row?.min_order_value_for_event_pass } : {}),
        }

        console.log('End of row')
        const filteredRow = Object.fromEntries(Object.entries(newRowAdd || {}).filter(([_, value]) => value !== undefined))

        setData((prevData: WebType[]) => [...prevData, filteredRow])
        setSelectedType('')

        console.log('Main Data That is to be send in the API', filteredRow)
        console.log('The row which is set', row)
    }

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
                    validationSchema={validationSchema}
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
                    handleAddFilter={handleAddFilter}
                    handleAddFilters={handleAddFilters}
                    handleRemoveFilter={handleRemoveFilter}
                    showAddFilter={showAddFilter}
                />
            </Modal>
        </>
    )
}

export default PageAddModal
