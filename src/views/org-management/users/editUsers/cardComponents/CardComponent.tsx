/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Card } from 'antd'
import Button from '@/components/ui/Button'

interface CARDPROPS {
    label: string
    getValue: any
    selectedValue: any
    handleSelect: any
    handleAdd: any
    addedValue: any
    handleRemove: any
    selectAll?: boolean
    handleSelectAll?: any
    handleSearch: any
    searchInput: any
    forPermission?: any
    handlePermissionEdit?: any
    handleSelectAllData?: any
    isSelectAll?: boolean
}

const CardComponent = ({
    label,
    getValue,
    selectedValue,
    handleSelect,
    handleAdd,
    addedValue,
    handleRemove,
    selectAll,
    handleSelectAll,
    handleSearch,
    searchInput,
    forPermission,
    handlePermissionEdit,
    handleSelectAllData,
    isSelectAll,
}: CARDPROPS) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between gap-6">
            {/* All Items Card */}
            <Card className="h-[400px] w-full lg:w-[400px] flex flex-col border border-gray-200 rounded-xl overflow-y-scroll shadow-sm">
                <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                    {isSelectAll && (
                        <div className="flex gap-2 items-center mb-3 p-2 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={selectedValue.length === getValue?.length}
                                onChange={handleSelectAllData}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-700">Select All</span>
                        </div>
                    )}

                    <div className="mb-3">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder={`Search ${label}`}
                            value={searchInput}
                            onChange={handleSearch}
                            onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                        />
                    </div>
                    <label htmlFor="All Permissions" className="font-bold text-gray-700">
                        ALL {label.toUpperCase()}
                    </label>
                </div>

                <div className="p-4 overflow-y-auto">
                    {selectAll && (
                        <div className="flex gap-2 items-center mb-3 p-2 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={selectedValue.length === getValue.length}
                                onChange={handleSelectAll}
                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-700">Select All</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        {getValue?.map((item: any) => (
                            <div key={item.id} className="flex flex-col">
                                <label className="px-3 py-2 flex items-center hover:bg-gray-50 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedValue?.includes(item.id)}
                                        onChange={() => handleSelect(item.id)}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-gray-700">{item.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Buttons */}
            <div className="flex lg:flex-col justify-center items-center gap-4 my-4 lg:my-0">
                <Button
                    type="button"
                    variant="accept"
                    className="w-full lg:w-32 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                    onClick={handleAdd}
                >
                    ADD {'>>'}
                </Button>
                {forPermission && (
                    <Button
                        type="button"
                        variant="pending"
                        className="w-full lg:w-32 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-md"
                        onClick={handlePermissionEdit}
                    >
                        Update
                    </Button>
                )}
            </div>

            {/* Added Items Card */}
            <Card className="h-[400px] w-full lg:w-[400px] flex flex-col border border-gray-200 rounded-xl overflow-y-scroll shadow-sm">
                <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                    <label htmlFor="Added Permissions" className="font-bold text-gray-700">
                        ADDED {label.toUpperCase()}
                    </label>
                </div>

                <div className="p-4 overflow-y-auto space-y-2">
                    {addedValue?.map((item: any, key: any) => (
                        <div key={key} className="flex flex-col">
                            <div className="px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <span className="text-gray-700">{item.name}</span>
                                <button
                                    className="text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded"
                                    onClick={() => handleRemove(item.id)}
                                    type="button"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default CardComponent
