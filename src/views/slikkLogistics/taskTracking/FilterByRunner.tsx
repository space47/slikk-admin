/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Modal from 'antd/es/modal/Modal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { notification, Radio } from 'antd'

type ModalProps = {
    showTaskModal: any
    handleCloseModal: any
    storeTaskId: number
    setShowAssignModal?: any
    handleFilterName?: any
    SetParticularMobileOfRunner: any
    particularMobileOfRunner: any
}

type RiderProfile = {
    first_name: string
    last_name: string
    email: string
    mobile: string
    image: string

    business_email: string | null
}

const FilterByRunner = ({
    showTaskModal,
    handleCloseModal,
    storeTaskId,
    setShowAssignModal,
    SetParticularMobileOfRunner,
    particularMobileOfRunner,
}: ModalProps) => {
    const [ridersData, setRidersData] = useState<RiderProfile[]>([])
    const [globalFilter, setGlobalFilter] = useState<string | undefined>('')
    const fetchData = async () => {
        let filterData = ''
        if (globalFilter) {
            filterData = `?name=${globalFilter}`
        }
        try {
            const response = await axioisInstance.get(`logistic/riders${filterData}`)
            const riderdata = response.data.data
            setRidersData(riderdata)
        } catch (error) {
            console.log(error)
        }
    }

    console.log('datatata', ridersData)

    useEffect(() => {
        fetchData()
    }, [globalFilter])

    const assignTask = () => {
        notification.success({
            message: `Filter has been applied with mobile: ${particularMobileOfRunner}`,
        })

        handleCloseModal()
        if (setShowAssignModal) setShowAssignModal(false)
    }

    const handleRiderSelection = (e: any) => {
        SetParticularMobileOfRunner(e.target.value)
    }

    return (
        <div>
            <Modal
                title=""
                open={showTaskModal}
                okText="Filter"
                okButtonProps={{
                    style: {
                        backgroundColor: 'green',
                        borderColor: 'darkgreen',
                    },
                }}
                onCancel={handleCloseModal}
                onOk={assignTask}
            >
                <div className="h-[500px] xl:h-[650px] ">
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
                        <div className="overflow-y-scroll scrollbar-hide h-[340px] xl:h-[500px]">
                            <Radio.Group value={particularMobileOfRunner} onChange={handleRiderSelection}>
                                {ridersData.map((item, key) => {
                                    return (
                                        <Card key={key} className="w-[350px] mb-4 bg-gray-200">
                                            <div className="flex items-center gap-2 justify-between">
                                                <div className="flex gap-3 items-center">
                                                    <Avatar shape="circle" src={item?.profile?.image} />
                                                    <div className="flex gap-1">
                                                        <span className="text-xl font-bold">{item?.profile?.first_name}</span>
                                                        <span className="text-xl font-bold">{item.profile?.last_name}</span>
                                                    </div>
                                                </div>
                                                <Radio value={item?.profile?.mobile} />
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

export default FilterByRunner
