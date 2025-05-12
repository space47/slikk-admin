import { useState } from 'react'
import { eventSeriesResponseTypes } from '@/store/types/eventSeries.types'
import { Button, Dialog, Input, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    eventSeriesData: eventSeriesResponseTypes[]
    isEdit?: boolean
    event_id?: string
    mobile: string
}

const EventActionModal = ({ dialogIsOpen, setIsOpen, eventSeriesData, isEdit, event_id, mobile }: Props) => {
    const [formData, setFormData] = useState({
        mobileNumber: '',
        eventId: '',
        replaceEventId: '',
        action: '',
    })

    console.log('Event Series Data:', formData?.eventId)

    const eventOptions = eventSeriesData.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const handleSelectChange = (name: string) => (newVal: { value: string } | null) => {
        if (newVal) {
            setFormData((prev) => ({ ...prev, [name]: newVal.value }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const onDialogOk = async () => {
        const { replaceEventId } = formData
        let body = {}

        if (isEdit) {
            body = {
                mobile: mobile,
                event_id: event_id,
                replace_event_id: Number(replaceEventId),
                action: 'replace',
            }
        } else {
            body = {
                mobile: mobile,
                event_id: event_id,
                action: 'remove',
            }
        }

        try {
            const response = await axioisInstance.post('/dashboard/user/events', body)
            notification.success({ message: response.data?.message || 'Updated successfully' })
        } catch (error) {
            console.error('Error assigning user to event:', error)
            notification.error({ message: 'Error' })
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
                {isEdit ? (
                    <>
                        <h5 className="text-lg font-semibold mb-4">Replace User Event</h5>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Replacement Event</label>
                            <Select
                                isClearable
                                options={eventOptions}
                                placeholder="Select replacement event"
                                getOptionLabel={(option) => option.label ?? ''}
                                getOptionValue={(option) => option.value ?? ''}
                                onChange={handleSelectChange('replaceEventId')}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>Are You Sure you want to remove this user</div>
                    </>
                )}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="plain" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Submit
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default EventActionModal
