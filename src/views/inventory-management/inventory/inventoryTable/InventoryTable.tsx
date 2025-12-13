import React, { useRef, useState } from 'react'
import { useInventoryApi } from '../inventoryUtils/useInventoryApi'
import { Button, Dropdown, Select, Spinner, Tooltip } from '@/components/ui'
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
import { notification, Tag } from 'antd'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'
import { Filter } from 'lucide-react'
import FilterProductCommon from '@/common/FilterProductCommon'
import { FaSync } from 'react-icons/fa'
import PageCommon from '@/common/PageCommon'

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
        <div>
            <div>
                <div className="flex flex-col w-full max-w-[600px] mb-10">
                    <label className="font-semibold text-gray-700 mb-1">Select Store</label>
                    <Select
                        isClearable
                        className="xl:w-[300px]"
                        options={storeList}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id.toString()}
                        onChange={(selectedOptions) => {
                            setStoreId(selectedOptions?.id || null)
                            setStoreCode(selectedOptions?.code || '')
                        }}
                    />
                </div>

                <div className="flex flex-col xl:flex-row xl:justify-between items-center gap-4 mb-10">
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
            </div>
            {loading && (
                <div className="flex items-center justify-center mt-2 mb-5">
                    <Spinner size={20} />
                </div>
            )}
            {data?.length > 0 && (
                <>
                    <div>
                        {totalQuantity && (
                            <div className="mb-6 ">
                                <Tag className="text-blue-600 text-xl font-bold">Total Quantity: {totalQuantity}</Tag>
                                <Tooltip title="Refresh">
                                    <Button variant="twoTone" color="gray" size="sm" icon={<FaSync />} onClick={() => refetch()}></Button>
                                </Tooltip>
                            </div>
                        )}
                        <EasyTable overflow mainData={data} columns={columns} page={page} pageSize={pageSize} />
                    </div>
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
                </>
            )}
            {(responseStatus === 400 || responseStatus === 404) && (
                <div>
                    <NotFoundData />
                </div>
            )}

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
