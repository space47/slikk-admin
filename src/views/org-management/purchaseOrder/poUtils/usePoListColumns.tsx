/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import moment from 'moment'
import { PurchaseOrderTable } from '@/store/types/po.types'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { PoStatusColor } from './poFormCommon'

export const usePoListColumns = () => {
    const navigate = useNavigate()

    return useMemo<ColumnDef<PurchaseOrderTable>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <div>{<FaEdit className="text-xl text-blue-500" onClick={() => navigate(`/app/po/${row?.original?.id}`)} />}</div>
                ),
            },
            {
                header: 'Company Name',
                accessorKey: 'company_name',
                cell: ({ row }) => <div>{row.original.company_name || '-'}</div>,
            },

            {
                header: 'Brand Name',
                accessorKey: 'brand_name',
                cell: ({ row }) => <div>{row.original.brand_name || '-'}</div>,
            },

            {
                header: 'Business Model',
                accessorKey: 'business_model',
                cell: ({ row }) => <div>{row.original.business_model || '-'}</div>,
            },

            {
                header: 'Vendor GST No',
                accessorKey: 'vendor_gst_no',
                cell: ({ row }) => <div>{row.original.vendor_gst_no || '-'}</div>,
            },

            {
                header: 'Vendor Address',
                accessorKey: 'vendor_address',
                cell: ({ row }) => <div className="max-w-[250px]">{row.original.vendor_address || '-'}</div>,
            },

            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => (
                    <div className={`${PoStatusColor(row?.original?.status)} text-white p-2 rounded-xl items-center`}>
                        {row.original.status || '-'}
                    </div>
                ),
            },

            // {
            //     header: 'PO Nature',
            //     accessorKey: 'po_nature',
            //     cell: ({ row }) => <div>{row.original.po_nature || '-'}</div>,
            // },

            // {
            //     header: 'POC Name',
            //     accessorKey: 'poc_name',
            //     cell: ({ row }) => <div>{row.original.poc_name || '-'}</div>,
            // },

            // {
            //     header: 'POC Contact',
            //     accessorKey: 'poc_contact',
            //     cell: ({ row }) => <div>{row.original.poc_contact || '-'}</div>,
            // },

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

            // {
            //     header: 'PO Issued Date',
            //     accessorKey: 'po_issued_date',
            //     cell: ({ row }) => (
            //         <div>{row.original.po_issued_date ? moment(row.original.po_issued_date).format('DD MMM YYYY') : '-'}</div>
            //     ),
            // },

            // {
            //     header: 'Delivery Date',
            //     accessorKey: 'delivery_date',
            //     cell: ({ row }) => <div>{row.original.delivery_date ? moment(row.original.delivery_date).format('DD MMM YYYY') : '-'}</div>,
            // },

            // {
            //     header: 'Agreement Completed',
            //     accessorKey: 'agreement_completed',
            //     cell: ({ row }) => <div>{row.original.agreement_completed ? 'Yes' : 'No'}</div>,
            // },

            {
                header: 'Payment Terms',
                accessorKey: 'payment_terms',
                cell: ({ row }) => <div>{row.original.payment_terms || '-'}</div>,
            },

            // {
            //     header: 'State Code',
            //     accessorKey: 'state_code',
            //     cell: ({ row }) => <div>{row.original.state_code || '-'}</div>,
            // },

            // {
            //     header: 'Created At',
            //     accessorKey: 'created_at',
            //     cell: ({ row }) => <div>{moment(row.original.created_at).format('DD MMM YYYY, hh:mm A')}</div>,
            // },

            // {
            //     header: 'Updated At',
            //     accessorKey: 'updated_at',
            //     cell: ({ row }) => <div>{moment(row.original.updated_at).format('DD MMM YYYY, hh:mm A')}</div>,
            // },
        ],
        [],
    )
}
