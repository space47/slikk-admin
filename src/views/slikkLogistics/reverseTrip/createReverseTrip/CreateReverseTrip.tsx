/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import Table from '@/components/ui/Table'
import { REVERSETask } from '../reverseTrip.common'
import moment from 'moment'
import { Button, Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/views/category-management/category/categoryTable/categoryCommon'
import { notification } from 'antd'
import AssignTrackerModal from './AssignTrackerModal'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const CreateReverseTrip = () => {
    const [reverseTaskDetail, setReverseTaskDetail] = useState<REVERSETask[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalCount, setTotalCount] = useState<number>(0)
    const navigate = useNavigate()
    const [checkboxStore, setCheckboxStore] = useState<(number | string)[]>([])
    const [showAssignModal, setShowAssignModal] = useState<boolean>(false)
    const [tridIdStore, setTripIdStore] = useState()

    const fetchReverseTask = async () => {
        try {
            const response = await axiosInstance.get(
                `/logistic/slikk/task?task_type=return_order&status=CREATED&p=${page}&page_size=${pageSize}`,
            )
            const data = response.data.data
            setReverseTaskDetail(data.results)
            setTotalCount(data.count)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchReverseTask()
    }, [page, pageSize])

    const columns = useMemo(
        () => [
            {
                header: 'Task Id',
                accessorKey: 'task_id',
                cell: ({ getValue }) => {
                    const taskId = getValue()
                    // const isChecked = checkboxStore.includes(taskId)

                    return (
                        <div className="flex items-center gap-2">
                            <input type="checkbox" onChange={(e) => handleCheckboxChange(taskId, e.target.checked)} />
                            <span>{taskId}</span>
                        </div>
                    )
                },
            },
            { header: 'Return_Order Id', accessorKey: 'client_order_id' },
            { header: 'Status', accessorKey: 'status' },
            { header: 'Runner Name', accessorKey: 'runner_detail.name' },
            { header: 'Runner mobile', accessorKey: 'runner_detail.mobile' },
            { header: 'Pickup Name', accessorKey: 'pickup_details.name' },
            { header: 'Pickup address', accessorKey: 'pickup_details.address' },
            { header: 'Pickup Mobile', accessorKey: 'pickup_details.contact_number' },
            { header: 'Drop Detail', accessorKey: 'drop_details.name' },
            { header: 'Drop address', accessorKey: 'drop_details.address' },
            { header: 'Drop mobile', accessorKey: 'drop_details.contact_number' },
            { header: 'User Number', accessorKey: 'user_details.contact_number' },
            {
                header: 'Create Date',
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

    const handleCheckboxChange = (taskId: any, isChecked: any) => {
        setCheckboxStore((prev) => (isChecked ? [...prev, taskId] : prev.filter((id) => id !== taskId)))
    }

    console.log('CHECKBOXDATA', checkboxStore)

    const table = useReactTable({
        data: reverseTaskDetail,
        columns,
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize: pageSize,
            },
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        // pageCount: Math.ceil(orderCount ?? 0 / pageSize),
    })
    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleCreateTrip = async () => {
        try {
            const body = {
                task_ids: checkboxStore.join(','),
            }
            const response = await axiosInstance.post(`/logistic/slikk/trip`, body)
            console.log(response)
            notification.success({
                message: response.data.message || 'Trip Created',
            })
            const data = response.data.data.trip_id
            setTripIdStore(data)
            setShowAssignModal(true)
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Error',
            })
        }
    }
    const handleCloseModal = () => {
        setShowAssignModal(false)
    }

    return (
        <div>
            <div className="flex justify-end mb-8">
                <Button variant="new" onClick={handleCreateTrip}>
                    Create Trip
                </Button>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <Sorter sort={header.column.getIsSorted()} />
                                        </div>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>

            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalCount}
                    onChange={onPaginationChange}
                    className="mb-4 md:mb-0"
                />

                <div className="min-w-[130px] flex gap-5">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                        className="w-full"
                    />
                </div>
            </div>
            {showAssignModal && (
                <AssignTrackerModal
                    setShowAssignModal={setShowAssignModal}
                    handleCloseModal={handleCloseModal}
                    showTaskModal={showAssignModal}
                    storeTaskId={tridIdStore}
                />
            )}
        </div>
    )
}

export default CreateReverseTrip
