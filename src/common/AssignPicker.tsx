/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'

interface AssignPickerProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    store_id: string | number
    onChange: (selectedUsers: string[]) => void
    handleAssign: () => void
}

const AssignPicker = ({ onChange, isOpen, setIsOpen, store_id, handleAssign }: AssignPickerProps) => {
    const [pickerData, setPickerData] = useState<any[]>([])
    const [selectedMobiles, setSelectedMobiles] = useState<string[]>([])
    const [globalFilter, setGlobalFilter] = useState<string>('')

    const fetchPickerData = async () => {
        let nameFilter = ''
        if (globalFilter) nameFilter = `&name=${encodeURIComponent(globalFilter)}`

        try {
            const response = await axioisInstance.get(`/store/staffs/${store_id}?user_type=picker${nameFilter}`)
            const data = response?.data?.data || []
            setPickerData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPickerData()
    }, [globalFilter])

    const handleToggle = (mobile: string) => {
        setSelectedMobiles((prev) => {
            let updated
            if (prev.includes(mobile)) {
                updated = prev.filter((m) => m !== mobile)
            } else {
                updated = [...prev, mobile]
            }
            onChange(updated)
            return updated
        })
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="bg-white p-2 rounded-2xl  w-[800px] max-w-full flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">Assign Picker</h2>
                </div>

                {/* Scrollable Content */}
                <div className="flex gap-2">
                    <input
                        type="search"
                        name="globalFilter"
                        placeholder="Enter Picker name"
                        value={globalFilter}
                        className="rounded-xl p-2 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {pickerData.length > 0 ? (
                        pickerData.map((item) => (
                            <label
                                key={item.mobile}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                                    selectedMobiles.includes(item.mobile) ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-400'
                                }`}
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {item?.first_name} {item?.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500">{item.mobile}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedMobiles.includes(item.mobile)}
                                    className="h-5 w-5 accent-blue-600 rounded cursor-pointer"
                                    onChange={() => handleToggle(item.mobile)}
                                />
                            </label>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-10">No pickers available</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-5 py-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button onClick={handleAssign} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                        Assign
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default AssignPicker
