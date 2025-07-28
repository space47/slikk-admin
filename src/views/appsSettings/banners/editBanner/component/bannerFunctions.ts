import { handleimage } from '@/common/handleImage'
import { handleVideo } from '@/views/appsSettings/newPageSettings/newPageSettingsUtils/usePageSettingsBodyFile'
import { filter } from 'lodash'

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
        return imageArray.length > 0 ? await handleimage('product', imageArray) : currentImage || ''
    }
    const processVideoUpload = async (videoArray: any[], currentvideo: string) => {
        return videoArray.length > 0 ? await handleVideo(videoArray) : currentvideo || ''
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

export const bannerBodyFile = (
    values: any,
    webVideoUpload: any,
    mobileVideoUpload: any,
    webAspectratio: any,
    mobileAspectratio: any,
    webLottieUpload: any,
    mobileLottieUpload: any,
    mobileImageUpload: any,
    webImageUpload: any,
    filterId: any,
    excludeFilterId: any,
    sectionBgWebUpload: any,
    sectionBgMobileUpload: any,
    BANNER_FIELDS_TYPE: any[],
) => {
    const bodyFile = {
        banner_id: values?.id || '',
        barcodes: values?.barcodes || '',
        brand: values?.brand?.map((item: any) => item.id) || [],
        category: values?.category?.map((item: any) => item.id) || [],
        sub_category: values?.sub_category?.map((item: any) => item.id) || [],
        coupon_code: values?.coupon_code || '',
        division: values?.division?.map((item: any) => item.id) || [],
        product_type: values?.product_type?.map((item: any) => item.id) || [],
        extra_attributes: {
            video_web: webVideoUpload ? webVideoUpload : values?.extra_attributes?.video_web || '',
            video_mobile: mobileVideoUpload ? mobileVideoUpload : values?.extra_attributes?.video_mobile || '',
            web_aspect_ratio: webAspectratio?.[0] ? Number(webAspectratio[0].toFixed(2)) : values?.extra_attributes?.web_aspect_ratio || '',
            mobile_aspect_ratio: mobileAspectratio?.[0]
                ? Number(mobileAspectratio[0].toFixed(2))
                : values?.extra_attributes?.mobile_aspect_ratio || '',
            mobile_redirection_url: values?.extra_attributes?.mobile_redirection_url || '',
            web_redirection_url: values?.extra_attributes?.web_redirection_url || '',
            lottie_web: webLottieUpload ?? values?.extra_attributes?.lottie_web ?? '',
            lottie_mobile: mobileLottieUpload ?? values?.extra_attributes?.lottie_mobile ?? '',
            filter_id_exclude: excludeFilterId || '',
        },
        footer: values?.footer || '',
        from_date: values?.from_date || '',
        id: values?.id || '',
        image_mobile: mobileImageUpload || '',
        image_web: webImageUpload || '',
        is_clickable: values?.is_clickable ?? '',
        max_price: values?.max_price || '',
        min_price: values?.min_price || '',
        name: values?.name || '',
        offer_id: values?.offer_id || '',
        offers: values?.offers ?? '',
        page: values?.page || '',
        filter_id: filterId || '',
        parent_banner: values?.parent_banner || '',
        position: values?.position || '',
        quick_filter_tags: values?.quick_filter_tags || [],
        redirection_url: values?.redirection_url || '',
        section_background_mobile: sectionBgMobileUpload || values?.section_background_mobile || '',
        section_background_mobile_array: values?.section_background_mobile_array || [],
        section_background_web: sectionBgWebUpload || values?.section_background_web || '',
        section_background_web_array: values?.section_background_web_array || [],
        section_heading: values?.section_heading || '',
        tags: [
            ...(values?.tags ? values.tags : []),
            BANNER_FIELDS_TYPE.some((item) => item.name === 'max_off') && values?.max_off ? `maxoff_${values?.max_off}` : '',
            BANNER_FIELDS_TYPE.some((item) => item.name === 'min_off') && values?.min_off ? `minoff_${values?.min_off}` : '',
            values?.sort ? `sort_${values?.sort}` : '',
        ]?.filter((val) => val !== ''),
        to_date: values?.to_date || '',
        type: values?.type || '',
        uptooff: values?.uptooff || '',
        video_mobile: values?.video_mobile || '',
        video_web: values?.video_web || '',
        sub_page: values?.sub_page || [],
    }

    return bodyFile
}
