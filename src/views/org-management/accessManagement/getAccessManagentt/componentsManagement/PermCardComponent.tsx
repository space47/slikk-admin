import React, { memo, useCallback, useMemo } from 'react'
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

const PermCardComponent: React.FC<PermCardProps> = ({
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
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') e.preventDefault()
    }, [])

    const visibleIds = useMemo(() => getValue.map((i) => i.id), [getValue])

    const isAllSelected = useMemo(() => {
        if (!selectAll || visibleIds.length === 0) return false
        return visibleIds.every((id) => selectedValue.includes(id))
    }, [selectAll, visibleIds, selectedValue])

    return (
        <div className="flex justify-around gap-6">
            {/* ALL PERMISSIONS */}
            <Card
                className="h-[560px] w-[400px] rounded-xl overflow-hidden"
                bodyStyle={{
                    padding: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* HEADER */}
                <div className="sticky top-0 z-10 bg-white p-4 border-b">
                    <div className="relative mb-3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchInput}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                            placeholder="Search permissions..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-between">
                        <h3 className="font-bold">ALL {label}</h3>
                        <span className="text-sm text-gray-500">{getValue.length}</span>
                    </div>
                </div>

                {/* SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-2">
                    {selectAll && getValue.length > 0 && (
                        <div onClick={handleSelectAll} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
                            <div className={`w-5 h-5 border rounded ${isAllSelected ? 'bg-blue-500' : ''}`} />
                            <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
                        </div>
                    )}

                    {getValue.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            {searchInput ? 'No results found' : 'No permissions available'}
                        </div>
                    ) : (
                        getValue.map((item) => {
                            const checked = selectedValue.includes(item.id)
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item.id)}
                                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded"
                                >
                                    <div className={`w-5 h-5 border rounded ${checked ? 'bg-blue-500' : ''}`} />
                                    <span className="truncate">{item.name}</span>
                                </div>
                            )
                        })
                    )}
                </div>
            </Card>

            {/* ACTIONS */}
            <div className="flex flex-col justify-center gap-6">
                <Button variant="accept" disabled={!selectedValue.length || isLoading} onClick={handleAdd}>
                    ADD {'>>'}
                </Button>

                <Button variant="yellow" loading={isLoading} onClick={handleUpdatePermission}>
                    UPDATE
                </Button>
            </div>

            {/* ADDED PERMISSIONS */}
            <Card
                className="h-[560px] w-[400px] rounded-xl overflow-hidden"
                bodyStyle={{
                    padding: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* HEADER */}
                <div className="sticky top-0 z-10 bg-white p-4 border-b">
                    <div className="relative mb-3">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={addedSearchInput}
                            onChange={handleAddedSearch}
                            onKeyDown={handleKeyDown}
                            placeholder="Search added permissions..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div className="flex justify-between">
                        <h3 className="font-bold">Added {label}</h3>
                        <span className="text-sm text-gray-500">{addedValue.length}</span>
                    </div>
                </div>

                {/* SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-2">
                    {addedValue.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500">No permissions added</div>
                    ) : (
                        addedValue.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
                                <span className="truncate">{item.name}</span>
                                <button
                                    disabled={isLoading}
                                    onClick={() => handleRemove(item.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <FiX />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    )
}

export default memo(PermCardComponent)
