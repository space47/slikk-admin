/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useLocation, useNavigate } from 'react-router-dom'
import { BANNER_MODEL } from './BannerCommon'
import { notification, Select } from 'antd'
import EasyTable from '@/common/EasyTable'
import { Button, Spinner } from '@/components/ui'
import _ from 'lodash'
import BulkEditModal from './BulkEditModal'
import { useBannerColumns } from './bannerUtils/BannerColumns'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import DeleteBannerModal from './editBanner/component/DeleteBannerModal'
import { fetchForSectionHeading } from './bannerUtils/bannerFunctions'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import ClearCache from '@/common/ClearCache'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import PageCommon from '@/common/PageCommon'
import { GiRolledCloth } from 'react-icons/gi'
import { FaFile, FaCopy, FaLayerGroup, FaSitemap, FaEdit, FaPlus } from 'react-icons/fa'
import BulkDuplicate from './BulkDuplicate'

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
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const [showDuplicate, setShowDuplicate] = useState(false)
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })

    const DivisionArray =
        divisions?.divisions?.map((item) => {
            return { name: item?.name, value: item?.name }
        }) || []

    const { data: pageData } = useFetchApi<pageNameTypes>({ url: `/page?dashboard=true&p=1&page_size=500` })
    const BANNER_PAGE_NAME = pageData?.map((item) => ({
        name: item?.display_name,
        value: item?.name,
    }))
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(
        var1 !== undefined ? { name: var1, value: var1 } : BANNER_PAGE_NAME[0],
    )
    const query = useMemo(() => {
        return `/subpage?dashboard=true&page=${currentSelectedPage?.name}`
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
        let division = ''
        if (selectedDivision && selectedDivision !== 'Select Division') {
            division = `&division=${encodeURIComponent(selectedDivision)}`
        }

        return `/banners?p=${page}&page_size=${pageSize}&name=${debounceFilter}&page=${currentSelectedPage?.value}${sectionHeading}${division}${subPage}`
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
    const filteredSectionHeadings = _.uniq(sectionHeadingArray)

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
        const selectedPage = BANNER_PAGE_NAME?.find((page) => page.value === value)
        if (selectedPage) setCurrentSelectedPage(selectedPage)
    }
    const handleSelectSubPage = (value: string) => {
        const selectedPage = SUB_PAGE_NAME.find((page: any) => page.value === value)
        if (selectedPage) setCurrentSelectedSubPage(selectedPage)
    }

    console.log('selected division', selectedDivision)

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
            <div className="max-w-[1920px] mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <GiRolledCloth className="text-2xl text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white">Banner Management</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-md">Manage and organize Slikk banners</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 mb-8">
                    <div className="mb-6">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white ">Filter & Search Banners</h2>
                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <ClearCache cacheKey="banner" />
                                    {bannerIdStore.length > 0 && (
                                        <Button variant="new" size="sm" icon={<FaEdit />} onClick={() => setShowBulkEditModal(true)}>
                                            Bulk Edit ({bannerIdStore.length})
                                        </Button>
                                    )}
                                    {bannerIdStore.length > 0 && (
                                        <Button variant="new" size="sm" icon={<FaCopy />} onClick={() => setShowDuplicate(true)}>
                                            Bulk Duplicate ({bannerIdStore.length})
                                        </Button>
                                    )}
                                </div>

                                <Button
                                    variant="new"
                                    size="sm"
                                    icon={<FaPlus className="group-hover:rotate-90 transition-transform" />}
                                    onClick={() => navigate('/app/appSettings/banners/addNew')}
                                >
                                    Add New Banner
                                </Button>
                            </div>
                        </div>
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search banners by name..."
                                value={globalFilter}
                                className="pl-10 w-full p-4 border border-gray-300 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FaFile className="text-blue-500" />
                                    Page
                                </label>
                                <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    value={currentSelectedPage?.name || undefined}
                                    placeholder="Select Page"
                                    options={BANNER_PAGE_NAME?.map((item: any) => ({
                                        label: item.name,
                                        value: item.value,
                                    }))}
                                    onChange={(value) => {
                                        const item = BANNER_PAGE_NAME?.find((i: any) => i.value === value)
                                        handleSelectPage(item?.name as string)
                                        setCurrentSelectedPage(item || { name: '', value: '' })
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FaCopy className="text-green-500" />
                                    Sub-page
                                </label>
                                <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    value={currentSelectedSubPage?.value || undefined}
                                    placeholder="Select Sub-page"
                                    options={SUB_PAGE_NAME?.map((item: any) => ({
                                        label: item.name,
                                        value: item.value,
                                    }))}
                                    onChange={(value) => {
                                        const item = SUB_PAGE_NAME?.find((i: any) => i.value === value)
                                        handleSelectSubPage(item?.name)
                                        setCurrentSelectedSubPage(item || { name: '', value: '' })
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FaLayerGroup className="text-purple-500" />
                                    Section
                                </label>
                                <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    value={selectedHeading || undefined}
                                    placeholder="Select Section"
                                    optionFilterProp="label"
                                    onChange={(value) => {
                                        setSelectedHeading(value || 'Select Section')
                                        setIsSectionHeading(!!value)
                                    }}
                                    options={filteredSectionHeadings.map((item) => ({
                                        label: item,
                                        value: item,
                                    }))}
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FaSitemap className="text-orange-500" />
                                    Division
                                </label>
                                <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    value={selectedDivision || 'Select Division'}
                                    placeholder="Select Division"
                                    options={DivisionArray?.map((item: any) => ({
                                        label: item.name,
                                        value: item.value,
                                    }))}
                                    onChange={(value) => {
                                        setSelectedDivision(value)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {loading && (
                        <div className="flex items-center justify-center mt-2 mb-2 py-8">
                            <div className="flex items-center gap-3">
                                <Spinner size={30} />
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Loading banners...</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
                </div>
                <div className="mt-6">
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
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
                {showDuplicate && (
                    <BulkDuplicate
                        pageState={currentSelectedPage?.name}
                        dialogIsOpen={showDuplicate}
                        setIsOpen={setShowDuplicate}
                        bannerIdStore={bannerIdStore}
                    />
                )}
            </div>
        </div>
    )
}

export default AppBanners
