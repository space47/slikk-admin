/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { purchaseOrderService } from '@/store/services/purchaseOrderService'
import { PurchaseOrderItem } from '@/store/types/po.types'
import { notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { IoMdAdd } from 'react-icons/io'
import { useOrderItemColumns } from './useOrderItemColumns'
import EasyTable from '@/common/EasyTable'
import PoOrderItemsDialog from './PoOrderItemsDialog'
import PoUpload from './PoUpload'
import { useParams } from 'react-router-dom'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import PageCommon from '@/common/PageCommon'

const PoOrderItems = () => {
    const { purchase_id } = useParams()
    const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [count, setCount] = useState(0)
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [uploadModal, setUploadModal] = useState(false)
    const [currentRow, setCurrentRow] = useState<PurchaseOrderItem>()
    const [addOrderItems, addResponse] = purchaseOrderService.useCreateOrderItemsMutation()
    const [updateOrderItems, updateResponse] = purchaseOrderService.useUpdateOrderItemsMutation()

    const { data, isSuccess, isError, error, refetch } = purchaseOrderService.useOrderItemsQuery(
        { purchase_order_id: purchase_id as string },
        { skip: !purchase_id },
    )

    useEffect(() => {
        if (isSuccess) {
            setOrderItems(data?.data?.results || [])
            setCount(data?.data?.count)
        }
        if (isError) {
            const errorMessage = getApiErrorMessage(error) || 'Failed to load items'
            notification.error({ message: errorMessage })
        }
    }, [isSuccess, isError, data, error])

    useEffect(() => {
        if (addResponse?.isSuccess) {
            notification.success({ message: 'Successfully Added' })
            refetch()
            setAddModal(false)
        }
        if (addResponse?.isError) {
            const errorMessage = getApiErrorMessage(addResponse?.error) || 'Failed to Add'
            notification.error({ message: errorMessage })
        }
    }, [addResponse?.isSuccess, addResponse?.isError, error])

    useEffect(() => {
        if (updateResponse?.isSuccess) {
            notification.success({ message: 'Successfully Updated' })
            refetch()
            setEditModal(false)
        }
        if (updateResponse?.isError) {
            const errorMessage = getApiErrorMessage(updateResponse?.error) || 'Failed to Update'
            notification.error({ message: errorMessage })
        }
    }, [updateResponse?.isSuccess, updateResponse?.isError, error])

    const handleEditRow = (row: PurchaseOrderItem) => {
        setCurrentRow(row)
        setEditModal(true)
    }

    const columns = useOrderItemColumns({ handleEditRow })

    const handleAdd = async (val: PurchaseOrderItem) => {
        addOrderItems(val)
    }
    const handleEdit = async (val: Partial<PurchaseOrderItem>) => {
        const body = { id: currentRow?.id, ...val }
        updateOrderItems(body)
    }

    if (!purchase_id) {
        return <NotFoundData />
    }

    return (
        <div>
            <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <h5>Line Items</h5>
                    <p>You can add items manually or upload excel</p>
                </div>

                <div className="flex gap-2 items-center">
                    <Button variant="default" size="sm" type="button" icon={<FiUpload />} onClick={() => setUploadModal(true)}>
                        Upload Excel
                    </Button>

                    <Button variant="blue" size="sm" type="button" icon={<IoMdAdd />} onClick={() => setAddModal(true)}>
                        Add Item
                    </Button>
                </div>
            </div>

            <div className="mt-10">
                <EasyTable noPage columns={columns} mainData={orderItems} />
                <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
            </div>

            <PoOrderItemsDialog isOpen={addModal} setIsOpen={setAddModal} handleSubmit={handleAdd} />

            <PoOrderItemsDialog edit isOpen={editModal} setIsOpen={setEditModal} currentRow={currentRow} handleSubmit={handleEdit} />

            {uploadModal && <PoUpload isOpen={uploadModal} setIsOpen={setUploadModal} purchase_id={purchase_id} />}
        </div>
    )
}

export default PoOrderItems
