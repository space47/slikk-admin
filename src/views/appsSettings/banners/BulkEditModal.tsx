import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormItem, Input, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { DatePicker, notification } from 'antd'
import { Moment } from 'moment'
import { BANNER_PAGE_NAME } from '@/common/banner'
import { FaEdit } from 'react-icons/fa'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    bannerIdStore: number[]
}

const BulkEditModal = ({ dialogIsOpen, setIsOpen, bannerIdStore }: Props) => {
    const [dates, setDates] = useState<{ startDate: Moment | null; endDate: Moment | null }>({ startDate: null, endDate: null })

    const [sectionHeading, setSectionHeading] = useState<string>('')
    const [pageSectionValues, setPageSectionsvalues] = useState<string>('')

    const onDialogClose = () => {
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
            page: pageSectionValues,
            section_heading: sectionHeading,
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
            <Dialog isOpen={dialogIsOpen} width={800} onRequestClose={onDialogClose} onClose={onDialogClose}>
                <div className="text-2xl font-semibold text-gray-800 mb-6 flex gap-3">
                    <span>
                        <FaEdit className="text-2xl text-blue-600" />
                    </span>{' '}
                    Bulk Edit Banners
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <FormItem label="Start Date">
                        <DatePicker
                            showTime
                            placeholder="Select Start Date"
                            value={dates.startDate}
                            className="w-full rounded-lg"
                            onChange={(date) => handleDateChange('startDate', date)}
                        />
                    </FormItem>
                    <FormItem label="End Date">
                        <DatePicker
                            showTime
                            placeholder="Select End Date"
                            value={dates.endDate}
                            className="w-full rounded-lg"
                            onChange={(date) => handleDateChange('endDate', date)}
                        />
                    </FormItem>
                </div>

                <div className="mb-6">
                    <div className="text-lg font-medium text-gray-700 mb-2">Section Heading</div>
                    <Input
                        value={sectionHeading}
                        placeholder="Enter Section Heading"
                        className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition w-full"
                        onChange={(e) => setSectionHeading(e.target.value)}
                    />
                </div>

                <div className="mb-8">
                    <div className="text-lg font-medium text-gray-700 mb-2">Select Page</div>
                    <Select
                        isMulti
                        placeholder="Select Page"
                        className="rounded-xl w-full"
                        options={BANNER_PAGE_NAME}
                        getOptionValue={(option) => option.value}
                        getOptionLabel={(option) => option.name}
                        onChange={(val) => {
                            const values = val.map((item) => item.value)
                            setPageSectionsvalues(values.join(','))
                        }}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        className="rounded-full px-6 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 transition"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button className="rounded-full px-6 py-2 " variant="solid" onClick={onDialogOk}>
                        Save Changes
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default BulkEditModal
