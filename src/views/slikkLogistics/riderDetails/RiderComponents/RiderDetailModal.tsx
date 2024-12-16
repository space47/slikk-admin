import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { RiderData } from '../RiderDetailsCommon'
import { GiFullMotorcycleHelmet } from 'react-icons/gi'
import { Card } from '@/components/ui'
import RiderLocationMap from './RiderLocationMap'

interface RiderModalProps {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    mobile: string | undefined
}

const RiderDetailModal = ({ dialogIsOpen, setIsOpen, mobile }: RiderModalProps) => {
    const [riderData, setRiderData] = useState<RiderData>()

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
                <div className="flex justify-between mt-10">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl text-blue-500">
                                <GiFullMotorcycleHelmet />
                            </span>
                            <span className="text-xl font-semibold text-gray-800">{riderData?.profile?.first_name}</span>
                        </div>

                        <Card className="shadow-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 rounded-lg p-6 mb-6 w-full">
                            <div className="flex justify-between">
                                <div className="flex flex-col mb-4">
                                    <span className="text-blue-700 text-lg font-bold">Shift</span>
                                    <span className="text-gray-600 text-lg">10AM - 10PM</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-blue-700 text-lg font-bold">Location</span>
                                    <span className="text-gray-600 text-lg">HSR</span>
                                </div>
                            </div>
                        </Card>

                        <div className="mb-6 font-bold text-xl">Deliveries</div>
                        {/* Task Details Row */}
                        <div className="flex space-x-4 mb-6">
                            {TaskDetailsData?.map((item, key) => (
                                <Card
                                    key={key}
                                    className="flex justify-between items-center p-4 shadow-lg border border-gray-200 rounded-xl hover:shadow-2xl transition-all duration-200 w-full sm:w-auto"
                                >
                                    <div className="text-gray-700 text-lg font-medium flex items-center justify-center">{item?.value}</div>
                                    <div className={`px-4 py-2 text-white rounded-full text-sm bg-${item?.color}-500`}>{item?.name}</div>
                                </Card>
                            ))}
                        </div>
                        <div className="font-bold text-xl mb-6"> Task Details</div>
                        <div className="flex gap-8 items-center ">
                            {TaskDetailsOthers?.map((item, key) => (
                                <div key={key} className="flex flex-col">
                                    <div className="font-bold xl:text-[15px] text-gray-600">{item?.name}</div>
                                    <div className="flex items-center justify-center text-green-600 ">{item?.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <div>
                        <RiderLocationMap latitudes={12} longitudes={12.8} amount={0} />
                        <div className="flex justify-center items-center">
                            <div>Map</div>
                        </div>
                    </div> */}
                </div>
            </Dialog>
        </div>
    )
}

export default RiderDetailModal
