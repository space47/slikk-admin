import { Drawer } from '@/components/ui'
import { useAppDispatch } from '@/store'
import { setCurrentTableSelected } from '@/store/slices/productData/productData.slice'
import { ProductTableField } from './ProductCommon'

interface PROPS {
    showDrawer: boolean
    setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>
    currentTableSelected: string[]
}

const TableData = [
    { label: 'Division', value: ProductTableField.DIVISION },
    { label: 'Category', value: ProductTableField.CATEGORY },
    { label: 'Sub Category', value: ProductTableField.SUB_CATEGORY },
    { label: 'Stocks', value: ProductTableField.INVENTORY_COUNT },
    { label: 'Color', value: ProductTableField.COLOR },
    { label: 'Color Family', value: ProductTableField.COLOR_FAMILY },
    { label: 'Size', value: ProductTableField.SIZE },
    { label: 'Offer Price', value: ProductTableField.OFFER_SP },
    { label: 'Tax', value: ProductTableField.TAX_RATE },
    { label: 'Variant Type', value: ProductTableField.VARIANT_TYPE },
    { label: 'Discount', value: ProductTableField.DISCOUNT },
    { label: 'HSN', value: ProductTableField.HSN },
    { label: 'Active', value: ProductTableField.IS_ACTIVE },
    { label: 'Exchangeable', value: ProductTableField.IS_EXCHANGEABLE },
    { label: 'Locked', value: ProductTableField.IS_LOCKED },
    { label: 'Returnable', value: ProductTableField.IS_RETURNABLE },
    { label: 'Try & Buy', value: ProductTableField.IS_TRY_AND_BUY },
    { label: 'Volumetric', value: ProductTableField.IS_VOLUMETRIC },
    { label: 'updated by', value: ProductTableField.LAST_UPDATED_BY },
]

const ProductTableFilters = ({ showDrawer, setShowDrawer, currentTableSelected }: PROPS) => {
    const dispatch = useAppDispatch()

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
            <Drawer
                title=""
                isOpen={showDrawer}
                lockScroll={showDrawer}
                onRequestClose={() => setShowDrawer(false)}
                onClose={() => setShowDrawer(false)}
            >
                <div className="flex flex-col mb-6">
                    <label htmlFor="" className="font-semibold text-lg mb-2">
                        Select Column You want to display
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
