/* eslint-disable @typescript-eslint/no-explicit-any */
import { Shipment } from '@/store/types/masterShipment.types'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const MasterShipmentColumns = () => {
    const navigate = useNavigate()
    return useMemo<ColumnDef<Shipment>[]>(
        () => [
            {
                header: 'Edit',
                name: 'id',
                cell: ({ row }) => {
                    return (
                        <div>
                            <button
                                className="flex items-center justify-center bg-none border-none"
                                onClick={() => navigate(`/app/masterShipments/update/${row?.original?.id}`)}
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
                cell: ({ row }) => {
                    return (
                        <a
                            href={`/app/vendor/shipments/details/${row?.original?.id}`}
                            className="p-2 w-auto min-w-[200px] rounded-xl bg-gray-600 text-white flex items-center justify-center hover:bg-gray-400 cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {row?.original.shipment_id}
                        </a>
                    )
                },
            },
            {
                header: 'name',
                name: 'name',
                cell: ({ row }) => {
                    return <div>{row?.original.name}</div>
                },
            },
            {
                header: 'Child Shipments',
                name: 'child_shipments',
                cell: ({ row }) => {
                    return <div>{row?.original.child_shipment?.length || 0}</div>
                },
            },
            {
                header: 'origin Address',
                name: 'origin_address',
                cell: ({ row }) => {
                    return <div>{row?.original.origin_address}</div>
                },
            },
            {
                header: 'Delivery Address',
                name: 'delivery_address',
                cell: ({ row }) => {
                    return <div>{row?.original.delivery_address}</div>
                },
            },
            {
                header: 'Received By',
                name: 'received_by',
                cell: ({ row }) => {
                    return <div>{row?.original.received_by}</div>
                },
            },
            {
                header: 'Dispatch Date',
                name: 'dispatch_date',
                cell: ({ row }) => {
                    return <div>{row?.original.dispatch_date}</div>
                },
            },
            {
                header: 'Delivery Date',
                name: 'delivery_date',
                cell: ({ row }) => {
                    return <div>{row?.original.delivery_date}</div>
                },
            },
            {
                header: 'Box Count',
                name: 'box_count',
                cell: ({ row }) => {
                    return <div>{row?.original.box_count}</div>
                },
            },
            {
                header: 'Items Count',
                name: 'items_count',
                cell: ({ row }) => {
                    return <div>{row?.original.items_count}</div>
                },
            },
        ],
        [],
    )
}

// export const ShipmentDetailsColumns = (
//     isDashboard: boolean,
//     qtyInputRef,
//     updatedQuantities,
//     handleQuantityChange,
//     handleChangeQty,
// ) => {
//     return useMemo(
//         () => [
//             { header: 'Barcode', accessorKey: 'barcode' },
//             { header: 'SKU', accessorKey: 'sku' },
//             { header: 'Catalog Available', accessorKey: 'catalog_available' },
//             { header: 'Quantity Sent', accessorKey: 'quantity_sent' },
//             {
//                 header: 'Quantity Received',
//                 accessorKey: 'quantity_received',
//                 cell: ({ row }) => {
//                     const stockId = row.original.id
//                     return isDashboard ? (
//                         <div className="flex gap-2 items-center">
//                             <input
//                                 ref={(el) => (qtyInputRef.current[stockId] = el)}
//                                 className="w-[80px] rounded-md border border-gray-300 p-2 text-center text-sm focus:border-indigo-500 focus:outline-none"
//                                 type="number"
//                                 min={0}
//                                 value={updatedQuantities[stockId] ?? row.original.quantity_received}
//                                 onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
//                             />
//                             <div onClick={() => handleChangeQty(row.original.quantity_received, row.original.id)}>
//                                 <GrUpdate className="text-xl font-bold text-green-500 cursor-pointer" />
//                             </div>
//                         </div>
//                     ) : (
//                         <span className="text-gray-700">{row.original.quantity_received ?? 'Not Received'}</span>
//                     )
//                 },
//             },
//             {
//                 header: 'QC failed',
//                 accessorKey: 'qc_failed',
//                 cell: ({ row }) => {
//                     const quantityReceived = row?.original?.quantity_received ?? 0
//                     const quantitySent = row?.original?.quantity_sent ?? 0
//                     return <div>{quantitySent - quantityReceived}</div>
//                 },
//             },
//             {
//                 header: 'Created Date',
//                 accessorKey: 'create_date',
//                 cell: ({ row }) => <span>{moment(row.original.create_date).format('DD-MM-YYYY')}</span>,
//             },
//         ],
//         [updatedQuantities, qtyInputRef],
//     )
// }
