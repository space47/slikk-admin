import React, { useEffect, useState } from 'react'
import EasyTable from '@/common/EasyTable'
import { useEventsColumns } from '../eventUtils/useEventsColumns'
import { useAppDispatch, useAppSelector } from '@/store'
import { EventNamesSliceType, setEventNamesData } from '@/store/slices/eventNameSlice/eventName.slice'
import { eventNameService } from '@/store/services/eventNameSerices'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import DialogConfirm from '@/common/DialogConfirm'
import { notification } from 'antd'

const EventTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { eventNamesData } = useAppSelector<EventNamesSliceType>((state) => state.eventNames)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
    const { data: eventNameList, isSuccess } = eventNameService.useEventNamesDataQuery({})
    const [deleteEventnames, deleteResponse] = eventNameService.useDeleteEventnamesMutation()

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEventNamesData(eventNameList?.results || []))
        }
    }, [dispatch, isSuccess, eventNameList])

    useEffect(() => {
        if (deleteResponse.isSuccess) {
            notification.success({
                message: 'Event deleted successfully',
            })
            setIsDeleteModalOpen(false)
            navigate(0)
        }
        if (deleteResponse.isError) {
            notification.error({
                message: 'Error deleting event',
            })
        }
    }, [deleteResponse])

    const handleDeleteEvent = (id: number) => {
        setIsDeleteModalOpen(true)
        setSelectedEventId(id)
    }

    const handleDelete = async () => {
        await deleteEventnames({ id: selectedEventId as number })
    }

    const columns = useEventsColumns({ handleDeleteEvent })

    return (
        <div>
            <div className="flex justify-end mb-5">
                <Button variant="new" onClick={() => navigate(`/app/appsCommuncication/eventsadd`)}>
                    Add
                </Button>
            </div>
            <EasyTable mainData={eventNamesData} columns={columns} />
            {isDeleteModalOpen && (
                <>
                    <DialogConfirm IsOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} IsDelete onDialogOk={handleDelete} />
                </>
            )}
        </div>
    )
}

export default EventTable
