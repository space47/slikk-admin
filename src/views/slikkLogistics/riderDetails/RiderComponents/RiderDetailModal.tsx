/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { RiderData } from '../RiderDetailsCommon'
import { GiFullMotorcycleHelmet } from 'react-icons/gi'
import { Button, Card } from '@/components/ui'
import { TaskData } from '@/store/types/tasks.type'
import { useAppDispatch, useAppSelector } from '@/store'
import RiderLocationMap from './RiderLocationMap'
import { ridersService } from '@/store/services/riderServices'
import { setCount, setRidersAttendanceData } from '@/store/slices/riderSlice/rider.slice'
import { RiderDetailsType, RiderSlice } from '@/store/types/riderAddTypes'
import { useNavigate } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import { notification } from 'antd'
import { ImUserCheck } from 'react-icons/im'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useRiderModalColumns, useRiderModalColumnsForOrders } from '../RiderUtils/useRiderModalColumns'

interface RiderModalProps {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    fromDate?: string
    toDate?: string
    row?: RiderDetailsType
}

const RiderDetailModal = ({ dialogIsOpen, setIsOpen, fromDate, toDate, row }: RiderModalProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [riderData, setRiderData] = useState<RiderData>()
    const { riderAttendance, from, to, page, pageSize } = useAppSelector<RiderSlice>((state) => state.riderData)

    const {
        data: riderDataForAttendance,
        isSuccess,
        isError,
        error,
    } = ridersService.useRiderAttendanceQuery({
        from: fromDate ?? from,
        mobile: row?.profile?.mobile as any,
        page: page,
        pageSize: pageSize,
        to: toDate ?? to,
        user_type: 'rider',
    })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRidersAttendanceData(riderDataForAttendance?.data?.results || []))
            dispatch(setCount(riderDataForAttendance?.data?.count || 0))
        }
        if (isError) {
            notification.error({
                message: `Error is ${error}}`,
            })
            dispatch(setRidersAttendanceData([]))
            dispatch(setCount(0))
        }
    }, [riderDataForAttendance, isSuccess, dispatch])

    const queryParams = useMemo(() => {
        return `/logistic/slikk/task?runner_mobile=${row?.profile?.mobile}&from=${fromDate}&to=${toDate}`
    }, [row?.profile?.mobile, fromDate, toDate])

    const { data: taskData, refetch } = useFetchApi<TaskData>({ url: queryParams })

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch()
        }, 60000)

        return () => clearInterval(intervalId)
    }, [])

    const fetchRiderParticularDetails = async () => {
        try {
            const response = await axioisInstance.get(`/logistic/rider/profile/${row?.profile?.mobile}`)
            const data = response?.data?.data
            setRiderData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchRiderParticularDetails()
    }, [])

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const riderTask = taskData?.find((item) => item?.runner_detail?.name.includes(riderData?.profile?.first_name || ''))

    const TaskDetailsData = [
        { name: 'Total', value: riderData?.task_data?.TOTAL, color: 'red' },
        { name: 'Return Completed', value: riderData?.task_data?.DELIVERED, color: 'blue' },
        { name: 'Completed', value: riderData?.task_data?.COMPLETED, color: 'green' },
    ]

    const columnsForRiderOrders = useRiderModalColumnsForOrders()

    const columns = useRiderModalColumns()

    return (
        <div className="p-2 overflow-scroll">
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose} width={1000}>
                <div className="overflow-y-scroll h-[750px] scrollbar-hide">
                    <div className="flex flex-col lg:flex-row justify-between mt-10 gap-8 ">
                        {/* Left Section */}
                        <div className="flex-1">
                            <div className="flex  gap-4 mb-6">
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
                                <div>
                                    <Button
                                        variant="new"
                                        size="sm"
                                        onClick={() => navigate(`/app/riders/attendance/${riderData?.profile?.mobile}`)}
                                    >
                                        <ImUserCheck className="text-xl" />
                                    </Button>
                                </div>
                            </div>

                            <Card className="shadow-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 rounded-lg p-6 mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                        <div className="flex flex-col justify-center items-center">
                                            <div className="text-gray-700 text-lg font-medium">{item?.value}</div>
                                            <div
                                                className={`mt-2 px-4 py-2 text-white rounded-xl items-center text-sm bg-${item?.color}-500`}
                                            >
                                                {item?.name}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-full h-64 lg:h-full">
                                <RiderLocationMap
                                    taskData={riderTask as TaskData}
                                    runnerLat={Number(riderData?.profile?.current_location?.latitude) || 0}
                                    runnerLong={Number(riderData?.profile?.current_location?.longitude) || 0}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="font-bold text-xl mb-6">Order Details</div>
                    <div className="grid grid-cols-1 ">
                        <EasyTable overflow mainData={taskData} columns={columnsForRiderOrders} page={page} pageSize={pageSize} />
                    </div>
                    <div className="font-bold text-xl mb-6">Attendance Details</div>
                    <div className="grid grid-cols-1 ">
                        <EasyTable overflow mainData={riderAttendance} columns={columns} page={page} pageSize={pageSize} />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default RiderDetailModal
