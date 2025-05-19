/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Modal, notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Spinner } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import CommonMainPageSettings from './CommonMainPageSettings'
import { ProductTable } from './pageSettings.types'
import * as Yup from 'yup'
import { EditInitialValues } from './pageSettingsUtils/PageSettingEditInitialValues'
import { DROPDOWNTYPE } from '@/views/category-management/catalog/CommonType'
import { handleimage } from '@/common/handleImage'

type modalProps = {
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void
    handleOk: () => void
    handleCancel: () => void
    formikRef: React.RefObject<any>
    particularRow: any
    setParticularRow: (data: any) => void
}

const DROPDOWNARRAY = [
    { label: 'Name', value: 'name' },
    { label: 'SKU', value: 'sku' },
    { label: 'Barcode', value: 'barcode' },
]

const PageModal: React.FC<modalProps> = ({ isModalOpen, handleOk, handleCancel, formikRef, particularRow, setParticularRow }) => {
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [showTable, setShowTable] = useState(false)
    const [tableData, setTableData] = useState<ProductTable[]>([])
    const [productData, setProductData] = useState(particularRow.data_type.barcodes)
    // posts....................
    const [postInput, setPOstInput] = useState('')
    const [showPostTable, setShowPostTable] = useState(false)
    const [postTableData, setPostTableData] = useState([])
    const [postData, setPostData] = useState<string[]>([
        particularRow
            ? Array.isArray(particularRow.data_type.posts)
                ? particularRow.data_type.posts
                : [particularRow.data_type.posts]
            : [],
    ])

    const [showSectionFilters, setShowSectionFilters] = useState(particularRow?.is_section_clickable)
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const [filterId, setFilterId] = useState()
    const [filtersData, setFiltersData] = useState<any[]>([])

    console.log('showSection Clickable', showSectionFilters)

    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const [initialValue, setInitalValue] = useState<any>(EditInitialValues(particularRow))
    const validationSchema = Yup.object().shape({
        section_heading: Yup.string().required('Section Header is required'),
    })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        setShowTable(true)
    }

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
    }

    const handleAddFilters = async (values: any) => {
        const newFilterData = showAddFilter.map((_, index) => values.filtersAdd[index] || [])
        setFiltersData((prev: any) => {
            const updatedFilters = [...prev, newFilterData]
            const lastElement = updatedFilters.at(-1)
            sendFilterData(lastElement)
            return updatedFilters
        })
    }

    const sendFilterData = async (filterData: any) => {
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

    const handleSelect = (value: any) => {
        const selected = DROPDOWNTYPE.find((item) => item.value === value)
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

    const handleImage = async (files: File[]) => {
        console.log('Images of mobile for checking', files)
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
            notification.info({
                message: 'Image Upload in process',
            })
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
            console.log('new data is', newData)
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

    const handleSubmit = async (row: any) => {
        console.log('here', row?.background_lottie_array, row?.mobile_background_lottie_array)
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

        const backgroundLottieUpload = row?.background_lottie_array
            ? await handleimage('product', row?.background_lottie_array)
            : initialValue.background_lottie
        const mobileBackgroundLottieUpload = row?.mobile_background_lottie_array
            ? await handleimage('product', row?.mobile_background_lottie_array)
            : initialValue.mobile_background_lottie

        try {
            console.log('handleSubmit called')
            const imageUpload = await handleImage(row.background_image_array)
            const mobileimageUpload = await handleImage(row.mobile_background_array)
            const footerImageUpload = await handleImage(row.footer_config_image_Array)
            const headerImageUpload = await handleImage(row.header_config_image_Array)
            const subHeaderImageUpload = await handleImage(row.sub_header_config_image_Array)
            const headerIconUpload = await handleImage(row.header_config_icon_Array)

            const footervideoUpload = await handleVideo(row.footer_config_video_Array)
            const headerVideoUpload = await handleVideo(row.header_config_video_Array)
            const subHeaderVideoUpload = await handleVideo(row.sub_header_config_video_Array)
            const backgroundVideoUpload = await handleVideo(row?.background_video_array)
            const mobileBackgroundVideoUpload = await handleVideo(row?.mobile_background_video_array)

            console.log('New Row below')
            const backgroundImageAspectRatios = await calculateAspectRatio(row.background_image_array)
            const mobileImageAspectRatios = await calculateAspectRatio(row.mobile_background_array)
            const headerImageAspectRatios = await calculateAspectRatio(row.header_config_image_Array)
            const subHeaderImageAspectRatios = await calculateAspectRatio(row.sub_header_config_image_Array)
            const footerImageAspectRatios = await calculateAspectRatio(row.footer_config_image_Array)

            console.log('Start New Row')
            const newRow = {
                ...row,
                ...(imageUpload || row?.background_image ? { background_image: imageUpload || row?.background_image } : {}),
                ...(mobileimageUpload || row?.mobile_background_image
                    ? { mobile_background_image: mobileimageUpload || row?.mobile_background_image }
                    : {}),
                background_config: {
                    ...row?.background_config,
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
                    ...(backgroundVideoUpload || row?.background_video
                        ? { background_video: backgroundVideoUpload || row?.background_video }
                        : {}),
                    ...(mobileBackgroundVideoUpload || row?.mobile_background_video
                        ? { mobile_background_video: mobileBackgroundVideoUpload || row?.mobile_background_video }
                        : {}),
                    ...(backgroundLottieUpload || row?.background_lottie
                        ? { background_lottie: backgroundLottieUpload || row?.background_lottie }
                        : {}),
                    ...(mobileBackgroundLottieUpload || row?.mobile_background_Lottie
                        ? { mobile_background_lottie: mobileBackgroundLottieUpload || row?.mobile_background_lottie }
                        : {}),
                },
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

                    ...(row?.data_type?.type ? { type: row?.data_type?.type } : {}),
                    ...(!(row?.data_type?.validation > 0) && row?.data_type?.start_date ? { start_date: row?.data_type?.start_date } : {}),
                    ...(!(row?.data_type?.validation > 0) && row?.data_type?.end_date ? { end_date: row?.data_type?.end_date } : {}),
                    ...(row?.data_type?.validation > 0 ? { duration: row?.data_type?.validation } : {}),
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
                    filters: [
                        ...(row?.division_select ? [`division_${row.division_select}`] : []),
                        ...(row?.data_type?.filters ?? []),
                        ...(filterId ? [`filterID_${filterId}`] : []),
                    ]
                        .filter(Boolean)
                        .flat(),
                },
                component_config: componentConfig,
                extra_info: {
                    ...row?.extra_info,
                    ...(row?.extra_info?.timeout ? { timeout: row?.extra_info?.timeout } : {}),
                },
                ...(row?.section_filters ? { section_filters: row?.section_filters } : {}),
                ...(row?.section_type ? { section_type: row?.section_type } : {}),
                ...(row?.order_count ? { order_count: row?.order_count } : {}),
            }

            const filteredRow = Object.fromEntries(Object.entries(newRow || {}).filter(([_, value]) => value !== undefined))

            setShowSpinner(false)
            setParticularRow(filteredRow)
            console.log('Barecode THAT HAS BEEN UPDATED', newRow.data_type.barcodes)
            console.log('FINAL ADD INSIDE SUBMIT', filteredRow)
        } catch (error) {
            console.error('Error in handleSubmit:', error)
        }
    }

    const handleRemoveImage = (val: string) => {
        if (val === 'background_image') {
            setInitalValue((prev: any) => ({
                ...prev,
                background_image: null,
                background_config: {
                    ...prev.background_config,
                    background_image: null,
                },
            }))
        } else if (val === 'mobile_background_image') {
            console.log('Remive mobile Bg')
            setInitalValue((prev: any) => ({
                ...prev,
                mobile_background_image: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_image: null,
                },
            }))
        }
    }
    const handleRemoveVideo = (val: string) => {
        if (val === 'background_video') {
            setInitalValue((prev: any) => ({
                ...prev,
                background_video: null,
                background_config: {
                    ...prev.background_config,
                    background_video: null,
                },
            }))
        } else if (val === 'mobile_background_video') {
            setInitalValue((prev: any) => ({
                ...prev,
                mobile_background_video: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_video: null,
                },
            }))
        } else if (val === 'background_lottie') {
            setInitalValue((prev: any) => ({
                ...prev,
                background_lottie: null,
                background_config: {
                    ...prev.background_config,
                    background_lottie: null,
                },
            }))
        } else if (val === 'mobile_background_lottie') {
            setInitalValue((prev: any) => ({
                ...prev,
                mobile_background_lottie: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_lottie: null,
                },
            }))
        }
    }

    const [componentOption, setComponentOptions] = useState(initialValue.component_type)
    const [borderForm, setBorderForm] = useState(initialValue?.border)
    const [webBorderForm, setWebBorderForm] = useState<boolean>(initialValue?.web_border)
    const [nameForm, setNameForm] = useState(initialValue?.name)
    const [webNameForm, setWebNameForm] = useState(initialValue?.web_name)
    const [footerAlignForm, setFooterAlignForm] = useState(initialValue?.name_footer)
    const [webFooterAlignForm, setWebFooterAlignForm] = useState(initialValue?.web_name_footer)
    const [sectionBorderShow, setSectioBorderShow] = useState(initialValue?.section_border)
    const [webSectionBorderShow, setWebSectioBorderShow] = useState(initialValue?.web_section_border)
    const [showSpinner, setShowSpinner] = useState(false)

    const handleRemoveSubImage = (e: any) => {
        e.preventDefault()

        setInitalValue((prev: any) => ({
            ...prev,
            sub_header_config: {
                ...prev.sub_header_config,
                image: null,
            },
        }))
    }

    const handleRemoveHeaderImage = (e: any) => {
        e.preventDefault()

        setInitalValue((prev: any) => ({
            ...prev,
            header_config: {
                ...prev.header_config,
                image: null,
            },
        }))
    }

    const handleActionClick = (value: any) => {
        setProductData((prev: any) => (prev ? [...prev, value] : [value]))
        setShowTable(false)
        setSearchInput('')
    }

    // POSTS...............
    const handlePOSTSearch = (e: any) => {
        setPOstInput(e.target.value)
        setShowPostTable(true)
    }

    const handlePostClick = (value: any) => {
        setPostData((prev) => (prev ? [...prev, value] : [value]))
        setShowPostTable(false)
        setPOstInput('')
    }

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    return (
        <>
            <Modal
                title="EDIT SECTION"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1500}
                okText="Edit"
                className="z-50"
            >
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
                    editMode
                    handleRemoveImage={handleRemoveImage}
                    particularRow={particularRow}
                    handleRemoveHeaderImage={handleRemoveHeaderImage}
                    handleRemoveSubImage={handleRemoveSubImage}
                    handleRemoveVideo={handleRemoveVideo}
                    handleAddFilter={handleAddFilter}
                    handleAddFilters={handleAddFilters}
                    handleRemoveFilter={handleRemoveFilter}
                    showAddFilter={showAddFilter}
                />
            </Modal>
        </>
    )
}

export default PageModal
