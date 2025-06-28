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

type ModalProps = {
    showTaskModal: boolean
    handleCloseModal: (x: any) => void
    storeTaskId: number | string
    setShowAssignModal: (x: boolean) => void
    isReturn?: boolean
}

const TrackModal = ({ showTaskModal, handleCloseModal, storeTaskId, setShowAssignModal, isReturn }: ModalProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    // const [ridersData, setRidersData] = useState<RiderProfile[]>([])
    const [selectedRiderMobile, setSelectedRiderMobile] = useState<string>('')
    const [globalFilter, setGlobalFilter] = useState<string | undefined>('')
    const { riderDetails } = useAppSelector<RiderDetailType>((state) => state.riderDetails)

    const { data: riders, isSuccess } = ridersService.useRiderDetailsQuery(
        {
            page: 1,
            pageSize: 100,
            name: globalFilter,
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

            const response = await axioisInstance.patch(`logistic/slikk/task/${storeTaskId}`, riderBody)
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

                    {riderDetails && (
                        <div className="details overflow-y-scroll scrollbar-hide h-[340px] xl:h-[500px]">
                            <Radio.Group value={selectedRiderMobile} onChange={handleRiderSelection}>
                                {riderDataArray?.map((item, key) => {
                                    return (
                                        <Card key={key} className="w-[350px] mb-4 bg-gray-200">
                                            <div className="flex items-center gap-2 ">
                                                <Radio value={item?.profile?.mobile} />
                                                <div className="flex gap-3 items-center">
                                                    <RiMotorbikeFill className="text-xl" />
                                                    <div className="flex gap-1">
                                                        <span className="text-xl font-bold">{item?.profile?.first_name}</span>
                                                        <span className="text-xl font-bold">{item?.profile?.last_name}</span>
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
