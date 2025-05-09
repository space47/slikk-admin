/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem, Input, Select, Spinner } from '@/components/ui'
import { notification } from 'antd'
import { eventNameService } from '@/store/services/eventNameSerices'

interface props {
    dialogIsOpen: boolean
    setIsOpen: any
    eventNamesData?: any[]
    refetch?: any
}

const EditEventNamesModal = ({ dialogIsOpen, setIsOpen, eventNamesData, refetch }: props) => {
    const [eventName, setEventName] = useState<string>('')
    const [eventId, setEventId] = useState<number>()
    const [spinner, setSpinner] = useState<boolean>(false)
    const [editEventNames] = eventNameService.useEditEventnamesMutation()

    const EventNamesArray = eventNamesData?.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const onDialogOk = async () => {
        try {
            setSpinner(true)
            await editEventNames({
                name: eventName,
                id: eventId,
            }).unwrap()
            notification.success({ message: 'Event name updated successfully' })
        } catch (error) {
            console.error('Error', error)
            notification.error({ message: 'Failed to perform Action' })
        } finally {
            refetch()
            setIsOpen(false)
            setEventName('')
            setEventId(undefined)
            setSpinner(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)}>
                <h5 className="mb-4">Edit Event Names</h5>

                <div>
                    <FormItem label="Select Event Name">
                        <div>
                            <Select
                                isClearable
                                options={EventNamesArray || []}
                                onChange={(newVal) => {
                                    setEventId(newVal?.value)
                                }}
                            />
                        </div>
                    </FormItem>
                </div>

                {eventId && (
                    <FormItem label="Event Name" className="mb-4">
                        <Input placeholder="place event name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                    </FormItem>
                )}
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="solid" disabled={!eventName || !eventId} onClick={onDialogOk}>
                        <div className="flex gap-3 items-center">
                            <span>{spinner && <Spinner color="white" size={30} />}</span>
                            <span>Edit</span>
                        </div>
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default EditEventNamesModal
