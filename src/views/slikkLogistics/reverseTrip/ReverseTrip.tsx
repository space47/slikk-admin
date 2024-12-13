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
import { REVERSETask } from './reverseTrip.common'
import moment from 'moment'
import { Button, Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/views/category-management/category/categoryTable/categoryCommon'
import { MdAssignment, MdUpdate } from 'react-icons/md'
import AssignTrackerModal from './createReverseTrip/AssignTrackerModal'
import AccessDenied from '@/views/pages/AccessDenied'
import EasyTable from '@/common/EasyTable'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const ReverseTrip = () => {
    const [reverseTaskDetail, setReverseTaskDetail] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [storeTaskId, setStoreTaskId] = useState()
    const navigate = useNavigate()
    const [accessDenied, setAccessDenied] = useState(false)

    const fetchReverseTask = async () => {
        try {
            const response = await axiosInstance.get(`/logistic/slikk/trip?p=${page}&page_size=${pageSize}`)
            const data = response.data.data
            setReverseTaskDetail(data.results)
            setTotalCount(data.count)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchReverseTask()
    }, [page, pageSize])

    console.log('ADTA', reverseTaskDetail)

    const handleTripId = (id: any) => {
        navigate(`/app/reverseTrip/${id}`)
    }

    const handleAssignClick = (task_id: any) => {
        console.log('Task Id', task_id)
        setShowAssignModal(true)
        setStoreTaskId(task_id)
    }

    const columns = useMemo(
        () => [
            {
                header: 'Assign Trip',
                accessorKey: 'trip_id',
                cell: ({ getValue, row }) => (
                    <button onClick={() => handleAssignClick(getValue())} className="bg-none border-none">
                        <MdAssignment className="text-3xl text-yellow-500" />
                    </button>
                ),
            },
            {
                header: 'Update Trip',
                accessorKey: 'trip_id',
                cell: ({ getValue, row }) => (
                    <button onClick={() => handleUpdateClick(getValue())} className="bg-none border-none">
                        <MdUpdate className="text-3xl text-green-500" />
                    </button>
                ),
            },
            {
                header: 'Trip Id',
                accessorKey: 'trip_id',
                cell: ({ getValue, row }) => {
                    return (
                        <button onClick={() => handleTripId(getValue())} className="px-4 py-2 bg-gray-400 text-white font-bold rounded-lg">
                            {getValue()}
                        </button>
                    )
                },
            },
            { header: 'Status', accessorKey: 'status' },
            { header: 'Distance Expected', accessorKey: 'distance_expected' },
            { header: 'Distance Actual', accessorKey: 'distance_actual' },
            { header: 'Runner Latitude', accessorKey: 'runner_latitude' },
            { header: 'Runner Longitude', accessorKey: 'runner_longitude' },
            { header: 'Assigned TO', accessorKey: 'assigned_to' },

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

    const handleUpdateClick = (trip_id) => {
        navigate(`/app/reverseTrip/update/${trip_id}`)
    }

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

    const handleCreateTask = () => {
        navigate(`/app/CreateReverseTrip`)
    }
    const handleCloseModal = () => {
        setShowAssignModal(false)
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div>
            <div className="flex justify-end mb-8">
                <Button variant="new" onClick={handleCreateTask}>
                    Create New Trip
                </Button>
            </div>
            <EasyTable mainData={reverseTaskDetail} columns={columns} page={page} pageSize={pageSize} />

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
                    storeTaskId={storeTaskId}
                />
            )}
        </div>
    )
}

export default ReverseTrip
