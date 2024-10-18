/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { REVERSETask } from '../reverseTrip.common'
import moment from 'moment'
import { Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/views/category-management/category/categoryTable/categoryCommon'
import EasyTable from '@/common/EasyTable'

interface PROPSFORTRIP {
    listOfTaskIds?: string[]
    setListOfTaskIds?: (ids: string[]) => void
}

const CreateTripForUpdate = ({ listOfTaskIds, setListOfTaskIds }: PROPSFORTRIP) => {
    const [reverseTaskDetail, setReverseTaskDetail] = useState<REVERSETask[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalCount, setTotalCount] = useState<number>(0)

    const fetchReverseTask = async () => {
        // iha pe status CREATED
        try {
            const response = await axiosInstance.get(
                `/logistic/slikk/task?status=CREATED&task_type=return_order&p=${page}&page_size=${pageSize}`,
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
                cell: ({ getValue }: any) => {
                    const taskId = getValue()
                    const isChecked = listOfTaskIds?.includes(taskId)

                    return (
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={isChecked} onChange={(e) => handleCheckboxChange(taskId, e.target.checked)} />
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
        [listOfTaskIds],
    )

    const handleCheckboxChange = (taskId: any, isChecked: any) => {
        setListOfTaskIds?.((prev) => {
            if (!prev) return isChecked ? [taskId] : []
            return isChecked ? [...prev, taskId] : prev.filter((id) => id !== taskId)
        })
    }

    console.log('CHECKBOXDATA', listOfTaskIds)

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    return (
        <div>
            <EasyTable page={page} pageSize={pageSize} mainData={reverseTaskDetail} columns={columns} />

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
        </div>
    )
}

export default CreateTripForUpdate
