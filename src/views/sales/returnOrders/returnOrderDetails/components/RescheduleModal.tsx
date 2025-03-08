/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, Dropdown, Select } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { DatePicker, notification } from 'antd'
import moment, { Moment } from 'moment'
import React, { useState } from 'react'

interface ReturnCancelProps {
    isReschedule: boolean
    setIsReschedule: (x: boolean) => void
}

const RescheduleType = [
    { label: 'EXCHANGE', value: 'exchange' },
    { label: 'REVERSE', value: 'return_order' },
    { label: 'ORDER', value: 'order' },
]

const RescheduleReasons = [
    {
        label: 'Return did not completed',
        value: 'Return did not completed',
    },
    {
        label: 'Other: I have another reason for rescheduling the order.',
        value: 'other',
    },
]

const RescheduleModal: React.FC<ReturnCancelProps> = ({ isReschedule, setIsReschedule }) => {
    const [rescheduleReason, setRescheduleReason] = useState<string | undefined>(undefined)
    const [rescheduleTypeValue, setRescheduleTypeValue] = useState<string | null>(null)
    const [dateStore, setDateStore] = useState<any>(null)

    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnDetails = returnOrder?.returnOrders
    const taskId = returnDetails?.return_order_delivery.find((item) => item?.state !== 'CANCELLED')?.task_id

    console.log('task id is', taskId)
    const handleReschedule = async () => {
        const formattedDate = dateStore ? moment(dateStore).format('YYYY-MM-DD HH:mm:ss') : null
        const body = {
            action: 'reschedule',
            task_type: rescheduleTypeValue,
            pickup_slot: formattedDate,
            reschedule_reason: rescheduleReason,
        }

        console.log('body ius', body)
        try {
            const response = await axioisInstance.patch(`logistic/rider/task/${taskId}`, body)
            notification.success({
                message: response?.data?.message,
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failed to reschedule',
            })
        } finally {
            setIsReschedule(false)
        }
    }

    return (
        <Dialog
            width="100%"
            className="w-full xl:w-1/4 mx-auto p-4 sm:p-6 md:p-8"
            isOpen={isReschedule}
            onClose={() => setIsReschedule(false)}
        >
            <div className="flex flex-col gap-6">
                <div>
                    <div className="text-xl font-bold">Reschedule Type</div>
                    <Select
                        isClearable
                        className="w-1/3"
                        options={RescheduleType}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        value={RescheduleType.find((option) => option.value === rescheduleTypeValue) || null}
                        onChange={(newVal) => setRescheduleTypeValue(newVal?.value ?? null)}
                    />
                </div>

                {/* Date Picker */}
                <div>
                    <div className="text-xl font-bold">Pickup Slot</div>
                    <DatePicker
                        showTime
                        className="w-1/2"
                        value={dateStore ? moment(dateStore) : null}
                        onChange={(value) => setDateStore(value ? value.format('YYYY-MM-DD HH:mm:ss') : '')}
                    />
                </div>

                <div>
                    <div className="text-xl font-bold">Reschedule Reason</div>
                    <Dropdown
                        className="bg-gray-300 w-full sm:w-auto"
                        title={
                            rescheduleReason
                                ? RescheduleReasons.find((reason) => reason.value === rescheduleReason)?.label || 'SELECT RETURN REASON'
                                : 'SELECT RETURN REASON'
                        }
                        onSelect={(val) => setRescheduleReason(val)}
                    >
                        {RescheduleReasons.map((reason) => (
                            <DropdownItem key={reason.value} eventKey={reason.value}>
                                <span>{reason.label}</span>
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
            </div>
            {!taskId && <p className="text-xl mt-10 font-bold text-red-500 mb-4">No rider has been selected to reschedule</p>}

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button variant="accept" onClick={handleReschedule} disabled={!taskId}>
                    Reschedule
                </Button>
            </div>
        </Dialog>
    )
}

export default RescheduleModal
