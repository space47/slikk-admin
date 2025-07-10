/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { TaskDetails } from '../TaskCommonType'
import { MdAssignment, MdAssignmentLate } from 'react-icons/md'

interface columnProps {
    handleAssignClick: (task_id: TaskDetails) => void
    handleReAssignClick: (task_id: TaskDetails) => void
    handleTaskDetailopen: (task_id: string | number) => void
    handleRiderProfile: (mobile: string | number) => void
}

export const TaskTrackingColumns = ({ handleAssignClick, handleReAssignClick, handleRiderProfile }: columnProps) => {
    return useMemo(
        () => [
            {
                header: 'Assign Task',
                accessor: 'task_id',
                format: (value: any, row: TaskDetails) => {
                    return (
                        <div>
                            {row.status == 'CREATED' && (
                                <button className="bg-none border-none" onClick={() => handleAssignClick(row)}>
                                    <MdAssignment className="text-3xl text-yellow-500" />
                                </button>
                            )}
                            {row.status !== 'CREATED' && (
                                <button className="bg-none border-none" onClick={() => handleReAssignClick(row)}>
                                    <MdAssignmentLate className="text-3xl text-red-500" />
                                </button>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Task ID',
                accessor: 'task_id',
                format: (_: any, row: TaskDetails) => {
                    return (
                        <button className="px-3 py-2 bg-gray-400 text-white rounded-[10px]">
                            <a href={`/app/tryAndBuy/taskTracking/${row?.task_id}`} target="_blank" rel="noreferrer">
                                {row.task_id}
                            </a>
                        </button>
                    )
                },
            },
            { header: 'Status', accessor: 'status' },
            { header: 'Task Type', accessor: 'task_type' },
            {
                header: 'Runner Name',
                accessor: 'runner_detail.name',
                format: (_: any, row: TaskDetails) => {
                    const runnerMobile = row.runner_detail?.mobile
                    return (
                        <div className="hover:text-blue-700 cursor-pointer" onClick={() => handleRiderProfile(runnerMobile)}>
                            {row.runner_detail?.name || ''}
                        </div>
                    )
                },
            },
            {
                header: 'Runner Contact Number',
                accessor: 'runner_detail.mobile',
                format: (_: any, row: TaskDetails) => row.runner_detail?.mobile || '',
            },
            {
                header: 'Pickup Name',
                accessor: 'pickup_details.name',
                format: (_: any, row: TaskDetails) => row.pickup_details?.name || '',
            },
            {
                header: 'Pickup Address',
                accessor: 'pickup_details.address',
                format: (_: any, row: TaskDetails) => row.pickup_details?.address || '',
            },
            {
                header: 'Pickup Contact Number',
                accessor: 'pickup_details.contact_number',
                format: (_: any, row: TaskDetails) => row.pickup_details?.contact_number || '',
            },
            {
                header: 'Drop Name',
                accessor: 'drop_details.name',
                format: (_: any, row: TaskDetails) => row.drop_details?.name || '',
            },
            {
                header: 'Drop Address',
                accessor: 'drop_details.address',
                format: (_: any, row: TaskDetails) => row.drop_details?.address || '',
            },
            // {
            //     header: 'Drop Landmark',
            //     accessor: 'drop_details.landmark',
            //     format: (_: any, row: TaskDetails) => row.drop_details?.landmark || '',
            // },
            {
                header: 'Drop Contact Number',
                accessor: 'drop_details.contact_number',
                format: (_: any, row: TaskDetails) => row.drop_details?.contact_number || '',
            },
            // {
            //     header: 'User Credits Key',
            //     accessor: 'user_details.credits_key',
            //     format: (_: any, row: TaskDetails) => row.user_details?.credits_key || '',
            // },
            {
                header: 'User Contact Number',
                accessor: 'user_details.contact_number',
                format: (_: any, row: TaskDetails) => row.user_details?.contact_number || '',
            },
            {
                header: 'Order ID',
                accessor: 'client_order_details.order_id',
                format: (_: any, row: TaskDetails) => row.client_order_details?.order_id || '',
            },
            {
                header: 'Is Prepaid',
                accessor: 'client_order_details.is_prepaid',
                format: (_: any, row: TaskDetails) => (row.client_order_details?.is_prepaid ? 'Yes' : 'No'),
            },
            {
                header: 'Cash to be Collected',
                accessor: 'client_order_details.cash_to_be_collected',
                format: (_: any, row: TaskDetails) => row.client_order_details?.cash_to_be_collected || '',
            },
            {
                header: 'Delivery Charge from Customer',
                accessor: 'client_order_details.delivery_charge_to_be_collected_from_customer',
                format: (_: any, row: TaskDetails) =>
                    row.client_order_details?.delivery_charge_to_be_collected_from_customer ? 'Yes' : 'No',
            },
            {
                header: 'Client Order ID',
                accessor: 'client_order_id',
                format: (_: any, row: TaskDetails) => row.client_order_id || '',
            },
        ],
        [],
    )
}
