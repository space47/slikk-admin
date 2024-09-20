/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Drawer from '@/components/ui/Drawer'
import type { MouseEvent } from 'react'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Button, Dropdown } from '@/components/ui'
import { ORDER_STATUS } from '../commontypes'
// import { IoMdDownload } from 'react-icons/io'
// import { FaLocationDot } from 'react-icons/fa6'
// import { FaMapMarkedAlt } from 'react-icons/fa'
// import { RiEBike2Fill } from 'react-icons/ri'
import moment from 'moment'
import { DELEIVERYOPTIONS, PAYMENTOPTIONS } from '../Orderlist'

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
}

const FilterDialogOrder = ({
    showFilter,
    handleFilterClose,
    dropdownStatus,
    handleDropdownSelect,
    handleFromChange,
    from,
    to,
    handleToChange,
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
                    <div className="flex flex-col justify-start gap-6">
                        <div>
                            <div className="mb-1 font-semibold text-xs md:text-sm ">FROM DATE:</div>
                            <DatePicker
                                inputPrefix={<HiOutlineCalendar className="text-base md:text-lg" />}
                                defaultValue={new Date()}
                                value={new Date(from)}
                                onChange={handleFromChange}
                                className="w-[240px]"
                            />
                        </div>
                        <div>
                            <div className="mb-1 font-semibold text-xs md:text-sm">TO DATE:</div>
                            <DatePicker
                                inputSuffix={<TbCalendarStats className="text-base md:text-xl" />}
                                defaultValue={new Date()}
                                value={moment(to).toDate()}
                                onChange={handleToChange}
                                minDate={moment(from).toDate()}
                                className="w-[240px]"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 items-center flex-col ">
                        <label htmlFor="" className="font-semibold">
                            SELECT STATUS
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start">
                            <div className="w-full px-1 py-2 text-sm  text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto">
                                    {ORDER_STATUS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer ${
                                                dropdownStatus?.value?.includes(item.value) ? 'bg-gray-200' : ''
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
                            <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start">
                                <div className="w-full px-1 py-2 text-sm  text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                                    <div className="h-auto overflow-y-auto max-h-80">
                                        {DELEIVERYOPTIONS?.map((item, key) => (
                                            <div
                                                key={key}
                                                className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer ${
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
                            <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start">
                                <div className="w-full px-1 py-2 text-sm  text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                                    <div className="h-auto overflow-y-auto max-h-80">
                                        {PAYMENTOPTIONS?.map((item, key) => (
                                            <div
                                                key={key}
                                                className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer ${
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
