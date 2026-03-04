import { Drawer } from '@/components/ui'
import { OrderColumns } from './OrderListUtils'

interface PROPS {
    showDrawer: boolean
    setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>
    currentTableSelected: string[]
    setCurrentSelectedTable: (x: string[]) => void
}

const TableData = [
    { label: 'PAYMENT STATUS', value: OrderColumns.PAYMENT_STATUS },
    { label: 'COUPON CODE', value: OrderColumns.COUPON_CODE },
    { label: 'DELAY STATUS', value: OrderColumns.DELAY_STATUS },
    { label: 'TOTAL TIME TAKEN', value: OrderColumns.TOTAL_TIME_TAKEN },
    { label: 'DELAY TIME', value: OrderColumns.DELAY_TIME },
    { label: 'ETA DROP OFF', value: OrderColumns.ETA_DROP_OFF },
    { label: 'ESTIMATE DELIVERY', value: OrderColumns.ESTIMATE_DELIVERY },
    { label: 'DEVICE TYPE', value: OrderColumns.DEVICE_TYPE },
    { label: 'CUSTOMER NAME', value: OrderColumns.CUSTOMER_NAME },
    { label: 'AREA', value: OrderColumns.AREA },
    { label: 'PICKER', value: OrderColumns.PICKER_NAME },
    { label: 'LAST UPDATED', value: OrderColumns.UPDATE_DATE },
]

const OrderColumnFilter = ({ showDrawer, setShowDrawer, currentTableSelected, setCurrentSelectedTable }: PROPS) => {
    const handleColumnSelect = (val: string) => {
        const isSelected = currentTableSelected.includes(val)

        if (isSelected) {
            setCurrentSelectedTable(currentTableSelected.filter((item) => item !== val))
        } else {
            setCurrentSelectedTable([...currentTableSelected, val])
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
                                            onChange={() => handleColumnSelect(item.value)}
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

export default OrderColumnFilter
