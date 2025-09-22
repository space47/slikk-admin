import React, { useRef, useState } from 'react'
import { useInventoryApi } from '../inventoryUtils/useInventoryApi'
import { Dropdown, Pagination, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { InventoryFilters } from '../inventoryUtils/inventoryCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useInventoryLocationColumns } from '../inventoryUtils/useInventoryLocationTable'
import ImageMODAL from '@/common/ImageModal'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import AccessDenied from '@/views/pages/AccessDenied'

const InventoryTable = () => {
    const locationInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const qtyInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({})
    const [storeCode, setStoreCode] = useState('')
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularRowImage] = useState<string | null>('')

    const [searchType, setSearchType] = useState<{ value: string; label?: string }>(InventoryFilters[0])

    const { data, responseStatus, totalData, setPage, setPageSize, setGlobalFilter, page, pageSize, globalFilter } = useInventoryApi({
        searchType,
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
    })

    console.log('COLUMNS', storeCode)

    if (responseStatus === '403') {
        return <AccessDenied />
    }

    return (
        <div>
            <div>
                <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-2">
                        <div className="mb-4 w-full md:w-auto">
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
                        </div>
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
                    <div className="flex flex-col w-full max-w-[400px]">
                        <label className="font-semibold text-gray-700 mb-1">Select Store</label>
                        <Select
                            isClearable
                            options={storeList}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            onChange={(selectedOptions) => {
                                setStoreCode(selectedOptions?.code || '')
                            }}
                        />
                    </div>
                </div>
            </div>
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
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
        </div>
    )
}

export default InventoryTable
