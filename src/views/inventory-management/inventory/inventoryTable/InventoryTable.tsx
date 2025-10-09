import React, { useEffect, useRef, useState } from 'react'
import { useInventoryApi } from '../inventoryUtils/useInventoryApi'
import { Button, Dropdown, Pagination, Select, Spinner } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
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
import AllCategoriesDropdown from '@/common/AllCategoriesDropdown'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'

const InventoryTable = () => {
    const dispatch = useAppDispatch()
    const locationInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const qtyInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const [storeCode, setStoreCode] = useState('slikk101')
    const [storeId, setStoreId] = useState<number | null>(null)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularRowImage] = useState<string | null>('')
    const [locationTrabsferModal, setLocationTransferModal] = useState(false)
    const [searchType, setSearchType] = useState<{ value: string; label?: string }>(InventoryFilters[0])
    const [isInventorySync, setIsInventorySync] = useState(false)
    const [clearInventory, setClearInventory] = useState(false)
    const [selectedDivision, setSelectedDivision] = useState('Select Division')
    const [selectedCategory, setSelectedCategory] = useState('Select Category')
    const [selectedSubCategory, setSelectedSubCategory] = useState('')
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [brandsList, setBrandList] = useState<number[]>([])
    const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const { data, responseStatus, totalData, setPage, setPageSize, setGlobalFilter, page, pageSize, globalFilter, query } = useInventoryApi(
        {
            searchType,
            store_code: storeCode,
            brandList: brandsList,
            selectedCategory: selectedCategory,
            selectedSubCategory: selectedSubCategory,
            selectedDivision: selectedDivision,
        },
    )

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
                <div className="flex gap-4 flex-col xl:flex-row items-center mb-10">
                    <div className="flex flex-col w-full max-w-[600px]">
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
                </div>
                <div className="flex flex-col xl:flex-row xl:justify-between items-center mb-10">
                    <div className="flex gap-2 flex-col xl:flex-row ">
                        <div className="mb-4 w-full md:w-auto flex gap-2">
                            <input
                                type="search"
                                placeholder="Search SKU/Name"
                                value={globalFilter}
                                onChange={(e) => {
                                    console.log('final Value', e.target.value)
                                    setGlobalFilter(e.target.value)
                                }}
                                className="p-2 border rounded shadow-md w-full md:w-auto"
                            />
                            <div>
                                <div className="bg-gray-100 items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                                    <Dropdown
                                        className=" text-xl text-black bg-gray-200 font-bold  "
                                        title={searchType?.label ? searchType.label : 'SELECT'}
                                        onSelect={(val) => {
                                            const selectedFilter = InventoryFilters.find((item) => item.value === val)
                                            if (selectedFilter) {
                                                setSearchType(selectedFilter)
                                            }
                                        }}
                                    >
                                        {InventoryFilters?.map((item, key) => {
                                            return (
                                                <DropdownItem key={key} eventKey={item.value}>
                                                    <span>{item.label}</span>
                                                </DropdownItem>
                                            )
                                        })}
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div>
                            <AllCategoriesDropdown
                                selectedCategory={selectedCategory}
                                selectedDivision={selectedDivision}
                                selectedSubCategory={selectedSubCategory}
                                setSelectedSubCategory={setSelectedSubCategory}
                                setSelectedCategory={setSelectedCategory}
                                setSelectedDivision={setSelectedDivision}
                            />
                        </div>

                        <div className="flex flex-col xl:flex-row items-start gap-2">
                            <Select
                                options={brands.brands}
                                isMulti
                                isClearable
                                placeholder="Select Brands"
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id.toString()}
                                className="w-full"
                                onChange={(val) => {
                                    if (val) {
                                        setBrandList(val?.map((item) => item?.id))
                                    } else {
                                        setBrandList([])
                                    }
                                }}
                            />
                        </div>

                        {storeCode && storeCode !== '' && (
                            <>
                                <div className="xl:mt-1 flex xl:flex-row flex-col gap-2">
                                    <Button variant="reject" size="sm" onClick={() => setClearInventory(true)}>
                                        Clear Inventory
                                    </Button>
                                    <Button variant="accept" size="sm" onClick={hanldeSync}>
                                        Sync Inventory
                                    </Button>
                                </div>
                                <div className="xl:mt-1">
                                    <Button
                                        variant="new"
                                        color="yellow"
                                        size="sm"
                                        onClick={handleDownload}
                                        className="flex gap-2 items-center"
                                    >
                                        <span>Download</span> <span>{spinner && <Spinner size={20} color="white" />}</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
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
            {locationTrabsferModal && <LocationTransferModal isOpen={locationTrabsferModal} setIsOpen={setLocationTransferModal} />}
            {isInventorySync && <SyncInventoryModal isOpen={isInventorySync} setIsOpen={setIsInventorySync} storeId={storeId as number} />}
            {clearInventory && <ClearInventoryModal isOpen={clearInventory} setIsOpen={setClearInventory} storeId={storeId as number} />}
        </div>
    )
}

export default InventoryTable
