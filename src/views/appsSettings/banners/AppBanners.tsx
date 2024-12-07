/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { BANNERMODEL } from './BannerCommon'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Modal, notification } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'
import EasyTable from '@/common/EasyTable'
import { Dropdown } from '@/components/ui'
import { BANNER_PAGE_NAME } from '@/common/banner'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import _ from 'lodash'
import { MdCancel } from 'react-icons/md'

type Option = {
    value: number
    label: string
}

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const AppBanners = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { var1, var2 } = location.state || {}
    const [data, setData] = useState<BANNERMODEL[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(var1 ? var1 : BANNER_PAGE_NAME[0])
    const [sectionHeadingArray, setSectionHeadingArray] = useState<any[]>()
    const [isSectionheading, setIsSectionheading] = useState(false)
    const [selectedHeading, setSelectedHeading] = useState(var2 ? var2 : 'Select Section')
    const [bannerid, setBannerid] = useState<number>()
    const [isFilterOn, setIsFilterOn] = useState(false)

    console.log('var1', var1, 'var2', var2)

    const fetchData = async (page: number, pageSize: number, filter: string) => {
        let sectionHeading = ''
        if (var2) {
            sectionHeading = `&section_heading=${var2}`
        }
        if (isSectionheading && selectedHeading !== 'Select Section') {
            sectionHeading = `&section_heading=${selectedHeading}`
        }
        try {
            const response = await axiosInstance.get(
                `/banners?p=${page}&page_size=${pageSize}&name=${filter}&page=${currentSelectedPage.value}${sectionHeading}`,
            )
            const data = response.data.data.results

            const total = response.data.data.count
            setData(data)

            setTotalData(total)

            const count = response.data.data.count
            setData(data)
            setTotalData(count)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchForSectionHeading = async () => {
        try {
            let page = 1
            let hasMore = true
            let allSectionHeadings: any = []

            while (hasMore) {
                const response = await axiosInstance.get(`/banners?p=${page}`)
                const data = response.data.data
                const newSectionHeadings = data.results.map((item) => item.section_heading)
                allSectionHeadings = _.uniq(allSectionHeadings.concat(newSectionHeadings))
                if (data.next) {
                    page++
                } else {
                    hasMore = false
                }
            }

            setSectionHeadingArray(allSectionHeadings)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchForSectionHeading()
    }, [])

    console.log('Section Heading Array', sectionHeadingArray)

    useEffect(() => {
        fetchData(page, pageSize, globalFilter)
    }, [page, pageSize, globalFilter, currentSelectedPage, selectedHeading])

    const handleSectionHeading = (selectedKey: string) => {
        setSelectedHeading(selectedKey)
        setIsSectionheading(true)
    }

    const columns = useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button className="border-none bg-none">
                        <a href={`/app/appSettings/banners/${row.original.id}`} target="_blank" rel="noreferrer">
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                        {/* <FaEdit className="text-xl text-blue-600" /> */}
                    </button>
                ),
            },
            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button onClick={() => handleDeleteClick(row.original.id)} className="border-none bg-none">
                        <FaTrash className="text-xl text-red-500" />
                    </button>
                ),
            },

            { header: 'Name', accessorKey: 'name' },
            { header: 'Position', accessorKey: 'position' },
            { header: 'Section Heading', accessorKey: 'section_heading' },
            {
                header: 'Brand Name',
                accessorKey: 'brand.name',
                cell: (info: any) => info.row.original.brand.map((item: any, key: number) => <div key={key}>{item.name}</div>),
            },
            {
                header: 'DIVISION Name',
                accessorKey: 'division.name',
                cell: (info: any) => info.row.original.division.map((item: any, key: number) => <div key={key}>{item.name}</div>),
            },

            {
                header: 'Category Name',
                accessorKey: 'category.name',
                cell: (info) => info.row.original.category.map((item: any, key: number) => <div key={key}>{item.name}</div>),
            },

            {
                header: 'Sub Category Name',
                accessorKey: 'sub_category',
                cell: (info: any) => info.row.original.sub_category.map((item: any, key: number) => <div key={key}>{item.name}</div>),
            },
            {
                header: 'Product Type Name',
                accessorKey: 'product_type',
                cell: (info: any) => info.row.original.product_type.map((item: any, key: number) => <div key={key}>{item.name}</div>),
            },
            {
                header: 'Image (WEB)',
                accessorKey: 'image_web',
                cell: (info) =>
                    info.getValue() ? (
                        <img src={info.getValue()?.split(',')[0]} alt="" className=" object-contain w-[100px] h-[100xp] " />
                    ) : (
                        ''
                    ),
            },
            {
                header: 'Image (Mobile)',
                accessorKey: 'image_mobile',
                cell: (info) =>
                    info.getValue() ? <img src={info.getValue()?.split(',')[0]} alt="" className=" object-contain w-[100px]  " /> : '',
            },

            { header: 'Upto Off', accessorKey: 'uptoff' },

            { header: 'Footer', accessorKey: 'footer' },
            { header: 'Coupon Code', accessorKey: 'coupon_code' },
            { header: 'Is Clickable', accessorKey: 'is_clickable' },
            {
                header: 'Section Background Web',
                accessorKey: 'section_background_web',
                cell: ({ getValue }) => {
                    const imageUrl = getValue() as string
                    console.log('SECTION URL:', imageUrl)

                    return <img src={imageUrl} alt="Image" style={{ width: '100px', height: 'auto' }} />
                },
            },

            { header: 'Max Price', accessorKey: 'max_price' },
            { header: 'Min Price', accessorKey: 'min_price' },
            { header: 'Barcodes', accessorKey: 'barcodes' },
            {
                header: 'Redirection URL',
                accessorKey: 'redirection_url',
                cell: ({ row }) => (
                    <div className="w-[180px] text-overflow:ellipsis">
                        <a href={row.original.redirection_url}> {row.original.redirection_url}</a>
                    </div>
                ),
            },

            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button onClick={() => handleDeleteClick(row.original.id)} className="border-none bg-none">
                        <FaTrash className="text-xl text-red-500" />
                    </button>
                ),
            },
        ],
        [],
    )

    const handleSelectPage = (value: string) => {
        const selectedPage = BANNER_PAGE_NAME.find((page) => page.value === value)
        if (selectedPage) setCurrentSelectedPage(selectedPage)
    }

    const handleDeleteClick = (id: number) => {
        setShowDeleteModal(true)
        setBannerid(id)
    }

    const handleCloseModal = () => {
        setShowDeleteModal(false)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleBanner = () => {
        navigate('/app/appSettings/banners/addNew')
    }

    const deleteBanner = async () => {
        const formData = {
            banner_id: bannerid,
        }
        console.log('data', formData)
        try {
            const response = await axiosInstance.delete(`/banners`, {
                data: formData,
            })
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'User has benn Successfully deleted',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Unable to delete',
            })
        }

        setShowDeleteModal(false)
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>

                <div className="flex gap-3 items-center justify-center order-first xl:order-none">
                    <div className="flex items-end justify-end mb-2 gap-2">
                        <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border bg-gray-200 text-black text-lg font-semibold"
                                title={currentSelectedPage.name}
                                onSelect={handleSelectPage}
                            >
                                {BANNER_PAGE_NAME.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item.value}>
                                        {item.name}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

                        <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border  bg-gray-200 text-black text-lg font-semibold"
                                title={selectedHeading}
                                onSelect={handleSectionHeading}
                            >
                                {sectionHeadingArray?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item}>
                                        {item}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                        <div>
                            <button className="" onClick={() => setSelectedHeading('Select Section')}>
                                <MdCancel className="text-xl text-red-500 " />
                            </button>
                        </div>
                        <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-700" onClick={handleBanner}>
                            ADD NEW BANNER
                        </button>
                    </div>
                </div>
            </div>
            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
            {showDeleteModal && (
                <Modal
                    title=""
                    open={showDeleteModal}
                    onOk={deleteBanner}
                    onCancel={handleCloseModal}
                    okText="DELETE"
                    okButtonProps={{
                        style: { backgroundColor: 'red', borderColor: 'red' },
                    }}
                >
                    <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                        <IoWarningOutline className="text-red-600 text-4xl" /> ARE YOU SURE YOU WANT TO DELETE THE BANNER Id: {bannerid} !!
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default AppBanners
