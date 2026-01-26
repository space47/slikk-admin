import React, { memo } from 'react'
import { Card } from 'antd'
import { FiSearch, FiX } from 'react-icons/fi'
import Button from '@/components/ui/Button'

interface PermissionItem {
    id: number
    name: string
}

interface PermCardProps {
    label: string
    getValue: PermissionItem[]
    selectedValue: number[]
    handleSelect: (id: number) => void
    handleAdd: () => void
    addedValue: PermissionItem[]
    handleRemove: (id: number) => void
    searchInput: string
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
    addedSearchInput: string
    handleAddedSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleUpdatePermission: () => void
    selectAll?: boolean
    handleSelectAll?: () => void
    isLoading?: boolean
}

const PermCardComponent: React.FC<PermCardProps> = memo(
    ({
        label,
        getValue,
        selectedValue,
        handleSelect,
        handleAdd,
        addedValue,
        handleRemove,
        searchInput,
        handleSearch,
        addedSearchInput,
        handleAddedSearch,
        handleUpdatePermission,
        selectAll = false,
        handleSelectAll,
        isLoading = false,
    }) => {
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault()
            }
        }

        const isAllSelected = selectAll && getValue.length > 0 && selectedValue.length === getValue.length

        return (
            <div className="flex justify-around gap-6">
                {/* All Permissions Card */}
                <Card
                    className="h-[560px] w-[400px] flex flex-col border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                    bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                        <div className="relative mb-3">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Search permissions..."
                                value={searchInput}
                                onChange={handleSearch}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">ALL {label}</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{getValue.length} items</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {selectAll && getValue.length > 0 && (
                            <div
                                className="flex gap-3 items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors mb-2"
                                onClick={handleSelectAll}
                            >
                                <div
                                    className={`w-5 h-5 flex items-center justify-center border-2 rounded ${isAllSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                                >
                                    {isAllSelected && <span className="text-white text-xs">✓</span>}
                                </div>
                                <span className="font-semibold text-gray-700">{isAllSelected ? 'Deselect All' : 'Select All'}</span>
                            </div>
                        )}

                        {getValue.length > 0 ? (
                            <div className="space-y-1">
                                {getValue.map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-center flex-1">
                                            <div
                                                className={`w-5 h-5 flex items-center justify-center border-2 rounded mr-3 ${selectedValue.includes(item.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
                                            >
                                                {selectedValue.includes(item.id) && <span className="text-white text-xs">✓</span>}
                                            </div>
                                            <span className="text-gray-700 group-hover:text-gray-900">{item.name}</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={selectedValue.includes(item.id)}
                                            onChange={() => handleSelect(item.id)}
                                        />
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <FiSearch size={32} className="mb-2" />
                                <p>No permissions found</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col justify-center items-center gap-6">
                    <Button
                        type="button"
                        variant="accept"
                        className="w-36 h-12 text-base font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        onClick={handleAdd}
                        disabled={selectedValue.length === 0 || isLoading}
                    >
                        ADD {'>>'}
                    </Button>

                    <Button
                        variant="yellow"
                        className="w-36 h-12 text-base font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        onClick={handleUpdatePermission}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        UPDATE
                    </Button>
                </div>

                {/* Added Permissions Card */}
                <Card
                    className="h-[560px] w-[400px] flex flex-col border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                    bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                        <div className="relative mb-3">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Search added permissions..."
                                value={addedSearchInput}
                                onChange={handleAddedSearch}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Added {label}</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{addedValue.length} items</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {addedValue.length > 0 ? (
                            <div className="space-y-1">
                                {addedValue.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                                    >
                                        <span className="text-gray-700 group-hover:text-gray-900 truncate">{item.name}</span>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                                            title="Remove permission"
                                            disabled={isLoading}
                                        >
                                            <FiX size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <FiX size={32} className="mb-2 mx-auto" />
                                    <p>No permissions added yet</p>
                                    <p className="text-sm mt-1">Select permissions and click ADD</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        )
    },
)

PermCardComponent.displayName = 'PermCardComponent'

export default PermCardComponent
