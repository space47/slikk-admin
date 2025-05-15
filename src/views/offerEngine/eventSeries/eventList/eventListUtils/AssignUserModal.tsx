/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { eventSeriesResponseTypes } from '@/store/types/eventSeries.types'
import { Button, Dialog, Input, Spinner } from '@/components/ui'
import { notification } from 'antd'
import { eventSeriesService } from '@/store/services/eventSeriesService'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    eventSeriesData: eventSeriesResponseTypes[]
    event_id?: string
}

const AssignUserModal = ({ dialogIsOpen, setIsOpen, event_id }: Props) => {
    const [eventAction, eventActionResponse] = eventSeriesService.useActionEventSeriesMutation()
    const [formData, setFormData] = useState({
        mobileNumber: '',
        eventId: '',
        replaceEventId: '',
        action: '',
    })

    useEffect(() => {
        if (eventActionResponse.isSuccess) {
            notification.success({
                message: (eventActionResponse as any).data?.message || 'User successfully assigned to event',
            })
            setIsOpen(false)
            setFormData({
                mobileNumber: '',
                eventId: '',
                replaceEventId: '',
                action: '',
            })
        }
        if (eventActionResponse.isError) {
            notification.error({
                message: (eventActionResponse.error as any)?.data?.message || 'Failed to assign user to event',
            })
        }
    }, [eventActionResponse, setIsOpen])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const onDialogOk = async () => {
        const { mobileNumber } = formData
        const body = {
            mobile: mobileNumber,
            event_id: event_id,
            action: 'add',
        }
        try {
            await eventAction(body as any).unwrap()
        } catch (error) {
            console.error('Error assigning user to event:', error)
        } finally {
            setIsOpen(false)
            setFormData({
                mobileNumber: '',
                eventId: '',
                replaceEventId: '',
                action: '',
            })
        }
    }

    return (
        <Dialog isOpen={dialogIsOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)} width="500px">
            <div className="space-y-4">
                <h5 className="text-lg font-semibold mb-4">Assign User to Event</h5>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                    <Input
                        type="text"
                        name="mobileNumber"
                        placeholder="Enter mobile number"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="plain" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk} className="flex gap-2 items-center">
                        <span>{eventActionResponse?.isLoading && <Spinner size={30} color="white" />}</span> Add
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default AssignUserModal
