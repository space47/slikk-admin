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
}: ModalProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    // const [ridersData, setRidersData] = useState<RiderProfile[]>([])
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
            rider_type: isReturn ? 'RETURN' : 'FORWARD',
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
            navigate(0)
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
                width={450}
                onOk={assignTask}
                onCancel={handleCloseModal}
            >
                <div className="main h-[500px] xl:h-[650px] ">
                    <div className="text-xl font-bold text-red-700 mb-6">ASSIGN RIDER</div>
                    <div className="flex gap-2 flex-col mb-4">
                        <div className="mb-8 flex gap-2">
                            <input
                                type="search"
                                name="globalFilter"
                                placeholder="Enter Rider name"
                                value={globalFilter}
                                className="rounded-xl"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </div>
                        <div className="mb-8 flex gap-2">
                            <input
                                type="search"
                                name="mobileFilter"
                                placeholder="Enter Rider Mobile"
                                value={mobileFilter}
                                className="rounded-xl"
                                onChange={(e) => setMobileFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {riderDetails && (
                        <div className="details overflow-y-scroll scrollbar-hide h-[340px] xl:h-[500px]">
                            <Radio.Group value={selectedRiderMobile} onChange={handleRiderSelection}>
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
                                        <Card key={key} className={`${isFree == true ? 'bg-green-300' : 'bg-red-300'} w-[380px] mb-4`}>
                                            <div className="flex items-center gap-2 ">
                                                <Radio value={item?.profile?.mobile} />
                                                <div className="flex gap-3 items-center ">
                                                    <RiMotorbikeFill className="text-xl" />
                                                    <div className="flex flex-col">
                                                        <div className="flex gap-1">
                                                            <span className="text-xl font-bold">{item?.profile?.first_name}</span>
                                                            <span className="text-xl font-bold">{item?.profile?.last_name}</span>
                                                            <span className="text-sm mt-1 font-semibold">
                                                                {latitude && <>({distanceFromStore}KM)</>}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </Radio.Group>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default TrackModal
