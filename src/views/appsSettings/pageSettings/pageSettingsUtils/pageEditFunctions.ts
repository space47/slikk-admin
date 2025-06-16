/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

export const calculateAspectRatio = async (files: File[]): Promise<number[]> => {
    if (!files || files.length === 0) {
        return []
    }

    const aspectRatios: number[] = []
    for (const file of files) {
        const image = new Image()
        const fileURL = URL.createObjectURL(file)

        image.src = fileURL

        await new Promise<void>((resolve) => {
            image.onload = () => {
                aspectRatios.push(image.width / image.height)
                URL.revokeObjectURL(fileURL)
                resolve()
            }
            image.onerror = () => {
                URL.revokeObjectURL(fileURL)
                resolve()
            }
        })
    }
    return aspectRatios
}

export const handleImage = async (files: File[]) => {
    console.log('Images of mobile for checking', files)
    if (!files || files.length === 0) {
        return
    }

    const formData = new FormData()

    for (const file of files) {
        const image = new Image()
        const fileURL = URL.createObjectURL(file)

        image.src = fileURL

        await new Promise<void>((resolve) => {
            image.onload = () => {
                console.log('Image width:', image.width, 'Image height:', image.height)
                URL.revokeObjectURL(fileURL)
                resolve()
            }
        })

        formData.append('file', file)
    }

    formData.append('file_type', 'banners')

    try {
        notification.info({
            message: 'Image Upload in process',
        })
        const response = await axioisInstance.post('fileupload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        const newData = response.data.url
        notification.success({
            message: 'Success',
            description: response?.data?.message || 'Image uploaded successfully',
        })
        console.log('new data is', newData)
        return newData
    } catch (error: any) {
        console.error('Error uploading files:', error)
        notification.error({
            message: 'Upload Failed',
            description: error?.response?.data?.message || 'Image upload failed',
        })

        return ''
    }
}

export const handleVideo = async (files: File[]) => {
    if (files) {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')

        notification.info({
            message: 'Video Upload In Process',
        })
        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            notification.success({
                message: 'Video Updated',
            })
            const newData = response.data.url
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Video Not uploaded',
            })
            return 'Error'
        }
    }
}
