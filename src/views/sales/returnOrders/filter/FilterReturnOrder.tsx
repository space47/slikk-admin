/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from '@/components/ui/Drawer'
import { RETURN_ORDERS } from '@/views/category-management/orderlist/commontypes'
import { DELEIVERYRETRUNOPTIONS } from '../returnOrderCommon'

type OrderFilterProps = {
    showFilter: any
    handleFilterClose: any
    dropdownStatus?: any
    handleDropdownSelect?: any
    deliveryType: any
    handleDeliveryType: any
}

const FilterReturnOrder = ({
    showFilter,
    handleFilterClose,
    dropdownStatus,
    handleDropdownSelect,
    deliveryType,
    handleDeliveryType,
}: OrderFilterProps) => {
    return (
        <div>
            <Drawer title="" isOpen={showFilter} lockScroll={false} onRequestClose={handleFilterClose} onClose={handleFilterClose}>
                <div className="flex flex-col  gap-7 items-start justify-start w-full lg:w-auto">
                    <div className="flex flex-col ">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT STATUS
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start dark:bg-gray-800 dark:text-white">
                            <div className="w-auto px-1 py-2 text-sm  text-black bg-gray-100 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto">
                                    {RETURN_ORDERS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-100 cursor-pointer ${
                                                dropdownStatus?.value?.includes(item.value) ? 'bg-gray-200' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={dropdownStatus.value.includes(item.value)}
                                                className="mr-2"
                                                onChange={() => handleDropdownSelect(item.value)}
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col mb-6">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT RETURN TYPE
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 dark:bg-gray-800 dark:text-white flex justify-center lg:justify-start">
                            <div className="w-full px-1 py-2 text-sm  text-black dark:bg-gray-800 dark:text-white bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto max-h-80">
                                    {DELEIVERYRETRUNOPTIONS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-100 cursor-pointer ${
                                                deliveryType?.value?.includes(item.value) ? 'bg-gray-200' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={deliveryType?.value?.includes(item.value)}
                                                className="mr-2"
                                                onChange={() => handleDeliveryType(item.value)}
                                            />
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default FilterReturnOrder
