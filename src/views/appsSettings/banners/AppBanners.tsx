/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useLocation, useNavigate } from 'react-router-dom'
import { BANNER_MODEL } from './BannerCommon'
import { notification } from 'antd'
import EasyTable from '@/common/EasyTable'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import _ from 'lodash'
import BulkEditModal from './BulkEditModal'
import { BANNER_PAGE_NAME } from '@/common/banner'
import { useBannerColumns } from './bannerUtils/BannerColumns'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { pageSizeOptions } from '@/views/category-management/orderlist/commontypes'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import DeleteBannerModal from './editBanner/component/DeleteBannerModal'
import { fetchForSectionHeading } from './bannerUtils/bannerFunctions'

const AppBanners = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { var1, var2 } = location.state || {}
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [sectionHeadingArray, setSectionHeadingArray] = useState<any[]>()
    const [isSectionHeading, setIsSectionHeading] = useState(false)
    const [selectedHeading, setSelectedHeading] = useState(var2 ? var2 : 'Select Section')
    const [selectedDivision, setSelectedDivision] = useState('Select Division')
    const [bannerId, setBannerId] = useState<number>()
    const [bannerIdStore, setBannerIdStore] = useState<any[]>([])
    const [showBulkEditModal, setShowBulkEditModal] = useState(false)
    const [updatedPosition, setUpdatedPosition] = useState<{ [key: number]: number }>({})
    const [sectionFilter, setSectionFilter] = useState<string>('')
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(var1 !== undefined ? var1 : BANNER_PAGE_NAME[0])

    const DivisionArray =
        divisions?.divisions?.map((item) => {
            return { name: item?.name, value: item?.name }
        }) || []

    //NOTE: FOR FETCHING PAGE NAMES Dynamically.......will fix it later
    // useEffect(() => {
    //     fetchPageSettings(setPageNames, setCurrentSelectedPage)
    // }, [])

    // const BANNER_PAGE_NAME = pageNames?.map((item) => ({
    //     name: item?.display_name,
    //     value: item?.name,
    // }))

    useEffect(() => {
        fetchForSectionHeading(currentSelectedPage)
            .then((data) => {
                setSectionHeadingArray(data)
            })
            .catch((error) => {
                console.error('Error fetching section headings:', error)
            })
    }, [currentSelectedPage])

    const queryURL = useMemo(() => {
        let sectionHeading = ''
        if (var2) {
            sectionHeading = `&section_heading=${encodeURIComponent(var2)}`
        }
        if (isSectionHeading && selectedHeading !== 'Select Section') {
            sectionHeading = `&section_heading=${encodeURIComponent(selectedHeading)}`
        }
        const divisionFilter = selectedDivision !== 'Select Division' ? `&division=${encodeURIComponent(selectedDivision)}` : ''
        return `/banners?p=${page}&page_size=${pageSize}&name=${globalFilter}&page=${currentSelectedPage.value}${sectionHeading}${divisionFilter}`
    }, [page, pageSize, globalFilter, currentSelectedPage, selectedHeading, selectedDivision, var2, isSectionHeading])

    const { data, totalData, responseStatus } = useFetchApi<BANNER_MODEL>({ url: queryURL })
    const filteredSectionHeadings = _.uniq(sectionHeadingArray)?.filter((item) => item.toLowerCase().includes(sectionFilter.toLowerCase()))

    console.log('response Status', responseStatus)

    const handleSectionHeading = (selectedKey: string) => {
        setSelectedHeading(selectedKey)
        setIsSectionHeading(true)
    }

    const handleSelectAllBanners = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = data.map((banner) => banner.id)
            setBannerIdStore(allIds)
        } else {
            setBannerIdStore([])
        }
    }

    const handleSelectBannerId = (id: number, isChecked: boolean) => {
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

    const handleUpdate = async (id: any, position: any) => {
        const positionData = updatedPosition[id] ?? null
        const body = {
            position: positionData ?? position,
            banner_id: id,
        }
        try {
            const response = await axiosInstance.patch(`/banners`, body)
            notification.success({
                message: response?.data?.message || 'UPDATE SUCCESS',
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
        setBannerId(id)
    }

    const columns = useBannerColumns({
        data,
        bannerIdStore,
        updatedPosition,
        handleSelectAllBanners,
        handleSelectBannerId,
        handleUpdate,
        handleQuantityChange,
        handleDeleteClick,
    })

    return (
        <div className="shadow-md p-4 bg-gray-50 rounded-lg">
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
                        <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border bg-gray-200 text-black text-lg font-semibold"
                                title={currentSelectedPage?.name}
                                onSelect={handleSelectPage}
                            >
                                {BANNER_PAGE_NAME.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item.value}>
                                        {item.name}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

                        <div className="bg-gray-200 max-h-[140px] px-1 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border   text-black text-lg font-semibold "
                                title={selectedHeading}
                                onSelect={handleSectionHeading}
                            >
                                <div className="mt-2 mb-2">
                                    <input
                                        className="flex h-[30px] items-center rounded-xl"
                                        placeholder="Search Section Heading"
                                        type="search"
                                        value={sectionFilter}
                                        onChange={(e) => setSectionFilter(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:h-[400px] xl:overflow-y-scroll font-bold ">
                                    {filteredSectionHeadings?.map((item, key) => (
                                        <DropdownItem key={key} eventKey={item} className="h-1">
                                            {item}
                                        </DropdownItem>
                                    ))}
                                </div>
                                <div
                                    className="flex mt-3 justify-center items-center rounded-lg cursor-pointer text-white bg-red-500 hover:bg-red-400"
                                    onClick={() => setSelectedHeading('Select Section')}
                                >
                                    Clear
                                </div>
                            </Dropdown>
                        </div>
                        <div className="bg-gray-200 h-auto scrollbar-hide px-1 rounded-lg font-bold text-[15px]">
                            <Dropdown
                                className="border   text-black text-lg font-semibold "
                                title={selectedDivision}
                                onSelect={(e) => {
                                    setSelectedDivision(e)
                                }}
                            >
                                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:h-[150px] xl:overflow-y-scroll font-bold ">
                                    {DivisionArray?.map((item, key) => (
                                        <DropdownItem key={key} eventKey={item.value} className="h-1">
                                            {item.name}
                                        </DropdownItem>
                                    ))}
                                </div>
                                <div
                                    className="flex mt-3 justify-center items-center rounded-lg cursor-pointer text-white bg-red-500 hover:bg-red-400"
                                    onClick={() => setSelectedDivision('Select Division')}
                                >
                                    Clear
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 items-center justify-center order-first xl:order-none">
                    <div className="mb-2">
                        {bannerIdStore.length > 0 && (
                            <div className="flex gap-2 items-center">
                                <Button variant="new" size="sm" onClick={() => setShowBulkEditModal(true)}>
                                    Bulk Edit
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-end justify-end mb-2 gap-2">
                        <button
                            className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-700"
                            onClick={() => {
                                navigate('/app/appSettings/banners/addNew')
                            }}
                        >
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
                        onChange={(option) => {
                            if (option) {
                                setPage(1)
                                setPageSize(option?.value)
                            }
                        }}
                    />
                </div>
            </div>
            {showDeleteModal && <DeleteBannerModal isOpen={showDeleteModal} setIsOpen={setShowDeleteModal} bannerId={bannerId!} />}
            {showBulkEditModal && (
                <BulkEditModal dialogIsOpen={showBulkEditModal} setIsOpen={setShowBulkEditModal} bannerIdStore={bannerIdStore} />
            )}
        </div>
    )
}

export default AppBanners
