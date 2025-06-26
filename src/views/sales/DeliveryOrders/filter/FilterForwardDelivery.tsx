/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from '@/components/ui/Drawer'
import { ORDER_STATUS, DELEIVERYOPTIONS, PAYMENTOPTIONS } from '@/views/category-management/orderlist/commontypes'

type OrderFilterProps = {
    showFilter?: any
    handleFilterClose?: any
    dropdownStatus?: any
    handleDropdownSelect?: any
    deliveryType?: any
    handleDeliverySelect?: any
    paymentType?: any
    handlePaymentSelect?: any
}

const FilterForwardDelivery = ({
    showFilter,
    handleFilterClose,
    dropdownStatus = { value: [] }, // default value
    handleDropdownSelect,
    deliveryType = { value: [] }, // default value
    handleDeliverySelect,
    paymentType = { value: [] }, // default value
    handlePaymentSelect,
}: OrderFilterProps) => {
    return (
        <div>
            <Drawer
                title=""
                lockScroll={false}
                isOpen={showFilter}
                className="xl:mx-0 mx-8"
                onClose={handleFilterClose}
                onRequestClose={handleFilterClose}
            >
                <div className="flex flex-col gap-6 items-start justify-start mt-4 lg:mt-0 xl:mx-0 mx-10">
                    <div className="flex flex-col">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT STATUS
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start dark:bg-gray-800 dark:text-white">
                            <div className="w-full px-1 py-2 text-sm text-black bg-gray-100 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto">
                                    {ORDER_STATUS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:text-white ${
                                                dropdownStatus.value?.includes(item.value) ? 'bg-gray-200' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={dropdownStatus.value?.includes(item.value)}
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

                    {/* Delivery Type Selection */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT DELIVERY TYPE
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start dark:bg-gray-800 dark:text-white ">
                            <div className="w-full px-1 py-2 text-sm text-black bg-gray-100 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto max-h-80">
                                    {DELEIVERYOPTIONS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-100 cursor-pointer ${
                                                deliveryType.value?.includes(item.value) ? 'bg-gray-200' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={deliveryType.value?.includes(item.value)}
                                                className="mr-2"
                                                onChange={() => handleDeliverySelect(item.value)}
                                            />
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Type Selection */}
                    <div className="flex flex-col">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT PAYMENT TYPE
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start dark:bg-gray-800 dark:text-white">
                            <div className="w-full px-1 py-2 text-sm text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white">
                                <div className="h-auto overflow-y-auto max-h-80">
                                    {PAYMENTOPTIONS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:text-white ${
                                                paymentType.value?.includes(item.value) ? 'bg-gray-200' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={paymentType.value?.includes(item.value)}
                                                className="mr-2"
                                                onChange={() => handlePaymentSelect(item.value)}
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

export default FilterForwardDelivery
