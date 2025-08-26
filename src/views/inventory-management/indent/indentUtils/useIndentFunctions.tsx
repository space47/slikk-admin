import { IndentDetailsTypes } from '@/store/types/indent.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface props {
    selectedUsers: string[]
    setIsPickerModal: React.Dispatch<React.SetStateAction<boolean>>
    data: IndentDetailsTypes | null
    isStatusConformation: string
    setIsStatusConformation: React.Dispatch<React.SetStateAction<string>>
}

export const useIndentFunctions = ({ selectedUsers, setIsPickerModal, data, isStatusConformation, setIsStatusConformation }: props) => {
    const navigate = useNavigate()
    const handleAssign = async () => {
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

    const handleStatus = async () => {
        let action = data?.status === 'created' ? 'status_approved' : 'status_created'
        if (isStatusConformation === 'reject') {
            action = 'status_rejected'
        }
        const body = {
            action,
            indent_number: data?.intent_number,
        }
        try {
            const response = await axioisInstance.patch('/indent', body)
            notification.success({ message: response?.data?.data?.message || 'Status updated successfully' })
            setIsStatusConformation('')
            navigate(0)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Error updating status' })
            }
            console.error('Error updating status:', error)
        }
    }

    const handleSyncToGDN = async () => {
        try {
            const response = await axioisInstance.patch(`/indent-note/gdn/sync/${data?.intent_number}`)
            notification.success({ message: response?.data?.data?.message || 'Sync to GDN successful' })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Error syncing to GDN' })
            }
            console.error('Error syncing to GDN:', error)
        }
    }

    return { handleAssign, handleStatus, handleSyncToGDN }
}
