/* eslint-disable @typescript-eslint/no-explicit-any */

import { Drawer } from '@/components/ui'

interface PROPS {
    showDrawer: boolean
    handleCloseDrawer: any
    tableDataFilters: Record<string, string>
    setTableDataFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

const TableData = [
    { label: 'Division', value: 'division' },
    { label: 'Category', value: 'category' },
    { label: 'Sub Category', value: 'sub_category' },
    { label: 'Stocks', value: 'inventory_count' },
    { label: 'Color', value: 'color' },
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
]

const ProductTableFilters = ({ showDrawer, handleCloseDrawer, tableDataFilters, setTableDataFilters }: PROPS) => {
    const handleDeliverySelect = (val: string) => {
        console.log(val)
    }

    return (
        <div>
            <Drawer title="" isOpen={showDrawer} lockScroll={false} onRequestClose={handleCloseDrawer} onClose={handleCloseDrawer}>
                <div className="flex flex-col mb-6">
                    <label htmlFor="" className="font-semibold text-lg mb-2">
                        SELECT DELIVERY TYPE
                    </label>
                    <div className="relative w-auto lg:w-auto bg-gray-100 dark:bg-gray-800 dark:text-white flex justify-center lg:justify-start">
                        <div className="w-full px-1 py-2 text-sm  text-black bg-gray-100 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm">
                            <div className="h-auto overflow-y-auto max-h-80">
                                {TableData?.map((item, key) => (
                                    <div
                                        key={key}
                                        className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:text-white ${
                                            tableDataFilters?.value?.includes(item.value) ? 'bg-gray-200' : ''
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={tableDataFilters?.value?.includes(item.value)}
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
