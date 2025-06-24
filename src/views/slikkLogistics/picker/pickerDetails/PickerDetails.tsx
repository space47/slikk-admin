import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { pickerService } from '@/store/services/pickerServices'
import { PickerRequiredType, setPickerDetailsData } from '@/store/slices/pickerSlice/picker.slice'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { usePickerDetailsColumns } from '../pickerUtils/usePickerDetailsColumns'
import EasyTable from '@/common/EasyTable'

const PickerDetails = () => {
    const dispatch = useAppDispatch()
    const { mobile } = useParams()
    const { pickerDetailsData } = useAppSelector<PickerRequiredType>((state) => state.picker)
    const { data, isSuccess } = pickerService.usePickerDetailsDataQuery({ mobile })

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setPickerDetailsData(data))
        }
    }, [isSuccess, data, dispatch])

    const profile = pickerDetailsData?.profile
    const counts = pickerDetailsData?.order_counts
    const orders = pickerDetailsData?.data || []

    const columns = usePickerDetailsColumns()

    if (!profile || !counts) return <NotFoundData />

    return (
        <div className="flex flex-col gap-10">
            <div className="bg-gray-50 rounded-2xl shadow-md p-6 w-full max-w-xl space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 text-center">Picker Profile</h2>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span className="font-medium">First Name:</span> {profile.first_name}
                    </div>
                    <div>
                        <span className="font-medium">Last Name:</span> {profile.last_name}
                    </div>
                    <div>
                        <span className="font-medium">Email:</span> {profile.email}
                    </div>
                    <div>
                        <span className="font-medium">Mobile:</span> {profile.mobile}
                    </div>
                    <div>
                        <span className="font-medium">Checked In:</span>{' '}
                        <span className={profile.checked_in_status ? 'text-green-600 font-semibold' : 'text-red-600'}>
                            {profile.checked_in_status ? '✅' : '❌'}
                        </span>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Counts</h3>
                    <div className="flex justify-between text-sm text-gray-700">
                        <div>
                            <span className="font-medium">Pending:</span> {counts.pending}
                        </div>
                        <div>
                            <span className="font-medium">Picked:</span> {counts.picked}
                        </div>
                        <div>
                            <span className="font-medium">Total:</span> {counts.total}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <EasyTable noPage overflow mainData={orders} columns={columns} />
            </div>
        </div>
    )
}

export default PickerDetails
