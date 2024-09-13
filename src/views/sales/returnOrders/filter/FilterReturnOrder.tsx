/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Drawer from '@/components/ui/Drawer'
import type { MouseEvent } from 'react'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineCalendar } from 'react-icons/hi'
import { TbCalendarStats } from 'react-icons/tb'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Button, Dropdown } from '@/components/ui'

// import { IoMdDownload } from 'react-icons/io'
// import { FaLocationDot } from 'react-icons/fa6'
// import { FaMapMarkedAlt } from 'react-icons/fa'
// import { RiEBike2Fill } from 'react-icons/ri'
import moment from 'moment'
import { RETURN_ORDERS } from '@/views/category-management/orderlist/commontypes'
import { DELEIVERYRETRUNOPTIONS } from '../ReturnOrders'

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
    handleDeliveryType: any
}

const FilterReturnOrder = ({
    showFilter,
    handleFilterClose,
    dropdownStatus,
    handleDropdownSelect,
    handleFromChange,
    from,
    to,
    handleToChange,
    deliveryType,
    handleDeliveryType,
}: OrderFilterProps) => {
    return (
        <div>
            <Drawer
                title=""
                isOpen={showFilter}
                onClose={handleFilterClose}
                onRequestClose={handleFilterClose}
                lockScroll={false}
            >
                <div className="flex flex-col  gap-7 items-start justify-start w-full lg:w-auto">
                    <div className="flex flex-col  gap-4 lg:gap-5">
                        <div>
                            <div className="mb-1 font-semibold text-sm text-center md:text-left">
                                FROM DATE:
                            </div>
                            <DatePicker
                                inputPrefix={
                                    <HiOutlineCalendar className="text-lg" />
                                }
                                defaultValue={new Date()}
                                value={new Date(from)}
                                onChange={handleFromChange}
                            />
                        </div>
                        <div>
                            <div className="mb-1 font-semibold text-sm text-center md:text-left">
                                TO DATE:
                            </div>
                            <DatePicker
                                inputSuffix={
                                    <TbCalendarStats className="text-xl" />
                                }
                                defaultValue={new Date()}
                                value={new Date(to)}
                                onChange={handleToChange}
                                minDate={moment(from).toDate()}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 items-center flex-col ">
                        <label htmlFor="" className="font-semibold">
                            SELECT STATUS
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 flex justify-center lg:justify-start">
                            <div className="w-full px-1 py-2 text-sm lg:text-base text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto">
                                    {RETURN_ORDERS?.map((item, key) => (
                                        <div
                                            key={key}
                                            className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer ${
                                                dropdownStatus?.value?.includes(
                                                    item.value,
                                                )
                                                    ? 'bg-gray-200'
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={dropdownStatus.value.includes(
                                                    item.value,
                                                )}
                                                onChange={() =>
                                                    handleDropdownSelect(
                                                        item.value,
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center flex-col gap-2">
                        <div className="font-bold">SET DELIVERY TYPE</div>
                        <div className="bg-gray-100 w-auto text-xl">
                            <Dropdown
                                className="w-auto px-4 py-2 text-base lg:text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                                title={
                                    deliveryType?.label ||
                                    'Select delivery type'
                                }
                                onSelect={handleDeliveryType}
                            >
                                <div className="max-h-60 overflow-y-auto">
                                    {DELEIVERYRETRUNOPTIONS?.map(
                                        (item, index) => (
                                            <DropdownItem
                                                key={index}
                                                eventKey={item.value}
                                                className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                            >
                                                <span>{item.label}</span>
                                            </DropdownItem>
                                        ),
                                    )}
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default FilterReturnOrder
