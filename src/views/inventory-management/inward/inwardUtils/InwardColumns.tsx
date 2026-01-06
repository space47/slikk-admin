/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tooltip } from '@/components/ui'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { GRNDetails } from '@/store/types/inward.types'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import { useMemo } from 'react'
import { FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa'

const isDashboard = import.meta.env.VITE_IS_DASHBOARD !== 'brand'

interface props {
    companyList: { id: number; name: string }[]
    storeList: { id: number; name: string }[]
}

const getowner = (own: any) => {
    if (own === true) {
        return 'Yes'
    } else {
        return 'No'
    }
}

export const InwardColumns = ({ companyList, storeList }: props) => {
    const comp = useAppSelector<SINGLE_COMPANY_DATA>((state) => state.company.currCompany)

    const companyMap = useMemo(() => {
        const map = new Map<number, string>()
        companyList?.forEach((c) => map.set(c.id, c.name))
        return map
    }, [companyList])

    const storeMap = useMemo(() => {
        const map = new Map<number, string>()
        storeList?.forEach((s) => map.set(s.id, s.name))
        return map
    }, [storeList])

    return useMemo<ColumnDef<GRNDetails>[]>(
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
                    <a
                        className="w-[200px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                        href={`/app/goods/received/${row.original.company}/${row.original.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {row.original.grn_number}
                    </a>
                ),
            },
            {
                header: 'Document Number',
                accessorKey: 'document_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Indent No.',
                accessorKey: 'indent_number',
                cell: ({ row }) => {
                    return row?.original?.indent_number ? (
                        <a
                            className="w-[230px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                            href={`/app/goods/indentDetails/${row.original.indent_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {row.original.indent_number}
                        </a>
                    ) : (
                        <span className="text-red-500">No Indent Found</span>
                    )
                },
            },
            {
                header: 'GDN Number',
                accessorKey: 'gdn_number',
                cell: ({ row }) => {
                    return row?.original?.gdn_id ? (
                        <a
                            className="w-[180px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                            href={`/app/goods/gdnDetails/${encodeURIComponent(row.original.gdn_id)}/${comp?.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {row.original.gdn_number}
                        </a>
                    ) : (
                        <span className="text-red-500">No GDN Found</span>
                    )
                },
            },
            {
                header: 'Shipment Id',
                accessorKey: 'shipment_id',
                cell: ({ row }) => {
                    return row?.original?.shipment ? (
                        <a
                            className="w-[180px] p-2 rounded-xl items-center bg-gray-600 text-white flex justify-center cursor-pointer hover:bg-gray-700"
                            href={`/app/vendor/shipments/details/${row?.original?.shipment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            SHIPMENT-{row.original.shipment}
                        </a>
                    ) : (
                        <span className="text-red-500">No Shipment Found</span>
                    )
                },
            },
            {
                header: 'Company',
                accessorKey: 'company',
                cell: ({ row }) => <div>{companyMap.get(Number(row.original.company)) ?? '-'}</div>,
            },
            {
                header: 'Store',
                accessorKey: 'store',
                cell: ({ row }) => <div>{storeMap.get(Number(row.original.store)) ?? '-'}</div>,
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
                cell: ({ row }) => (
                    <div className="w-[100px] line-clamp-3 overflow-hidden text-ellipsis">
                        {row?.original?.received_address || 'Not Available'}
                    </div>
                ),
            },
            {
                header: 'Received By',
                accessorKey: 'received_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Slikk Owned',
                accessorKey: 'slikk_owned',
                cell: (info) => getowner(info.getValue()),
            },
            {
                header: 'Synced Items',
                accessorKey: 'synced_quantity',
            },
            {
                header: 'UnSynced Items',
                accessorKey: 'synced_quantity',
                cell: ({ row }) => {
                    const synced =
                        typeof row?.original?.synced_quantity === 'number'
                            ? row?.original?.synced_quantity
                            : parseInt(row?.original?.synced_quantity) || 0
                    const qcPassed =
                        typeof row?.original?.qc_passed_quantity === 'number'
                            ? row?.original?.qc_passed_quantity
                            : parseInt(row?.original?.qc_passed_quantity) || 0
                    return <div>{qcPassed - synced}</div>
                },
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
        [companyMap, storeMap, comp],
    )
}

export const InwardDetailsColumns = (
    editingRow: any,
    editFormDataRef: any,
    barcodeInputRef: any,
    skuInputRef: any,
    qtySentInputRef: any,
    handleEdit: any,
    renderEditableCell: any,
    handleEditChange: any,
    handleEditKeyDown: any,
    handleSave: any,
    handleCancel: any,
    handleAddRow: any,
    formData: {
        boxCount: string
        sku: string
        barcode: string
    },
    skuWiseData: any[],
    handleDeleteRow: any,
) => {
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'Edit',
                cell: ({ row }: any) => {
                    const isEditing = editingRow === row.original.id
                    return (
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(row.original.id)}>
                                        <Tooltip title="Save">
                                            <FaSave className="text-xl" />
                                        </Tooltip>
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={handleCancel}>
                                        <Tooltip title="Cancel">
                                            <FaTimes className="text-xl" />
                                        </Tooltip>
                                    </button>
                                </>
                            ) : (
                                <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row.original)}>
                                    <FaEdit className="text-xl" />
                                </button>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'barcode',
                accessorKey: 'barcode',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(
                            editFormDataRef.current.barcode,
                            'barcode',
                            handleEditChange,
                            handleEditKeyDown,
                            barcodeInputRef,
                        )
                    }
                    return row.original.barcode
                },
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(editFormDataRef.current.sku, 'sku', handleEditChange, handleEditKeyDown, skuInputRef)
                    }
                    return row.original.sku
                },
            },
            {
                header: 'QUANTITY SENT',
                accessorKey: 'quantity_sent',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(
                            editFormDataRef.current.quantity_sent,
                            'quantity_sent',
                            handleEditChange,
                            handleEditKeyDown,
                            qtySentInputRef,
                        )
                    }
                    return row.original.quantity_sent
                },
            },
            {
                header: 'Box Number',
                accessorKey: 'boxCount',
                cell: ({ row }: any) => {
                    console.log('box number', row?.boxCount)

                    const value = formData?.boxCount ?? row?.original?.boxCount ?? ''

                    return <div className="flex gap-1 items-center">{value}</div>
                },
            },
            {
                header: 'Add',
                accessorKey: 'add',
                cell: ({ row }: any) => {
                    const isEditing = editingRow === row.original.id
                    return (
                        <div className="">
                            <button
                                disabled={isEditing}
                                className="p-2 bg-green-600 text-white rounded-xl items-center justify-center disabled:bg-green-300 disabled:cursor-not-allowed"
                                onClick={() => handleAddRow(row?.original)}
                            >
                                ADD
                            </button>
                        </div>
                    )
                },
            },
            {
                header: 'Delete',
                accessorKey: 'delete',
                cell: ({ row }: any) => {
                    return (
                        <div className="">
                            <button
                                className="p-2 text-red-600  items-center justify-center "
                                onClick={() => handleDeleteRow(row?.original)}
                            >
                                <FaTrash className="text-xl" />
                            </button>
                        </div>
                    )
                },
            },
        ],
        [editingRow, handleEdit, handleSave, handleCancel, handleEditChange, handleEditKeyDown, skuWiseData, formData],
    )
}
export const ShipmentDetailsInwardColumns = (
    editingRow: any,
    editFormDataRef: any,
    barcodeInputRef: any,
    skuInputRef: any,
    qtySentInputRef: any,
    handleEdit: any,
    renderEditableCell: any,
    handleEditChange: any,
    handleEditKeyDown: any,
    handleSave: any,
    handleCancel: any,
    qtyReceivedInputRef: any,
) => {
    useMemo(
        () => [
            {
                header: 'Barcode',
                accessorKey: 'barcode',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(
                            editFormDataRef.current.barcode,
                            'barcode',
                            handleEditChange,
                            handleEditKeyDown,
                            barcodeInputRef,
                        )
                    }
                    return row.original.barcode
                },
            },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(editFormDataRef.current.sku, 'sku', handleEditChange, handleEditKeyDown, skuInputRef)
                    }
                    return row.original.sku
                },
            },
            {
                header: 'Catalog Available',
                accessorKey: 'catalog_available',
                cell: ({ row }: any) => {
                    return <div>{row.original.catalog_available ? 'true' : 'false'}</div>
                },
            },
            {
                header: 'Quantity Sent',
                accessorKey: 'quantity_sent',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(
                            editFormDataRef.current.quantity_sent,
                            'quantity_sent',
                            handleEditChange,
                            handleEditKeyDown,
                            qtySentInputRef,
                        )
                    }
                    return row.original.quantity_sent
                },
            },
            {
                header: 'Quantity Received',
                accessorKey: 'quantity_received',
                cell: ({ row }: any) => {
                    if (editingRow === row.original.id) {
                        return renderEditableCell(
                            editFormDataRef.current.quantity_received,
                            'quantity_received',
                            handleEditChange,
                            handleEditKeyDown,
                            qtyReceivedInputRef,
                        )
                    }
                    return row.original.quantity_received
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
                cell: ({ row }: any) => {
                    return <span>{moment(row.original.create_date).format('DD-MM-YYYY')}</span>
                },
            },
            {
                header: isDashboard ? 'Action' : '',
                accessorKey: 'action',
                cell: ({ row }: any) => {
                    const isEditing = editingRow === row.original.id
                    return (
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(row.original.id)}>
                                        <Tooltip title="Save">
                                            <FaSave className="text-xl" />
                                        </Tooltip>
                                    </button>
                                    <button className="text-red-500 hover:text-red-700" onClick={handleCancel}>
                                        <Tooltip title="Cancel">
                                            <FaTimes className="text-xl" />
                                        </Tooltip>
                                    </button>
                                </>
                            ) : (
                                <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row.original)}>
                                    <FaEdit className="text-xl" />
                                </button>
                            )}
                        </div>
                    )
                },
            },
        ],
        [editingRow, handleEdit, handleSave, handleCancel, handleEditChange, handleEditKeyDown],
    )
}
