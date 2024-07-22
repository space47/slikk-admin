import React, { useState, ChangeEvent } from 'react'

interface filtProps {
    onSearch: (invoiceId: string) => void
    onSelectDateRange: () => void
}

const Filter: React.FC<filtProps> = ({ onSearch, onSelectDateRange }) => {
    const [invoiceId, setInvoiceId] = useState('')
    const [status, setStatus] = useState('')

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInvoiceId(e.target.value)
    }
    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value)
    }

    const handleSearch = () => {
        onSearch(invoiceId)
    }

    return (
        <div className="mb-4 flex justify-around items-center">
            <div className="Search flex  items-center">
                <input
                    type="text"
                    name="invoiceId"
                    value={invoiceId}
                    onChange={handleInputChange}
                    placeholder="Search Invoice ID"
                    className="border px-10 py-2 w-[100%] items-start"
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="bg-yellow-50 opacity-60 text-black px-3 py-2 "
                >
                    Q
                </button>
            </div>

            <div className="flex gap-3 ">
                <button
                    type="button"
                    onClick={onSelectDateRange}
                    className=" text-black px-4 py-2 mx-4 border border-red-500 rounded-md"
                >
                    Select Date Range
                </button>
                <select
                    name="status"
                    value={status}
                    onChange={handleSelectChange}
                    className="border px-4 py-2"
                >
                    <option value="" disabled>
                        Status
                    </option>
                    <option value="opt1">Option 1</option>
                    <option value="opt2">Option 2</option>
                </select>
            </div>
        </div>
    )
}

export default Filter
