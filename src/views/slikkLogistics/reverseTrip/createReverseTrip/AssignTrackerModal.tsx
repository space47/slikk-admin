/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Modal from 'antd/es/modal/Modal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Card from '@/components/ui/Card'
import { notification, Radio } from 'antd'
import { useNavigate } from 'react-router-dom'
import { RiMotorbikeFill } from 'react-icons/ri'

type ModalProps = {
    showTaskModal: any
    handleCloseModal: any
    storeTaskId?: number
    setShowAssignModal: any
}

type RiderProfile = {
    first_name: string
    last_name: string
    email: string
    mobile: string
    image: string

    business_email: string | null
}

const AssignTrackerModal = ({ showTaskModal, handleCloseModal, storeTaskId, setShowAssignModal }: ModalProps) => {
    console.log('TaskId', storeTaskId)

    const [ridersData, setRidersData] = useState<RiderProfile[]>([])
    const [selectedRiderMobile, setSelectedRiderMobile] = useState<string>('')
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`logistic/riders`)
            const riderdata = response.data.data
            console.log('Rider Data:', riderdata)
            setRidersData(riderdata)
        } catch (error) {
            console.log('here')
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                mobile: selectedRiderMobile,
            }

            const response = await axioisInstance.patch(`logistic/slikk/trip/${storeTaskId}`, riderBody)
            console.log('rssssssssssssssss:', response)
            notification.success({
                message: 'SUCCESS',
                description: `Rider with moblie ${selectedRiderMobile} is assigned`,
            })
            setShowAssignModal(false)
            return response
            navigate(0)
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

    return (
        <div>
            <Modal
                title=""
                open={showTaskModal}
                okText="ASSIGN"
                okButtonProps={{
                    style: {
                        backgroundColor: 'green',
                        borderColor: 'darkgreen',
                    },
                }}
                onCancel={handleCloseModal}
                onOk={assignTask}
            >
                <div className="main">
                    {ridersData && (
                        <div className="details">
                            <Radio.Group value={selectedRiderMobile} onChange={handleRiderSelection}>
                                {ridersData.map((item, key) => {
                                    return (
                                        <Card key={key} className="w-[350px] mb-4 bg-gray-200">
                                            <div className="flex items-center gap-2 ">
                                                <Radio value={item?.mobile} />
                                                <div className="flex gap-3 items-center">
                                                    <RiMotorbikeFill className="text-xl" />
                                                    <div className="flex gap-1">
                                                        <span className="text-xl font-bold">{item?.first_name}</span>
                                                        <span className="text-xl font-bold">{item?.last_name}</span>
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

export default AssignTrackerModal
