/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'

// import { useNavigate } from 'react-router-dom'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
// import Button from '@/components/ui/Button'
// import TrackModal from './TrackModal'
// import { MdAssignment } from 'react-icons/md'
import { TaskDetails } from '../taskTracking/TaskCommonType'
import { useNavigate, useParams } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

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

const RiderTracking = () => {
    const [riderData, setRiderData] = useState<TaskDetails[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const navigate = useNavigate()
    const { task_id } = useParams()
    const [accessDenied, setAccessDenied] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`logistic/rider/task`)
            const data = response.data.data.results
            const total = response.data.data.count

            setRiderData(data)
            setTotalData(total)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredData = riderData.filter((item) =>
        Object.values(item).some((val) => (val ? val.toString().toLowerCase().includes(globalFilter.toLowerCase()) : false)),
    )

    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.ceil(totalData / pageSize)

    const columns = [
        {
            header: 'Task ID',
            accessor: 'task_id',
            format: (_: any, row: TaskDetails) =>
                row.task_id ? (
                    <div
                        className="bg-gray-300 px-4 flex justify-center items-center rounded-lg font-bold w-1/2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleRider(row?.task_id)}
                    >
                        {row.task_id}
                    </div>
                ) : (
                    ''
                ),
        },
        { header: 'Status', accessor: 'status' },

        {
            header: 'Client Order ID',
            accessor: 'client_order_id',
            format: (_: any, row: TaskDetails) =>
                row.client_order_id ? (
                    <div
                        className="bg-gray-100 px-4 flex justify-center items-center rounded-lg font-bold w-1/2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleOrder(row.client_order_id)}
                    >
                        {row.client_order_id}
                    </div>
                ) : (
                    ''
                ),
        },
    ]

    const handleRider = (task_id: any) => {
        navigate(`/app/tryAndBuy/riderTracking/${task_id}`)
    }

    const handleOrder = (order_id: any) => {
        navigate(`/app/orders/${order_id}`)
    }

    if (accessDenied) {
        return <AccessDenied />
    }

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
        </div>
    )
}

export default RiderTracking
