/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Drawer from '@/components/ui/Drawer'
import { ORDER_STATUS } from '@/views/category-management/orderlist/commontypes'
import { DELEIVERYOPTIONS, PAYMENTOPTIONS } from '@/views/category-management/orderlist/Orderlist'
import UltimateDatePicker from '@/common/UltimateDateFilter'

type OrderFilterProps = {
    showFilter: any
    handleFilterClose: any
    dropdownStatus?: any
    handleDropdownSelect?: any
    handleFromChange: any
    from: any
    to: any
    handleToChange: any
    deliveryType: any
    handleDeliverySelect: any
    paymentType: any
    handlePaymentSelect: any
    handleDateChange: any
    setFrom: any
    setTo: any
    dispatch?: any
}

const FilterForwardDelivery = ({
    showFilter,
    handleFilterClose,
    dropdownStatus = { value: [] }, // default value
    handleDropdownSelect,
    handleFromChange,
    from,
    to,
    handleToChange,
    deliveryType = { value: [] }, // default value
    handleDeliverySelect,
    paymentType = { value: [] }, // default value
    handlePaymentSelect,
    handleDateChange,
    setFrom,
    setTo,
    dispatch,
}: OrderFilterProps) => {
    return (
        <div>
            <Drawer
                title=""
                isOpen={showFilter}
                onClose={handleFilterClose}
                onRequestClose={handleFilterClose}
                lockScroll={false}
                className="xl:mx-0 mx-8"
            >
                <div className="flex flex-col gap-6 items-start justify-start mt-4 lg:mt-0 xl:mx-0 mx-10">
                    {/* Date Pickers */}
                    <UltimateDatePicker
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        handleFromChange={handleFromChange}
                        handleToChange={handleToChange}
                        handleDateChange={handleDateChange}
                        dispatch={dispatch}
                    />

                    {/* Status Selection */}
                    <div className="flex flex-col">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT STATUS
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start">
                            <div className="w-full px-1 py-2 text-sm text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto">
                                    {ORDER_STATUS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer ${
                                                dropdownStatus.value?.includes(item.value) ? 'bg-gray-200' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={dropdownStatus.value?.includes(item.value)}
                                                onChange={() => handleDropdownSelect(item.value)}
                                                className="mr-2"
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
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start">
                            <div className="w-full px-1 py-2 text-sm text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto max-h-80">
                                    {DELEIVERYOPTIONS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer ${
                                                deliveryType.value?.includes(item.value) ? 'bg-gray-200' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={deliveryType.value?.includes(item.value)}
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

                    {/* Payment Type Selection */}
                    <div className="flex flex-col">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT PAYMENT TYPE
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start">
                            <div className="w-full px-1 py-2 text-sm text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto max-h-80">
                                    {PAYMENTOPTIONS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer ${
                                                paymentType.value?.includes(item.value) ? 'bg-gray-200' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={paymentType.value?.includes(item.value)}
                                                onChange={() => handlePaymentSelect(item.value)}
                                                className="mr-2"
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
