import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { STORETABLE } from '../commonStores'
import { FaEdit } from 'react-icons/fa'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { Switch } from 'antd'

interface props {
    handleActiveCareer: any
}

export const useStoreColumn = ({ handleActiveCareer }: props) => {
    const navigate = useNavigate()
    return useMemo<ColumnDef<STORETABLE>[]>(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button className="border-none bg-none" onClick={() => navigate(`/app/stores/${row.original.id}`)}>
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            {
                header: 'Store Availability',
                accessorKey: 'is_accepting_orders',
                cell: ({ row }: any) => {
                    return (
                        <div>
                            <Switch
                                className="bg-red-500"
                                checked={row.original.is_accepting_orders}
                                onChange={(checked) => handleActiveCareer(row.original.id, checked, row.original.is_accepting_orders)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'CODE',
                accessorKey: 'code',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Fullfillment Center',
                accessorKey: 'is_fulfillment_center',
                cell: (info) => (info.getValue() ? 'YES' : 'NO'),
            },
            {
                header: 'Volumetric Store',
                accessorKey: 'is_volumetric_store',
                cell: (info) => (info.getValue() ? 'YES' : 'NO'),
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Area',
                accessorKey: 'area',
                cell: (info) => info.getValue(),
            },
            {
                header: 'City',
                accessorKey: 'city',
                cell: (info) => info.getValue(),
            },
            {
                header: 'State',
                accessorKey: 'state',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Pincode',
                accessorKey: 'pincode',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Rating',
                accessorKey: 'rating',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Latitude',
                accessorKey: 'latitude',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Longitude',
                accessorKey: 'longitude',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Contact Number',
                accessorKey: 'contactNumber',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Alternate Contact Number',
                accessorKey: 'alternate_contact_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC',
                accessorKey: 'poc',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC Designation',
                accessorKey: 'poc_designation',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return Area',
                accessorKey: 'return_area',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return City',
                accessorKey: 'return_city',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return State',
                accessorKey: 'return_state',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Return Pincode',
                accessorKey: 'return_pincode',
                cell: (info) => info.getValue(),
            },
            {
                header: 'GSTIN',
                accessorKey: 'gstin',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Instruction',
                accessorKey: 'instruction',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Active',
                accessorKey: 'is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Location URL',
                accessorKey: 'location_url',
                cell: (info) => (
                    <a href={info.getValue() as string} target="_blank" rel="noopener noreferrer">
                        Location
                    </a>
                ),
            },
            // {
            //     header: 'Store Availability',
            //     accessorKey: '',
            //     cell: ({ row }) => (
            //         <button className="border-none bg-none" onClick={() => handleStoreAvailability(row?.original?.id)}>
            //             <FaEdit className="text-xl text-blue-600" />
            //         </button>
            //     ),
            // },
        ],
        [],
    )
}
