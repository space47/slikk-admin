import { Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React, { useState } from 'react'

const options = [
    { value: 'myntra', label: 'Myntra' },
    { value: 'nykaa', label: 'Nykaa' },
]

const Scrapper = () => {
    const [url, setUrl] = useState('')
    const [count, setCount] = useState<number | ''>('')
    const [companyName, setCompanyName] = useState('')

    const handleChange = (val: { label: string; value: string }) => {
        setCompanyName(val.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url || !count) {
            notification.error({ message: 'Please provide both URL and product count.' })
            return
        }
        try {
            const res = await axioisInstance.get(`/scrape-data`, {
                params: {
                    url: url,
                    product_count: count,
                    company_name: companyName,
                },
            })
            notification.success({ message: 'File has been generated and sent to your Email' })
        } catch (error) {
            notification.error({ message: 'An error occurred while fetching data.' })
        }
    }

    return (
        <div className="flex items-center justify-center ">
            <div className="w-full  rounded-2xl bg-white p-8 shadow-xl">
                {/* Title */}
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Data Scraper</h1>
                <p className="mb-8 text-center text-sm text-gray-500">Enter a product URL and the number of products to fetch.</p>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* URL Field */}
                    <div>
                        <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-700">
                            Website URL
                        </label>
                        <input
                            type="text"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/product"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-700">
                            Company
                        </label>
                        <Select
                            isSearchable
                            options={options}
                            onChange={(val) => handleChange(val as { label: string; value: string })}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                    </div>
                    {/* Product Count Field */}
                    <div>
                        <label htmlFor="count" className="mb-2 block text-sm font-medium text-gray-700">
                            Product Count
                        </label>
                        <input
                            type="number"
                            id="count"
                            value={count}
                            onChange={(e) => setCount(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Enter number of products"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            min={1}
                        />
                    </div>

                    {/* Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className=" rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-md transition duration-300 hover:bg-indigo-700 hover:shadow-lg"
                        >
                            Start Scraping
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Scrapper
