/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useLocation, useNavigate } from 'react-router-dom'
import { BANNER_MODEL } from './BannerCommon'
import { notification } from 'antd'
import EasyTable from '@/common/EasyTable'
import { Button, Dropdown, Spinner } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import _ from 'lodash'
import BulkEditModal from './BulkEditModal'
import { useBannerColumns } from './bannerUtils/BannerColumns'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { pageSizeOptions } from '@/views/category-management/orderlist/commontypes'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import DeleteBannerModal from './editBanner/component/DeleteBannerModal'
import { fetchForSectionHeading } from './bannerUtils/bannerFunctions'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import ClearCache from '@/common/ClearCache'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'

const AppBanners = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { var1, var2, var3 } = location.state || {}
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
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })

    const DivisionArray =
        divisions?.divisions?.map((item) => {
            return { name: item?.name, value: item?.name }
        }) || []

    const { data: pageData } = useFetchApi<pageNameTypes>({ url: `/page?p=1&page_size=500` })
    const BANNER_PAGE_NAME = pageData?.map((item) => ({
        name: item?.display_name,
        value: item?.name,
    }))
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(
        var1 !== undefined ? { name: var1, value: var1 } : BANNER_PAGE_NAME[0],
    )
    const query = useMemo(() => {
        return `/subpage?page=${currentSelectedPage?.name}`
    }, [currentSelectedPage])
    const { data: subPageData } = useFetchSingleData<any>({ url: query })
    const SUB_PAGE_NAME = subPageData?.map((item: any) => ({
        name: item?.name,
        value: item?.name,
    }))
    const [currentSelectedSubPage, setCurrentSelectedSubPage] = useState<Record<string, string>>(
        var3 !== undefined ? { name: var3, value: var3 } : { name: '', value: null },
    )
    useEffect(() => {
        if (!var1) {
            setCurrentSelectedPage(BANNER_PAGE_NAME[0])
        }
    }, [pageData])

    useEffect(() => {
        fetchForSectionHeading(currentSelectedPage, currentSelectedSubPage)
            .then((data) => {
                setSectionHeadingArray(data)
            })
            .catch((error) => {
                console.error('Error fetching section headings:', error)
            })
    }, [currentSelectedPage, currentSelectedSubPage])

    const queryURL = useMemo(() => {
        let sectionHeading = ''
        let subPage = ''
        if (var2) {
            sectionHeading = `&section_heading=${encodeURIComponent(var2)}`
        }
        if (isSectionHeading && selectedHeading !== 'Select Section') {
            sectionHeading = `&section_heading=${encodeURIComponent(selectedHeading)}`
        }
        if (currentSelectedSubPage) {
            subPage = `&sub_page=${encodeURIComponent(currentSelectedSubPage?.name)}`
        }
        const divisionFilter = selectedDivision !== 'Select Division' ? `&division=${encodeURIComponent(selectedDivision)}` : ''
        return `/banners?p=${page}&page_size=${pageSize}&name=${debounceFilter}&page=${currentSelectedPage?.value}${sectionHeading}${divisionFilter}${subPage}`
    }, [
        page,
        pageSize,
        debounceFilter,
        currentSelectedPage,
        selectedHeading,
        selectedDivision,
        var2,
        isSectionHeading,
        currentSelectedSubPage,
    ])

    const { data, totalData, loading } = useFetchApi<BANNER_MODEL>({ url: queryURL })
    const filteredSectionHeadings = _.uniq(sectionHeadingArray)?.filter((item) => item.toLowerCase().includes(sectionFilter.toLowerCase()))

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
        const body = { position: positionData ?? position, banner_id: id }
        try {
            const response = await axiosInstance.patch(`/banners`, body)
            notification.success({ message: response?.data?.message || 'UPDATE SUCCESS' })
        } catch (error) {
            console.error(error)
        }
    }

    const handleSelectPage = (value: string) => {
        const selectedPage = BANNER_PAGE_NAME.find((page) => page.value === value)
        if (selectedPage) setCurrentSelectedPage(selectedPage)
    }
    const handleSelectSubPage = (value: string) => {
        const selectedPage = SUB_PAGE_NAME.find((page: any) => page.value === value)
        if (selectedPage) setCurrentSelectedSubPage(selectedPage)
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
        <div className="shadow-md p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col xl:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={globalFilter}
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full xl:w-60"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <div className="bg-gray-200 rounded-xl font-semibold">
                        <Dropdown
                            className="border border-gray-300 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                            title={currentSelectedPage?.name || 'Select Page'}
                            onSelect={handleSelectPage}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {BANNER_PAGE_NAME.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item.value}>
                                        {item.name}
                                    </DropdownItem>
                                ))}
                            </div>
                        </Dropdown>
                    </div>
                    <div className="bg-gray-200 rounded-xl font-semibold">
                        <Dropdown
                            className="border border-gray-300 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                            title={currentSelectedSubPage?.name || 'Select Sub Page'}
                            onSelect={handleSelectSubPage}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {SUB_PAGE_NAME?.map((item: any) => (
                                    <DropdownItem key={item.value} eventKey={item.name}>
                                        {item.name}
                                    </DropdownItem>
                                ))}
                            </div>
                            <div
                                className="mt-3 px-3 py-1 rounded-md text-white text-center bg-red-500 hover:bg-red-400 cursor-pointer"
                                onClick={() => setCurrentSelectedSubPage({ name: '', value: '' })}
                            >
                                Clear
                            </div>
                        </Dropdown>
                    </div>
                    <div className="bg-gray-200 rounded-xl font-semibold">
                        <Dropdown
                            className="border border-gray-300 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                            title={selectedHeading}
                            onSelect={handleSectionHeading}
                        >
                            <div className="px-2 py-1">
                                <input
                                    type="search"
                                    placeholder="Search Section Heading"
                                    value={sectionFilter}
                                    className="w-full h-8 px-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400"
                                    onChange={(e) => setSectionFilter(e.target.value)}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {filteredSectionHeadings?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item}>
                                        {item}
                                    </DropdownItem>
                                ))}
                            </div>
                            <div
                                className="mt-3 px-3 py-1 rounded-md text-white text-center bg-red-500 hover:bg-red-400 cursor-pointer"
                                onClick={() => setSelectedHeading('Select Section')}
                            >
                                Clear
                            </div>
                        </Dropdown>
                    </div>
                    <div className="bg-gray-200  rounded-xl font-semibold ">
                        <Dropdown
                            className="border border-gray-600 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                            title={selectedDivision}
                            onSelect={(e) => setSelectedDivision(e)}
                        >
                            <div className="max-h-40 overflow-y-auto">
                                {DivisionArray?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        {item.name}
                                    </DropdownItem>
                                ))}
                            </div>
                            <div
                                className="mt-3 px-3 py-1 rounded-md text-white text-center bg-red-500 hover:bg-red-400 cursor-pointer"
                                onClick={() => setSelectedDivision('Select Division')}
                            >
                                Clear
                            </div>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {bannerIdStore.length > 0 && (
                        <Button
                            variant="new"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2"
                            onClick={() => setShowBulkEditModal(true)}
                        >
                            Bulk Edit
                        </Button>
                    )}
                    <ClearCache cacheKey="banner" />
                    <button
                        className="bg-black hover:bg-gray-800 text-white rounded-lg px-5 py-2"
                        onClick={() => navigate('/app/appSettings/banners/addNew')}
                    >
                        Add New Banner
                    </button>
                </div>
            </div>
            <div>
                {loading && (
                    <div className="flex items-center justify-center mt-2 mb-2">
                        <Spinner size={30} />
                    </div>
                )}
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
                <BulkEditModal
                    pageState={currentSelectedPage?.name}
                    dialogIsOpen={showBulkEditModal}
                    setIsOpen={setShowBulkEditModal}
                    bannerIdStore={bannerIdStore}
                />
            )}
        </div>
    )
}

export default AppBanners
