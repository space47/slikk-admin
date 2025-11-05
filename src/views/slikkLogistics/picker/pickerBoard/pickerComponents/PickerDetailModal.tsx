import { useEffect, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import { pickerService } from '@/store/services/pickerServices'
import { particularPickerType } from '@/store/types/picker.types'
import { usePickerDetailsColumns } from '../../pickerUtils/usePickerDetailsColumns'
import EasyTable from '@/common/EasyTable'
import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    mobile: string
    from?: string
    to?: string
}

const PickerDetailModal = ({ dialogIsOpen, setIsOpen, mobile }: props) => {
    const [pickerDetailsData, setPickerDetailsData] = useState<particularPickerType>()
    const [activeTab, setActiveTab] = useState<string>('pending')
    const { data, isSuccess } = pickerService.usePickerDetailsDataQuery({ mobile, status: activeTab?.toUpperCase() })

    useEffect(() => {
        if (isSuccess && data) {
            setPickerDetailsData(data)
        }
    }, [isSuccess, data])

    const profile = pickerDetailsData?.profile
    const counts = pickerDetailsData?.order_counts
    const orders = pickerDetailsData?.data || []

    const columns = usePickerDetailsColumns()

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)} width={900}>
                <div className="flex flex-col w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="p-6 bg-gray-50 space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 text-center">Picker Profile</h2>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span className="font-medium">First Name:</span> {profile?.first_name}
                            </div>
                            <div>
                                <span className="font-medium">Last Name:</span> {profile?.last_name}
                            </div>
                            <div>
                                <span className="font-medium">Email:</span> {profile?.email}
                            </div>
                            <div>
                                <span className="font-medium">Mobile:</span> {profile?.mobile}
                            </div>
                            <div>
                                <span className="font-medium">Checked In:</span>{' '}
                                <span className={profile?.checked_in_status ? 'text-green-600 font-semibold' : 'text-red-600'}>
                                    {profile?.checked_in_status ? '✅' : '❌'}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Counts</h3>
                            <div className="flex justify-between text-sm text-gray-700">
                                <div>
                                    <span className="font-medium">Pending:</span> {counts?.pending}
                                </div>
                                <div>
                                    <span className="font-medium">Picked:</span> {counts?.picked}
                                </div>
                                <div>
                                    <span className="font-medium">Total:</span> {counts?.total}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue={'pending'} onChange={(val) => setActiveTab(val)}>
                        <TabList>
                            <TabNav value="pending" className={`text-xl ${activeTab === 'pending' ? ' border-b-2 border-green-500' : ''} `}>
                                Pending
                            </TabNav>
                            <TabNav value="packed" className={`text-xl ${activeTab === 'packed' ? ' border-b-2 border-green-500' : ''} `}>
                                Packed
                            </TabNav>
                        </TabList>
                    </Tabs>
                    <div className="flex-1 overflow-y-auto px-4 pb-4 mt-4">
                        <EasyTable noPage overflow mainData={orders} columns={columns} />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default PickerDetailModal
