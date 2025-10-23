/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Calendar, Dialog } from '@/components/ui'
import { cashCollectionService } from '@/store/services/cashCollectionService'
import { notification } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
}

const CreateCollectionModal = ({ isOpen, setIsOpen }: Props) => {
    const [dates, setDates] = useState<string[]>([])
    const [createCashCollection, cashCollectionResponse] = cashCollectionService.useCreateCashCollectionMutation()

    useEffect(() => {
        if (cashCollectionResponse.isSuccess) {
            notification.success({
                message: cashCollectionResponse?.data?.message || 'Successfully created',
            })
            setIsOpen(false)
        }

        if (cashCollectionResponse.isError) {
            notification.error({
                message: (cashCollectionResponse?.error as any)?.data?.message || 'Failed to create collection',
            })
        }
    }, [cashCollectionResponse?.isSuccess, cashCollectionResponse?.isError])

    const handleCreate = () => {
        createCashCollection({ task_date: dates })
    }

    return (
        <Dialog isOpen={isOpen} width={480} onClose={() => setIsOpen(false)}>
            <div className="p-6 flex flex-col items-center gap-6">
                <h2 className="text-lg font-semibold text-gray-800">Select Collection Dates</h2>
                <div className="w-full flex justify-center  ">
                    <div className="w-full shadow-xl p-2 rounded-xl">
                        <Calendar
                            multipleSelection
                            value={dates.map((d) => new Date(d))}
                            onChange={(selectedDates: Date[] | Date) => {
                                const formatted = Array.isArray(selectedDates)
                                    ? selectedDates.map((date) => moment(date).format('YYYY-MM-DD'))
                                    : [moment(selectedDates).format('YYYY-MM-DD')]
                                setDates(formatted)
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 w-full mt-2">
                    <Button
                        variant="reject"
                        className="min-w-[90px]"
                        onClick={() => {
                            setIsOpen(false)
                            setDates([])
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="blue" className="min-w-[90px]" onClick={handleCreate}>
                        Apply
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CreateCollectionModal
