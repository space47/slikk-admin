import { useState } from 'react'
import { eventSeriesResponseTypes } from '@/store/types/eventSeries.types'
import { Button, Dialog, Input, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    eventSeriesData: eventSeriesResponseTypes[]
    event_id?: string
}

const AssignUserModal = ({ dialogIsOpen, setIsOpen, event_id }: Props) => {
    const [formData, setFormData] = useState({
        mobileNumber: '',
        eventId: '',
        replaceEventId: '',
        action: '',
    })

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
            const response = await axioisInstance.post('/dashboard/user/events', body)
            notification.success({ message: response.data?.message || 'User assigned successfully' })
        } catch (error) {
            console.error('Error assigning user to event:', error)
            notification.error({ message: 'Error assigning user to event' })
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
                    <Button variant="solid" onClick={onDialogOk}>
                        Submit
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default AssignUserModal
