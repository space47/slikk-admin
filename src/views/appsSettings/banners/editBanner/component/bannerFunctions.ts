import { handleimage } from '@/common/handleImage'
import { handleVideo } from '@/views/appsSettings/newPageSettings/newPageSettingsUtils/usePageSettingsBodyFile'

/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const calculateAspectRatioFromStrings = async (imageSources: string[]): Promise<number[]> => {
    if (!imageSources || imageSources.length === 0) {
        return []
    }

    const aspectRatios: number[] = []

    for (const src of imageSources) {
        const image = new Image()
        image.src = src

        await new Promise<void>((resolve) => {
            image.onload = () => {
                aspectRatios.push(image.width / image.height)
                resolve()
            }
            image.onerror = () => {
                resolve()
            }
        })
    }

    return aspectRatios
}

export const ImageHandlerBanners = async (values: any, webImagview: string[], mobileImagview: string[]) => {
    const processImageUpload = async (imageArray: any[], currentImage: string) => {
        return imageArray.length > 0 ? await handleimage('product', imageArray) : currentImage
    }
    const processVideoUpload = async (videoArray: any[], currentvideo: string) => {
        return videoArray.length > 0 ? await handleVideo(videoArray) : currentvideo
    }
    const webImageUpload = await processImageUpload(values.image_web_array, values.image_web)
    const webAspectratio =
        values.image_web_array?.length > 0
            ? await calculateAspectRatio(values.image_web_array)
            : values.image_web
              ? await calculateAspectRatioFromStrings(webImagview)
              : values?.extra_attributes?.web_aspect_ratio || null
    const mobileImageUpload = await processImageUpload(values.image_mobile_array, values.image_mobile)
    const mobileAspectratio =
        values.image_mobile_array?.length > 0
            ? await calculateAspectRatio(values.image_mobile_array)
            : values.image_mobile
              ? await calculateAspectRatioFromStrings(mobileImagview)
              : values?.extra_attributes?.mobile_aspect_ratio || null
    const sectionBgWebUpload = await processImageUpload(values.section_background_web_array, values.section_background_web)
    const sectionBgMobileUpload = await processImageUpload(values.section_background_mobile_array, values.section_background_mobile)

    console.log('Aspect ratios', webAspectratio)
    const webVideoUpload = await processVideoUpload(values?.video_web_array, values?.video_web)
    const mobileVideoUpload = await processVideoUpload(values?.video_mobile_array, values?.video_mobile)

    const webLottieUpload = await processImageUpload(values?.lottie_web_array, values?.lottie_web)
    const mobileLottieUpload = await processImageUpload(values?.lottie_mobile_array, values?.lottie_mobile)

    return {
        webImageUpload,
        webAspectratio,
        mobileImageUpload,
        mobileAspectratio,
        sectionBgWebUpload,
        sectionBgMobileUpload,
        webVideoUpload,
        mobileVideoUpload,
        webLottieUpload,
        mobileLottieUpload,
    }
}

export enum MediaType {
    MobileImage = 'mobile',
    WebImage = 'web',
    SectionWeb = 'SecWeb',
    SectionMobile = 'SecMob',
    MobileVideo = 'mobile_video',
    WebVideo = 'web_video',
    MobileLottie = 'mobile_lottie',
    WebLottie = 'web_lottie',
}
