/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { GrUpdate } from 'react-icons/gr'
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
                    return (
                        <div
                            className="p-2 rounded-xl bg-gray-600 text-white flex items-center justify-center hover:bg-gray-400 cursor-pointer"
                            onClick={() => navigate(`/app/vendor/shipments/details/${row?.original?.id}`)}
                        >
                            {row?.original.shipment_id}
                        </div>
                    )
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

export const ShipmentDetailsColumns = (
    isDashboard: boolean,
    qtyInputRef: any,
    updatedQuantities: any,
    handleQuantityChange: any,
    handleChangeQty: any,
) => {
    return useMemo(
        () => [
            { header: 'Barcode', accessorKey: 'barcode' },
            { header: 'SKU', accessorKey: 'sku' },
            { header: 'Catalog Available', accessorKey: 'catalog_available' },
            { header: 'Quantity Sent', accessorKey: 'quantity_sent' },
            {
                header: 'Quantity Received',
                accessorKey: 'quantity_received',
                cell: ({ row }) => {
                    const stockId = row.original.id
                    return isDashboard ? (
                        <div className="flex gap-2 items-center">
                            <input
                                ref={(el) => (qtyInputRef.current[stockId] = el)}
                                className="w-[80px] rounded-md border border-gray-300 p-2 text-center text-sm focus:border-indigo-500 focus:outline-none"
                                type="number"
                                min={0}
                                value={updatedQuantities[stockId] ?? row.original.quantity_received}
                                onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
                            />
                            <div onClick={() => handleChangeQty(row.original.quantity_received, row.original.id)}>
                                <GrUpdate className="text-xl font-bold text-green-500 cursor-pointer" />
                            </div>
                        </div>
                    ) : (
                        <span className="text-gray-700">{row.original.quantity_received ?? 'Not Received'}</span>
                    )
                },
            },
            {
                header: 'Created Date',
                accessorKey: 'create_date',
                cell: ({ row }) => <span>{moment(row.original.create_date).format('DD-MM-YYYY')}</span>,
            },
        ],
        [updatedQuantities],
    )
}
