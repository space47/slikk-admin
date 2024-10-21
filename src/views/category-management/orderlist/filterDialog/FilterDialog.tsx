/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Drawer from '@/components/ui/Drawer'
import { ORDER_STATUS, DELEIVERYOPTIONS, PAYMENTOPTIONS } from '../commontypes'
// import { IoMdDownload } from 'react-icons/io'
// import { FaLocationDot } from 'react-icons/fa6'
// import { FaMapMarkedAlt } from 'react-icons/fa'
// import { RiEBike2Fill } from 'react-icons/ri'

type OrderFilterProps = {
    showFilter?: any
    handleFilterClose?: any
    dropdownStatus?: any
    handleDropdownSelect?: any
    handleFromChange?: any
    from?: any
    to?: any
    handleToChange?: any
    deliveryType?: any
    handleDeliverySelect?: any
    paymentType?: any
    handlePaymentSelect?: any
    handleDateChange?: any
    setFrom?: any
    setTo?: any
}

const FilterDialogOrder = ({
    showFilter,
    handleFilterClose,
    dropdownStatus,
    handleDropdownSelect,

    deliveryType,
    handleDeliverySelect,
    paymentType,
    handlePaymentSelect,
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
                <div className="flex flex-col  gap-6 items-start justify-start mt-4 lg:mt-0 xl:mx-0 mx-10">
                    {/* <UltimateDatePicker
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        handleFromChange={handleFromChange}
                        handleToChange={handleToChange}
                        handleDateChange={handleDateChange}
                    /> */}

                    <div className="flex flex-col">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT STATUS
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 dark:bg-gray-800 flex justify-center lg:justify-start">
                            <div className="w-full px-1 py-2 text-sm text-black dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto">
                                    {ORDER_STATUS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                                                dropdownStatus?.value?.includes(item.value) ? 'bg-gray-200 dark:bg-gray-700' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={dropdownStatus.value.includes(item.value)}
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

                    <div className="mb-10">
                        {/* DELIVERY TYPE */}
                        <div className="flex flex-col mb-6">
                            <label htmlFor="" className="font-semibold text-lg mb-2">
                                SELECT DELIVERY TYPE
                            </label>
                            <div className="relative w-auto lg:w-auto bg-gray-100 dark:bg-gray-800 dark:text-white flex justify-center lg:justify-start">
                                <div className="w-full px-1 py-2 text-sm  text-black bg-gray-100 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm">
                                    <div className="h-auto overflow-y-auto max-h-80">
                                        {DELEIVERYOPTIONS?.map((item, key) => (
                                            <div
                                                key={key}
                                                className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:text-white ${
                                                    deliveryType?.value?.includes(item.value) ? 'bg-gray-200' : ''
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={deliveryType?.value?.includes(item.value)}
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

                        {/* PAYMENT TYPE */}
                        <div className="flex flex-col">
                            <label htmlFor="" className="font-semibold text-lg mb-2">
                                SELECT PAYMENT TYPE
                            </label>
                            <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center dark:bg-gray-800 dark:text-white lg:justify-start">
                                <div className="w-full px-1 py-2 text-sm  text-black bg-gray-100 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm">
                                    <div className="h-auto overflow-y-auto max-h-80">
                                        {PAYMENTOPTIONS?.map((item, key) => (
                                            <div
                                                key={key}
                                                className={`flex items-center px-2 py-2 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-100 cursor-pointer ${
                                                    paymentType?.value?.includes(item.value) ? 'bg-gray-200' : ''
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={paymentType?.value?.includes(item.value)}
                                                    onChange={() => handlePaymentSelect(item.value)}
                                                    className="mr-2 "
                                                />
                                                <span>{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <br />
                    <br />
                </div>
            </Drawer>
        </div>
    )
}

export default FilterDialogOrder
