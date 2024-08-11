/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

type RunnerDetail = {
    name: string
    mobile: string
    photo: string
}

type LocationDetails = {
    name: string
    address: string
    landmark: string
    latitude: number
    longitude: number
    contact_number: string
}

type UserDetails = {
    credits_key: string
    contact_number: string
}

type ClientOrderDetails = {
    order_id: string
    is_prepaid: boolean
    cash_to_be_collected: number
    delivery_charge_to_be_collected_from_customer: boolean
}

type TaskDetails = {
    task_id: string
    status: string
    runner_latitude: number
    runner_longitude: number
    runner_detail: RunnerDetail
    pickup_details: LocationDetails
    drop_details: LocationDetails
    user_details: UserDetails
    client_order_details: ClientOrderDetails
    client_order_id: string
}

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const TaskTracking = () => {
    const [data, setData] = useState<TaskDetails[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('logistic/slikk/task')
            const data = response.data.data.results
            const total = data.count
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
        Object.values(item).some((val) =>
            val
                ? val
                      .toString()
                      .toLowerCase()
                      .includes(globalFilter.toLowerCase())
                : false,
        ),
    )

    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize,
    )
    const totalPages = Math.ceil(filteredData.length / pageSize)

    const columns = [
        { header: 'Task ID', accessor: 'task_id' },
        { header: 'Status', accessor: 'status' },
        { header: 'Runner Latitude', accessor: 'runner_latitude' },
        { header: 'Runner Longitude', accessor: 'runner_longitude' },
        {
            header: 'Runner Name',
            accessor: 'runner_detail.name',
            format: (_: any, row: TaskDetails) =>
                row.runner_detail?.name || 'N/A',
        },
        {
            header: 'Runner Mobile',
            accessor: 'runner_detail.mobile',
            format: (_: any, row: TaskDetails) =>
                row.runner_detail?.mobile || 'N/A',
        },
        {
            header: 'Runner Photo',
            accessor: 'runner_detail.photo',
            format: (_: any, row: TaskDetails) =>
                row.runner_detail?.photo ? (
                    <img
                        src={row.runner_detail.photo}
                        alt="runner"
                        width="50"
                    />
                ) : (
                    'N/A'
                ),
        },
        {
            header: 'Pickup Name',
            accessor: 'pickup_details.name',
            format: (_: any, row: TaskDetails) =>
                row.pickup_details?.name || 'N/A',
        },
        {
            header: 'Pickup Address',
            accessor: 'pickup_details.address',
            format: (_: any, row: TaskDetails) =>
                row.pickup_details?.address || 'N/A',
        },
        {
            header: 'Pickup Landmark',
            accessor: 'pickup_details.landmark',
            format: (_: any, row: TaskDetails) =>
                row.pickup_details?.landmark || 'N/A',
        },
        {
            header: 'Pickup Latitude',
            accessor: 'pickup_details.latitude',
            format: (_: any, row: TaskDetails) =>
                row.pickup_details?.latitude || 'N/A',
        },
        {
            header: 'Pickup Longitude',
            accessor: 'pickup_details.longitude',
            format: (_: any, row: TaskDetails) =>
                row.pickup_details?.longitude || 'N/A',
        },
        {
            header: 'Pickup Contact Number',
            accessor: 'pickup_details.contact_number',
            format: (_: any, row: TaskDetails) =>
                row.pickup_details?.contact_number || 'N/A',
        },
        {
            header: 'Drop Name',
            accessor: 'drop_details.name',
            format: (_: any, row: TaskDetails) =>
                row.drop_details?.name || 'N/A',
        },
        {
            header: 'Drop Address',
            accessor: 'drop_details.address',
            format: (_: any, row: TaskDetails) =>
                row.drop_details?.address || 'N/A',
        },
        {
            header: 'Drop Landmark',
            accessor: 'drop_details.landmark',
            format: (_: any, row: TaskDetails) =>
                row.drop_details?.landmark || 'N/A',
        },
        {
            header: 'Drop Latitude',
            accessor: 'drop_details.latitude',
            format: (_: any, row: TaskDetails) =>
                row.drop_details?.latitude || 'N/A',
        },
        {
            header: 'Drop Longitude',
            accessor: 'drop_details.longitude',
            format: (_: any, row: TaskDetails) =>
                row.drop_details?.longitude || 'N/A',
        },
        {
            header: 'Drop Contact Number',
            accessor: 'drop_details.contact_number',
            format: (_: any, row: TaskDetails) =>
                row.drop_details?.contact_number || 'N/A',
        },
        {
            header: 'User Credits Key',
            accessor: 'user_details.credits_key',
            format: (_: any, row: TaskDetails) =>
                row.user_details?.credits_key || 'N/A',
        },
        {
            header: 'User Contact Number',
            accessor: 'user_details.contact_number',
            format: (_: any, row: TaskDetails) =>
                row.user_details?.contact_number || 'N/A',
        },
        {
            header: 'Order ID',
            accessor: 'client_order_details.order_id',
            format: (_: any, row: TaskDetails) =>
                row.client_order_details?.order_id || 'N/A',
        },
        {
            header: 'Is Prepaid',
            accessor: 'client_order_details.is_prepaid',
            format: (_: any, row: TaskDetails) =>
                row.client_order_details?.is_prepaid ? 'Yes' : 'No',
        },
        {
            header: 'Cash to be Collected',
            accessor: 'client_order_details.cash_to_be_collected',
            format: (_: any, row: TaskDetails) =>
                row.client_order_details?.cash_to_be_collected || 'N/A',
        },
        {
            header: 'Delivery Charge from Customer',
            accessor:
                'client_order_details.delivery_charge_to_be_collected_from_customer',
            format: (_: any, row: TaskDetails) =>
                row.client_order_details
                    ?.delivery_charge_to_be_collected_from_customer
                    ? 'Yes'
                    : 'No',
        },
        {
            header: 'Client Order ID',
            accessor: 'client_order_id',
            format: (_: any, row: TaskDetails) => row.client_order_id || 'N/A',
        },
        {
            header: 'Action',
            accessor: 'task_id',
            format: (value: any) => (
                <Button onClick={() => handleActionClick(value)}>Assign</Button>
            ),
        },
    ]

    const navigate = useNavigate()

    const handleActionClick = (id: any) => {
        navigate(`/app/category/subCategory/${id}`)
    }

    // const handleSeller = () => {
    //     navigate('/app/category/subCategory/addNew')
    // }

    return (
        <div>
            {/* <div className="flex items-end justify-end mb-2">
                <button
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                    onClick={handleSeller}
                >
                    ADD NEW SUB_CATEGORY
                </button>{' '}
                <br />
                <br />
            </div> */}
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
                    {paginatedData.map((row) => (
                        <Tr key={row.task_id}>
                            {columns.map((column, index) => (
                                <Td key={index}>
                                    {column.format
                                        ? column.format(
                                              row[column.accessor],
                                              row,
                                          )
                                        : row[column.accessor] || 'N/A'}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage: any) => setPage(newPage)}
                />
                <Select<Option>
                    size="sm"
                    isSearchable={false}
                    value={pageSizeOptions.find(
                        (option) => option.value === pageSize,
                    )}
                    options={pageSizeOptions}
                    onChange={(option) => setPageSize(Number(option?.value))}
                />
            </div>
        </div>
    )
}

export default TaskTracking
