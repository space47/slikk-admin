/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'

export const InwardColumns = () => {
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }: any) => (
                    <button className="border-none bg-none">
                        <a href={`/app/goods/received/edit/${row.original.grn_number}`} target="_blank" rel="noreferrer">
                            {' '}
                            <FaEdit className="text-xl text-blue-500" />
                        </a>
                    </button>
                ),
            },
            {
                header: 'GRN Number',
                accessorKey: 'grn_number',
                cell: ({ row }: any) => (
                    <div
                        // onClick={() => handleGRNClick(row.original.grn_number, row.original.company)}
                        className="cursor-pointer bg-gray-200 px-3 py-3 rounded-md text-black font-semibold"
                    >
                        <a href={`/app/goods/received/${row.original.company}/${row.original.grn_number}`} target="_blank" rel="noreferrer">
                            {row.original.grn_number}
                        </a>
                    </div>
                ),
            },
            {
                header: 'Document Number',
                accessorKey: 'document_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Document Date',
                accessorKey: 'document_date',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Received At',
                accessorKey: 'received_address',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Received By',
                accessorKey: 'received_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Slikk Owned',
                accessorKey: 'slikk_owned',
                cell: (info) => (info.getValue() ? 'YES' : 'NO'),
            },
            {
                header: 'Total QTY',
                accessorKey: 'total_quantity',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Total SKU',
                accessorKey: 'total_sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Updated On',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
        ],
        [],
    )
}

export const InwardDetailsColumns = (
    qcReceived: number | undefined,
    setQcReceived: React.Dispatch<React.SetStateAction<number | undefined>>,
    qcPass: number | undefined,
    setQcPass: React.Dispatch<React.SetStateAction<number | undefined>>,
    locationInput: string,
    setLocationInput: React.Dispatch<React.SetStateAction<string>>,
    formData: {
        location: string
        sku: string
        barcode: string
    },
    skuWiseData: any[],
) => {
    return useMemo(
        () => [
            { header: 'barcode', accessorKey: 'barcode' },
            { header: 'SKU', accessorKey: 'sku' },
            {
                header: 'QUANTITY SENT',
                accessorKey: 'quantity_sent',
            },
            {
                header: 'QUANTITY RECEIVED',
                accessorKey: 'quantity_received',
                cell: ({ row }: any) => {
                    const value = qcReceived ?? row?.original?.quantity_received
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px] "
                                type="number"
                                min={0}
                                value={value}
                                onChange={(e) => setQcReceived(Number(e.target.value))}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'QC PASSED',
                accessorKey: 'qc_passed',
                cell: ({ row }: any) => {
                    const value = qcPass ?? row?.original?.qc_passed ?? 0
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px] "
                                type="number"
                                min={0}
                                value={value}
                                onChange={(e) => setQcPass(Number(e.target.value))}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'QC FAILED',
                accessorKey: 'qc_failed',
                cell: ({ row }: any) => {
                    const received = qcReceived ?? row?.original?.quantity_received ?? 0
                    const passed = qcPass ?? row?.original?.qc_passed ?? 0
                    const qcFail = received - passed
                    return <div>{qcFail}</div>
                },
            },
            {
                header: 'LOCATION',
                accessorKey: 'location',
                cell: () => {
                    const getSame = skuWiseData?.find((item: any) => item.sku === formData?.sku)
                    let value = locationInput !== '' ? locationInput : formData?.location
                    if (getSame) {
                        value = `${getSame?.location}/${formData?.location}`
                    }
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[100px] "
                                type="text"
                                min={0}
                                value={value}
                                onChange={(e) => setLocationInput(e.target.value)}
                            />
                        </div>
                    )
                },
            },
        ],
        [formData, qcReceived, qcPass, locationInput, skuWiseData],
    )
}
export const ShipmentDetailsInwardColumns = (
    qtyInputRef: React.MutableRefObject<any>,
    handleQuantityChange: (stockId: string, value: number) => void,
    updatedQuantities: Record<string, number>,
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
                cell: ({ row }: any) => {
                    const stockId = row.original.id
                    return (
                        <div className="flex gap-2 items-center">
                            <input
                                ref={(el) => (qtyInputRef.current[stockId] = el)}
                                className="w-[80px] rounded-md border border-gray-300 p-2 text-center text-sm focus:border-indigo-500 focus:outline-none"
                                type="number"
                                min={0}
                                value={updatedQuantities[stockId] ?? row.original.quantity_received}
                                onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'QC failed',
                accessorKey: 'qc_failed',
                cell: ({ row }: any) => {
                    const quantityReceived = row?.original?.quantity_received ?? 0
                    const quantitySent = row?.original?.quantity_sent ?? 0
                    return <div>{quantitySent - quantityReceived}</div>
                },
            },
            {
                header: 'Created Date',
                accessorKey: 'create_date',
                cell: ({ row }: any) => <span>{moment(row.original.create_date).format('DD-MM-YYYY')}</span>,
            },
        ],
        [updatedQuantities],
    )
}
