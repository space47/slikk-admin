import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

export const handleimage = async (files: File[]) => {
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

        return newData
    } catch (error: any) {
        console.error('Error uploading files:', error)

        return 'Error'
    }
}
