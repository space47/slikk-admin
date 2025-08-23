/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, Input } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { IndentItem } from '@/store/types/indent.types'
import React, { useEffect, useState } from 'react'
import { notification } from 'antd'

interface Props {
    isOpen: boolean
    onClose: () => void
    rowData: IndentItem
    store_type?: string
    indent_number: string
}

const IndentUpdateModal = ({ isOpen, onClose, rowData, store_type, indent_number }: Props) => {
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (store_type === 'source') {
            setValue(rowData.quantity_accepted.toString())
        }
        if (store_type === 'target') {
            setValue(rowData.quantity_required.toString())
        }
    }, [])

    const handleUpdate = async () => {
        let body: Record<string, any> = {
            sku: rowData.sku,
            company: rowData.company,
        }

        if (store_type === 'source') {
            body = {
                ...body,
                quantity_accepted: Number(value),
            }
        }

        if (store_type === 'target') {
            body = {
                ...body,
                quantity_required: Number(value),
            }
        }

        try {
            setLoading(true)
            const res = await axiosInstance.patch(`/indent-note/${indent_number}`, body)
            notification.success({ message: res?.data?.data?.message || 'Indent updated successfully' })
            onClose()
        } catch (error: any) {
            console.error(error)
            notification.error({ message: error?.response?.data?.message || 'Failed to update indent' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="p-4 space-y-4">
                <h2 className="text-lg font-semibold">Update Indent</h2>
                <p className="text-sm text-gray-500">
                    Updating SKU <span className="font-medium">{rowData.sku}</span>
                </p>
                <div>{store_type === 'source' ? 'Quantity Accepted' : 'Quantity Required'}</div>
                <Input placeholder="Enter update value..." value={value} onChange={(e) => setValue(e.target.value)} />

                <div className="flex justify-end gap-2">
                    <Button variant="reject" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} variant="accept" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default IndentUpdateModal
