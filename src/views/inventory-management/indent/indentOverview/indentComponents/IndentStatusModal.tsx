/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Spinner } from '@/components/ui'
import { indentService } from '@/store/services/indentService'
import { IndentDetailsTypes } from '@/store/types/indent.types'
import React, { useEffect, useState } from 'react'
import { useItemsPickerColumns } from '../../indentUtils/useItemsColumns'
import EasyTable from '@/common/EasyTable'

interface Props {
    isOpen: boolean
    onClose: () => void
    id: string | number | null
}

const IndentStatusModal = ({ isOpen, onClose, id }: Props) => {
    const [indentDetails, setIndentDetails] = useState<IndentDetailsTypes>()

    const { data: detailResponseData, isLoading, isSuccess } = indentService.useIndentDetailsQuery({ id: id as string, is_picked: 'true' })

    useEffect(() => {
        if (isSuccess) {
            setIndentDetails(detailResponseData?.data)
        }
    }, [isSuccess, detailResponseData])

    const pickerColumns = useItemsPickerColumns()

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={800} height={600}>
            {isLoading ? (
                <Spinner size={30} />
            ) : (
                <div className="p-6 bg-gray-50 rounded-xl flex flex-col h-full overflow-y-scroll">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white shadow-md rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Total Items</p>
                            <p className="text-2xl font-bold text-gray-800">{indentDetails?.total_items ?? 0}</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">Items Picked</p>
                            <p className="text-2xl font-bold text-green-600">{indentDetails?.items_picked ?? 0}</p>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Picker Details</h2>
                    <div className="bg-white shadow-md rounded-lg flex-1 min-h-0 overflow-hidden">
                        <EasyTable noPage overflow columns={pickerColumns} mainData={indentDetails?.picker_items || []} />
                    </div>
                </div>
            )}
        </Dialog>
    )
}

export default IndentStatusModal
