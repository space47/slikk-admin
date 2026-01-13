/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { SKUhistory } from './skuhistoru.common'
import EasyTable from '@/common/EasyTable'
import { Spinner, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import debounce from 'lodash/debounce'
import StoreSelectComponent from '@/common/StoreSelectComponent'

const SkuOrderHistory = () => {
    const [data, setData] = useState<SKUhistory[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [showSkuTable, setShowSkuTable] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [store, setStore] = useState<any[]>([])
    const [tab, setTab] = useState<string>('sku')

    /* ----------------------------- API CALL ----------------------------- */
    const fetchData = useCallback(async () => {
        const searchValue = globalFilter.trim()
        if (!searchValue) return

        setIsLoading(true)
        setHasSearched(true)

        const storeId = store.length > 0 ? `&store_id=${store.map((item) => item.id).join(',')}` : ''

        try {
            const response = await axiosInstance.get(`/merchant/product/sku/sales?${tab}=${encodeURIComponent(searchValue)}${storeId}`)
            setData(response.data.data || [])
        } catch (error) {
            console.error(error)
            setData([])
        } finally {
            setIsLoading(false)
        }
    }, [globalFilter, tab, store])

    /* --------------------------- DEBOUNCED API --------------------------- */
    const debouncedFetchData = useMemo(() => debounce(fetchData, 500), [fetchData])

    /* ------------------------------ EFFECT ------------------------------- */
    useEffect(() => {
        const trimmedValue = globalFilter.trim()

        if (!trimmedValue) {
            setData([])
            setShowSkuTable(false)
            setHasSearched(false)
            debouncedFetchData.cancel()
            return
        }

        setShowSkuTable(true)
        debouncedFetchData()

        return () => {
            debouncedFetchData.cancel()
        }
    }, [globalFilter, tab, store, debouncedFetchData])

    /* ------------------------------ COLUMNS ------------------------------ */
    const columns = useMemo<ColumnDef<SKUhistory>[]>(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',
            },
            {
                header: 'Order ID',
                accessorKey: 'order_id',
                cell: ({ getValue }) => (
                    <a
                        href={`/app/orders/${getValue()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-red-600 px-2 py-1 rounded-[7px] font-semibold"
                    >
                        {getValue() as string}
                    </a>
                ),
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
            },
            {
                header: 'Date',
                accessorKey: 'date',
                cell: ({ getValue }) => moment(getValue() as string).format('YYYY-MM-DD'),
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Selling Price (SP)',
                accessorKey: 'sp',
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ getValue }) => {
                    const images = getValue() as string
                    const firstImage = images?.split(',')[0]
                    return firstImage ? <img src={firstImage} alt="Product" className="w-16 h-16 object-cover" /> : null
                },
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
            },
            {
                header: 'Maximum Retail Price (MRP)',
                accessorKey: 'mrp',
            },
            {
                header: 'Return Order ID',
                accessorKey: 'return_order_id',
                cell: ({ getValue }) =>
                    getValue() ? (
                        <a
                            href={`/app/returnOrders/${getValue()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white bg-red-600 px-2 py-1 rounded-[7px] font-semibold"
                        >
                            {getValue() as string}
                        </a>
                    ) : (
                        'N/A'
                    ),
            },
        ],
        [],
    )

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-blue-800 mb-2">Order History</h1>
                <p className="text-gray-600 mb-4">Track all orders for a specific product SKU or SKID</p>

                <StoreSelectComponent label="Select Store" store={store} setStore={setStore} customCss="w-full" />

                <Tabs defaultValue="sku" onChange={(v) => setTab(v)}>
                    <TabList className="flex gap-4 bg-gray-50 shadow-md p-3 mb-10">
                        <TabNav value="sku">SKU</TabNav>
                        <TabNav value="skid">SKID</TabNav>
                    </TabList>
                </Tabs>

                <div className="relative max-w-md">
                    <input
                        type="search"
                        placeholder="Enter SKU code..."
                        className="block w-full pl-4 py-3 border rounded-lg"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value.trimStart())}
                    />
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center">
                    <Spinner size={20} />
                </div>
            )}

            {showSkuTable && !isLoading && (
                <div className="bg-white rounded-xl shadow-sm border">
                    {data.length > 0 ? (
                        <EasyTable noPage mainData={data} columns={columns} />
                    ) : (
                        hasSearched && <div className="p-8 text-center text-gray-500">No orders found</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SkuOrderHistory
