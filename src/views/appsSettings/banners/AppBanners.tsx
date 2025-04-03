/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { BANNERMODEL } from './BannerCommon'
import { FaEdit, FaSync, FaTrash } from 'react-icons/fa'
import { Modal, notification } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'
import EasyTable from '@/common/EasyTable'
import { Button, Dropdown, Input } from '@/components/ui'
import { BANNER_PAGE_NAME } from '@/common/banner'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import _ from 'lodash'
import { MdCancel } from 'react-icons/md'
import BulkEditModal from './BulkEditModal'

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
    const [bannerIdStore, setBannerIdStore] = useState<any[]>([])
    const [showBannerEditButton, setShowBannerIdButton] = useState(false)
    const [showBulkEditModal, setShowBulkEditModal] = useState(false)
    const [updatedPosition, setUpdatedPosition] = useState<{
        [key: number]: number
    }>({})
    const [isSelectAllBanner, setIsSelectAllBanner] = useState(false)

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
                const response = await axiosInstance.get(`/banners?p=${page}&page=${currentSelectedPage.value}`)
                const data = response.data.data
                const newSectionHeadings = data.results.map((item: any) => item.section_heading)
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
    }, [currentSelectedPage])

    useEffect(() => {
        fetchData(page, pageSize, globalFilter)
    }, [page, pageSize, globalFilter, currentSelectedPage, selectedHeading])

    const handleSectionHeading = (selectedKey: string) => {
        setSelectedHeading(selectedKey)
        setIsSectionheading(true)
    }

    const handleSelectAllBanners = (e) => {
        if (e.target.checked) {
            const allIds = data.map((banner) => banner.id)
            setBannerIdStore(allIds)
            setIsSelectAllBanner(true)
            setShowBannerIdButton(true)
        } else {
            handleSelectEmptyBanners()
        }
    }

    const handleSelectEmptyBanners = () => {
        setIsSelectAllBanner(false)
        setBannerIdStore([])
        setShowBannerIdButton(false)
    }

    const columns = useMemo(
        () => [
            {
                header: (
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <input
                            type="checkbox"
                            name="selectAll"
                            checked={data.length > 0 && bannerIdStore.length === data.length}
                            onChange={handleSelectAllBanners}
                        />
                    </div>
                ),
                accessorKey: 'id',
                cell: ({ row }) => {
                    const bannerId = row.original.id
                    return (
                        <div className="flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="bannerId"
                                checked={bannerIdStore.includes(bannerId)}
                                onChange={(e) => handleSelectBannerId(bannerId, e.target.checked)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button className="border-none bg-none">
                        <a href={`/app/appSettings/banners/${row.original.id}`} target="_blank" rel="noreferrer">
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </button>
                ),
            },
            { header: 'Name', accessorKey: 'name' },
            {
                header: 'Position',
                accessorKey: 'position',
                cell: ({ getValue, row }) => {
                    const stockId = row.original.id
                    const position = updatedPosition[stockId] ?? row.original.position
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px] "
                                type="number"
                                min={0}
                                value={position}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUpdate(row.original.id, row.original.position)
                                    }
                                }}
                                onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
                            />
                            <div>
                                <button
                                    className="px-4 py-2 bg-none text-xl rounded font-bold text-green-600"
                                    onClick={() => handleUpdate(row.original.id, row.original.position)}
                                >
                                    <FaSync />
                                </button>
                            </div>
                        </div>
                    )
                },
            },
            { header: 'Section Heading', accessorKey: 'section_heading' },
            {
                header: 'Brand Name',
                accessorKey: 'brand',
                cell: (info: any) => info.row.original.brand.map((item: any, key: number) => <div key={key}>{item.name}</div>),
            },
            {
                header: 'DIVISION Name',
                accessorKey: 'division',
                cell: (info: any) => info.row.original.division.map((item: any, key: number) => <div key={key}>{item.name}</div>),
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
            {
                header: 'From Update',
                accessorKey: 'from_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'To Update',
                accessorKey: 'to_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
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
        [bannerIdStore, updatedPosition],
    )

    const handleSelectBannerId = (id: number, isChecked: boolean) => {
        setShowBannerIdButton(true)
        setBannerIdStore((prev) => {
            if (isChecked) {
                return [...prev, id]
            } else {
                return prev.filter((item) => item !== id)
            }
        })
    }

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setUpdatedPosition((prevQuantities) => ({
            ...prevQuantities,
            [id]: newQuantity,
        }))
    }

    console.log('Banner_Id', bannerIdStore)

    const handleUpdate = async (id: any, position: any) => {
        const positionData = updatedPosition[id] ?? null
        console.log('position data is', positionData, 'for the id', id)

        const body = {
            position: positionData ?? position,
            banner_id: id,
        }

        console.log('bdou is', body)

        try {
            const response = await axiosInstance.patch(`/banners`, body)
            notification.success({
                message: 'SUCCESS',
                description: response?.data?.message || 'UPDATE SUCCESS',
            })
        } catch (error) {
            console.error(error)
        }
    }

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

    const handleBulkEditModal = () => {
        setShowBulkEditModal(true)
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={globalFilter}
                        className="p-2 border rounded"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <div className="bg-gray-200 px-1 rounded-lg font-bold text-[15px]">
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

                        <div className="bg-gray-200 px-1 rounded-lg font-bold text-[15px]">
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
                        <div className="items-center flex justify-center">
                            <button className="" onClick={() => setSelectedHeading('Select Section')}>
                                <MdCancel className="text-xl text-red-500 " />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 items-center justify-center order-first xl:order-none">
                    <div className="mb-2">
                        {bannerIdStore.length > 0 && (
                            <div className="flex gap-2 items-center">
                                <Button variant="new" size="sm" onClick={handleBulkEditModal}>
                                    Bulk Edit
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-end justify-end mb-2 gap-2">
                        <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-700" onClick={handleBanner}>
                            ADD NEW BANNER
                        </button>
                    </div>
                </div>
            </div>
            <EasyTable isNotSort mainData={data} columns={columns} page={page} pageSize={pageSize} />
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
            {showBulkEditModal && (
                <BulkEditModal dialogIsOpen={showBulkEditModal} setIsOpen={setShowBulkEditModal} bannerIdStore={bannerIdStore} />
            )}
        </div>
    )
}

export default AppBanners
