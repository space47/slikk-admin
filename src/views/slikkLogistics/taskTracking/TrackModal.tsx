/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Modal from 'antd/es/modal/Modal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { notification, Radio } from 'antd'
import { useNavigate } from 'react-router-dom'

type ModalProps = {
    showTaskModal: any
    handleCloseModal: any
    storeTaskId: number
    setShowAssignModal: any
    isReturn?: boolean
}

type RiderProfile = {
    first_name: string
    last_name: string
    email: string
    mobile: string
    image: string
    checked_in_status: boolean
}

const TrackModal = ({ showTaskModal, handleCloseModal, storeTaskId, setShowAssignModal, isReturn }: ModalProps) => {
    console.log('TaskId', storeTaskId)

    const [ridersData, setRidersData] = useState<RiderProfile[]>([])
    const [selectedRiderMobile, setSelectedRiderMobile] = useState<string>('')
    const [globalFilter, setGlobalFilter] = useState<string | undefined>('')
    const navigate = useNavigate()
    const [hitSearchApi, setHitSearchApi] = useState<boolean>(false)

    const fetchData = async () => {
        try {
            let filterData = ''
            if (globalFilter) {
                filterData = `?name=${globalFilter}`
            }

            const response = await axioisInstance.get(`logistic/riders${filterData}`)
            const riderdata = response.data?.data?.map((item) => item?.profile)

            console.log('Rider Data:', riderdata)
            setRidersData(riderdata)
        } catch (error) {
            console.log(error)
        }
    }

    console.log('rider data for given is', ridersData)

    useEffect(() => {
        fetchData()
    }, [globalFilter])

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

    const handleSearch = () => {
        setHitSearchApi(true)
    }

    const riderDataArray = isReturn ? ridersData : ridersData?.filter((item) => item?.checked_in_status === true)

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
                onCancel={handleCloseModal}
                onOk={assignTask}
                width={450}
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

                    {ridersData && (
                        <div className="details overflow-y-scroll scrollbar-hide h-[340px] xl:h-[500px]  ">
                            <Radio.Group value={selectedRiderMobile} onChange={handleRiderSelection}>
                                {riderDataArray?.map((item, key) => {
                                    return (
                                        <Card key={key} className="w-[350px] mb-4 bg-gray-200">
                                            <div className="flex items-center gap-2 justify-between">
                                                <div className="flex gap-3 items-center">
                                                    <Avatar shape="circle" src={item?.image} />
                                                    <div className="flex gap-1">
                                                        <span className="text-xl font-bold">{item.first_name}</span>
                                                        <span className="text-xl font-bold">{item.last_name}</span>
                                                    </div>
                                                </div>
                                                <Radio value={item.mobile} />
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
