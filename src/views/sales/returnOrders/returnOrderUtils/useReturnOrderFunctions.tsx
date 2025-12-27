/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ReturnOrderState {
    action: string
    returnDetails: any
    setForceCOD: React.Dispatch<React.SetStateAction<boolean>>
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    valueInsideModal: { refundAmount: string; refundId: string }
    setTriggerPickedUpGenerate: React.Dispatch<React.SetStateAction<boolean>>
    locationWiseArray: any[]
    setIsCompleting: (x: boolean) => void
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
}: ReturnOrderState) => {
    const navigate = useNavigate()
    const triggerApiCall = async () => {
        try {
            const body = {
                action: action,
            }

            const response = await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
            notification.success({ message: response?.data?.message || 'Rider status updated successfully.' })
            setForceCOD(false)
            navigate(0)
        } catch (error: any) {
            console.error(error)
            const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'
            notification.error({ message: 'Error', description: errorMessage })
            setForceCOD(true)
        } finally {
            setIsModalOpen(false)
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
            notification.success({ message: response?.data?.message || 'Rider status updated successfully.' })
            setForceCOD(false)
            navigate(0)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message || 'Failed to Update' })
            }
            console.error(error)
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
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Rider status updated successfully.',
            })
            navigate(0)
        } catch (error: any) {
            console.error(error)
            const errorMessage = error.response?.data?.message || 'There was an error updating the order status. Please try again.'

            if (error.response?.status === 400) {
                try {
                    const bodyWithReCreate = {
                        action,
                        re_create: 'yes',
                    }
                    const retryResponse = await axioisInstance.patch(
                        `merchant/return_order/${returnDetails?.return_order_id}`,
                        bodyWithReCreate,
                    )
                    notification.success({
                        message: 'Success',
                        description: retryResponse?.data?.message || 'Rider status updated successfully.',
                    })
                    navigate(0)
                } catch (retryError: any) {
                    console.error(retryError)
                    notification.error({
                        message: 'Error',
                        description: retryError.response?.data?.message || 'Failed to update rider status with re_create.',
                    })
                }
            } else {
                notification.error({
                    message: 'Error',
                    description: errorMessage,
                })
            }
        } finally {
            setTriggerPickedUpGenerate(false)
        }
    }

    const handleCompleteReturn = async (action: string, locationWiseDetails: any) => {
        setIsCompleting(true)
        if (Object.entries(locationWiseDetails)?.length <= 0) {
            notification.error({ message: 'Fill up the items as per the location to proceed further' })
            return
        }
        const totalItemQuantity = locationWiseArray?.reduce((total: number, item: any) => total + Number(item?.quantity), 0) || 0

        for (const id of Object.keys(locationWiseDetails)) {
            for (const { location } of locationWiseDetails[id]) {
                if (!location || location?.trim() === '') {
                    notification.error({ message: 'No location found. Please select a valid location.' })
                    return
                }
            }
        }

        Object.keys(locationWiseDetails)?.forEach((id) => {
            locationWiseDetails[id] = locationWiseDetails[id]?.reduce((acc: any, { location, quantity }: any) => {
                acc[location] = quantity
                return acc
            }, {})
        })

        const calculatedQuantity = Object.values(locationWiseDetails).reduce((sum: number, obj: any) => {
            return sum + Object.values(obj as Record<string, number>).reduce((a, b) => a + b, 0)
        }, 0)

        if (calculatedQuantity !== totalItemQuantity) {
            notification.warning({
                message: 'Warning',
                description: 'The total item quantity does not match the calculated quantity.',
            })
            return
        }

        const body = {
            action: action,
            items_location: locationWiseDetails,
        }

        try {
            const response = await axioisInstance.patch(`merchant/return_order/${returnDetails?.return_order_id}`, body)
            notification.success({ message: response?.data?.message || 'Return order created successfully.' })
            navigate(0)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || error?.message || 'Failed to create return order' })
            }
            setTimeout(() => {
                navigate(0)
            }, 500)
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
            navigate(0)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    return { sendApiRequest, triggerApiCall, handleForceCod, handleCompleteReturn, handleReturnReject }
}
