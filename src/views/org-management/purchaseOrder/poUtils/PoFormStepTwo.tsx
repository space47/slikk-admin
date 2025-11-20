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
import { AxiosError } from 'axios'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { successMessage } from '@/utils/responseMessages'
import PoUpload from './PoUpload'

interface Props {
    isEdit?: boolean
    purchase_id?: string | number
}

const PoFormStepTwo = ({ isEdit, purchase_id }: Props) => {
    const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([])
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [uploadModal, setUploadModal] = useState(false)
    const [currentRow, setCurrentRow] = useState<PurchaseOrderItem>()

    const { data, isSuccess, isError, error, refetch } = purchaseOrderService.useOrderItemsQuery(
        { purchase_order_id: purchase_id as string },
        { skip: !isEdit },
    )

    useEffect(() => {
        if (isSuccess && isEdit) {
            setOrderItems(data?.data || [])
        }
        if (isError) {
            const errorMessage = getApiErrorMessage(error) || 'Failed to load items'
            notification.error({ message: errorMessage })
        }
    }, [isSuccess, isError, isEdit, data, error])

    const handleEditRow = (row: PurchaseOrderItem) => {
        setCurrentRow(row)
        setEditModal(true)
    }

    const columns = useOrderItemColumns({ handleEditRow })

    /** ---------- Add Item ---------- **/
    const handleAdd = async (val: PurchaseOrderItem) => {
        try {
            const res = await axioisInstance.post(`/merchant/purchase/orderitem`, val)
            const newItem = res?.data?.data
            successMessage(res)

            if (isEdit) {
                refetch()
            } else {
                setOrderItems((prev) => [...prev, newItem])
            }

            setAddModal(false)
        } catch (err) {
            if (err instanceof AxiosError) {
                notification.error({ message: err.message })
            }
        }
    }
    const handleEdit = async (val: Partial<PurchaseOrderItem>) => {
        const body = { id: currentRow?.id, ...val }

        try {
            const res = await axioisInstance.patch(`/merchant/purchase/orderitem`, body)
            successMessage(res)

            if (isEdit) {
                refetch()
            } else {
                setOrderItems((prev) => prev.map((item) => (item.id === body.id ? { ...item, ...val } : item)))
            }

            setEditModal(false)
        } catch (err) {
            if (err instanceof AxiosError) {
                notification.error({ message: err.message })
            }
        }
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
            </div>

            {addModal && <PoOrderItemsDialog isOpen={addModal} setIsOpen={setAddModal} handleSubmit={handleAdd} />}

            {editModal && (
                <PoOrderItemsDialog isOpen={editModal} setIsOpen={setEditModal} currentRow={currentRow} handleSubmit={handleEdit} />
            )}
            {uploadModal && <PoUpload isOpen={uploadModal} setIsOpen={setUploadModal} />}
        </div>
    )
}

export default PoFormStepTwo
