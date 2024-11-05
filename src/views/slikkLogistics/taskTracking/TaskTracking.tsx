/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import TrackModal from './TrackModal'
import { MdAssignment } from 'react-icons/md'
import { Option, pageSizeOptions, TaskDetails } from './TaskCommonType'

import { useNavigate } from 'react-router-dom'

const { Tr, Th, Td, THead, TBody } = Table

const TaskTracking = () => {
    const [data, setData] = useState<TaskDetails[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [storeTaskId, setStoreTaskId] = useState()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`logistic/slikk/task?page_size=100`)
            const data = response.data.data.results
            const total = response.data.data.count

            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredData = data.filter((item) =>
        Object.values(item).some((val) => (val ? val.toString().toLowerCase().includes(globalFilter.toLowerCase()) : false)),
    )

    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.ceil(totalData / pageSize)

    const handleAssignClick = (task_id: any) => {
        setShowAssignModal(true)
        setStoreTaskId(task_id)
    }

    const handleCloseModal = () => {
        setShowAssignModal(false)
    }

    const handleTaskDetailopen = (task_id: unknown) => {
        navigate(`/app/tryAndBuy/taskTracking/${task_id}`)
    }

    const columns = [
        {
            header: 'Task ID',
            accessor: 'task_id',
            format: (_: any, row: TaskDetails) => {
                return (
                    <button className="px-3 py-2 bg-gray-400 text-white rounded-[10px]" onClick={() => handleTaskDetailopen(row.task_id)}>
                        {row.task_id}
                    </button>
                )
            },
        },
        { header: 'Status', accessor: 'status' },
        { header: 'Runner Latitude', accessor: 'runner_latitude' },
        { header: 'Runner Longitude', accessor: 'runner_longitude' },
        {
            header: 'Runner Name',
            accessor: 'runner_detail.name',
            format: (_: any, row: TaskDetails) => row.runner_detail?.name || '',
        },
        {
            header: 'Runner Mobile',
            accessor: 'runner_detail.mobile',
            format: (_: any, row: TaskDetails) => row.runner_detail?.mobile || '',
        },
        {
            header: 'Runner Photo',
            accessor: 'runner_detail.photo',
            format: (_: any, row: TaskDetails) =>
                row.runner_detail?.photo ? <img src={row.runner_detail?.photo} alt="runner" width="50" /> : '',
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
            header: 'Pickup Landmark',
            accessor: 'pickup_details.landmark',
            format: (_: any, row: TaskDetails) => row.pickup_details?.landmark || '',
        },
        {
            header: 'Pickup Latitude',
            accessor: 'pickup_details.latitude',
            format: (_: any, row: TaskDetails) => row.pickup_details?.latitude || '',
        },
        {
            header: 'Pickup Longitude',
            accessor: 'pickup_details.longitude',
            format: (_: any, row: TaskDetails) => row.pickup_details?.longitude || '',
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
        {
            header: 'Drop Landmark',
            accessor: 'drop_details.landmark',
            format: (_: any, row: TaskDetails) => row.drop_details?.landmark || '',
        },
        {
            header: 'Drop Latitude',
            accessor: 'drop_details.latitude',
            format: (_: any, row: TaskDetails) => row.drop_details?.latitude || '',
        },
        {
            header: 'Drop Longitude',
            accessor: 'drop_details.longitude',
            format: (_: any, row: TaskDetails) => row.drop_details?.longitude || '',
        },
        {
            header: 'Drop Contact Number',
            accessor: 'drop_details.contact_number',
            format: (_: any, row: TaskDetails) => row.drop_details?.contact_number || '',
        },
        {
            header: 'User Credits Key',
            accessor: 'user_details.credits_key',
            format: (_: any, row: TaskDetails) => row.user_details?.credits_key || '',
        },
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
            format: (_: any, row: TaskDetails) => (row.client_order_details?.delivery_charge_to_be_collected_from_customer ? 'Yes' : 'No'),
        },
        {
            header: 'Client Order ID',
            accessor: 'client_order_id',
            format: (_: any, row: TaskDetails) => row.client_order_id || '',
        },
        {
            header: 'Action',
            accessor: 'task_id',
            format: (value: any, row: TaskDetails) =>
                row.status == 'CREATED' && (
                    <button onClick={() => handleAssignClick(row.task_id)} className="bg-none border-none">
                        <MdAssignment className="text-3xl text-yellow-500" />
                    </button>
                ),
        },
    ]

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search here"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>
            <Table>
                <THead>
                    <Tr>
                        {columns.map((column, index) => (
                            <Th key={index}>{column.header}</Th>
                        ))}
                    </Tr>
                </THead>
                <TBody>
                    {paginatedData.map((row: any) => (
                        <Tr key={row.task_id}>
                            {columns.map((column, index) => (
                                <Td key={index}>{column.format ? column.format(row[column.accessor], row) : row[column.accessor] || ''}</Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
                <Pagination currentPage={page} total={totalPages} onChange={(newPage: any) => setPage(newPage)} />
                <Select<Option>
                    size="sm"
                    isSearchable={false}
                    value={pageSizeOptions.find((option) => option.value === pageSize)}
                    options={pageSizeOptions}
                    onChange={(option) => setPageSize(Number(option?.value))}
                />
            </div>
            {showAssignModal && (
                <TrackModal
                    showTaskModal={showAssignModal}
                    handleCloseModal={handleCloseModal}
                    storeTaskId={storeTaskId ?? 0}
                    setShowAssignModal={setShowAssignModal}
                />
            )}
        </div>
    )
}

export default TaskTracking
