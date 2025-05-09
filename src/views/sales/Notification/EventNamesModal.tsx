/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem, Input, Spinner } from '@/components/ui'
import { notification } from 'antd'
import { eventNameService } from '@/store/services/eventNameSerices'

interface props {
    dialogIsOpen: boolean
    setIsOpen: any
    refetch?: any
}

const EventNamesModal = ({ dialogIsOpen, setIsOpen, refetch }: props) => {
    const [eventName, setEventName] = useState<string>('')
    const [spinner, setSpinner] = useState<boolean>(false)
    const [addEventNames] = eventNameService.useAddEventnamesMutation()

    const onDialogOk = async () => {
        try {
            setSpinner(true)
            await addEventNames({ name: eventName }).unwrap()
            notification.success({ message: 'Event Name Added Successfully' })
        } catch (error) {
            console.error('Error', error)
            notification.error({ message: 'Failed to perform Action' })
        } finally {
            refetch()
            setIsOpen(false)
            setSpinner(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)}>
                <h5 className="mb-4">Add Event Names</h5>
                <FormItem label="Event Name" className="mb-4">
                    <Input placeholder="place event name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                </FormItem>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="solid" disabled={!eventName} onClick={onDialogOk}>
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

export default EventNamesModal
