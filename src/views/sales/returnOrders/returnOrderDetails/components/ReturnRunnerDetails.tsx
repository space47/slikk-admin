import Card from '@/components/ui/Card'
import { Avatar, Button } from '@/components/ui'
import { useState } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'
import TrackModal from '@/views/slikkLogistics/taskTracking/TrackModal'
import { ReturnOrder } from '@/store/types/returnOrderData.types'
import { EReturnOrderStatus } from '../../returnOrderUtils/ReturnOrderUtils'

interface Props {
    returnOrder: ReturnOrder
}

const ReturnRunnerDetails: React.FC<Props> = ({ returnOrder }) => {
    const [showRiderModal, setShowRiderModal] = useState(false)
    const returnProducts = returnOrder?.return_order_delivery?.find((item) => item?.state !== EReturnOrderStatus.cancelled)

    return (
        <Card className="card">
            <h5 className="mb-4">Runner Details</h5>
            <div className="group flex flex-col gap-2">
                <div className="flex gap-5  flex-col">
                    <div className="ltr:ml-2 rtl:mr-2 flex  justify-center items-center">
                        <span className="text-xl font-bold flex gap-1">{returnProducts?.partner}</span>
                    </div>
                    <div className="flex flex-col gap-3 ">
                        <div className="flex flex-col gap-3">
                            <Avatar shape="circle" src={returnProducts?.runner_profile_pic_url} size="lg" />
                            <div className="mx-3">
                                <div className="items-start flex flex-col gap-1">
                                    <div className="flex gap-2 items-center">
                                        <FaUserAlt /> <span>{returnProducts?.runner_name}</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <HiPhone className="font-bold" /> <span>{returnProducts?.runner_phone_number}</span>
                                    </div>

                                    <div className="url">
                                        <a href={returnProducts?.tracking_url} className="flex items-center cursor-pointer">
                                            <HiLocationMarker className="text-xl" />
                                            <p className="text-blue-600 hover:underline">Track location</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="time">
                    <span className="font-bold">
                        {returnProducts?.awb_code ? (
                            <span>AWB :{returnProducts?.awb_code}</span>
                        ) : (
                            <span>Task_id:{returnProducts?.task_id}</span>
                        )}
                    </span>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="mt-5">
                        <Button variant="new" size="sm" onClick={() => setShowRiderModal(true)}>
                            Assign Rider
                        </Button>
                    </div>
                </div>
                {showRiderModal && (
                    <TrackModal
                        isReturn
                        isOrder
                        handleCloseModal={() => setShowRiderModal(false)}
                        showTaskModal={showRiderModal}
                        setShowAssignModal={setShowRiderModal}
                        taskId={returnOrder?.return_order_delivery[0]?.task_id}
                    />
                )}
            </div>
        </Card>
    )
}

export default ReturnRunnerDetails
