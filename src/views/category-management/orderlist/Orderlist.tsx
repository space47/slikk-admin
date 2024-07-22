import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './filter'

interface Order {
    invoice_id: string
    create_date: string
    user: string
    store: string
    rating: number
    amount: number
    status: string
    update_date: string
}

const headers = [
    'Invoice Id',
    'Order Date',
    'Mobile Number',
    'Customer Name',
    'Store Code',
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`/merchant/orders`)
                const ordersData = response.data?.results || []
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
            //     return 'paymentMode'
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

    return (
        <div className="overflow-x-auto">
            <Filter
                onSearch={handleSearch}
                onSelectDateRange={handleSelectDateRange}
            />
            <table className="min-w-full bg-white border border-gray-300">
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
                                {order.invoice_id}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.create_date}
                            </td>
                            <td className="py-2 px-4 border-b">{order.user}</td>
                            <td className="py-2 px-4 border-b">
                                {order.store}
                            </td>
                            <td className="py-2 px-4 border-b">
                                {order.rating}
                            </td>
                            {/* <td className="py-2 px-4 border-b">{order.paymentMode}</td> */}
                            {/* <td className="py-2 px-4 border-b">{order.totalItems}</td> */}
                            <td className="py-2 px-4 border-b">
                                {order.amount}
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
