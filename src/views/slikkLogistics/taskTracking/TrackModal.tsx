/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Modal from 'antd/es/modal/Modal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Card from '@/components/ui/Card'
import { notification, Radio } from 'antd'
import { useNavigate } from 'react-router-dom'
import { RiderDetailType, setRiderDetails } from '@/store/slices/riderDetails/riderDetails.slice'
import { useAppDispatch, useAppSelector } from '@/store'
import { ridersService } from '@/store/services/riderServices'
import { RiMotorbikeFill } from 'react-icons/ri'
import { TaskDetails } from './TaskCommonType'
import { calculateDistance } from '../riderDetails/RiderUtils/RiderDetailsColumns'

type ModalProps = {
    showTaskModal: boolean
    handleCloseModal: (x: any) => void
    storeData?: TaskDetails
    setShowAssignModal: (x: boolean) => void
    isReturn?: boolean
    isOrder?: boolean
    taskId?: number | string
    storeLat?: number
    storeLong?: number
    refetch?: any
}

const TrackModal = ({
    showTaskModal,
    handleCloseModal,
    storeData,
    setShowAssignModal,
    isReturn,
    isOrder,
    taskId,
    storeLat,
    storeLong,
    refetch,
}: ModalProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [selectedRiderMobile, setSelectedRiderMobile] = useState<string>('')
    const [globalFilter, setGlobalFilter] = useState<string | undefined>('')
    const [mobileFilter, setMobileFilter] = useState<string | undefined>('')
    const { riderDetails } = useAppSelector<RiderDetailType>((state) => state.riderDetails)

    console.log('task id is', taskId)

    const { data: riders, isSuccess } = ridersService.useRiderDetailsQuery(
        {
            page: 1,
            pageSize: 100,
            name: globalFilter,
            mobile: mobileFilter,
            isActive: 'true',
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRiderDetails(riders.data?.results || []))
        }
    }, [riders, isSuccess, dispatch, globalFilter])

    const assignTask = async () => {
        if (!selectedRiderMobile) {
            notification.warning({
                message: 'WARNING',
                description: 'YOU SHOULD SELECT A RIDER',
            })
            return
        }

        try {
            const riderBody = {
                action: 'assign_rider',
                rider_mobile: selectedRiderMobile,
            }

            const field = isOrder ? taskId : storeData?.task_id

            console.log('hello', `logistic/slikk/task/${field}`)

            const response = await axioisInstance.patch(`logistic/slikk/task/${field}`, riderBody)
            notification.success({
                message: 'SUCCESS',
                description: `Rider with moblie ${selectedRiderMobile} is assigned`,
            })
            setShowAssignModal(false)
            refetch ? refetch() : navigate(0)
            return response
        } catch (error) {
            console.log(error)
            notification.error({
                message: `FAILURE`,
                description: 'Failed to assign Rider',
            })
        }
    }

    const handleRiderSelection = (e: any) => {
        setSelectedRiderMobile(e.target.value)
    }

    const riderDataArray = isReturn ? riderDetails : riderDetails?.filter((item) => item?.profile?.checked_in_status === true)

    return (
        <div>
            <Modal
                title=""
                open={showTaskModal}
                okText="Assign"
                okButtonProps={{
                    style: {
                        backgroundColor: 'green',
                        borderColor: 'darkgreen',
                    },
                }}
                width={650}
                onOk={assignTask}
                onCancel={handleCloseModal}
            >
                <div className="flex flex-col h-[60vh]">
                    <div className="text-xl font-bold text-red-700 mb-6 text-center">ASSIGN RIDER</div>

                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex gap-2">
                            <input
                                type="search"
                                name="globalFilter"
                                placeholder="Enter Rider name"
                                value={globalFilter}
                                className="rounded-xl p-2 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="search"
                                name="mobileFilter"
                                placeholder="Enter Rider Mobile"
                                value={mobileFilter}
                                className="rounded-xl p-2 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                onChange={(e) => setMobileFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {riderDetails && (
                        <div className="flex-1 overflow-scroll scrollbar-hide ">
                            <div className="overflow-y-auto h-[200px] xl:h-[400px] md:h-[300px] pr-2 scrollbar-thin scrollbar-thumb-gray-400  scrollbar-track-gray-100">
                                <Radio.Group value={selectedRiderMobile} onChange={handleRiderSelection} className="w-full">
                                    <div className="space-y-3">
                                        {riderDataArray?.map((item, key) => {
                                            const latitude = isOrder ? storeLat : storeData?.pickup_details?.latitude
                                            const longitude = isOrder ? storeLong : storeData?.pickup_details?.longitude

                                            const distanceFromStore = calculateDistance(
                                                Number(item?.profile?.current_location?.latitude),
                                                Number(item?.profile?.current_location?.longitude),
                                                latitude,
                                                longitude,
                                            )

                                            console.log('distance from store', distanceFromStore)

                                            const isFree = item?.rider_status == false

                                            return (
                                                <Card
                                                    key={key}
                                                    className={`${isFree ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'} w-full transition-colors duration-200 cursor-pointer`}
                                                >
                                                    <div className="flex items-center gap-3 p-3">
                                                        <Radio value={item?.profile?.mobile} />
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <RiMotorbikeFill className="text-2xl text-gray-700" />
                                                            <div className="flex flex-col flex-1">
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-lg font-semibold">
                                                                        {item?.profile?.first_name} {item?.profile?.last_name}
                                                                    </span>
                                                                    {latitude && (
                                                                        <span className="text-sm text-gray-600">
                                                                            {distanceFromStore}KM away
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-600 mt-1">{item?.profile?.mobile}</div>
                                                                <span className="text-sm text-gray-600">{item?.profile?.rider_type}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </Radio.Group>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default TrackModal
