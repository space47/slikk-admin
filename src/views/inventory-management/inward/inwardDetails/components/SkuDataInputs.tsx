/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

type formData = {
    location: string
    sku: string
}

interface props {
    formData: formData
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleAddSku: any
}

const SkuDataInputs = ({ formData, handleInputChange, handleAddSku }: props) => {
    return (
        <div>
            <div className="mb-4">
                <label className="block text-gray-700">Location</label>
                <input
                    name="location"
                    type="text"
                    placeholder="Enter Location"
                    className="w-auto xl:w-1/6 border border-gray-300 rounded p-2"
                    value={formData.location}
                    onChange={handleInputChange}
                />
            </div>
            <div className="grid grid-cols-4 gap-2">
                <div className="mb-4">
                    <label className="block text-gray-700">SKU</label>
                    <input
                        name="sku"
                        type="search"
                        placeholder="Enter SKU"
                        className="w-2/3 border border-gray-300 rounded p-2"
                        value={formData.sku}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddSku()
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SkuDataInputs
