/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const BrandShipmentsColumns = () => {
    const navigate = useNavigate()
    return useMemo(
        () => [
            {
                header: 'Edit',
                name: 'id',
                cell: ({ row }: any) => {
                    return (
                        <div>
                            <button
                                className="flex items-center justify-center bg-none border-none"
                                onClick={() => navigate(`/app/vendor/shipments/update/${row?.original?.id}`)}
                            >
                                <FaEdit className="text-xl text-blue-500" />
                            </button>
                        </div>
                    )
                },
            },
            {
                header: 'Shipment Id',
                name: 'shipment_id',
                cell: ({ row }: any) => {
                    return <div>{row?.original.shipment_id}</div>
                },
            },
            {
                header: 'name',
                name: 'name',
                cell: ({ row }: any) => {
                    return <div>{row?.original.name}</div>
                },
            },
            {
                header: 'origin Address',
                name: 'origin_address',
                cell: ({ row }: any) => {
                    return <div>{row?.original.origin_address}</div>
                },
            },
            {
                header: 'Delivery Address',
                name: 'delivery_address',
                cell: ({ row }: any) => {
                    return <div>{row?.original.delivery_address}</div>
                },
            },
            {
                header: 'Received By',
                name: 'received_by',
                cell: ({ row }: any) => {
                    return <div>{row?.original.received_by}</div>
                },
            },
            {
                header: 'Dispatch Date',
                name: 'dispatch_date',
                cell: ({ row }: any) => {
                    return <div>{row?.original.dispatch_date}</div>
                },
            },
            {
                header: 'Delivery Date',
                name: 'delivery_date',
                cell: ({ row }: any) => {
                    return <div>{row?.original.delivery_date}</div>
                },
            },
            {
                header: 'Box Count',
                name: 'box_count',
                cell: ({ row }: any) => {
                    return <div>{row?.original.box_count}</div>
                },
            },
            {
                header: 'Items Count',
                name: 'items_count',
                cell: ({ row }: any) => {
                    return <div>{row?.original.items_count}</div>
                },
            },
        ],
        [],
    )
}
