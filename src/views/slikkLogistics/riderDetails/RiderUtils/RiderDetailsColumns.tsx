/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from 'antd'

interface RiderColumnsProps {
    handleActiveCareer: (id: number, e: any, checked: boolean, mobile: string, name: string) => void
    hanldeProfileClick: (mobile: string) => void
}

export const RiderColumns = ({ handleActiveCareer, hanldeProfileClick }: RiderColumnsProps) => {
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
