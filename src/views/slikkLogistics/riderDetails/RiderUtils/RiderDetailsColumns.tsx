/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from 'antd'
import moment from 'moment'
import { FaShareSquare, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface RiderColumnsProps {
    sortedRiderDetails: any
    handleActiveCareer: (id: number, e: any, checked: boolean, mobile: string, name: string) => void
    handleProfileClick: (row: any) => void
    handleDelete: (row: any) => void
    currentStoreLocation: Record<string, number | undefined>
    riderMobileStore: any[]
    handleSelectAllRiders: (x: any) => void
    handleSelectRiderMobile: (x: any, y: any) => void
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

export const RiderColumns = ({
    handleActiveCareer,
    handleProfileClick: hanldeProfileClick,
    currentStoreLocation,
    riderMobileStore,
    sortedRiderDetails,
    handleSelectAllRiders,
    handleSelectRiderMobile,
    handleDelete,
}: RiderColumnsProps) => {
    const navigate = useNavigate()
    return [
        {
            header: (
                <div className="flex flex-col gap-2 items-center justify-center">
                    <input
                        type="checkbox"
                        name="selectAll"
                        checked={sortedRiderDetails.length > 0 && riderMobileStore.length === sortedRiderDetails.length}
                        onChange={handleSelectAllRiders}
                    />
                </div>
            ),
            accessorKey: 'x',
            cell: ({ row }: { row: { original: any } }) => {
                const mobiles = row.original.profile.mobile
                return (
                    <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            name="mobiles"
                            checked={riderMobileStore.includes(mobiles)}
                            onChange={(e) => handleSelectRiderMobile(mobiles, e.target.checked)}
                        />
                    </div>
                )
            },
        },
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
                        onClick={() => hanldeProfileClick(row?.original)}
                    >
                        <span>{row?.original?.profile?.first_name}</span>
                        <span>{row?.original?.profile?.last_name}</span>
                    </div>
                )
            },
        },
        {
            header: 'App Version',
            accessorKey: 'app_version',
            cell: ({ row }: any) => {
                const version = row?.original?.app_version[0]
                return <div>{version || 'N/A'}</div>
            },
        },
        {
            header: 'See Rider Performance',
            accessorKey: 'profile.mobile',
            cell: ({ row }: any) => {
                const mobile = row?.original?.profile.mobile
                return (
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/app/riderPerformance/${mobile}`)}>
                        <span className="hover:underline hover:text-blue-500">Performance</span>
                        <FaShareSquare className="text-xl" />
                    </div>
                )
            },
        },
        {
            header: 'Agency',
            accessorKey: 'profile.agency',
            cell: ({ row }: any) => {
                return <div>{row?.original?.profile?.agency ?? 'N/A'}</div>
            },
        },
        {
            header: 'Store Name',
            accessorKey: 'store',
            cell: ({ row }: any) => {
                const storeName = row?.original?.store?.map((item: any) => item?.name)?.join(', ')
                return <div>{storeName ?? 'N/A'}</div>
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

        {
            header: 'Order',
            accessorKey: 'recent_task_detail.order_id',
            cell: ({ row }: any) => {
                return row?.original?.recent_task_detail?.order_id ? (
                    <a
                        className="p-2 cursor-pointer bg-red-500 text-white rounded-xl"
                        href={`/app/orders/${row?.original?.recent_task_detail?.order_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {row?.original?.recent_task_detail?.order_id}
                    </a>
                ) : (
                    'N/A'
                )
            },
        },

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
            accessorKey: 'attendance_status.check_in_time',
            cell: ({ row }: any) => {
                const time = row?.original?.attendance_status?.check_in_time
                return <div>{time?.split('.')[0] ?? 'N/A'}</div>
            },
        },
        {
            header: 'Checked Out',
            accessorKey: 'attendance_status.checkout_time',
            cell: ({ row }: any) => {
                const time = row?.original?.attendance_status?.checkout_time
                return <div>{time?.split('.')[0] ?? 'N/A'}</div>
            },
        },
        {
            header: 'Active Time',
            accessorKey: 'attendance_status.active_time',
            cell: ({ row }: any) => <div>{row?.original?.attendance_status?.active_time ?? 0} mins</div>,
        },
        {
            header: 'Distance Covered',
            accessorKey: 'task_data.distance_covered',
            cell: ({ row }: any) => <div>{row?.original?.task_data?.distance_covered ?? 0} km</div>,
        },
        {
            header: 'Assigned At',
            accessorKey: 'recent_task_detail.assigned_at',
            cell: ({ row }: any) => {
                return <div>{moment(row?.original?.recent_task_detail.assigned_at).format('YYYY-MM-DD HH:mm:ss ')}</div>
            },
        },
        {
            header: 'Delivered At',
            accessorKey: 'recent_task_detail.delivered_at',
            cell: ({ row }: any) => {
                return <div>{moment(row?.original?.recent_task_detail.delivered_at).format('YYYY-MM-DD HH:mm:ss ')}</div>
            },
        },

        { header: 'Estimate Time', accessorKey: 'recent_task_detail.estimate_time' },
        {
            header: 'Delete',
            accessorKey: 'mobile',
            cell: ({ row }: any) => (
                <div className="text-gray-700 dark:text-white">
                    <FaTrash className="text-xl text-red-500" onClick={() => handleDelete(row?.original)} />
                </div>
            ),
        },
    ]
}
