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
import { EditAspectRatios, EditImageUpoads, EditVideoUpload } from './pageSettingsUtils/pageEditFunctions'
import { usePageEditRemoveFunctions } from './pageSettingsUtils/usePageEditRemoveFunctions'
import { fetchInput, fetchPost } from './pageSettingsUtils/pageEditApi'

type modalProps = {
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void
    handleOk: () => void
    handleCancel: () => void
    formikRef: React.RefObject<any>
    particularRow: any
    setParticularRow: (data: any) => void
}

const PageModal: React.FC<modalProps> = ({ isModalOpen, handleOk, handleCancel, formikRef, particularRow, setParticularRow }) => {
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [showTable, setShowTable] = useState(false)
    const [tableData, setTableData] = useState<ProductTable[]>([])
    const [productData, setProductData] = useState(particularRow.data_type.barcodes)
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
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const [filterId, setFilterId] = useState()
    const [filtersData, setFiltersData] = useState<any[]>([])

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

    useEffect(() => {
        fetchInput(searchInput, currentSelectedPage, setTableData)
    }, [searchInput])

    useEffect(() => {
        fetchPost(postInput, setPostTableData)
    }, [postInput])

    const handleSelect = (value: any) => {
        const selected = DROPDOWNTYPE.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const handleSubmit = async (row: any) => {
        const componentConfig = {
            ...Object.fromEntries(Object.entries(row?.component_config || {}).filter(([, value]) => value !== '')),
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
            const {
                imageUpload,
                mobileimageUpload,
                footerImageUpload,
                headerImageUpload,
                subHeaderImageUpload,
                headerIconUpload,
                exploreMoreImageUpload,
            } = await EditImageUpoads(row)

            const {
                backgroundVideoUpload,
                exploreMoreVideoUpload,
                footervideoUpload,
                headerVideoUpload,
                mobileBackgroundVideoUpload,
                subHeaderVideoUpload,
            } = await EditVideoUpload(row)

            const {
                backgroundImageAspectRatios,
                mobileImageAspectRatios,
                headerImageAspectRatios,
                subHeaderImageAspectRatios,
                footerImageAspectRatios,
                exploreMoreAspectRatios,
            } = await EditAspectRatios(row)

            const explore_more_data = {
                ...row?.extra_info.explore_more,
                ...(exploreMoreImageUpload ? { image: exploreMoreImageUpload } : {}),
                ...(exploreMoreAspectRatios?.[0] ? { aspect_ratio: exploreMoreAspectRatios[0] } : {}),
                ...(exploreMoreVideoUpload ? { video: exploreMoreVideoUpload } : {}),
            }
            const explore_more = Object.fromEntries(Object.entries(explore_more_data).filter(([, value]) => value !== ''))

            const backgroundConfig = {
                ...Object.fromEntries(Object.entries(row?.background_config || {}).filter(([, value]) => value !== '')),
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
            }
            const newRow = {
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
                    ...(row?.extra_info?.page_size ? { page_size: row?.extra_info?.page_size } : {}),
                    ...(row?.extra_info?.child_data_type && { child_data_type: row?.extra_info?.child_data_type }),
                    explore_more: explore_more,
                },
                ...(row?.section_filters ? { section_filters: row?.section_filters } : {}),
                ...(row?.section_type ? { section_type: row?.section_type } : {}),
                ...(row?.order_count ? { order_count: row?.order_count } : {}),
                ...(row?.min_order_value_for_event_pass ? { min_order_value_for_event_pass: row?.min_order_value_for_event_pass } : {}),
            }

            const filteredRow = Object.fromEntries(Object.entries(newRow || {}).filter(([_, value]) => value !== undefined))
            setShowSpinner(false)
            setParticularRow(filteredRow)
            console.log('FINAL ADD INSIDE SUBMIT', filteredRow)
        } catch (error) {
            console.error('Error in handleSubmit:', error)
        }
    }
    const { handleRemoveImage, handleRemoveVideo } = usePageEditRemoveFunctions({ setInitalValue })
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

    const handleRemoveSubImage = () => {
        setInitalValue((prev: any) => ({
            ...prev,
            sub_header_config: {
                ...prev.sub_header_config,
                image: null,
            },
        }))
    }

    const handleRemoveHeaderImage = () => {
        setInitalValue((prev: any) => ({
            ...prev,
            header_config: {
                ...(prev.header_config || {}),
                image: null,
            },
        }))
    }
    const handleRemoveExploreImage = () => {
        setInitalValue((prev: any) => ({
            ...prev,
            extra_info: {
                ...prev.extra_info,
                explore_more: {
                    ...prev.extra_info.explore_more,
                    image: '',
                },
            },
        }))
    }

    const handleActionClick = (value: any) => {
        setProductData((prev: any) => (prev ? [...prev, value] : [value]))
        setShowTable(false)
        setSearchInput('')
    }

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
                    handleRemoveExploreImage={handleRemoveExploreImage}
                />
            </Modal>
        </>
    )
}

export default PageModal
