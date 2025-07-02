/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, FormContainer, FormItem } from '@/components/ui'
import React, { useEffect, useState } from 'react'
import { ProductTable } from '../../pageSettings/pageSettings.types'
import { DROPDOWNTYPE } from '@/views/category-management/catalog/CommonType'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import CreatePostTable from '@/views/creatorPost/uploadPost/createPost/CreatePostTable'
import { MdCancel } from 'react-icons/md'
import { Field } from 'formik'
import { fetchInput } from '../../pageSettings/pageSettingsUtils/pageEditApi'

interface props {
    values?: any
    barcodeData: string | string[]
    setBarcodeData?: any
    setFieldValue?: any
}

const BarcodeData = ({ barcodeData, setBarcodeData, setFieldValue }: props) => {
    const [searchInput, setSearchInput] = useState<string>('')
    const [tableData, setTableData] = useState<ProductTable[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>()

    useEffect(() => {
        fetchInput(searchInput, currentSelectedPage, setTableData)
    }, [searchInput])

    const handleActionClick = (value: any) => {
        const currentBarcodes = typeof barcodeData === 'string' ? barcodeData.split(',') : Array.isArray(barcodeData) ? barcodeData : []
        const filteredBarcodes = currentBarcodes.filter((b) => b.trim() !== '')
        const newBarcodes = [...filteredBarcodes, value.toString()]
        setBarcodeData(newBarcodes)
        setSearchInput('')
    }

    const handleSelect = (value: any) => {
        const selected = DROPDOWNTYPE.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    return (
        <div>
            <FormContainer className="flex flex-col gap-4 ">
                <div className="text-xl">Barcode</div>
                <div className="flex gap-10">
                    <div className="flex justify-start ">
                        <Field
                            type="search"
                            placeholder="search SKU"
                            value={searchInput}
                            className=" xl:w-[350px] rounded-[10px]"
                            onChange={(e: any) => setSearchInput(e.target.value)}
                        />
                    </div>
                    <div className="bg-gray-200 rounded-[10px] font-bold text-lg ">
                        <Dropdown
                            className=" text-xl text-black bg-gray-200 font-bold "
                            title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                            onSelect={handleSelect}
                        >
                            {DROPDOWNTYPE?.map((item, key) => {
                                return (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                )
                            })}
                        </Dropdown>
                    </div>
                </div>
                {searchInput && <CreatePostTable data={tableData as any} handleActionClick={handleActionClick} />}
                <FormItem label="Barcodes" className="w-full flex gap-3">
                    <Field
                        type="text"
                        name="data_type.barcodes"
                        value={Array.isArray(barcodeData) ? barcodeData.join(',') : barcodeData}
                        className="w-[50%]"
                        placeholder="Enter product barcode"
                        onChange={(e: any) => {
                            const value = e.target.value
                            setBarcodeData(value.includes(',') ? value.split(',') : [value])
                            setFieldValue('data_type.barcodes', value)
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setBarcodeData([])
                            setFieldValue('data_type.barcodes', [])
                        }}
                    >
                        <MdCancel className="text-red-500 text-xl" />
                    </button>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default BarcodeData
