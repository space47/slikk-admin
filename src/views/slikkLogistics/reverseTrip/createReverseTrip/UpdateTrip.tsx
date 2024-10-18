import React, { useState } from 'react'
import SelectedTripId from '../componentsTrip/SelectedTripId'
import { useParams } from 'react-router-dom'
import CreateTripForUpdate from '../componentsTrip/CreateTripForUpdate'
import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const UpdateTrip = () => {
    const [listOfTaskIds, setListOfTaskIds] = useState<string[]>([])
    const [mobileNumber, setMobileNumber] = useState()
    const { tripId } = useParams()

    console.log('MOnbile', mobileNumber)

    const handleUpdateTheTrip = async () => {
        const body = {
            task_ids: listOfTaskIds.join(','),
            mobile: mobileNumber,
        }
        try {
            const response = await axioisInstance.patch(`/logistic/slikk/trip/${tripId}`, body)
            notification.success({
                message: response.data.message || 'Successfully Updated Trip',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to update Trip',
            })
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-end">
                <Button variant="new" onClick={handleUpdateTheTrip}>
                    Update Trip
                </Button>
            </div>
            <div>
                <h5>TRIP Details</h5>
                <SelectedTripId
                    trip_id={tripId}
                    listOfTaskIds={listOfTaskIds}
                    setListOfTaskIds={setListOfTaskIds}
                    setMobileNumber={setMobileNumber}
                />
            </div>
            <div>
                <h5>ALL CREATED TASKS</h5>
                <CreateTripForUpdate listOfTaskIds={listOfTaskIds} setListOfTaskIds={setListOfTaskIds} />
            </div>
        </div>
    )
}

export default UpdateTrip
