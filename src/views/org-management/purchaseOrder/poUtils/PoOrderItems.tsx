/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { purchaseOrderService } from '@/store/services/purchaseOrderService'
import { PurchaseOrderItem } from '@/store/types/po.types'
import { notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { FiInbox, FiUpload } from 'react-icons/fi'
import { IoMdAdd } from 'react-icons/io'
import { useOrderItemColumns } from './useOrderItemColumns'
import EasyTable from '@/common/EasyTable'
import PoOrderItemsDialog from './PoOrderItemsDialog'
import PoUpload from './PoUpload'
import { useNavigate, useParams } from 'react-router-dom'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import PageCommon from '@/common/PageCommon'
import { FaEye } from 'react-icons/fa'
import { filterEmptyValues } from '@/utils/apiBodyUtility'

const PoOrderItems = () => {
    const { purchase_id } = useParams()
    const navigate = useNavigate()
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

    const { data, isSuccess, isError, error, isFetching, refetch } = purchaseOrderService.useOrderItemsQuery(
        { purchase_order_id: purchase_id as string, page, pageSize },
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
        const { comission_rate, ...rest } = val
        const commissionRate = typeof comission_rate === 'string' ? Number(comission_rate) : comission_rate
        const body = {
            purchase_order_id: Number(purchase_id),
            comission_rate: commissionRate ?? undefined,
            ...rest,
        }

        const filteredValue = filterEmptyValues(body)
        addOrderItems(filteredValue)
    }

    const handleEdit = async (val: Partial<PurchaseOrderItem>) => {
        const { comission_rate, ...rest } = val

        const commissionRate = typeof comission_rate === 'string' ? Number(comission_rate) || undefined : comission_rate

        const body = {
            id: currentRow?.id,
            comission_rate: commissionRate ?? undefined,
            ...rest,
        }

        const filteredValue = filterEmptyValues(body)

        updateOrderItems(filteredValue)
    }

    if (!purchase_id) {
        return <NotFoundData />
    }

    return (
        <div>
            <div className="flex justify-between">
                <div className="flex gap-2 flex-col items-start">
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
                    <Button variant="gray" size="sm" type="button" icon={<FaEye />} onClick={() => navigate(`/app/poCatalogHistory`)}>
                        View Catalog History
                    </Button>
                </div>
            </div>

            {orderItems.length > 0 && !isFetching ? (
                <div className="mt-10">
                    <EasyTable overflow noPage columns={columns} mainData={orderItems} />
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
                </div>
            ) : (
                <>
                    <div className="mt-16 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl p-12 bg-gray-50">
                        <div className="bg-blue-50 p-4 rounded-full mb-4">
                            <FiInbox className="text-red-500 text-3xl" />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>

                        <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
                            You haven’t added any items yet. You can upload an Excel file or manually add items to this purchase order.
                        </p>

                        <Button variant="blue" size="sm" icon={<FiUpload />} onClick={() => setUploadModal(true)}>
                            Upload Excel
                        </Button>
                    </div>
                </>
            )}

            <PoOrderItemsDialog isOpen={addModal} setIsOpen={setAddModal} handleSubmit={handleAdd} />

            <PoOrderItemsDialog edit isOpen={editModal} setIsOpen={setEditModal} currentRow={currentRow} handleSubmit={handleEdit} />

            {uploadModal && <PoUpload refetch={refetch} isOpen={uploadModal} setIsOpen={setUploadModal} purchase_id={purchase_id} />}
        </div>
    )
}

export default PoOrderItems
