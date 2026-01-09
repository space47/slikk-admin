/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { rtvService } from '@/store/services/rtvService'
import { RTV_DATA_DETAILS, Rtv_Products } from '@/store/types/rtv.types'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRtvProductsColumn } from '../../rtvUtils/useRtvProductsColumns'
import PageCommon from '@/common/PageCommon'
import { Button, Input, Spinner, Tabs, Tooltip } from '@/components/ui'
import RtvAssignPicker from './RtvAssignPickers'
import { notification } from 'antd'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import RtvEditModal from './RtvEditModal'
import { FaSync, FaTimesCircle } from 'react-icons/fa'
import DialogConfirm from '@/common/DialogConfirm'
import { textParser } from '@/common/textParser'

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
    const [searchInput, setSearchInput] = useState('')
    const [isStatusConformation, setIsStatusConformation] = useState('')

    const { debounceFilter } = useDebounceInput({ globalFilter: searchInput, delay: 500 })

    const { data, isSuccess, isLoading, isFetching, refetch, isError } = rtvService.useRtvProductsQuery({
        rtv_id: rtv_number,
        page,
        pageSize,
        is_picked: tabValue,
        sku: debounceFilter || '',
    })
    const { data: rtv, isSuccess: rtvSuccess } = rtvService.useRtvDataQuery({ rtv_id: rtv_number })
    const [assignPicker, pickerResponse] = rtvService.useAssignRtvPickerMutation()
    const [createGdn, gdnResponse] = rtvService.useCreateGdnFromRtvMutation()
    const [currentRtvData, setCurrentRtvData] = useState<Rtv_Products>()
    const [showEditModal, setShowEditModal] = useState(false)
    const [updateRtv, updateResponse] = rtvService.useUpdateRtvMutation()

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

    useEffect(() => {
        if (updateResponse?.isSuccess) {
            notification.success({ message: updateResponse?.data?.message || 'Successfully Updated Rtv Number' })
        }
        if (updateResponse?.isError) {
            notification.error({ message: (updateResponse?.error as any)?.data?.message || 'Failed to Update Rtv Number' })
        }
    }, [updateResponse.isSuccess, updateResponse.isError])

    const handleAssign = async (actionType: string) => {
        const body = {
            action: 'assign_picker',
            pickers: selectedUsers?.filter((item) => item !== undefined),
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

    const handleEditProducts = (data: Rtv_Products) => {
        setCurrentRtvData(data)
        setShowEditModal(true)
    }

    const columns = useRtvProductsColumn({ handleEditProducts })

    const handleRtvGeneration = () => {
        updateRtv({
            id: rtv_number as string,
            action: 'add_rtv_number',
        })
    }

    const DetailsData = [
        { label: 'Company Name', value: rtvData?.company?.name || '-' },
        { label: 'Store Name', value: rtvData?.store?.name || '-' },
        { label: 'Document Number', value: rtvData?.document_number || '-' },
        { label: 'Document Date', value: rtvData?.document_date ? new Date(rtvData.document_date).toLocaleDateString() : '-' },
        { label: 'Origin Address', value: rtvData?.origin_address || '-' },
        { label: 'Destination Address', value: textParser(rtvData?.destination_address || '') || '-' },
        { label: 'Total SKUs', value: rtvData?.total_sku ?? 0 },
        { label: 'Total Quantity', value: rtvData?.total_quantity ?? 0 },
        { label: 'Quantity Picked', value: rtvData?.quantity_picked ?? 0 },
    ]

    const handleStatus = () => {}

    return (
        <div className="flex flex-col gap-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg">
            {rtvSuccess ? (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                            RTV Details
                        </h2>
                        <div>
                            <Button variant="new" size="sm" onClick={handleRtvGeneration}>
                                RTV Number Generation
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                        {DetailsData?.map((item, idx) => (
                            <div key={idx}>
                                <span className="font-medium text-gray-500 dark:text-gray-400">{item?.label}:</span>
                                <p className="text-gray-800 dark:text-gray-100">{item?.value || '-'}</p>
                            </div>
                        ))}
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
                    {data?.status !== 'approved' && (
                        <>
                            <Button
                                variant={data?.status === 'created' ? 'accept' : 'pending'}
                                size="sm"
                                onClick={() => setIsStatusConformation('forward')}
                            >
                                {data?.status === 'created' ? 'Approve' : 'Create'}
                            </Button>
                            <Button
                                variant="reject"
                                size="sm"
                                icon={<FaTimesCircle className="mr-1" />}
                                onClick={() => setIsStatusConformation('reject')}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    <Button size="sm" variant="twoTone" onClick={handleCreateGDN}>
                        {gdnResponse?.isLoading ? <Spinner size={20} color="blue" /> : 'Create GDN from RTV'}
                    </Button>
                </div>
            </div>
            {isError && <NotFoundData />}
            {isSuccess && (
                <div className="space-y-6">
                    <div className="flex w-1/2 items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-3 transition-all hover:shadow-md">
                        <Input
                            type="search"
                            value={searchInput}
                            placeholder="Search by SKU... "
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    {isLoading ||
                        (isFetching && (
                            <div className="flex items-center justify-center py-6">
                                <Spinner size={35} className="text-primary animate-spin" />
                            </div>
                        ))}

                    <div className="flex justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">RTV Items Details</h4>
                        <Tooltip title="Refresh table data">
                            <Button variant="gray" size="sm" icon={<FaSync />} onClick={() => refetch()}></Button>
                        </Tooltip>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <EasyTable overflow columns={columns} mainData={rtvProductsData} page={page} pageSize={pageSize} />
                    </div>
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
                </div>
            )}

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

            {showEditModal && (
                <RtvEditModal
                    isOPen={showEditModal}
                    rtvData={currentRtvData as Rtv_Products}
                    setIsOpen={setShowEditModal}
                    refetch={refetch}
                />
            )}
            {isStatusConformation === 'reject' && (
                <DialogConfirm
                    IsDelete
                    IsOpen={!!isStatusConformation}
                    closeDialog={() => setIsStatusConformation('')}
                    onDialogOk={handleStatus}
                />
            )}
            {isStatusConformation === 'forward' && (
                <DialogConfirm
                    label="Are you sure you want to change the status of this RTV"
                    headingName="Change Status"
                    isProceed
                    IsOpen={!!isStatusConformation}
                    closeDialog={() => setIsStatusConformation('')}
                    onDialogOk={handleStatus}
                />
            )}
        </div>
    )
}

export default RtvDetails
