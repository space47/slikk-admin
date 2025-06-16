import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

export const handleimage = async (fileType: string, files: File[]) => {
    const formData = new FormData()

    files.forEach((file) => {
        formData.append('file', file)
    })
    formData.append('file_type', fileType)
    formData.append('compression_service', 'slikk')

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
            description: response?.data?.message || 'Image uploaded successfully',
        })
        return newData
    } catch (error) {
        console.error('Error uploading files:', error)
        return 'Error'
    }
}
