import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Filter from './filter'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { OrderItem } from './commontypes'

export interface Order {
    invoice_id: string
    create_date: string
    user: {
        name: string
        mobile: string
    }
    store: {
        address: string
        latitude: string
        longitude: string
    }
    rating: number
    amount: number
    payment: {
        mode: string
        amount: number
    }
    order_items: OrderItem[]
    status: string
    update_date: string
}

const headers = [
    'Invoice Id',
    'Order Date',
    'Mobile Number',
    'Customer Name',
    'Store Address',
    'Rating',
    'Payment Mode',
    'Total Items',
    'Order Total',
    'Status',
    'Last Update',
]

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [sort, setSort] = useState<boolean>(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(
                    `/merchant/orders?page_size=100`,
                )
                const ordersData = response.data?.data.results || []
                setOrders(ordersData)
                setFilteredOrders(ordersData)
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrders()
    }, [])

    const handleSearch = (invoiceId: string) => {
        let filtered = orders

        if (invoiceId) {
            filtered = filtered.filter((order) =>
                order.invoice_id.includes(invoiceId),
            )
        }

        setFilteredOrders(filtered)
    }

    const handleSelectDateRange = () => {
        console.log('Date range selection clicked')
    }

    const handleSort = (key: keyof Order) => {
        const sortedOrders = [...filteredOrders].sort((a, b) => {
            if (a[key] < b[key]) {
                return sort ? -1 : 1
            }
            if (a[key] > b[key]) {
                return sort ? 1 : -1
            }
            return 0
        })
        setSort(!sort)
        setFilteredOrders(sortedOrders)
    }

    const getColumnKey = (heads: string): keyof Order => {
        switch (heads) {
            case 'Invoice Id':
                return 'invoice_id'
            case 'Order Date':
                return 'create_date'
            case 'Mobile Number':
                return 'user'
            case 'Store Code':
                return 'store'
            case 'Rating':
                return 'rating'
            // case 'Payment Mode':
            //     return 'mode'
            // case 'Total Items':
            //     return 'totalItems'
            case 'Order Total':
                return 'amount'
            case 'Status':
                return 'status'
            case 'Last Update':
                return 'update_date'
            default:
                throw new Error('Unknown column')
        }
    }

    const handleInvoiceClick = (invoiceId: string) => {
        navigate(`/app/orders/${invoiceId}`)
    }

    return (
        <div className="overflow-x-auto">
            <Filter
                onSearch={handleSearch}
                onSelectDateRange={handleSelectDateRange}
            />
            <table className="min-w-full bg-white border-gray-300 border-0">
                <thead>
                    <tr>
                        {headers.map((heads, key) => (
                            <th key={key} className="py-2 px-2">
                                <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                        handleSort(getColumnKey(heads))
                                    }
                                >
                                    {heads.toUpperCase()}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, key) => (
                        <tr key={key}>
                            <td className="py-2 px-4 border-b">
                                <div
                                    className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                                    onClick={() =>
                                        handleInvoiceClick(order.invoice_id)
                                    }
                                >
                                    {order.invoice_id}
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.create_date}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.user.mobile}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.user.name}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.store?.address}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.rating}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.payment?.mode}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.order_items.length}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.payment.amount}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.status}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.update_date}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OrderList
