/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { IndentDetailsTypes, IndentItem } from '@/store/types/indent.types'
import { useItemsColumns, useItemsPickerColumns } from '../../indentUtils/useItemsColumns'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import { Button, Input, Tabs } from '@/components/ui'
import AssignPicker from '@/common/AssignPicker'
import IndentUpdateModal from './IndentUpdateModal'
import { indentService } from '@/store/services/indentService'
import { DetailsData } from '../../indentUtils/indent.types'
import DialogConfirm from '@/common/DialogConfirm'
import { useIndentFunctions } from '../../indentUtils/useIndentFunctions'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabList from '@/components/ui/Tabs/TabList'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { FaStore, FaClipboardList, FaSync, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa'
import { BsFillPatchCheckFill, BsBoxSeam } from 'react-icons/bs'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { MdOutlineInventory } from 'react-icons/md'

const IndentDetails = () => {
    const { id } = useParams()
    const [data, setData] = useState<IndentDetailsTypes | null>(null)
    const location = useLocation()
    const { store_type } = location.state || ''
    const [isPickerModal, setIsPickerModal] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [rowData, setRowData] = useState<IndentItem | null>(null)
    const [isEditModal, setIsEditModal] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [isStatusConformation, setIsStatusConformation] = useState('')
    const [tabValue, setTabValue] = useState('false')
    const [searchInput, setSearchInput] = useState('')

    const { debounceFilter } = useDebounceInput({ globalFilter: searchInput, delay: 500 })

    const {
        data: detailResponseData,
        isLoading,
        error,
        isSuccess,
        refetch,
    } = indentService.useIndentDetailsQuery({ id: id as string, is_picked: tabValue, sku: debounceFilter || '' })

    useEffect(() => {
        if (isSuccess) {
            setData(detailResponseData?.data || null)
        }
    }, [isSuccess, detailResponseData])

    const handleUpdate = (row: IndentItem) => {
        setIsEditModal(true)
        setRowData(row as any)
    }

    const { handleAssign, handleStatus, handleSyncToGDN } = useIndentFunctions({
        selectedUsers,
        setIsPickerModal,
        data,
        isStatusConformation,
        setIsStatusConformation,
        refetch,
        setIsSyncing,
    })

    const { detailsArray } = DetailsData(data as IndentDetailsTypes)
    const columns = useItemsColumns({ handleUpdate, store_type, data: data as IndentDetailsTypes })
    const pickerColumns = useItemsPickerColumns()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 animate-pulse">Loading indent details…</p>
            </div>
        )
    }

    if ((error && 'status' in error && (error.status === 403 || error.status === 401)) || (!isLoading && !data)) {
        return <AccessDenied />
    }

    return (
        <div className=" bg-gray-50 min-h-screen">
            <div className="">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <HiOutlineDocumentText className="text-blue-600 text-xl" />
                                    <h1 className="text-2xl font-bold text-gray-900">Indent Details</h1>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">Indent Number:</span>
                                            <span className="ml-2 font-semibold text-gray-800">{data?.intent_number}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <span
                                            className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                                                data?.status === 'approved'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : data?.status === 'pending'
                                                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                        >
                                            {data?.status === 'approved' && <FaCheckCircle className="text-green-600" />}
                                            {data?.status === 'pending' && <FaExclamationTriangle className="text-yellow-600" />}
                                            {data?.status === 'created' && <BsFillPatchCheckFill className="text-gray-500" />}
                                            {data?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Source Store */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaStore className="text-blue-500" />
                                    <h2 className="text-lg font-semibold text-gray-800">Source Store</h2>
                                </div>
                                {data?.source_store ? (
                                    <div className="text-sm text-gray-600 space-y-3">
                                        {detailsArray?.slice(0, 4).map((detail) => (
                                            <div key={detail.label} className="flex justify-between">
                                                <span className="font-medium text-gray-700">{detail.label}:</span>
                                                <span className="text-gray-800">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">Not available</p>
                                )}
                            </div>

                            {/* Target Store */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <BsBoxSeam className="text-green-500" />
                                    <h2 className="text-lg font-semibold text-gray-800">Target Store</h2>
                                </div>
                                {data?.target_store ? (
                                    <div className="text-sm text-gray-600 space-y-3">
                                        {detailsArray?.slice(4).map((detail) => (
                                            <div key={detail.label} className="flex justify-between">
                                                <span className="font-medium text-gray-700">{detail.label}:</span>
                                                <span className="text-gray-800">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">Not available</p>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <FaClipboardList className="text-purple-500" />
                                <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
                            </div>
                            <p className="text-sm text-gray-600">{data?.notes || 'No notes available.'}</p>
                        </div>

                        {/* Picker Details */}
                        <div className="mb-6">
                            {data?.picker_items && data?.picker_items.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Picker Packing Details</h4>
                                    <EasyTable overflow noPage mainData={data?.picker_items} columns={pickerColumns} />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-end gap-3 mb-8">
                            {data?.source_store?.id ? (
                                <div>
                                    <Button variant="new" size="sm" onClick={() => setIsPickerModal(true)}>
                                        Assign Picker
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-gray-500 font-medium flex items-center gap-2">
                                    <FaExclamationTriangle />
                                    No Store Assigned
                                </div>
                            )}
                            {data?.status !== 'approved' && (
                                <>
                                    <Button
                                        variant={data?.status === 'created' ? 'accept' : 'pending'}
                                        size="sm"
                                        onClick={() => setIsStatusConformation('forward')}
                                    >
                                        {data?.status === 'created' ? 'Approve' : 'Create'}
                                    </Button>
                                    <Button variant="reject" size="sm" onClick={() => setIsStatusConformation('reject')}>
                                        <FaTimesCircle className="mr-1" />
                                        Reject
                                    </Button>
                                </>
                            )}

                            <Button
                                variant="new"
                                size="sm"
                                icon={<FaSync />}
                                loading={isSyncing}
                                disabled={isSyncing}
                                onClick={handleSyncToGDN}
                            >
                                Sync To GDN
                            </Button>
                        </div>
                        <div className="w-full mb-6">
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
                                    <TabNav
                                        value="true"
                                        className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:border-blue-500 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                                    >
                                        Force Completed
                                    </TabNav>
                                </TabList>
                            </Tabs>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <MdOutlineInventory className="text-blue-600" />
                                    <span className="font-medium">Total quantity Required:</span>
                                </div>
                                <span className="font-bold text-lg text-gray-800">
                                    {data?.items?.reduce((acc, item) => acc + item.quantity_required, 0)}
                                </span>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaCheckCircle className="text-green-600" />
                                    <span className="font-medium">Quantity Accepted:</span>
                                </div>
                                <span className="font-bold text-lg text-gray-800">
                                    {data?.items?.reduce((acc, item) => acc + item.quantity_accepted, 0)}
                                </span>
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative w-full md:w-1/2 shadow-md p-4">
                                    <Input
                                        type="search"
                                        value={searchInput}
                                        placeholder="Search by SKU... "
                                        className=" w-full rounded-lg"
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            {data?.items && data.items?.length > 0 ? (
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Items Details</h4>
                                    <EasyTable overflow noPage mainData={data?.items} columns={columns} />
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MdOutlineInventory className="text-4xl text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-400 italic">No items available.</p>
                                </div>
                            )}
                        </div>
                        {tabValue === 'true' && data?.items && data?.items?.length > 0 ? (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Picked Items</h4>
                                <EasyTable
                                    overflow
                                    noPage
                                    mainData={data?.items?.filter((item) => item?.quantity_accepted < item?.quantity_required)}
                                    columns={columns}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            {isPickerModal && (
                <AssignPicker
                    isOpen={isPickerModal}
                    setIsOpen={setIsPickerModal}
                    store_id={data?.source_store.id as number}
                    handleAssign={handleAssign}
                    onChange={(selectedUsers) => {
                        setSelectedUsers(selectedUsers)
                    }}
                    selectedPickers={data?.picker_items?.map((item) => item.picker) || []}
                />
            )}
            {isStatusConformation === 'forward' && (
                <DialogConfirm
                    IsConfirm
                    IsOpen={!!isStatusConformation}
                    closeDialog={() => setIsStatusConformation('')}
                    onDialogOk={handleStatus}
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
            {isEditModal && (
                <IndentUpdateModal
                    isOpen={isEditModal}
                    rowData={rowData as IndentItem}
                    status={data?.status}
                    refetch={refetch}
                    indent_number={data?.intent_number as string}
                    onClose={() => setIsEditModal(false)}
                />
            )}
        </div>
    )
}

export default IndentDetails
