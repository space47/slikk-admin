import { useAppDispatch, useAppSelector } from '@/store'
import { fetchTaskData } from '@/store/slices/taskData/taskData.slice'
import { TaskData, TASKDETAILS } from '@/store/types/tasks.type'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TaskLogisticItem from './TaskLogisticItem'
import TaskActivity from './TaskActivity'
import TaskTrackingMap from './TaskTrackingMap'

const TaskDetails = () => {
    const { task_id } = useParams()

    const { taskData } = useAppSelector<TASKDETAILS>((state) => state?.taskData)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTaskData(task_id ?? ''))
    }, [dispatch])

    console.log('LOG', taskData?.slikklogistic_item)

    const CARDDATA = [
        { name: 'Task_ID', value: taskData?.task_id, hyper: false },
        { name: 'Created', value: taskData?.create_date, hyper: false },
        { name: 'Status', value: taskData?.status, hyper: false },
        { name: 'Order', value: taskData?.client_order_id, hyper: true },
    ]

    return (
        <div>
            <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg font-bold flex flex-col gap-2">
                    {CARDDATA.map((item, key) => {
                        return (
                            <div className="flex justify-between mb-3" key={key}>
                                <span className="font-semibold text-gray-700">{item.name}</span>
                                <span className="text-gray-900">
                                    {item?.hyper ? (
                                        <>
                                            <a
                                                href={`/app/returnOrders/${item?.value}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                                            >
                                                {item?.value}
                                            </a>
                                        </>
                                    ) : (
                                        <>{item?.value}</>
                                    )}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <TaskLogisticItem />
                </div>

                <div className="flex gap-8 items-start">
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                        <TaskActivity />
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                        <TaskTrackingMap />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskDetails
