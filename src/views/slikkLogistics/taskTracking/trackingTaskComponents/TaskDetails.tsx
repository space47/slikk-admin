import { useAppDispatch, useAppSelector } from '@/store'
import { fetchTaskData } from '@/store/slices/taskData/taskData.slice'
import { TASKDETAILS } from '@/store/types/tasks.type'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TaskLogisticItem from './TaskLogisticItem'
import TaskActivity from './TaskActivity'
import TaskTrackingMap from './TaskTrackingMap'
import moment from 'moment'

const TaskDetails = () => {
    const { task_id } = useParams()

    const { taskData } = useAppSelector<TASKDETAILS>((state) => state?.taskData)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTaskData(task_id ?? ''))
        const intervalId = setInterval(() => {
            dispatch(fetchTaskData(task_id ?? ''))
        }, 60000)

        return () => clearInterval(intervalId)
    }, [dispatch, task_id])

    console.log('LOG', taskData)

    const CARDDATA = [
        { name: 'Task_ID', value: taskData?.task_id, hyper: false },
        { name: 'Created', value: moment(taskData?.create_date).format('YYYY-MM-DD hh:mm:ss a'), hyper: false },
        { name: 'Status', value: taskData?.status, hyper: false },
        { name: 'Order', value: taskData?.client_order_id, hyper: true },
    ]

    return (
        <div>
            <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-lg font-bold flex flex-col gap-2">
                    {CARDDATA.map((item, key) => {
                        return (
                            <div key={key} className="flex justify-between mb-3">
                                <span className="font-semibold text-gray-700">{item.name}</span>
                                <span className="text-gray-900">
                                    {item?.hyper ? (
                                        <>
                                            {typeof item?.value === 'string' && /^\d/.test(item.value) ? (
                                                <div>
                                                    <a
                                                        href={`/app/orders/${item?.value}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                                                    >
                                                        {item?.value}
                                                    </a>
                                                </div>
                                            ) : (
                                                <div>
                                                    <a
                                                        href={`/app/returnOrders/${item?.value}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-white bg-red-600 flex items-center justify-center px-2 py-1 rounded-[7px] font-semibold cursor-pointer"
                                                    >
                                                        {item?.value}
                                                    </a>
                                                </div>
                                            )}
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
