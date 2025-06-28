/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from 'antd'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

interface RiderColumnsProps {
    handleActiveCareer: (id: number, e: any, checked: boolean, mobile: string, name: string) => void
    hanldeProfileClick: (mobile: string) => void
    currentStoreLocation: Record<string, number | undefined>
}

export const calculateDistance = (latitude: number, longitude: number, storeLat: number, storeLong: number) => {
    const dLat = (latitude - (storeLat ?? 0)) * (Math.PI / 180)
    const dLon = (longitude - (storeLong ?? 0)) * (Math.PI / 180)
    const rLat1 = (storeLat ?? 0) * (Math.PI / 180)
    const rLat2 = latitude * (Math.PI / 180)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = parseFloat((6371 * c).toFixed(2))
    return distance
}

export const RiderColumns = ({ handleActiveCareer, hanldeProfileClick, currentStoreLocation }: RiderColumnsProps) => {
    const navigate = useNavigate()
    return [
        {
            header: 'Status',
            accessorKey: 'profile.checked_in_status',
            cell: ({ row }: any) => {
                const isStatusTrue = row?.original?.profile?.checked_in_status
                return (
                    <div>
                        <Switch
                            className="bg-red-500"
                            checked={isStatusTrue}
                            onChange={(checked) =>
                                handleActiveCareer(
                                    row.original.id,
                                    checked,
                                    isStatusTrue,
                                    row.original.profile.mobile,
                                    row.original.profile.first_name,
                                )
                            }
                        />
                    </div>
                )
            },
        },
        {
            header: 'Name',
            accessorKey: 'profile',
            cell: ({ row }: any) => {
                const isStatusTrue = row?.original?.profile?.checked_in_status
                return (
                    <div
                        className={
                            isStatusTrue
                                ? 'text-green-500 flex gap-2 hover:text-blue-800 hover:underline cursor-pointer'
                                : 'text-red-500 flex gap-2 hover:text-blue-800 hover:underline cursor-pointer'
                        }
                        onClick={() => hanldeProfileClick(row?.original?.profile?.mobile)}
                    >
                        <span>{row?.original?.profile?.first_name}</span>
                        <span>{row?.original?.profile?.last_name}</span>
                    </div>
                )
            },
        },
        {
            header: 'Distance From Store',
            accessorKey: 'profile.current_location',
            cell: ({ row }: any) => {
                const currentLatitude = Number(row?.original?.profile?.current_location?.latitude) || 0
                const currentLong = Number(row?.original?.profile?.current_location?.longitude)

                const storeLat = currentStoreLocation?.lat || 0
                const storeLong = currentStoreLocation?.long || 0

                const distance = calculateDistance(currentLatitude, currentLong, storeLat, storeLong)

                return <div>{distance || 0} km</div>
            },
        },
        {
            header: 'Store to Order Distance',
            accessorKey: 'recent_task_detail.distance',
            cell: ({ row }: any) => {
                return <div>{row?.original?.recent_task_detail?.distance ?? 0} Km</div>
            },
        },
        // {
        //     header: 'Estimate Time',
        //     accessorKey: 'recent_task_detail.estimate_time',
        //     cell: ({ row }: any) => {
        //         return <div>{row?.original?.recent_task_detail?.estimate_time ?? '-'}</div>
        //     },
        // },
        {
            header: 'Order',
            accessorKey: 'recent_task_detail.order_id',
            cell: ({ row }: any) => {
                return (
                    <div
                        onClick={() => navigate(`/app/orders/${row?.original?.recent_task_detail?.order_id}`)}
                        className="p-2 cursor-pointer bg-red-500 text-white rounded-xl"
                    >
                        {row?.original?.recent_task_detail?.order_id}
                    </div>
                )
            },
        },

        // {
        //     header: 'Assigned',
        //     accessorKey: 'recent_task_detail.assigned_at',
        //     cell: ({ row }: any) => {
        //         return <div>{moment(row?.original?.recent_task_detail?.assigned_at).format('YYYY-MM-DD')}</div>
        //     },
        // },
        {
            header: 'Delivered',
            accessorKey: 'recent_task_detail.delivered_at',
            cell: ({ row }: any) => {
                return <div>{moment(row?.original?.recent_task_detail?.delivered_at).format('YYYY-MM-DD HH:mm:ss ')}</div>
            },
        },

        { header: 'Mobile', accessorKey: 'profile.mobile' },
        {
            header: 'Checked In',
            accessorKey: 'task_data.check_in_time',
            cell: ({ row }: any) => {
                const time = row?.original?.task_data?.check_in_time
                return <div>{time?.split('.')[0] ?? 'N/A'}</div>
            },
        },
        {
            header: 'Checked Out',
            accessorKey: 'task_data.checkout_time',
            cell: ({ row }: any) => {
                const time = row?.original?.task_data?.checkout_time
                return <div>{time?.split('.')[0] ?? 'N/A'}</div>
            },
        },
        {
            header: 'Active Time',
            accessorKey: 'task_data.active_time',
            cell: ({ row }: any) => <div>{row?.original?.task_data?.active_time ?? 0} mins</div>,
        },
        {
            header: 'Distance Covered',
            accessorKey: 'task_data.distance_covered',
            cell: ({ row }: any) => <div>{row?.original?.task_data?.distance_covered ?? 0} km</div>,
        },
        { header: 'Order Assigned', accessorKey: 'task_data.ASSIGNED' },
        { header: 'Out for delivery', accessorKey: 'task_data.OUT_FOR_DELIVERY' },
        { header: 'Out for Return pickup', accessorKey: 'task_data.OUT_FOR_PICKUP' },
        { header: 'Return Pickup', accessorKey: 'task_data.PICKED_UP' },
        { header: 'Return Pickup failed', accessorKey: 'task_data.PICKUP_FAILED' },
        { header: 'Orders Completed', accessorKey: 'task_data.COMPLETED' },
        { header: 'Return Delivered', accessorKey: 'task_data.DELIVERED' },
        { header: 'Total Task', accessorKey: 'task_data.TOTAL' },
    ]
}
