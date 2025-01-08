import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import { FormItem } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { DatePicker, notification } from 'antd'
import moment, { Moment } from 'moment'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    bannerIdStore: number[]
}

const BulkEditModal = ({ dialogIsOpen, setIsOpen, bannerIdStore }: Props) => {
    const [dates, setDates] = useState<{
        startDate: Moment | null
        endDate: Moment | null
    }>({ startDate: null, endDate: null })

    const onDialogClose = (e: MouseEvent) => {
        setIsOpen(false)
    }

    const handleDateChange = (name: string, date: Moment | null) => {
        setDates((prevDates) => ({
            ...prevDates,
            [name]: date,
        }))
    }

    const onDialogOk = async () => {
        const body = {
            banner_ids: bannerIdStore.join(','),
            start_date: dates.startDate ? dates.startDate.format('YYYY-MM-DD HH:mm:ss') : null,
            end_date: dates.endDate ? dates.endDate.format('YYYY-MM-DD HH:mm:ss') : null,
        }

        try {
            const response = await axioisInstance.post(`/banner/bulk/update`, body)
            notification.success({
                message: response?.data?.message || response?.data?.data?.message || 'Successfully edited banner ids',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to edit bulk banner id',
            })
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <div className="flex flex-col gap-3">
                    <FormItem label="Start Date">
                        <DatePicker
                            showTime
                            placeholder="Select Start Date"
                            value={dates.startDate}
                            onChange={(date) => handleDateChange('startDate', date)}
                        />
                    </FormItem>
                    <FormItem label="End Date">
                        <DatePicker
                            showTime
                            placeholder="Select End Date"
                            value={dates.endDate}
                            onChange={(date) => handleDateChange('endDate', date)}
                        />
                    </FormItem>
                </div>

                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Edit
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default BulkEditModal
