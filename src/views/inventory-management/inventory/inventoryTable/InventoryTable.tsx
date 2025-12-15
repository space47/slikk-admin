/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react'
import { useInventoryApi } from '../inventoryUtils/useInventoryApi'
import { Button, Dropdown, Select, Spinner } from '@/components/ui'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { InventoryFilters } from '../inventoryUtils/inventoryCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useInventoryLocationColumns } from '../inventoryUtils/useInventoryLocationTable'
import ImageMODAL from '@/common/ImageModal'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import LocationTransferModal from '../inventoryUtils/locationTransferModal'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import SyncInventoryModal from '../inventoryUtils/SyncInventoryModal'
import ClearInventoryModal from '../inventoryUtils/ClearInventoryModal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'
import { Filter } from 'lucide-react'
import FilterProductCommon from '@/common/FilterProductCommon'
import { FaStore } from 'react-icons/fa'
import PageCommon from '@/common/PageCommon'
import { BsBoxSeam } from 'react-icons/bs'
import { FiGrid } from 'react-icons/fi'
import { HiRefresh } from 'react-icons/hi'

const InventoryTable = () => {
    const locationInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const qtyInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const [storeCode, setStoreCode] = useState('')
    const [storeId, setStoreId] = useState<number | null>(null)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularRowImage] = useState<string | null>('')
    const [locationTransferModal, setLocationTransferModal] = useState(false)
    const [searchType, setSearchType] = useState<{ value: string; label?: string }>(InventoryFilters[0])
    const [isInventorySync, setIsInventorySync] = useState(false)
    const [clearInventory, setClearInventory] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [typeFetch, setTypeFetch] = useState('')
    const [brandList, setBrandList] = useState([])
    const [sortByFilter, setSortByFilter] = useState('')

    const {
        data,
        responseStatus,
        totalData,
        setPage,
        setPageSize,
        setGlobalFilter,
        page,
        pageSize,
        query,
        totalQuantity,
        globalFilter,
        loading,
        refetch,
    } = useInventoryApi({
        searchType,
        store_code: storeCode,
        typeFetch: typeFetch,
        sortByFilter,
    })

    const handleOpenModal = (img: string) => {
        setParticularRowImage(img)
        setShowImageModal(true)
    }

    const columns = useInventoryLocationColumns({
        handleOpenModal,
        locationInputRef,
        qtyInputRef,
        storeCode,
        setLocationTransferModal,
    })

    const handleDownload = async () => {
        try {
            setSpinner(true)
            const res = await axioisInstance.get(`${query()}+&download=true`)
            notification.success({ message: res?.data?.message || 'Successfully downloaded' })
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setSpinner(false)
        }
    }

    if (responseStatus === 403) {
        return <AccessDenied />
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <BsBoxSeam className="text-blue-600 xl:text-4xl text-xl dark:text-blue-400" />
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Inventory Location</h1>
                </div>
                <p className="text-gray-600">Manage Slikk Inventory Location</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <FaStore className="text-blue-600 text-lg" />
                    <h2 className="text-lg font-semibold text-gray-800">Store Selection</h2>
                </div>
                <div className="max-w-md">
                    <Select
                        isClearable
                        className="w-full"
                        placeholder="Choose a store..."
                        options={storeList}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(selectedOptions) => {
                            setStoreId(selectedOptions?.id || null)
                            setStoreCode(selectedOptions?.code || '')
                        }}
                    />
                </div>
            </div>
            {storeCode && storeCode !== '' && (
                <div className="flex flex-col xl:flex-row xl:justify-between shadow-xl p-6 bg-white rounded-xl items-center gap-4 mb-10">
                    <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <input
                                type="search"
                                placeholder="Search SKU/Name"
                                value={globalFilter}
                                className="p-2 border rounded shadow-md w-full sm:w-auto"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                            <div className="bg-gray-100 items-center rounded-md dark:bg-blue-600 dark:text-white">
                                <Dropdown
                                    className="text-xl text-black bg-gray-200 font-bold"
                                    title={searchType?.label ? searchType.label : 'SELECT'}
                                    onSelect={(val) => {
                                        const selectedFilter = InventoryFilters.find((item) => item.value === val)
                                        if (selectedFilter) {
                                            setSearchType(selectedFilter)
                                        }
                                    }}
                                >
                                    {InventoryFilters?.map((item, key) => (
                                        <DropdownItem key={key} eventKey={item.value}>
                                            <span>{item.label}</span>
                                        </DropdownItem>
                                    ))}
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    {storeCode && storeCode !== '' && (
                        <div className="flex flex-col xl:flex-row gap-2 w-full xl:w-auto justify-end">
                            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                <Button variant="reject" size="sm" onClick={() => setClearInventory(true)}>
                                    Clear Inventory
                                </Button>
                                <Button variant="accept" size="sm" onClick={() => setIsInventorySync(true)}>
                                    Sync Inventory
                                </Button>
                                <Button
                                    variant="new"
                                    color="yellow"
                                    size="sm"
                                    className="flex gap-2 items-center justify-center"
                                    onClick={handleDownload}
                                >
                                    <span>Download</span>
                                    {spinner && <Spinner size={20} color="white" />}
                                </Button>
                                <Button size="sm" variant="blue" onClick={() => setShowFilter(true)}>
                                    <span className="flex gap-2 items-center  justify-center">
                                        <Filter className="w-5 h-5 text-white" /> Filter
                                    </span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading inventory data...</p>
                </div>
            )}
            {data?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border border-blue-100 dark:border-gray-700 rounded-xl p-5 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mt-2">
                                    <FiGrid className="text-2xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Quantity</p>
                                    <p className="xl:md:text-3xl text-md  font-bold text-gray-900 dark:text-white mt-1">
                                        {totalQuantity?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                            <div className=" md:block">
                                <Button icon={<HiRefresh className="text-lg" />} size="sm" onClick={() => refetch()}>
                                    <span className="xl:block md:block hidden">Refresh Data</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <EasyTable overflow mainData={data} columns={columns} page={page} pageSize={pageSize} />
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200">
                        <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
                    </div>
                </div>
            )}
            {!loading && (responseStatus === 400 || responseStatus === 404) && <NotFoundData />}
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
            <LocationTransferModal isOpen={locationTransferModal} setIsOpen={setLocationTransferModal} />
            <SyncInventoryModal isOpen={isInventorySync} setIsOpen={setIsInventorySync} storeId={storeId as number} />
            <ClearInventoryModal isOpen={clearInventory} setIsOpen={setClearInventory} storeId={storeId as number} />
            <FilterProductCommon
                isSorByFilter
                showDrawer={showFilter}
                setShowDrawer={setShowFilter}
                setTypeFetch={setTypeFetch}
                brandList={brandList}
                setBrandList={setBrandList}
                typeFetch={typeFetch}
                sortByFilter={sortByFilter}
                setSortByFilter={setSortByFilter}
            />
        </div>
    )
}

export default InventoryTable
