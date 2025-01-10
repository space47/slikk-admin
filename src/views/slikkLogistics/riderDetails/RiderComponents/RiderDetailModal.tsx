import { useEffect, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { RiderData } from '../RiderDetailsCommon'
import { GiFullMotorcycleHelmet } from 'react-icons/gi'
import { Card } from '@/components/ui'
import { TaskData, TASKDETAILS } from '@/store/types/tasks.type'
import { useAppDispatch, useAppSelector } from '@/store'
import RiderLocationMap from './RiderLocationMap'

interface RiderModalProps {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    mobile: string | undefined
}

const RiderDetailModal = ({ dialogIsOpen, setIsOpen, mobile }: RiderModalProps) => {
    const dispatch = useAppDispatch()
    const [riderData, setRiderData] = useState<RiderData>()
    const [taskData, setTaskData] = useState<TaskData[]>([])

    const fetchTaskData = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/rider/task`)
            const data = response?.data?.data?.results
            setTaskData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTaskData()
        const intervalId = setInterval(() => {
            fetchTaskData()
        }, 60000)

        return () => clearInterval(intervalId)
    }, [dispatch])

    const fetchRiderParticularDetails = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/rider/profile/${mobile}`)
            const data = response?.data?.data
            setRiderData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchRiderParticularDetails()
    }, [])

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }
    console.log('rider name is:', riderData?.profile?.first_name)
    console.log('rider Table:', taskData)
    console.log(
        'rider details is:',
        taskData?.find((item) => item?.runner_detail?.name.includes(riderData?.profile?.first_name)),
    )

    const riderTask = taskData?.find((item) => item?.runner_detail?.name.includes(riderData?.profile?.first_name))

    const TaskDetailsData = [
        { name: 'Total', value: riderData?.task_data?.TOTAL, color: 'red' },
        { name: 'Delivered', value: riderData?.task_data?.DELIVERED, color: 'blue' },
        { name: 'Completed', value: riderData?.task_data?.COMPLETED, color: 'green' },
    ]
    const TaskDetailsOthers = [
        { name: 'Assigned', value: riderData?.task_data?.ASSIGNED },
        { name: 'Delivering', value: riderData?.task_data?.OUT_FOR_DELIVERY },
        { name: 'PickedUp', value: riderData?.task_data?.PICKED_UP },
        { name: 'Out for Pickup', value: riderData?.task_data?.OUT_FOR_PICKUP },
        { name: 'Failed', value: riderData?.task_data?.PICKUP_FAILED },
    ]

    return (
        <div className="p-6">
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose} width={1000}>
                <div className="flex flex-col lg:flex-row justify-between mt-10 gap-8">
                    {/* Left Section */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-6xl text-blue-500">
                                <GiFullMotorcycleHelmet />
                            </span>
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <span className="text-xl font-semibold text-gray-800">{riderData?.profile?.first_name}</span>
                                    <span className="text-xl font-semibold text-gray-800">{riderData?.profile?.last_name}</span>
                                </div>
                                <div>
                                    <a href={`tel:${riderData?.profile?.mobile}`} className="text-sm text-blue-500 hover:text-blue-700">
                                        {riderData?.profile?.mobile}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <Card className="shadow-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-600 text-lg">10:00AM - 10:00PM</span>
                                    <span className="text-blue-700 font-bold">Shift</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-600 text-lg">Bike</span>
                                    <span className="text-blue-700 font-bold">Vehicle Type</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-600 text-lg">HSR Outlet</span>
                                    <span className="text-blue-700 font-bold">Location</span>
                                </div>
                            </div>
                        </Card>

                        <div className="mb-6 font-bold text-xl">Deliveries</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {TaskDetailsData?.map((item, key) => (
                                <Card
                                    key={key}
                                    className="flex flex-col items-center p-4 shadow-lg border border-gray-200 rounded-xl hover:shadow-2xl transition-all duration-200"
                                >
                                    <div className="text-gray-700 text-lg font-medium">{item?.value}</div>
                                    <div className={`mt-2 px-4 py-2 text-white rounded-full text-sm bg-${item?.color}-500`}>
                                        {item?.name}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="font-bold text-xl mb-6">Task Details</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {TaskDetailsOthers?.map((item, key) => (
                                <div key={key} className="flex flex-col items-center">
                                    <div className="font-bold xl:text-[15px] text-gray-600">{item?.name}</div>
                                    <div className="text-green-600">{item?.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1 flex items-center justify-center">
                        {riderTask === undefined ? (
                            <div className="flex justify-center items-center font-bold text-gray-600 text-lg text-center">
                                NO CURRENT TASK ASSIGNED
                            </div>
                        ) : (
                            <div className="w-full h-64 lg:h-full">
                                <RiderLocationMap taskData={riderTask} />
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default RiderDetailModal
