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
    if (!files || files.length === 0) {
        return
    }

    console.log('is reached here')
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

export const EditImageUploads = async (row: any) => {
    const imageUpload = (await handleImage(row.background_image_array)) || ''
    const mobileimageUpload = (await handleImage(row.mobile_background_array)) || ''
    const footerImageUpload = (await handleImage(row.footer_config_image_Array)) || ''
    const headerImageUpload = (await handleImage(row.header_config_image_Array)) || ''
    const subHeaderImageUpload = (await handleImage(row.sub_header_config_image_Array)) || ''
    const headerIconUpload = (await handleImage(row.header_config_icon_Array)) || ''
    const exploreMoreImageUpload = (await handleImage(row.extra_info.explore_more_image_Array)) || ''

    return {
        imageUpload,
        mobileimageUpload,
        footerImageUpload,
        headerImageUpload,
        subHeaderImageUpload,
        headerIconUpload,
        exploreMoreImageUpload,
    }
}

export const EditVideoUpload = async (row: any) => {
    const footervideoUpload = await handleVideo(row.footer_config_video_Array)
    const headerVideoUpload = await handleVideo(row.header_config_video_Array)
    const subHeaderVideoUpload = await handleVideo(row.sub_header_config_video_Array)
    const backgroundVideoUpload = await handleVideo(row?.background_video_array)
    const mobileBackgroundVideoUpload = await handleVideo(row?.mobile_background_video_array)
    const exploreMoreVideoUpload = await handleVideo(row?.extra_info.explore_more_video_Array)

    return {
        footervideoUpload,
        headerVideoUpload,
        subHeaderVideoUpload,
        backgroundVideoUpload,
        mobileBackgroundVideoUpload,
        exploreMoreVideoUpload,
    }
}

export const EditAspectRatios = async (row: any) => {
    const backgroundImageAspectRatios = await calculateAspectRatio(row.background_image_array)
    const mobileImageAspectRatios = await calculateAspectRatio(row.mobile_background_array)
    const headerImageAspectRatios = await calculateAspectRatio(row.header_config_image_Array)
    const subHeaderImageAspectRatios = await calculateAspectRatio(row.sub_header_config_image_Array)
    const footerImageAspectRatios = await calculateAspectRatio(row.footer_config_image_Array)
    const exploreMoreAspectRatios = await calculateAspectRatio(row.extra_info.explore_more_image_Array)

    return {
        backgroundImageAspectRatios,
        mobileImageAspectRatios,
        headerImageAspectRatios,
        subHeaderImageAspectRatios,
        footerImageAspectRatios,
        exploreMoreAspectRatios,
    }
}
