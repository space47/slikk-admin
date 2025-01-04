/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer } from '@/components/ui'
import React from 'react'

interface props {
    showFilter: any
    setShowFilter: any
    dropdownStatus: any
    handleDropdownSelect: any
    handleDeliverySelect: any
    deliveryType: any
}

const TemplateStatus = [
    { name: 'APPROVED', value: 'APPROVED' },
    { name: 'REJECTED', value: 'REJECTED' },
]
const TemplateCategory = [
    { label: 'MARKETING', value: 'MARKETING' },
    { label: 'UTILITY', value: 'UTILITY' },
]

const FilterDrawer = ({ showFilter, setShowFilter, dropdownStatus, handleDropdownSelect, handleDeliverySelect, deliveryType }: props) => {
    const handleFilterClose = () => {
        setShowFilter(false)
    }
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
                    <div className="flex flex-col">
                        <label htmlFor="" className="font-semibold text-lg mb-2">
                            SELECT STATUS
                        </label>
                        <div className="relative w-auto lg:w-auto bg-gray-100 dark:bg-gray-800 flex justify-center lg:justify-start">
                            <div className="w-full px-1 py-2 text-sm text-black dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                                <div className="h-auto overflow-y-auto">
                                    {TemplateStatus?.map((item, key) => (
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
                                SELECT CATEGORY
                            </label>
                            <div className="relative w-auto lg:w-auto bg-gray-100 dark:bg-gray-800 dark:text-white flex justify-center lg:justify-start">
                                <div className="w-full px-1 py-2 text-sm  text-black bg-gray-100 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm">
                                    <div className="h-auto overflow-y-auto max-h-80">
                                        {TemplateCategory?.map((item, key) => (
                                            <div
                                                key={key}
                                                className={`flex items-center px-2 py-2 text-black hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:text-white ${
                                                    deliveryType?.value?.includes(item.value) ? 'bg-gray-200' : ''
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
                    </div>

                    <br />
                    <br />
                </div>
            </Drawer>
        </div>
    )
}

export default FilterDrawer
