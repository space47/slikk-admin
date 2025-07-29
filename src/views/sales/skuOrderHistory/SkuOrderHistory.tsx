import React, { useEffect, useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { SKUhistory } from './skuhistoru.common'
import EasyTable from '@/common/EasyTable'
import { Spinner, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import debounce from 'lodash/debounce'

const SkuOrderHistory = () => {
    const [data, setData] = useState<SKUhistory[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [showSkuTable, setShowSkuTable] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [tab, setTab] = useState('sku')

    const fetchData = async () => {
        setIsLoading(true)
        setHasSearched(true)
        try {
            const response = await axiosInstance.get(`/merchant/product/sku/sales?${tab}=${encodeURIComponent(globalFilter.trim())}`)
            const data = response.data.data
            setData(data)
        } catch (error) {
            console.error(error)
            setData([])
        } finally {
            setIsLoading(false)
        }
    }

    const debouncedFetchData = useMemo(() => debounce(fetchData, 500), [globalFilter, tab])

    useEffect(() => {
        const trimmedSku = globalFilter.trim()
        if (trimmedSku) {
            debouncedFetchData()
            setShowSkuTable(true)
            return () => {
                debouncedFetchData.cancel()
            }
        } else {
            setData([])
            setShowSkuTable(false)
            setHasSearched(false)
        }
    }, [globalFilter, tab])

    const columns = useMemo<ColumnDef<SKUhistory>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Order ID',
                accessorKey: 'order_id',
                cell: ({ getValue, row }) => {
                    return (
                        <div className="flex items-center gap-3">
                            <a
                                href={`/app/orders/${getValue()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                            >
                                {row?.original?.order_id}
                            </a>
                        </div>
                    )
                },
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Date',
                accessorKey: 'date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Selling Price (SP)',
                accessorKey: 'sp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: (info) => {
                    const images = info.getValue() as string
                    const firstImageUrl = images ? images.split(',')[0].trim() : ''
                    return firstImageUrl ? <img src={firstImageUrl} alt="Product Image" className="w-16 h-16" /> : null
                },
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Maximum Retail Price (MRP)',
                accessorKey: 'mrp',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return Order ID',
                accessorKey: 'return_order_id',
                cell: ({ row, getValue }) => {
                    return (
                        <div>
                            {row?.original?.return_order_id ? (
                                <>
                                    <a
                                        href={`/app/returnOrders/${getValue()}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white w-[70%] bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                                    >
                                        {row?.original?.return_order_id}
                                    </a>
                                </>
                            ) : (
                                'N/A'
                            )}
                        </div>
                    )
                },
            },
        ],
        [],
    )

    return (
        <div className="">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-blue-800 mb-2 ">Order History</h1>
                <p className="text-gray-600 mb-4">Track all orders for a specific product SKU or SKID</p>

                <Tabs defaultValue="sku" onChange={(e: string) => setTab(e)}>
                    <TabList className="flex items-center justify-start gap-4 bg-gray-50  shadow-md p-3 mb-10">
                        <TabNav
                            value="sku"
                            className="relative px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 rounded-xl transition-all duration-300 hover:text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            SKU
                        </TabNav>
                        <TabNav
                            value="skid"
                            className="relative px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 rounded-xl transition-all duration-300 hover:text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            SKID
                        </TabNav>
                    </TabList>
                </Tabs>

                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="search"
                        placeholder="Enter SKU code..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={globalFilter}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value.trimStart())
                            setShowSkuTable(!!e.target.value.trim())
                        }}
                    />
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center ">
                    <Spinner size={20} />
                </div>
            )}

            {showSkuTable && !isLoading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {data && data.length > 0 ? (
                        <EasyTable noPage mainData={data} columns={columns} />
                    ) : hasSearched ? (
                        <div className="p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                            <p className="mt-1 text-gray-500">Could not find any orders for this SKU code.</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default SkuOrderHistory
