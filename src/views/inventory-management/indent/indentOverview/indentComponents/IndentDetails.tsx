/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { IndentDetailsTypes, IndentItem } from '@/store/types/indent.types'
import { useItemsColumns } from '../../indentUtils/useItemsColumns'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import { Button } from '@/components/ui'
import AssignPicker from '@/common/AssignPicker'
import IndentUpdateModal from './IndentUpdateModal'
import { indentService } from '@/store/services/indentService'
import { DetailsData } from '../../indentUtils/indent.types'
import { BsFillPatchCheckFill } from 'react-icons/bs'
import DialogConfirm from '@/common/DialogConfirm'
import { useIndentFunctions } from '../../indentUtils/useIndentFunctions'

const IndentDetails = () => {
    const { id } = useParams()
    const [data, setData] = useState<IndentDetailsTypes | null>(null)
    const location = useLocation()
    const { store_type } = location.state || ''
    const [isPickerModal, setIsPickerModal] = useState(false)
    const [rowData, setRowData] = useState<IndentItem | null>(null)
    const [isEditModal, setIsEditModal] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [isStatusConformation, setIsStatusConformation] = useState('')
    const { data: detailResponseData, isLoading, error, isSuccess } = indentService.useIndentDetailsQuery({ id: id as string })

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
    })

    const { detailsArray } = DetailsData(data as IndentDetailsTypes)
    const columns = useItemsColumns({ handleUpdate, store_type })

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
        <div className="p-3 bg-white rounded-xl shadow-md border">
            <div className="flex justify-between items-center mb-6">
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Indent Details</h1>
                    <div className="flex gap-2">
                        <p className="text-gray-500 text-sm mt-1">
                            Indent Number: <span className="font-medium text-gray-700">{data?.intent_number}</span>
                        </p>
                        <div className="mb-6">
                            <span
                                className={`px-3 py-1 text-sm rounded-full font-medium  flex gap-2 items-center ${
                                    data?.status === 'approved'
                                        ? 'bg-green-100 text-green-700'
                                        : data?.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {data?.status === 'approved' && <BsFillPatchCheckFill className="text-green-500" />}
                                {data?.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Source Store</h2>
                    {data?.source_store ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>
                                {detailsArray?.slice(0, 4).map((detail) => (
                                    <div key={detail.label}>
                                        <span className="font-medium">{detail.label}:</span> {detail.value}
                                    </div>
                                ))}
                            </li>
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic">Not available</p>
                    )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Target Store</h2>
                    {data?.target_store ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>
                                {detailsArray?.slice(4).map((detail) => (
                                    <div key={detail.label}>
                                        <span className="font-medium">{detail.label}:</span> {detail.value}
                                    </div>
                                ))}
                            </li>
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic">Not available</p>
                    )}
                </div>
            </div>
            <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Notes</h2>
                <p className="text-sm text-gray-600">{data?.notes || 'No notes available.'}</p>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                {data?.source_store?.id ? (
                    <div>
                        <Button variant="new" size="sm" onClick={() => setIsPickerModal(true)}>
                            Assign Picker
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="text-gray-500 font-bold">No Store Assigned</div>
                    </>
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
                            Reject
                        </Button>
                    </>
                )}

                {/* <Button variant="new" size="sm">
                    Download
                </Button> */}
                <Button variant="new" size="sm" onClick={handleSyncToGDN}>
                    Sync To GDN
                </Button>
            </div>

            {data?.items && data.items.length > 0 ? (
                <div className="mt-10">
                    <h4 className="mb-4">Items Details</h4>
                    <EasyTable overflow noPage mainData={data?.items} columns={columns} />
                </div>
            ) : (
                <p className="text-gray-400 italic">No items available.</p>
            )}

            {isPickerModal && (
                <AssignPicker
                    isOpen={isPickerModal}
                    setIsOpen={setIsPickerModal}
                    store_id={data?.source_store.id as number}
                    handleAssign={handleAssign}
                    onChange={(selectedUsers) => {
                        setSelectedUsers(selectedUsers)
                    }}
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
                    store_type={store_type}
                    indent_number={data?.intent_number as string}
                    onClose={() => setIsEditModal(false)}
                />
            )}
        </div>
    )
}

export default IndentDetails
