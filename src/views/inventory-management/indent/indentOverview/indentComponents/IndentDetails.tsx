/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { IndentDetailsTypes, IndentItem } from '@/store/types/indent.types'
import { useItemsColumns } from '../../indentUtils/useItemsColumns'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import { Button } from '@/components/ui'
import AssignPicker from '@/common/AssignPicker'
import IndentUpdateModal from './IndentUpdateModal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'

const IndentDetails: React.FC = () => {
    const { id } = useParams()
    const location = useLocation()
    const { store_type } = location.state || ''
    const query = useMemo(() => `/indent?id=${id}`, [id])
    const [isPickerModal, setIsPickerModal] = useState(false)
    const [rowData, setRowData] = useState<IndentItem | null>(null)
    const [isEditModal, setIsEditModal] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    console.log('store type in details', store_type)

    const { data, loading, responseStatus } = useFetchSingleData<IndentDetailsTypes>({ url: query })

    const handleUpdate = (row: IndentItem) => {
        setIsEditModal(true)
        setRowData(row as any)
    }

    const handleAssign = async () => {
        console.log('Selected Users:', selectedUsers)
        const body = {
            action: 'assign_pickers',
            pickers: selectedUsers,
            indent_number: data?.intent_number,
        }
        try {
            const response = await axioisInstance.patch('/indent', body)
            notification.success({ message: response?.data?.data?.message || 'Pickers assigned successfully' })
            setIsPickerModal(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Error assigning pickers' })
            }
            console.error('Error assigning pickers:', error)
        }
    }

    const columns = useItemsColumns({ handleUpdate, store_type })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 animate-pulse">Loading indent details…</p>
            </div>
        )
    }

    if (responseStatus === 403) {
        return <AccessDenied />
    }

    return (
        <div className="p-3 bg-white rounded-xl shadow-md border">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Indent Details</h1>
                    <p className="text-gray-500 text-sm">
                        Indent Number: <span className="font-medium text-gray-700">{data?.intent_number}</span>
                    </p>
                </div>

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
            </div>

            {/* Status */}
            <div className="mb-6">
                <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                        data?.status === 'fulfilled'
                            ? 'bg-green-100 text-green-700'
                            : data?.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {data?.status}
                </span>
            </div>

            {/* Store Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Store */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Source Store</h2>
                    {data?.source_store ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>
                                <span className="font-medium">ID:</span> {data?.source_store.id}
                            </li>
                            <li>
                                <span className="font-medium">Code:</span> {data?.source_store.code}
                            </li>
                            <li>
                                <span className="font-medium">Name:</span> {data?.source_store.name}
                            </li>
                            <li>
                                <span className="font-medium">Fulfillment Center:</span>{' '}
                                {data?.source_store.is_fulfillment_center ? 'Yes' : 'No'}
                            </li>
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic">Not available</p>
                    )}
                </div>

                {/* Target Store */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Target Store</h2>
                    {data?.target_store ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>
                                <span className="font-medium">ID:</span> {data?.target_store.id}
                            </li>
                            <li>
                                <span className="font-medium">Code:</span> {data?.target_store.code}
                            </li>
                            <li>
                                <span className="font-medium">Name:</span> {data?.target_store.name}
                            </li>
                            <li>
                                <span className="font-medium">Fulfillment Center:</span>{' '}
                                {data?.target_store.is_fulfillment_center ? 'Yes' : 'No'}
                            </li>
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic">Not available</p>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Notes</h2>
                <p className="text-sm text-gray-600">{data?.notes || 'No notes available.'}</p>
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
                    onChange={(selectedUsers) => {
                        setSelectedUsers(selectedUsers)
                    }}
                    handleAssign={handleAssign}
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
