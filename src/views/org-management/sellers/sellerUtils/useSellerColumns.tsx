import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { VendorList } from '@/store/types/vendor.type'

export const useSellerColumns = () => {
    const navigate = useNavigate()

    return useMemo<ColumnDef<VendorList>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button
                        onClick={() => navigate(`/app/sellers/${row?.original?.id}`)}
                        className="border-none bg-transparent hover:opacity-80"
                    >
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'Vendor Info',
                accessorKey: 'vendor',
                cell: ({ row }) => (
                    <div className="max-w-[250px] space-y-1 truncate text-sm leading-tight">
                        <p>
                            <span className="font-semibold">Name:</span> {row?.original?.name}
                        </p>
                        <p>
                            <span className="font-semibold">Code:</span> {row?.original?.code}
                        </p>
                        <p className="line-clamp-2">
                            <span className="font-semibold">Address:</span> {row?.original?.address}
                        </p>
                        <p>
                            <span className="font-semibold">Segment:</span> {row?.original?.segment}
                        </p>
                        <p>
                            <span className="font-semibold">Active:</span> {row?.original?.is_active ? 'Yes' : 'No'}
                        </p>
                    </div>
                ),
            },
            {
                header: 'Registration Details',
                accessorKey: 'registration',
                cell: ({ row }) => (
                    <div className="max-w-[250px] space-y-1 text-sm leading-tight">
                        <p>
                            <span className="font-semibold">CIN:</span> {row?.original?.cin}
                        </p>
                        <p>
                            <span className="font-semibold">GSTIN:</span> {row?.original?.gstin}
                        </p>
                        <p>
                            <span className="font-semibold">Created:</span> {moment(row?.original?.create_date).format('YYYY-MM-DD HH:mm')}
                        </p>
                        <p>
                            <span className="font-semibold">Updated:</span> {moment(row?.original?.update_date).format('YYYY-MM-DD HH:mm')}
                        </p>
                    </div>
                ),
            },
            {
                header: 'Contact Details',
                accessorKey: 'vendor',
                cell: ({ row }) => (
                    <div className="max-w-[200px] space-y-1 text-sm leading-tight">
                        <p>
                            <span className="font-semibold">Phone:</span> {row?.original?.contact_number}
                        </p>
                        <p>
                            <span className="font-semibold">Alt Phone:</span> {row?.original?.alternate_contact_number}
                        </p>
                    </div>
                ),
            },
            {
                header: 'POC',
                accessorKey: 'poc',
                cell: ({ row }) => (
                    <div className="max-w-[200px] space-y-1 text-sm leading-tight">
                        <p>
                            <span className="font-semibold">Name:</span> {row?.original?.poc}
                        </p>
                        <p className="truncate">
                            <span className="font-semibold">Email:</span> {row?.original?.poc_email}
                        </p>
                    </div>
                ),
            },
            {
                header: 'Bank Details',
                accessorKey: 'bank',
                cell: ({ row }) => (
                    <div className="max-w-[250px] space-y-1 text-sm leading-tight">
                        <p>
                            <span className="font-semibold">Holder:</span> {row?.original?.account_holder_name}
                        </p>
                        <p>
                            <span className="font-semibold">Acc No:</span> {row?.original?.account_number}
                        </p>
                        <p>
                            <span className="font-semibold">Bank:</span> {row?.original?.bank_name}
                        </p>
                        <p>
                            <span className="font-semibold">IFSC:</span> {row?.original?.ifsc || 'N/A'}
                        </p>
                    </div>
                ),
            },
            {
                header: 'Charges & Fees',
                accessorKey: 'charges',
                cell: ({ row }) => (
                    <div className="max-w-[350px] space-y-1 text-sm leading-tight">
                        <p>
                            <span className="font-semibold">Damages/SKU:</span> ₹{row?.original?.damages_per_sku}
                        </p>
                        <p>
                            <span className="font-semibold">Handling/Order:</span> ₹{row?.original?.handling_charges_per_order}
                        </p>
                        <p>
                            <span className="font-semibold">Removal/SKU:</span> ₹{row?.original?.removal_fee_per_sku}
                        </p>
                        <p>
                            <span className="font-semibold">Warehouse/SKU:</span> ₹{row?.original?.warehouse_charge_per_sku}
                        </p>
                        <p>
                            <span className="font-semibold">Revenue Share:</span> {row?.original?.revenue_share}%
                        </p>
                        <p>
                            <span className="font-semibold">Settlement:</span> {row?.original?.settlement_days} days
                        </p>
                    </div>
                ),
            },
            {
                header: 'Action',
                accessorKey: 'vendor',
                cell: ({ row }) => (
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-200"
                            onClick={() => navigate(`/app/sellers/details/${row?.original?.id}`)}
                        >
                            View Details
                        </button>
                    </div>
                ),
            },
        ],
        [navigate],
    )
}
