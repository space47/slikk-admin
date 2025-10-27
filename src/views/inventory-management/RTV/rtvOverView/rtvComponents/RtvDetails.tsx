/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { rtvService } from '@/store/services/rtvService'
import { Rtv_Products } from '@/store/types/rtv.types'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRtvProductsColumn } from '../../rtvUtils/useRtvProductsColumns'
import PageCommon from '@/common/PageCommon'
import LoadingSpinner from '@/common/LoadingSpinner'
import { Button, Tabs } from '@/components/ui'
import RtvAssignPicker from './RtvAssignPickers'
import { notification } from 'antd'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'

const RtvDetails = () => {
    const { rtv_number } = useParams()
    const [rtvProductsData, setRtvProductsData] = useState<Rtv_Products[]>([])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [isPickerModal, setIsPickerModal] = useState(false)
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [tabValue, setTabValue] = useState('false')
    const { data, isSuccess, isLoading, refetch } = rtvService.useRtvProductsQuery({
        rtv_id: rtv_number,
        page,
        pageSize,
        is_picked: tabValue,
    })
    const [assignPicker, pickerResponse] = rtvService.useAssignRtvPickerMutation()
    const [createGdn, gdnResponse] = rtvService.useCreateGdnFromRtvMutation()

    useEffect(() => {
        if (isSuccess) {
            setRtvProductsData(data?.data?.results || [])
            setCount(data?.data?.count)
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (pickerResponse?.isSuccess) {
            notification.success({ message: pickerResponse?.data?.message || 'Successfully Assigned' })
            refetch()
        }
        if (pickerResponse?.isError) {
            notification.error({ message: (pickerResponse?.error as any)?.data?.message || 'Failed to Assign' })
        }
    }, [pickerResponse.isSuccess, pickerResponse.isError])

    useEffect(() => {
        if (gdnResponse?.isSuccess) {
            notification.success({ message: gdnResponse?.data?.message || 'Successfully Created Gdn' })
        }
        if (gdnResponse?.isError) {
            notification.error({ message: (gdnResponse?.error as any)?.data?.message || 'Failed to create Gdn' })
        }
    }, [gdnResponse.isSuccess, gdnResponse.isError])

    const handleAssign = async (actionType: string) => {
        const body = {
            action: 'assign_pickers',
            pickers: selectedUsers,
            assign_action: actionType,
        }
        assignPicker({
            id: rtv_number as any,
            ...body,
        })
    }

    const handleCreateGDN = () => {
        const idToSend = typeof rtv_number === 'number' ? rtv_number : parseInt(rtv_number || '')
        createGdn({ id: idToSend })
    }

    const columns = useRtvProductsColumn()

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
            <div className="w-full">
                <Tabs defaultValue="active" className="flex flex-col" value={tabValue} onChange={(value) => setTabValue(value)}>
                    <TabList className="flex gap-6 border-b border-gray-200">
                        <TabNav
                            value="false"
                            className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:border-blue-500 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                        >
                            Active
                        </TabNav>
                        <TabNav
                            value="true"
                            className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:border-blue-500 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                        >
                            Completed
                        </TabNav>
                    </TabList>
                </Tabs>
            </div>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">RTV Product List</h2>
                <div className="flex gap-3">
                    <Button size="sm" variant="twoTone" onClick={() => setIsPickerModal(true)}>
                        Add Picker
                    </Button>
                    <Button size="sm" variant="twoTone" onClick={handleCreateGDN}>
                        Create GDN from RTV
                    </Button>
                </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                <EasyTable overflow columns={columns} mainData={rtvProductsData} page={page} pageSize={pageSize} />
            </div>
            <div className="flex justify-end">
                <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
            </div>

            {isPickerModal && (
                <RtvAssignPicker
                    isOpen={isPickerModal}
                    setIsOpen={setIsPickerModal}
                    selectedPickers={rtvProductsData?.map((item) => item.picker) || []}
                    handleAssign={handleAssign}
                    onChange={(selectedUsers) => {
                        setSelectedUsers(selectedUsers)
                    }}
                />
            )}
        </div>
    )
}

export default RtvDetails
