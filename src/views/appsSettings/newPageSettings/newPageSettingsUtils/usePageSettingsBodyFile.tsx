/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleimage } from '@/common/handleImage'
import { calculateAspectRatio, handleImage } from '../../pageSettings/pageSettingsUtils/pageEditFunctions'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

interface props {
    values?: any
    initialValue?: any
}

export const handleVideo = async (files: File[]) => {
    notification.info({
        message: 'Video Upload In Process',
    })
    if (files.length > 0) {
        try {
            const formData = new FormData()
            formData.append('file', files[0])
            formData.append('file_type', 'product')
            formData.append('compression_service', 'slikk')

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

export const PageSettingsBodyFile = async ({ values, initialValue }: props) => {
    const componentConfig = {
        ...Object.fromEntries(Object.entries(values?.component_config || {}).filter(([, value]) => value !== '')),
    }

    const backgroundLottieUpload = values?.background_lottie_array
        ? await handleimage('product', values?.background_lottie_array)
        : initialValue?.background_lottie
    const mobileBackgroundLottieUpload = values?.mobile_background_lottie_array
        ? await handleimage('product', values?.mobile_background_lottie_array)
        : initialValue?.mobile_background_lottie

    const backgroundVideoUpload = values?.background_video_array ? await handleVideo(values?.background_video_array) : ''
    const mobileBackgroundVideoUpload = values?.mobile_background_video_array
        ? await handleVideo(values?.mobile_background_video_array)
        : ''

    const footervideoUpload = values?.footer_config_video_Array ? await handleVideo(values?.footer_config_video_Array) : ''
    const headerVideoUpload = values?.header_config_video_Array ? await handleVideo(values?.header_config_video_Array) : ''
    const subHeaderVideoUpload = values?.sub_header_config_video_Array ? await handleVideo(values?.sub_header_config_video_Array) : ''

    const imageUpload = values?.background_image_array ? await handleImage(values?.background_image_array) : ''
    const mobileimageUpload = values?.mobile_background_array ? await handleImage(values?.mobile_background_array) : ''
    const footerImageUpload = values?.footer_config_image_Array ? await handleImage(values?.footer_config_image_Array) : ''
    const headerImageUpload = values?.header_config_image_Array ? await handleImage(values?.header_config_image_Array) : ''
    const subHeaderImageUpload = values?.sub_header_config_image_Array ? await handleImage(values?.sub_header_config_image_Array) : ''
    const headerIconUpload = values?.header_config_icon_Array ? await handleImage(values?.header_config_icon_Array) : ''

    const backgroundImageAspectRatios = values?.background_image_array ? await calculateAspectRatio(values?.background_image_array) : ''
    const mobileImageAspectRatios = values?.mobile_background_array ? await calculateAspectRatio(values?.mobile_background_array) : ''
    const headerImageAspectRatios = values?.header_config_image_Array ? await calculateAspectRatio(values?.header_config_image_Array) : ''
    const subHeaderImageAspectRatios = values?.sub_header_config_image_Array
        ? await calculateAspectRatio(values?.sub_header_config_image_Array)
        : ''
    const footerImageAspectRatios = values?.footer_config_image_Array ? await calculateAspectRatio(values?.footer_config_image_Array) : ''

    const cta_config_data = {
        ...values?.extra_info?.cta_config,
    }
    const cta_config = Object.fromEntries(Object.entries(cta_config_data).filter(([, value]) => value !== ''))

    const child_component_config_data = {
        ...values?.extra_info?.child_component_config,
    }
    const child_component_config = Object.fromEntries(Object.entries(child_component_config_data).filter(([, value]) => value !== ''))
    const backgroundConfig = {
        ...Object.fromEntries(Object.entries(values?.background_config || {}).filter(([, value]) => value !== '')),
        ...(imageUpload || values?.background_image ? { background_image: imageUpload || values?.background_image } : {}),
        ...(mobileimageUpload || values?.mobile_background_image
            ? { mobile_background_image: mobileimageUpload || values?.mobile_background_image }
            : {}),
        ...(values?.background_config?.background_image_aspect_ratio
            ? { background_image_aspect_ratio: values.background_config.background_image_aspect_ratio }
            : backgroundImageAspectRatios[0]
              ? { background_image_aspect_ratio: backgroundImageAspectRatios[0] }
              : {}),

        ...(values?.background_config?.mobile_image_aspect_ratio
            ? { mobile_image_aspect_ratio: values.background_config.mobile_image_aspect_ratio }
            : mobileImageAspectRatios[0]
              ? { mobile_image_aspect_ratio: mobileImageAspectRatios[0] }
              : {}),
        ...(backgroundVideoUpload || values?.background_video
            ? { background_video: backgroundVideoUpload || values?.background_video }
            : {}),
        ...(mobileBackgroundVideoUpload || values?.mobile_background_video
            ? { mobile_background_video: mobileBackgroundVideoUpload || values?.mobile_background_video }
            : {}),
        ...(backgroundLottieUpload || values?.background_lottie
            ? { background_lottie: backgroundLottieUpload || values?.background_config.background_lottie }
            : {}),
        ...(mobileBackgroundLottieUpload || values?.mobile_background_Lottie
            ? { mobile_background_lottie: mobileBackgroundLottieUpload || values?.background_config.mobile_background_lottie }
            : {}),
    }

    const footerConfig = Object.fromEntries(
        Object.entries({
            ...values?.footer_config,
            ...(footerImageUpload ? { image: footerImageUpload } : {}),
            ...(footerImageAspectRatios?.[0] ? { aspect_ratio: footerImageAspectRatios[0] } : {}),
            ...(footervideoUpload ? { video: footervideoUpload } : {}),
        }).filter(([, value]) => value !== ''),
    )
    const headerConfig = Object.fromEntries(
        Object.entries({
            ...values?.header_config,
            ...(headerIconUpload ? { icon: headerIconUpload } : {}),
            ...(headerImageUpload ? { image: headerImageUpload } : {}),
            ...(headerImageAspectRatios?.[0] ? { aspect_ratio: headerImageAspectRatios[0] } : {}),
            ...(headerVideoUpload ? { video: headerVideoUpload } : {}),
        }).filter(([, value]) => value !== ''),
    )
    const subHeaderConfig = Object.fromEntries(
        Object.entries({
            ...values?.sub_header_config,
            ...(subHeaderImageUpload ? { image: subHeaderImageUpload } : {}),
            ...(subHeaderImageAspectRatios?.[0] ? { aspect_ratio: subHeaderImageAspectRatios[0] } : {}),
            ...(subHeaderVideoUpload ? { video: subHeaderVideoUpload } : {}),
        }).filter(([, value]) => value !== ''),
    )
    const extraInfo = Object.fromEntries(
        Object.entries({
            extra_info: {
                ...values?.extra_info,
                ...(values?.extra_info?.timeout ? { timeout: values?.extra_info?.timeout } : {}),
                ...(values?.extra_info?.page_size ? { page_size: values?.extra_info?.page_size } : {}),
                ...(values?.extra_info?.child_data_type && { child_data_type: values?.extra_info?.child_data_type }),
                cta_config: cta_config,
                child_component_config: child_component_config,
            },
        }).filter(([, value]) => value !== ''),
    )

    return { componentConfig, backgroundConfig, footerConfig, headerConfig, subHeaderConfig, extraInfo, cta_config, child_component_config }
}
