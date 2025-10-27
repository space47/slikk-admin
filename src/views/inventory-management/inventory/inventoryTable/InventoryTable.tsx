import React, { useRef, useState } from 'react'
import { useInventoryApi } from '../inventoryUtils/useInventoryApi'
import { Button, Dropdown, Pagination, Select, Spinner } from '@/components/ui'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { InventoryFilters } from '../inventoryUtils/inventoryCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useInventoryLocationColumns } from '../inventoryUtils/useInventoryLocationTable'
import ImageMODAL from '@/common/ImageModal'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
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

    const { data, responseStatus, totalData, setPage, setPageSize, setGlobalFilter, page, pageSize, globalFilter, query, loading } =
        useInventoryApi({
            searchType,
            store_code: storeCode,
            typeFetch: typeFetch,
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

    console.log('columns are', columns)

    const handleDownload = async () => {
        try {
            setSpinner(true)
            const downloadQuery = `${query}+&download=true`
            const res = await axioisInstance.get(downloadQuery)
            notification.success({ message: res?.data?.message || 'Successfully downloaded' })
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setSpinner(false)
        }
    }

    const hanldeSync = async () => {
        setIsInventorySync(true)
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
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="p-2 border rounded shadow-md w-full sm:w-auto"
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
                                <Button variant="accept" size="sm" onClick={hanldeSync}>
                                    Sync Inventory
                                </Button>
                                <Button
                                    variant="new"
                                    color="yellow"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="flex gap-2 items-center justify-center"
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
                        <EasyTable overflow mainData={data} columns={columns} page={page} pageSize={pageSize} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                        <Pagination
                            pageSize={pageSize}
                            currentPage={page}
                            total={totalData}
                            onChange={(page) => {
                                setPage(page)
                            }}
                            className="w-[400px] md:w-auto mb-4 md:mb-0 "
                        />
                        <div className="flex flex-row items-center justify-between xl:justify-normal w-full md:w-auto xl:gap-5">
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                className="w-1/2 md:w-auto"
                                onChange={(option) => {
                                    if (option) {
                                        setPageSize(option.value)
                                        setPage(1)
                                    }
                                }}
                            />
                        </div>
                    </div>
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
            {locationTransferModal && <LocationTransferModal isOpen={locationTransferModal} setIsOpen={setLocationTransferModal} />}
            {isInventorySync && <SyncInventoryModal isOpen={isInventorySync} setIsOpen={setIsInventorySync} storeId={storeId as number} />}
            {clearInventory && <ClearInventoryModal isOpen={clearInventory} setIsOpen={setClearInventory} storeId={storeId as number} />}
            {showFilter && (
                <FilterProductCommon
                    showDrawer={showFilter}
                    setShowDrawer={setShowFilter}
                    setTypeFetch={setTypeFetch}
                    brandList={brandList}
                    setBrandList={setBrandList}
                    typeFetch={typeFetch}
                />
            )}
        </div>
    )
}

export default InventoryTable
