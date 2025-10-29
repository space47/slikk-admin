/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { rtvService } from '@/store/services/rtvService'
import { RTV_DATA_DETAILS, Rtv_Products } from '@/store/types/rtv.types'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRtvProductsColumn } from '../../rtvUtils/useRtvProductsColumns'
import PageCommon from '@/common/PageCommon'
import LoadingSpinner from '@/common/LoadingSpinner'
import { Button, Spinner, Tabs } from '@/components/ui'
import RtvAssignPicker from './RtvAssignPickers'
import { notification } from 'antd'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import NotFoundData from '@/views/pages/NotFound/Notfound'

const RtvDetails = () => {
    const { rtv_number } = useParams()
    const [rtvData, setRtvData] = useState<RTV_DATA_DETAILS>()
    const [rtvProductsData, setRtvProductsData] = useState<Rtv_Products[]>([])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [isPickerModal, setIsPickerModal] = useState(false)
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [tabValue, setTabValue] = useState('false')
    const { data, isSuccess, isLoading, refetch, isError } = rtvService.useRtvProductsQuery({
        rtv_id: rtv_number,
        page,
        pageSize,
        is_picked: tabValue,
    })
    const { data: rtv, isSuccess: rtvSuccess } = rtvService.useRtvDataQuery({ rtv_id: rtv_number })
    const [assignPicker, pickerResponse] = rtvService.useAssignRtvPickerMutation()
    const [createGdn, gdnResponse] = rtvService.useCreateGdnFromRtvMutation()

    useEffect(() => {
        if (isSuccess) {
            setRtvProductsData(data?.data?.results || [])
            setCount(data?.data?.count)
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (rtvSuccess) {
            setRtvData(rtv?.data as any)
        }
    }, [rtvSuccess, rtv])

    useEffect(() => {
        if (pickerResponse?.isSuccess) {
            notification.success({ message: pickerResponse?.data?.message || 'Successfully Assigned' })
            setIsPickerModal(false)
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
            action: 'assign_picker',
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
        <div className="flex flex-col gap-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg">
            {rtvSuccess ? (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        RTV Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Company Name:</span>
                            <p className="text-gray-800 dark:text-gray-100">{rtvData?.company?.name || '-'}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Store Name:</span>
                            <p className="text-gray-800 dark:text-gray-100">{rtvData?.store?.name || '-'}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Document Number:</span>
                            <p className="text-gray-800 dark:text-gray-100">{rtvData?.document_number || '-'}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Document Date:</span>
                            <p className="text-gray-800 dark:text-gray-100">
                                {rtvData?.document_date ? new Date(rtvData.document_date).toLocaleDateString() : '-'}
                            </p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Origin Address:</span>
                            <p className="text-gray-800 dark:text-gray-100">{rtvData?.origin_address || '-'}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Destination Address:</span>
                            <p className="text-gray-800 dark:text-gray-100">{rtvData?.destination_address || '-'}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Total SKUs:</span>
                            <p className="text-gray-800 dark:text-gray-100">{rtvData?.total_sku ?? 0}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Total Quantity:</span>
                            <p className="text-gray-800 dark:text-gray-100">{rtvData?.total_quantity ?? 0}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">Quantity Picked:</span>
                            <p className="text-gray-800 dark:text-gray-100">{rtvData?.quantity_picked ?? 0}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center font-bold">No Data for Particular RTV</div>
            )}

            <div className="w-full">
                <Tabs defaultValue="active" className="flex flex-col" value={tabValue} onChange={(value) => setTabValue(value)}>
                    <TabList className="flex gap-8 border-b border-gray-200 dark:border-gray-700">
                        <TabNav
                            value="false"
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-500 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                        >
                            Active
                        </TabNav>
                        <TabNav
                            value="true"
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-500 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                        >
                            Completed
                        </TabNav>
                    </TabList>
                </Tabs>
            </div>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">RTV Product List</h2>
                <div className="flex gap-3">
                    <Button
                        size="sm"
                        variant="twoTone"
                        onClick={() => setIsPickerModal(true)}
                        className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 hover:bg-blue-100"
                    >
                        Add Picker
                    </Button>
                    <Button size="sm" variant="twoTone" onClick={handleCreateGDN}>
                        {gdnResponse?.isLoading ? <Spinner size={20} color="blue" /> : 'Create GDN from RTV'}
                    </Button>
                </div>
            </div>
            {isError && <NotFoundData />}
            {isSuccess && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                    <EasyTable overflow columns={columns} mainData={rtvProductsData} page={page} pageSize={pageSize} />
                </div>
            )}
            <>
                <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
            </>
            {isPickerModal && (
                <RtvAssignPicker
                    isOpen={isPickerModal}
                    setIsOpen={setIsPickerModal}
                    selectedPickers={rtvProductsData?.map((item) => item.picker) || []}
                    store_id={rtvData?.store?.id as number}
                    handleAssign={handleAssign}
                    onChange={(selectedUsers) => setSelectedUsers(selectedUsers)}
                />
            )}
        </div>
    )
}

export default RtvDetails
