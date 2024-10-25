/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { FaExclamationCircle, FaMapMarkedAlt } from 'react-icons/fa'

import EasyTable from '@/common/EasyTable'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { useAppSelector } from '@/store'
import { Spinner } from '@/components/ui'

const CartOrder = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)

    const user = customerData?.profile?.mobile

    const [orders, setOrders] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(100)
    const [showSpinner, setShowSpinner] = useState(false)
    const [orderCount, setOrderCount] = useState()

    const fetchOrders = async () => {
        try {
            setShowSpinner(true)
            const response = await axiosInstance.get(`/merchant/orders?p=1&page_size=100&mobile=${user}`)

            const ordersData = response.data?.data.results
            const orderCount = response.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
            setShowSpinner(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const columns = useMemo(
        () => [
            {
                header: 'Invoice Id',
                accessorKey: 'invoice_id',
                cell: ({ getValue, row }) => {
                    const createDate = moment(row.original.create_date)
                    const currentDate = moment()
                    const differenceInSeconds = currentDate.diff(createDate, 'seconds')
                    console.log(`opoop-${row.original.id}`, differenceInSeconds)

                    return (
                        <div className="flex items-center gap-3">
                            <a
                                href={`/app/orders/${getValue()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                            >
                                {getValue()}
                            </a>
                        </div>
                    )
                },
            },

            {
                header: 'Order Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Mobile Number',
                accessorKey: 'user.mobile',
                cell: ({ getValue, row }) => {
                    return <div>{getValue()}</div>
                },
            },
            { header: 'Order Count', accessorKey: 'user_order_count' },
            { header: 'Device Type', accessorKey: 'device_type' },
            { header: 'Customer Name', accessorKey: 'user.name' },
            {
                header: 'Delivery Type',
                accessorKey: 'delivery_type',
                cell: ({ getValue }: any) => {
                    return <div>{getValue()}</div>
                },
            },
            // { header: 'Store Address', accessorKey: 'store.address' },
            {
                header: 'Customer Address',
                accessorKey: 'location_url',
                cell: ({ getValue }: any) => (
                    <a href={getValue()} target="_blank" rel="noreferrer">
                        <div className="flex justify-center">
                            <FaMapMarkedAlt className="text-xl" />
                        </div>
                    </a>
                ),
            },

            { header: 'Rating', accessorKey: 'rating' },
            { header: 'Payment Mode', accessorKey: 'payment.mode' },
            { header: 'Payment Status', accessorKey: 'payment.status' },
            { header: 'Total Items', accessorKey: 'order_items.length' },
            { header: 'Order Total', accessorKey: 'payment.amount' },
            { header: 'Status', accessorKey: 'status' },
            {
                header: 'Last Update',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [],
    )

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center  h-1/3">
                <Spinner size={40} />
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <EasyTable mainData={orders} page={page} pageSize={pageSize} columns={columns} />
            </div>
        </div>
    )
}

export default CartOrder
