import EasyTable from '@/common/EasyTable'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchTaskData } from '@/store/slices/taskData/taskData.slice'
import { TASKDETAILS } from '@/store/types/tasks.type'
import moment from 'moment'
import React, { useEffect, useMemo } from 'react'

const TaskLogisticItem = () => {
    const { taskData } = useAppSelector<TASKDETAILS>((state) => state.taskData)

    const logisticData = taskData?.slikklogistic_item ? taskData?.slikklogistic_item : []

    const columns = useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
            { header: 'Name', accessorKey: 'name' },
            { header: 'brand', accessorKey: 'brand' },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ getValue, row }) => <img src={getValue()} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />,
            },
            { header: 'Quantity', accessorKey: 'quantity' },
            { header: 'MRP', accessorKey: 'mrp' },
            { header: 'SP', accessorKey: 'sp' },
            { header: 'Barcode', accessorKey: 'barcode' },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Last Update',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
        ],
        [],
    )

    return (
        <div>
            <EasyTable noPage mainData={logisticData} columns={columns} overflow />
        </div>
    )
}

export default TaskLogisticItem
