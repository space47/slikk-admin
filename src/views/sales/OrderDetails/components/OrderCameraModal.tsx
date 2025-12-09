import React, { useEffect } from 'react'
import { Modal } from 'antd'
import CommonCamera from '@/common/CommonCamera'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    currentId: number
    setStorePhoto: React.Dispatch<React.SetStateAction<{ [key: number]: string[] }>>
}

const OrderCameraModal = ({ isOpen, setIsOpen, currentId, setStorePhoto }: Props) => {
    const handleUpload = async (fileType: string, files: File) => {
        const formData = new FormData()
        formData.append('file', files)
        formData.append('file_type', fileType)
        formData.append('compression_service', 'slikk')

        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const newUrl = response.data.url
            successMessage(response)

            setStorePhoto((prev) => ({
                ...prev,
                [currentId]: [...(prev[currentId] || []), newUrl],
            }))
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    useEffect(() => {
        if (isOpen) {
            const instance = Modal.confirm({
                title: 'Capture Image',
                icon: null,
                footer: null, // remove OK/Cancel buttons
                width: 650,
                closable: true,
                content: (
                    <CommonCamera
                        onCapture={(file) => {
                            instance.destroy()
                            setIsOpen(false)
                            handleUpload('orders', file)
                        }}
                    />
                ),
                onCancel: () => {
                    setIsOpen(false)
                },
            })
        }
    }, [isOpen])

    return null // Modal.confirm renders itself
}

export default OrderCameraModal
