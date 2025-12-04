/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { TaskDetails } from '../TaskCommonType'
import { MdAssignment, MdAssignmentLate } from 'react-icons/md'
import moment from 'moment'
import { ColumnDef } from '@tanstack/react-table'

interface columnProps {
    handleAssignClick: (task_id: TaskDetails) => void
    handleReAssignClick: (task_id: TaskDetails) => void
    handleTaskDetailopen: (task_id: string | number) => void
    handleRiderProfile: (mobile: string | number) => void
}

export const TaskTrackingColumns = ({ handleAssignClick, handleReAssignClick, handleRiderProfile }: columnProps) => {
    return useMemo<ColumnDef<TaskDetails>[]>(
        () => [
            {
                header: 'Assign Task',
                accessorKey: 'task_id',
                cell: ({ row }) => {
                    return (
                        <div>
                            {row?.original?.status == 'CREATED' && (
                                <button className="bg-none border-none" onClick={() => handleAssignClick(row?.original)}>
                                    <MdAssignment className="text-3xl text-yellow-500" />
                                </button>
                            )}
                            {row?.original?.status !== 'CREATED' && (
                                <button className="bg-none border-none" onClick={() => handleReAssignClick(row?.original)}>
                                    <MdAssignmentLate className="text-3xl text-red-500" />
                                </button>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Task ID',
                accessorKey: 'task_id',
                cell: ({ row }) => {
                    return (
                        <button className="px-3 py-2 bg-gray-400 text-white rounded-[10px]">
                            <a href={`/app/tryAndBuy/taskTracking/${row?.original?.task_id}`} target="_blank" rel="noreferrer">
                                {row?.original?.task_id}
                            </a>
                        </button>
                    )
                },
            },
            { header: 'Status', accessorKey: 'status' },
            {
                header: 'Payment Mode',
                accessorKey: 'client_order_details.payment_mode',
                cell: ({ row }) => {
                    return <div>{row?.original?.client_order_details?.payment_mode}</div>
                },
            },
            {
                header: 'Cash to be Collected',
                accessorKey: 'client_order_details.cash_to_be_collected',
                cell: ({ row }) => {
                    return (
                        <div>
                            {row?.original?.client_order_details?.cash_to_be_collected ? (
                                <>
                                    <div>Rs. {row?.original?.client_order_details?.cash_to_be_collected}</div>
                                </>
                            ) : (
                                'N/A'
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Cash Collected',
                accessorKey: 'client_order_details?.cash_collected',
                cell: ({ row }) => {
                    return <div>{row?.original?.client_order_details?.cash_collected ? 'Yes' : 'No'}</div>
                },
            },

            { header: 'Task Type', accessorKey: 'task_type' },
            {
                header: 'Runner Name',
                accessorKey: 'runner_detail.name',
                cell: ({ row }) => {
                    const runnerMobile = row?.original?.runner_detail?.mobile
                    return (
                        <div className="hover:text-blue-700 cursor-pointer" onClick={() => handleRiderProfile(runnerMobile)}>
                            {row?.original?.runner_detail?.name || ''}
                        </div>
                    )
                },
            },
            {
                header: 'Runner Contact Number',
                accessorKey: 'runner_detail.mobile',
                cell: ({ row }) => row?.original?.runner_detail?.mobile || '',
            },
            {
                header: 'Pickup Name',
                accessorKey: 'pickup_details.name',
                cell: ({ row }) => row?.original?.pickup_details?.name || '',
            },
            {
                header: 'Pickup Address',
                accessorKey: 'pickup_details.address',
                cell: ({ row }) => row?.original?.pickup_details?.address || '',
            },
            {
                header: 'Pickup Contact Number',
                accessorKey: 'pickup_details.contact_number',
                cell: ({ row }) => row?.original?.pickup_details?.contact_number || '',
            },
            {
                header: 'Drop Name',
                accessorKey: 'drop_details.name',
                cell: ({ row }) => row?.original?.drop_details?.name || '',
            },
            {
                header: 'Drop Address',
                accessorKey: 'drop_details.address',
                cell: ({ row }) => row?.original?.drop_details?.address || '',
            },
            // {
            //     header: 'Drop Landmark',
            //     accessorKey: 'drop_details.landmark',
            //     cell: ({row}) => row?.original?.drop_details?.landmark || '',
            // },
            {
                header: 'Drop Contact Number',
                accessorKey: 'drop_details.contact_number',
                cell: ({ row }) => row?.original?.drop_details?.contact_number || '',
            },
            // {
            //     header: 'User Credits Key',
            //     accessorKey: 'user_details.credits_key',
            //     cell: ({row}) => row?.original?.user_details?.credits_key || '',
            // },
            {
                header: 'User Contact Number',
                accessorKey: 'user_details.contact_number',
                cell: ({ row }) => row?.original?.user_details?.contact_number || '',
            },
            {
                header: 'Order ID',
                accessorKey: 'client_order_details.order_id',
                cell: ({ row }) => row?.original?.client_order_details?.order_id || '',
            },
            {
                header: 'Is Prepaid',
                accessorKey: 'client_order_details.is_prepaid',
                cell: ({ row }) => (row?.original?.client_order_details?.is_prepaid ? 'Yes' : 'No'),
            },

            {
                header: 'Delivery Charge from Customer',
                accessorKey: 'client_order_details.delivery_charge_to_be_collected_from_customer',
                cell: ({ row }) => (row?.original?.client_order_details?.delivery_charge_to_be_collected_from_customer ? 'Yes' : 'No'),
            },
            {
                header: 'Client Order ID',
                accessorKey: 'client_order_id',
                cell: ({ row }) => row?.original?.client_order_id || '',
            },
            {
                header: 'Create Update',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Last Update',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [],
    )
}
