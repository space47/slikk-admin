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

    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const [initialValue, setInitalValue] = useState<any>({
        data_type: particularRow.data_type,
        footer_config: particularRow.footer_config,
        header_config: particularRow.header_config,
        component_type: particularRow.component_type,
        section_heading: particularRow.section_heading,
        background_image: particularRow.background_config?.background_image,
        sub_header_config: particularRow.sub_header_config,
        mobile_background_image: particularRow.background_config?.mobile_background_image,
        is_section_clickable: particularRow.is_section_clickable,
        section_filters: particularRow.section_filters,
        grid: particularRow.grid,
        background_config: particularRow.background_config,
        border: particularRow.border,
        border_style: particularRow.border_style,
        web_border: particularRow.web_border,
        web_border_style: particularRow.web_border_style,
        name: particularRow.name,
        section_border: particularRow?.section_border,
        section_type: particularRow?.section_type,
        web_name: particularRow.web_name,
        name_footer: particularRow.name_footer,
        web_name_footer: particularRow.web_name_footer,
        component_config: particularRow.component_config,
        web_section_border: particularRow?.web_section_border,
    })

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

    const handleimage = async (files: File[]) => {
        if (!files || files?.length == 0) {
            return
        }

        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'banners')

        try {
            return await axioisInstance
                .post('fileupload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
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
        try {
            console.log('handleSubmit called')
            const imageUpload = await handleimage(row.background_image_array)
            const mobileimageUpload = await handleimage(row.mobile_background_array)
            const footerImageUpload = await handleimage(row.footer_config_image_Array)
            const headerImageUpload = await handleimage(row.header_config_image_Array)
            const subHeaderImageUpload = await handleimage(row.sub_header_config_image_Array)
            const headerIconUpload = await handleimage(row.header_config_icon_Array)

            console.log('New Row below', row.interval)

            setShowSpinner(true)
            const newRow = {
                ...row,
                background_image: imageUpload || row?.background_image,
                mobile_background_image: mobileimageUpload || row?.mobile_background_image,
                background_config: {
                    background_color: row?.background_config?.background_color || '',
                    desktop_position: row?.background_config?.desktop_position || '',
                    mobile_position: row?.background_config?.mobile_position || '',
                    background_topMargin: Number(row?.background_config?.background_topMargin) || 0,
                    background_bottomMargin: Number(row?.background_config?.background_bottomMargin) || 0,
                    web_background_topMargin: Number(row.background_config?.web_background_topMargin) || 0,
                    web_background_bottomMargin: Number(row.background_config?.web_background_bottomMargin) || 0,
                    mobile_width: Number(row?.background_config?.mobile_width) || 0,
                    web_width: Number(row?.background_config?.web_width) || 0,
                    background_image: imageUpload || row?.background_image,
                    mobile_background_image: mobileimageUpload || row?.mobile_background_image,
                },
                footer_config: {
                    ...row?.footer_config,
                    image: footerImageUpload || '',
                },
                header_config: {
                    ...row?.header_config,
                    icon: headerIconUpload || '',
                    image: headerImageUpload || '',
                },
                sub_header_config: {
                    ...row?.sub_header_config,
                    image: subHeaderImageUpload || '',
                },
                data_type: {
                    ...row?.data_type,
                    type: row?.data_type?.type || '',
                    posts: Array.isArray(postData) ? postData.join(',') : row?.data_type?.posts || '',
                    barcodes: Array.isArray(productData) ? productData.join(',') : row?.data_type?.barcodes || '',
                },
                component_config: {
                    ...row?.component_config,
                },
                section_filters: row?.data_type?.filters || '',
                section_type: row.section_type || '',
            }
            setShowSpinner(false)

            setParticularRow(newRow)
            console.log('Barecode THAT HAS BEEN UPDATED', newRow.data_type.barcodes)
            console.log('FINAL ADD INSIDE SUBMIT', newRow)
        } catch (error) {
            console.error('Error in handleSubmit:', error)
        }
    }

    console.log('ppppppproduct DDDDDDDDDatata', productData)

    const handleRemoveImage = (val: string) => {
        if (val === 'background_image') {
            setInitalValue((prev: any) => ({
                ...prev,
                background_image: null,
            }))
        } else if (val === 'mobile_background_image') {
            setInitalValue((prev: any) => ({
                ...prev,
                mobile_background_image: null,
            }))
        }
    }

    const [componentOption, setComponentOptions] = useState(initialValue.component_type)
    const [borderForm, setBorderForm] = useState(initialValue.border)
    const [webBorderForm, setWebBorderForm] = useState<boolean>(initialValue.web_border)
    const [nameForm, setNameForm] = useState(initialValue.name)
    const [webNameForm, setWebNameForm] = useState(initialValue.web_name)
    const [footerAlignForm, setFooterAlignForm] = useState(initialValue.name_footer)
    const [webFooterAlignForm, setWebFooterAlignForm] = useState(initialValue.web_name_footer)
    const [sectionBorderShow, setSectioBorderShow] = useState(initialValue.section_border)
    const [webSectionBorderShow, setWebSectioBorderShow] = useState(initialValue.web_section_border)
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
                />
            </Modal>
        </>
    )
}

export default PageModal
