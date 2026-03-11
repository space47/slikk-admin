/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndentDetailsTypes } from '@/store/types/indent.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Modal, notification } from 'antd'
import { AxiosError } from 'axios'
import React from 'react'

interface props {
    selectedUsers: string[]
    setIsPickerModal: React.Dispatch<React.SetStateAction<boolean>>
    data: IndentDetailsTypes | null
    isStatusConformation: string
    setIsStatusConformation: React.Dispatch<React.SetStateAction<string>>
    refetch: () => void
    setIsSyncing?: React.Dispatch<React.SetStateAction<boolean>>
}

export const useIndentFunctions = ({
    selectedUsers,
    setIsPickerModal,
    data,
    isStatusConformation,
    setIsStatusConformation,
    refetch,
    setIsSyncing,
}: props) => {
    const handleAssign = async (actionType: string) => {
        console.log('Selected users in handleAssign:', actionType)
        const body = {
            action: 'assign_pickers',
            pickers: selectedUsers?.filter((item) => item !== undefined),
            indent_number: data?.intent_number,
            assign_action: actionType,
        }
        try {
            const response = await axioisInstance.patch('/indent', body)
            notification.success({ message: response?.data?.data?.message || 'Pickers assigned successfully' })
            setIsPickerModal(false)
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Error assigning pickers' })
            }
            console.error('Error assigning pickers:', error)
        }
    }

    const updateIndentStatus = async (body: any) => {
        const response = await axioisInstance.patch('/indent', body)
        notification.success({ message: response?.data?.data?.message || 'Status updated successfully' })
        setIsStatusConformation('')
        refetch()
    }

    const handleStatus = async () => {
        const actionMap: Record<string, string> = {
            reject: 'status_rejected',
            fulfilled: 'status_fulfilled',
        }

        const action = actionMap[isStatusConformation] || (data?.status === 'created' ? 'status_approved' : 'status_created')

        const body = {
            action,
            indent_number: data?.intent_number,
        }

        try {
            await updateIndentStatus(body)
        } catch (error) {
            const axiosError = error as AxiosError<any>

            if (isStatusConformation !== 'fulfilled') {
                notification.error({
                    message: axiosError?.response?.data?.message || 'Error updating status',
                })
                return
            }

            const errData = axiosError?.response?.data?.data

            Modal.confirm({
                title: axiosError?.response?.data?.message || 'Close the RTV',
                content: `Are you sure you want to close Indent with Total Items ${errData?.total_items_sum || '0'}, Total Picked ${
                    errData?.items_picked_sum || '0'
                }, and Total GDN Sum ${errData?.gdn_items_sum || '0'}?`,
                okText: 'Yes',
                cancelText: 'No',
                onOk: async () => {
                    try {
                        await updateIndentStatus({
                            ...body,
                            force_update: true,
                        })
                    } catch (err) {
                        const forceError = err as AxiosError<any>

                        notification.error({
                            message: forceError?.response?.data?.message || 'Error updating status',
                        })
                    }
                },
            })
        }
    }

    const handleSyncToGDN = async () => {
        setIsSyncing && setIsSyncing(true)
        try {
            const response = await axioisInstance.post(`/indent-note/gdn/sync/${data?.intent_number}`)
            notification.success({ message: response?.data?.data?.message || 'Sync to GDN successful' })
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Error syncing to GDN' })
            }
            console.error('Error syncing to GDN:', error)
        } finally {
            setIsSyncing && setIsSyncing(false)
        }
    }

    return { handleAssign, handleStatus, handleSyncToGDN }
}
