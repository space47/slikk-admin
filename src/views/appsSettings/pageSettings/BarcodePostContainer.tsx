import { Dropdown, FormContainer, FormItem } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { DROPDOWNARRAY } from '@/views/category-management/catalog/CommonType'
import CreatePostTable from '@/views/creatorPost/uploadPost/createPost/CreatePostTable'
import React from 'react'
import { MdCancel } from 'react-icons/md'
import PageSettingsPostTable from './PageSettingsPostTable'

interface CONTAINERPROPS {
    label: string
    searchInput?: string
    handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
    currentSelectedPage?: Record<string, string> | undefined
    handleSelect: (value: any) => void
    tableData?: any[]
    showTable?: boolean
    productData?: string[]
    setProductData: (value: React.SetStateAction<string[]>) => void
    setFieldValue?: any
    handleActionClick?: any
    postTableData?: any[]
    handlePostClick?: any
    IspostTable?: boolean
}

const BarcodePostContainer = ({
    label,
    searchInput,
    handleSearch,
    currentSelectedPage,
    handleSelect,
    tableData,
    setFieldValue,
    showTable,
    setProductData,
    handleActionClick,
    productData,
    postTableData,
    handlePostClick,
    IspostTable,
}: CONTAINERPROPS) => {
    return (
        <FormContainer className="flex flex-col gap-4 ">
            <div className="text-xl">{label}</div>
            <div className="flex gap-10">
                <div className="flex justify-start ">
                    <input
                        type="search"
                        name="search"
                        id=""
                        placeholder="search SKU for product"
                        value={searchInput}
                        className=" w-[250px] rounded-[10px]"
                        onChange={handleSearch}
                    />
                </div>
                <div className="bg-gray-200 rounded-[10px] font-bold text-lg ">
                    <Dropdown
                        className=" text-xl text-black bg-gray-200 font-bold "
                        title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                        onSelect={handleSelect}
                    >
                        {DROPDOWNARRAY?.map((item, key) => {
                            return (
                                <DropdownItem key={key} eventKey={item.value}>
                                    <span>{item.label}</span>
                                </DropdownItem>
                            )
                        })}
                    </Dropdown>
                </div>
            </div>

            {showTable && searchInput && IspostTable ? (
                <CreatePostTable data={tableData} handleActionClick={handleActionClick} />
            ) : (
                <PageSettingsPostTable data={postTableData} handleActionClick={handlePostClick} />
            )}

            <FormItem label="Barcodes" className="w-full flex gap-3">
                <input
                    disabled
                    type="text"
                    name="data_type.barcodes"
                    value={productData}
                    onChange={(e: any) => {
                        setProductData(e.target.value)
                        setFieldValue('products', e.target.value)
                    }}
                    placeholder="Enter product barcode"
                />
                <button
                    type="button"
                    onClick={() => {
                        setProductData([])
                        setFieldValue('products', '')
                    }}
                >
                    <MdCancel className="text-red-500 text-xl" />
                </button>
            </FormItem>
        </FormContainer>
    )
}

export default BarcodePostContainer
