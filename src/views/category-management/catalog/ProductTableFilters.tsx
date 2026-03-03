/* eslint-disable @typescript-eslint/no-explicit-any */

import { Drawer } from '@/components/ui'
import { useAppDispatch } from '@/store'
import { setCurrentTableSelected } from '@/store/slices/productData/productData.slice'
import { useEffect, useState } from 'react'

interface PROPS {
    showDrawer: boolean
    handleCloseDrawer: any
    currentTableSelected: string[]
}

const TableData = [
    { label: 'Division', value: 'division' },
    { label: 'Category', value: 'category' },
    { label: 'Sub Category', value: 'sub_category' },
    { label: 'Stocks', value: 'inventory_count' },
    { label: 'Color', value: 'color' },
    { label: 'Color Family', value: 'color_family' },
    { label: 'Size', value: 'size' },
    { label: 'Offer Price', value: 'offer_sp' },
    { label: 'Tax', value: 'tax_rate' },
    { label: 'Variant Type', value: 'variant_type' },
    { label: 'Discount', value: 'discount' },
    { label: 'HSN', value: 'hsn' },
    { label: 'Active', value: 'is_active' },
    { label: 'Exchangeable', value: 'is_exchangeable' },
    { label: 'Locked', value: 'is_locked' },
    { label: 'Returnable', value: 'is_returnable' },
    { label: 'Try & Buy', value: 'is_try_and_buy' },
    { label: 'Volumetric', value: 'is_volumetric' },
    { label: 'updated by', value: 'last_updated_by' },
]

const ProductTableFilters = ({ showDrawer, handleCloseDrawer, currentTableSelected }: PROPS) => {
    const dispatch = useAppDispatch()
    const [lockScroll, setLockScroll] = useState(false)

    useEffect(() => {
        if (showDrawer) {
            console.log('called here')
            setLockScroll(true)
        } else {
            console.log('became false')
            setLockScroll(false)
        }
    }, [showDrawer])

    const handleDeliverySelect = (val: string) => {
        const isSelected = currentTableSelected.includes(val)

        if (isSelected) {
            dispatch(setCurrentTableSelected(currentTableSelected.filter((item) => item !== val)))
        } else {
            dispatch(setCurrentTableSelected([...currentTableSelected, val]))
        }
    }

    return (
        <div>
            <Drawer title="" isOpen={showDrawer} lockScroll={lockScroll} onRequestClose={handleCloseDrawer} onClose={handleCloseDrawer}>
                <div className="flex flex-col mb-6">
                    <label htmlFor="" className="font-semibold text-lg mb-2">
                        SELECT DELIVERY TYPE
                    </label>
                    <div className="relative w-auto lg:w-auto bg-gray-100 dark:bg-gray-800 dark:text-white flex justify-center lg:justify-start">
                        <div className="w-full px-1 py-2 text-sm  text-black bg-gray-100 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm">
                            <div className=" overflow-y-auto ">
                                {TableData?.map((item, key) => (
                                    <div
                                        key={key}
                                        className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:text-white ${
                                            currentTableSelected.includes(item.value) ? 'bg-gray-200' : ''
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={currentTableSelected.includes(item.value)}
                                            onChange={() => handleDeliverySelect(item.value)}
                                            className="mr-2"
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default ProductTableFilters
