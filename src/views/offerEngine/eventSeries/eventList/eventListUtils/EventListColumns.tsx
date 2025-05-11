/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const EventListColumns = () => {
    const navigate = useNavigate()
    return useMemo(() => {
        return [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }: any) => (
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-none border-none"
                            onClick={() => navigate(`/app/appSettings/eventSeries/${row?.original?.id}`)}
                        >
                            <FaEdit className="text-xl text-blue-600 cursor-pointer" />
                        </button>
                    </div>
                ),
            },

            {
                header: 'Event Name',
                accessorKey: 'name',
                cell: ({ row }: any) => (
                    <div
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/app/appSettings/eventSeries/details/${row?.original?.id}`)}
                    >
                        {row?.original?.name}
                    </div>
                ),
            },
            {
                header: 'Event Type',
                accessorKey: 'event_type',
                cell: ({ row }: any) => <div>{row?.original?.event_type}</div>,
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: ({ row }: any) => <div className="flex-wrap w-[150px]">{row?.original?.description}</div>,
            },
            {
                header: 'Image Web',
                accessorKey: 'image_web',
                cell: ({ row }: any) => (row?.original?.image_web ? <img src={row.original.image_web} alt="web" width="50" /> : ''),
            },
            {
                header: 'Image Mobile',
                accessorKey: 'image_mobile',
                cell: ({ row }: any) =>
                    row?.original?.image_mobile ? <img src={row.original.image_mobile} alt="mobile" width="50" /> : '',
            },
            {
                header: 'Total Slots',
                accessorKey: 'total_slots',
                cell: ({ row }: any) => <div>{row?.original?.total_slots}</div>,
            },
            {
                header: 'Registration Start',
                accessorKey: 'registration_start_date',
                cell: ({ row }: any) => <div>{moment(row?.original?.registration_start_date).format('DD-MM-YYYY HH:mm:ss')}</div>,
            },
            {
                header: 'Registration End',
                accessorKey: 'registration_end_date',
                cell: ({ row }: any) => <div>{moment(row?.original?.registration_end_date).format('DD-MM-YYYY HH:mm:ss')}</div>,
            },
            {
                header: 'Event Start Time',
                accessorKey: 'event_start_time',
                cell: ({ row }: any) => <div>{moment(row?.original?.event_start_time).format('DD-MM-YYYY HH:mm:ss')}</div>,
            },
            {
                header: 'Event End Time',
                accessorKey: 'event_end_time',
                cell: ({ row }: any) => <div>{moment(row?.original?.event_end_time).format('DD-MM-YYYY HH:mm:ss')}</div>,
            },
            {
                header: 'Code Prefix',
                accessorKey: 'code_prefix',
                cell: ({ row }: any) => <div>{row?.original?.code_prefix}</div>,
            },
            {
                header: 'Active',
                accessorKey: 'is_active',
                cell: ({ row }: any) => <div>{row?.original?.is_active ? 'Yes' : 'No'}</div>,
            },
            {
                header: 'Public',
                accessorKey: 'is_public',
                cell: ({ row }: any) => <div>{row?.original?.is_public ? 'Yes' : 'No'}</div>,
            },
            {
                header: 'Latitude',
                accessorKey: 'latitude',
                cell: ({ row }: any) => <div>{row?.original?.latitude}</div>,
            },
            {
                header: 'Longitude',
                accessorKey: 'longitude',
                cell: ({ row }: any) => <div>{row?.original?.longitude}</div>,
            },
            {
                header: 'Venue',
                accessorKey: 'extra_attributes.venue',
                cell: ({ row }: any) => <div>{row?.original?.extra_attributes?.venue}</div>,
            },
            {
                header: 'Category',
                accessorKey: 'extra_attributes.category',
                cell: ({ row }: any) => <div>{row?.original?.extra_attributes?.category}</div>,
            },
            {
                header: 'Sponsors',
                accessorKey: 'extra_attributes.sponsors',
                cell: ({ row }: any) => (
                    <div className="flex gap-2 flex-wrap w-[120px]">
                        {row?.original?.extra_attributes?.sponsors?.map((sponsor: string, index: number) => (
                            <span key={index} className="bg-gray-200 rounded px-2 py-1 text-sm">
                                {sponsor}
                            </span>
                        ))}
                    </div>
                ),
            },
            {
                header: 'Special Instructions',
                accessorKey: 'extra_attributes.special_instructions',
                cell: ({ row }: any) => <div className="w-[150px]">{row?.original?.extra_attributes?.special_instructions}</div>,
            },
            {
                header: 'Created At',
                accessorKey: 'create_date',
                cell: ({ row }: any) => <div>{moment(row?.original?.create_date).format('DD-MM-YYYY HH:mm:ss')}</div>,
            },
            {
                header: 'Updated At',
                accessorKey: 'update_date',
                cell: ({ row }: any) => <div>{moment(row?.original?.update_date).format('DD-MM-YYYY HH:mm:ss')}</div>,
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by',
                cell: ({ row }: any) => <div>{row?.original?.last_updated_by}</div>,
            },
        ]
    }, [])
}
