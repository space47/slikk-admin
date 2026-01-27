/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReturnOrder } from '@/store/types/returnOrderData.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React from 'react'

interface ReturnOrderFunctionProps {
    action: string
    returnDetails: ReturnOrder
    setForceCOD: React.Dispatch<React.SetStateAction<boolean>>
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    valueInsideModal: { refundAmount: string; refundId: string }
    setTriggerPickedUpGenerate: React.Dispatch<React.SetStateAction<boolean>>
    locationWiseArray: any[]
    setIsCompleting: (x: boolean) => void
    setIsLoading: (x: boolean) => void
    refetch: any
    setTriggerAction: (x: boolean) => void
}

export const useReturnOrderFunctions = ({
    action,
    returnDetails,
    setForceCOD,
    setIsModalOpen,
    valueInsideModal,
    setTriggerPickedUpGenerate,
    locationWiseArray,
    setIsCompleting,
    refetch,
    setIsLoading,
    setTriggerAction,
}: ReturnOrderFunctionProps) => {
    const reCreationCall = async () => {
        try {
            const bodyWithReCreate = { action, re_create: 'yes' }
            const retryResponse = await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, bodyWithReCreate)

            successMessage(retryResponse || 'updated successfully')
            refetch()
        } catch (retryError) {
            if (retryError instanceof AxiosError) {
                errorMessage(retryError || 'Failed to update rider status with re_create.')
            }
        }
    }

    const triggerApiCall = async () => {
        try {
            setIsLoading(true)
            const body = { action: action }
            const response = await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
            successMessage(response)
            setForceCOD(false)
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
            setForceCOD(true)
        } finally {
            setIsModalOpen(false)
            setIsLoading(false)
            setTriggerAction(false)
        }
    }

    const handleForceCod = async () => {
        const body = {
            action: 'return_completed',
            reference_id: valueInsideModal.refundId,
            return_amount: valueInsideModal.refundAmount,
            cod_force: true,
        }
        try {
            const response = await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
            successMessage(response)
            setForceCOD(false)
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    const sendApiRequest = async () => {
        try {
            const body = {
                action,
                re_create: 'no',
            }
            const response = await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
            if (response.status === 400) {
                body.re_create = 'yes'
                await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
            }
            setIsModalOpen(false)
            setTriggerPickedUpGenerate(false)
            successMessage(response)
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    reCreationCall()
                } else {
                    errorMessage(error)
                }
            }
        } finally {
            setTriggerPickedUpGenerate(false)
        }
    }

    const handleCompleteReturn = async (action: string, payload: Record<string, Record<string, number>>) => {
        const payloadId = Object.keys(payload || {}) || []
        const checkIfAllKeysExist = locationWiseArray.every((item) => payloadId.includes(item.order_id?.toString()))
        if (!checkIfAllKeysExist) {
            notification.error({ message: 'All the items are required to proceed further' })
            return
        }
        console.log('payload is', payloadId, checkIfAllKeysExist)

        const body = {
            action: action,
            items_details: payload,
        }

        try {
            setIsCompleting(true)
            const response = await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
            successMessage(response || 'Return order created successfully.')
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error || 'Failed to create return order')
            }
        } finally {
            setIsCompleting(false)
        }
    }

    const handleReturnReject = async () => {
        try {
            const response = await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, {
                action: 'reject_return_order',
            })
            successMessage(response)
            setIsModalOpen(false)
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    return { sendApiRequest, triggerApiCall, handleForceCod, handleCompleteReturn, handleReturnReject }
}
