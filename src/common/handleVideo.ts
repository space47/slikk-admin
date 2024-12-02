import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

export const handleVideo = async (files: File[]) => {
    if (!files || files.length === 0) {
        console.error('No files provided for upload')
        return 'Error'
    }

    const formData = new FormData()
    files.forEach((file, index) => {
        formData.append(`file[${index}]`, file)
    })
    formData.append('file_type', 'product')

    try {
        console.log('Uploading video files:', files)
        const response = await axioisInstance.post('fileupload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        console.log('Upload successful:', response)
        const newData = response.data.url
        return newData
    } catch (error: any) {
        console.error('Error uploading video files:', error)
        notification.error({
            message: 'Failure',
            description: error?.response?.data?.message || 'Video not uploaded',
        })
        return 'Error'
    }
}
