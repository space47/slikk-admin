/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { rtvService } from '@/store/services/rtvService'
import { RTV_DATA_DETAILS, Rtv_Products } from '@/store/types/rtv.types'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRtvProductsColumn } from '../../rtvUtils/useRtvProductsColumns'
import PageCommon from '@/common/PageCommon'
import { Button, Input, Spinner, Tabs, Tooltip } from '@/components/ui'
import RtvAssignPicker from './RtvAssignPickers'
import { Modal, notification } from 'antd'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import RtvEditModal from './RtvEditModal'
import { FaCheckCircle, FaExclamationTriangle, FaSync, FaTimesCircle } from 'react-icons/fa'
import DialogConfirm from '@/common/DialogConfirm'
import { textParser } from '@/common/textParser'
import { ERtvDetail } from '../../rtvUtils/rtv.types'
import { BsFillPatchCheckFill } from 'react-icons/bs'

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
    const { data: rtv, isSuccess: rtvSuccess, refetch: dataRefetch } = rtvService.useRtvDataQuery({ rtv_id: rtv_number })
    const [assignPicker, pickerResponse] = rtvService.useAssignRtvPickerMutation()
    const [createGdn, gdnResponse] = rtvService.useCreateGdnFromRtvMutation()
    const [currentRtvData, setCurrentRtvData] = useState<Rtv_Products>()
    const [showEditModal, setShowEditModal] = useState(false)
    const [updateRtv, updateResponse] = rtvService.useUpdateRtvMutation()
    const [updateStatus, statusUpdateResponse] = rtvService.useUpdateRtvStatusMutation()

    const hasSyncedQuantity = useMemo(() => rtvProductsData?.some((item) => item.synced_quantity > 0), [rtvProductsData])

    useEffect(() => {
        if (isSuccess) {
            setRtvProductsData(data?.data?.results || [])
            setCount(data?.data?.count)
        }
    }, [isSuccess, data?.data])

    useEffect(() => {
        if (rtvSuccess) {
            setRtvData(rtv?.data as any)
        }
    }, [rtvSuccess, rtv?.data])

    useEffect(() => {
        if (pickerResponse?.isSuccess) {
            notification.success({ message: pickerResponse?.data?.message || 'Successfully Assigned' })
            setIsPickerModal(false)
            refetch()
            dataRefetch()
        }
        if (pickerResponse?.isError) {
            notification.error({ message: (pickerResponse?.error as any)?.data?.message || 'Failed to Assign' })
        }
    }, [pickerResponse.isSuccess, pickerResponse.isError])

    useEffect(() => {
        if (gdnResponse?.isSuccess) {
            notification.success({ message: gdnResponse?.data?.message || 'Successfully Created Gdn' })
            dataRefetch()
            refetch()
        }
        if (gdnResponse?.isError) {
            notification.error({ message: (gdnResponse?.error as any)?.data?.message || 'Failed to create Gdn' })
        }
    }, [gdnResponse.isSuccess, gdnResponse.isError])

    useEffect(() => {
        if (updateResponse?.isSuccess) {
            notification.success({ message: updateResponse?.data?.message || 'Successfully Updated Rtv Number' })
            dataRefetch()
            refetch()
        }
        if (updateResponse?.isError) {
            notification.error({ message: (updateResponse?.error as any)?.data?.message || 'Failed to Update Rtv Number' })
        }
    }, [updateResponse.isSuccess, updateResponse.isError])

    useEffect(() => {
        if (statusUpdateResponse?.isSuccess) {
            notification.success({ message: statusUpdateResponse?.data?.message || 'Successfully Updated Rtv Number Status' })
            setIsStatusConformation('')
            dataRefetch()
            refetch()
        }
        if (statusUpdateResponse?.isError) {
            if (statusUpdateResponse.originalArgs?.data.action === ERtvDetail.processed) {
                const resultData = (statusUpdateResponse?.error as any)?.data?.data
                Modal.confirm({
                    title: `${(statusUpdateResponse?.error as any)?.data?.message || 'Close the rtv'}`,
                    content: `Are you sure you close rtv with total Items ${resultData?.total_items_sum || '0'}, Total Picked:${resultData?.items_picked_sum || '0'} and total GDN Sum: ${resultData?.gdn_items_sum || '0'} `,
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk: () => {
                        const body = { action: ERtvDetail.processed, force_update: true }
                        updateStatus({ rtv_id: rtvData?.id as number, data: body })
                    },
                })
            }
            notification.error({ message: (statusUpdateResponse?.error as any)?.data?.message || 'Failed to Update Rtv Number Status' })
        }
    }, [statusUpdateResponse.isSuccess, statusUpdateResponse.isError])

    const handleAssign = async (actionType: string) => {
        const body = {
            action: ERtvDetail.assign_picker,
            pickers: selectedUsers?.filter((item) => item !== undefined),
            assign_action: actionType,
        }
        assignPicker({ id: rtv_number as any, ...body })
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
        updateRtv({ id: rtv_number as string, action: ERtvDetail.add_rtv_number })
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

    const handleStatus = async () => {
        const body = { action: isStatusConformation }
        updateStatus({ rtv_id: rtvData?.id as number, data: body })
    }

    return (
        <div className="flex flex-col gap-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg">
            {rtvSuccess ? (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 ">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 pb-2">RTV Details</h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-medium">Rtv Number:</span>
                                        <span className="ml-2 font-semibold text-gray-800">{rtvData?.rtv_number}</span>
                                    </p>
                                </div>
                                <div>
                                    <span
                                        className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                                            rtvData?.status === 'approved'
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : rtvData?.status === 'pending'
                                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}
                                    >
                                        {rtvData?.status === 'approved' && <FaCheckCircle className="text-green-600" />}
                                        {rtvData?.status === 'pending' && <FaExclamationTriangle className="text-yellow-600" />}
                                        {rtvData?.status === 'created' && <BsFillPatchCheckFill className="text-gray-500" />}
                                        {rtvData?.status}
                                    </span>
                                </div>
                            </div>
                        </div>
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
                    {rtvData?.status === 'draft' && (
                        <>
                            <Button variant="accept" size="sm" onClick={() => setIsStatusConformation(ERtvDetail.created)}>
                                Create
                            </Button>

                            <Button
                                variant="reject"
                                size="sm"
                                icon={<FaTimesCircle className="mr-1" />}
                                onClick={() => setIsStatusConformation(ERtvDetail.rejected)}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {rtvData?.status === 'created' && (
                        <>
                            <Button size="sm" variant="twoTone" onClick={() => setIsPickerModal(true)}>
                                Add Picker
                            </Button>

                            <Button size="sm" variant="twoTone" onClick={handleCreateGDN}>
                                {gdnResponse?.isLoading ? <Spinner size={20} /> : 'Sync to GDN'}
                            </Button>

                            {!hasSyncedQuantity && (
                                <Button
                                    variant="reject"
                                    size="sm"
                                    icon={<FaTimesCircle />}
                                    onClick={() => setIsStatusConformation(ERtvDetail.rejected)}
                                >
                                    Reject
                                </Button>
                            )}
                        </>
                    )}
                    {rtvData?.status === 'approved' && (
                        <>
                            <Button size="sm" variant="twoTone" onClick={handleCreateGDN}>
                                {gdnResponse?.isLoading ? <Spinner size={20} /> : 'Sync to GDN'}
                            </Button>

                            <Button size="sm" variant="new" onClick={() => setIsStatusConformation(ERtvDetail.processed)}>
                                Close RTV
                            </Button>

                            <Button size="sm" variant="twoTone" onClick={() => setIsPickerModal(true)}>
                                Add Picker
                            </Button>
                        </>
                    )}
                </div>
            </div>
            {isError && <NotFoundData />}
            {(isSuccess || isLoading) && (
                <div className="space-y-6">
                    <div className="flex w-1/2 items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-3 transition-all hover:shadow-md">
                        <Input
                            type="search"
                            value={searchInput}
                            placeholder="Search by SKU... "
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    {(isLoading || isFetching) && (
                        <div className="flex items-center justify-center py-6">
                            <Spinner size={35} className="text-primary animate-spin" />
                        </div>
                    )}

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
            {isStatusConformation === ERtvDetail.rejected && (
                <DialogConfirm
                    IsDelete
                    IsOpen={!!isStatusConformation}
                    closeDialog={() => setIsStatusConformation('')}
                    onDialogOk={handleStatus}
                />
            )}
            {isStatusConformation === ERtvDetail.created && (
                <DialogConfirm
                    isProceed
                    label="Are you sure you want to change the status of this RTV"
                    headingName="Change Status"
                    IsOpen={!!isStatusConformation}
                    closeDialog={() => setIsStatusConformation('')}
                    onDialogOk={handleStatus}
                />
            )}
            {isStatusConformation === ERtvDetail.processed && (
                <DialogConfirm
                    isProceed
                    label="Are you sure you want to close this rtv"
                    headingName="Close rtv"
                    IsOpen={!!isStatusConformation}
                    closeDialog={() => setIsStatusConformation('')}
                    onDialogOk={handleStatus}
                />
            )}
        </div>
    )
}

export default RtvDetails
