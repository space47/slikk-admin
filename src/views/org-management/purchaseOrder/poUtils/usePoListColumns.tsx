/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { PurchaseOrderTable } from '@/store/types/po.types'
import { FaEdit, FaFilePdf, FaRegDotCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { PoStatusColor } from './poFormCommon'
import { MdOutlineGridView } from 'react-icons/md'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

interface Props {
    handleDownloadPdf: (x: number) => void
}

export const usePoListColumns = ({ handleDownloadPdf }: Props) => {
    const navigate = useNavigate()

    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    const findCompany = (companyId: number) => {
        return companyList?.find((item) => item.id === companyId)?.name
    }

    return useMemo<ColumnDef<PurchaseOrderTable>[]>(
        () => [
            {
                header: 'PO-Number',
                accessorKey: 'id',
                cell: ({ row }) => <div>{`PO-${row?.original?.id}`}</div>,
            },
            {
                header: 'PO Nature',
                accessorKey: 'po_nature',
                cell: ({ row }) => <div>{row.original.po_nature || '-'}</div>,
            },
            {
                header: 'Company Name',
                accessorKey: 'company_name',
                cell: ({ row }) => <div>{findCompany(row.original.company) || '-'}</div>,
            },
            {
                header: 'Warehouse Name',
                accessorKey: 'gst_details.warehouse_name',
                cell: ({ row }) => <div>{row.original.gst_details.warehouse_name || '-'}</div>,
            },
            {
                header: 'Warehouse Address',
                accessorKey: 'gst_details.warehouse_address',
                cell: ({ row }) => <div>{row.original.gst_details.warehouse_address || '-'}</div>,
            },

            {
                header: 'Business Model',
                accessorKey: 'business_model',
                cell: ({ row }) => <div>{row.original.business_model || '-'}</div>,
            },
            {
                header: 'Billing Address',
                accessorKey: 'order_billing_address',
                cell: ({ row }) => <div className="max-w-[250px]">{row.original.order_billing_address || '-'}</div>,
            },
            {
                header: 'Shipping Address',
                accessorKey: 'order_shipping_address',
                cell: ({ row }) => <div className="max-w-[250px]">{row.original.order_shipping_address || '-'}</div>,
            },

            {
                header: 'Approver Name',
                accessorKey: 'approver_name',
                cell: ({ row }) => <div>{row.original.approver_name || '-'}</div>,
            },

            {
                header: 'Total Amount',
                accessorKey: 'total_amount',
                cell: ({ row }) => <div>₹ {row.original.total_amount || '0.00'}</div>,
            },

            {
                header: 'Payment Terms',
                accessorKey: 'payment_terms',
                cell: ({ row }) => <div>{row.original.payment_terms || '-'}</div>,
            },

            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => (
                    <div
                        className={`${PoStatusColor(row?.original?.status)} text-white p-2 flex gap-2 justify-center rounded-xl items-center`}
                    >
                        <span>
                            <FaRegDotCircle className=" text-white" />
                        </span>
                        {row.original.status || '-'}
                    </div>
                ),
            },
            {
                header: 'Actions',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row?.original?.status?.toLowerCase() || ''
                    const isPendingApproval =
                        status === 'created' ||
                        status === 'approval waiting' ||
                        status === 'approval_waiting' ||
                        status === 'waiting_approval'
                    const ActionButton = ({ icon: Icon, label, onClick }: any) => (
                        <button
                            className="flex items-center whitespace-nowrap gap-2 px-3 py-2 
                        bg-white text-gray-700 border border-gray-200 rounded-xl
                        hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm
                        transition-all duration-200 text-sm font-medium"
                            onClick={onClick}
                        >
                            <Icon className="text-sm shrink-0" />
                            <span className="truncate">{label}</span>
                        </button>
                    )
                    return (
                        <div className="flex flex-col gap-2">
                            {isPendingApproval ? (
                                <>
                                    <ActionButton
                                        icon={MdOutlineGridView}
                                        label="View Details"
                                        onClick={() => navigate(`/app/po/details/${row?.original?.id}`)}
                                    />

                                    <ActionButton icon={FaFilePdf} onClick={() => handleDownloadPdf(row.original.id)} label="View PDF" />
                                    <ActionButton icon={FaEdit} label="Edit" onClick={() => navigate(`/app/po/${row?.original?.id}`)} />
                                    {/* <ActionButton icon={FaPaperPlane} label="Send for Approval" /> */}
                                </>
                            ) : (
                                <>
                                    <ActionButton
                                        icon={MdOutlineGridView}
                                        label="View Details"
                                        onClick={() => navigate(`/app/po/details/${row?.original?.id}`)}
                                    />
                                    <ActionButton icon={FaFilePdf} onClick={() => handleDownloadPdf(row.original.id)} label="View PDF" />
                                </>
                            )}
                        </div>
                    )
                },
            },
        ],
        [],
    )
}
