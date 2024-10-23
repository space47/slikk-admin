import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

export const handleimage = async (files: File[]) => {
    console.log('filessss', files)
    if (!files) {
        return
    }
    if (!files.length) {
        return
    }
    const formData = new FormData()

    files.forEach((file) => {
        formData.append('file', file)
    })
    formData.append('file_type', 'product')

    try {
        console.log(formData.get('file'))
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
        return newData
    } catch (error: any) {
        console.error('Error uploading files:', error)
        notification.error({
            message: 'Failure',
            description: error?.response?.data?.message || 'File Not uploaded',
        })
        return 'Error'
    }
}

export const handleVideo = async (files: File[]) => {
    if (!files) {
        return
    }
    if (!files.length) {
        return
    }
    const formData = new FormData()

    files.forEach((file) => {
        formData.append('file', file)
    })
    formData.append('file_type', 'product')

    try {
        console.log(formData.get('file'))
        const response = await axioisInstance.post('fileupload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log(response)
        const newData = response.data.url
        notification.success({
            message: 'Success',
            description: response?.data?.message || 'Video uploaded successfully',
        })
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
