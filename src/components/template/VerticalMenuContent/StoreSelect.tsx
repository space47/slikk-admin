import { Button } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { setStoreIds } from '@/store/slices/storeSelect/storeSelect.slice'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useState } from 'react'
import { HiOutlineBuildingStorefront } from 'react-icons/hi2'

const StoreSelect = () => {
    const dispatch = useAppDispatch()
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const { store_ids } = useAppSelector((state) => state.storeSelect)
    const [storeIdStore, setStoreIdStore] = useState<number[] | null>(null)

    const selected = storeIdStore !== null ? storeIdStore : store_ids

    const handleToggle = (id: number, checked: boolean) => {
        const current = selected ?? []
        setStoreIdStore(checked ? [...current, id] : current.filter((s) => s !== id))
    }

    const handleSelectAll = (checked: boolean) => {
        setStoreIdStore(checked ? storeList.map((s) => s.id) : [])
    }

    const allSelected = storeList.length > 0 && storeList.every((s) => selected?.includes(s.id))
    const someSelected = storeList.some((s) => selected?.includes(s.id))
    const isIndeterminate = !allSelected && someSelected
    const selectedCount = selected?.length ?? 0

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <HiOutlineBuildingStorefront className="text-lg text-blue-600" />
                    Select Stores
                </h2>
                {selectedCount > 0 && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{selectedCount} selected</span>
                )}
            </div>

            {/* Checkbox list */}
            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                {/* Select All row */}
                <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                            if (el) el.indeterminate = isIndeterminate
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700">Select all</span>
                </label>

                {/* Store rows */}
                <div className="max-h-56 overflow-y-auto">
                    {storeList.map((store) => {
                        const isChecked = selected?.includes(store.id) ?? false
                        return (
                            <label
                                key={store.id}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                                    ${isChecked ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleToggle(store.id, e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                                />
                                <span className={`text-sm ${isChecked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{store.name}</span>
                            </label>
                        )
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                {selectedCount > 0 && (
                    <button
                        onClick={() => setStoreIdStore([])}
                        className="text-xs text-red-700 hover:text-gray-600 transition-colors underline underline-offset-2"
                    >
                        Clear all
                    </button>
                )}
                <div className="ml-auto">
                    <Button variant="blue" onClick={() => dispatch(setStoreIds(storeIdStore ?? []))}>
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default StoreSelect
