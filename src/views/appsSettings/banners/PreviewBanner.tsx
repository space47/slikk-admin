/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
// import { API_RESPONSE } from './data';
import { Button, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import Preview from '@/preview/BannerComps/Preview'
import { safeImageUrl } from '@/preview/lib/utils'
import { AxiosError } from 'axios'

function PreviewBanner({ setCurrentStep, completeBannerFormData, selectedPage, subpage, selectedSection }: any) {
    const navigate = useNavigate()
    const [API_BANNERS, setApiBanners] = useState<any[]>([])
    const [loader, setLoader] = useState(false)
    const [showSpinner, setShowSpinner] = useState(false)
    useEffect(() => {
        const fetchBanners = async () => {
            setLoader(true)
            let url = `page/sections/new?page_size=10000&page=${selectedPage.name?.toLowerCase()}`
            if (subpage.name) url += `&sub_page=${subpage.name?.toLowerCase()}`
            const response = await axioisInstance
                .get(url)
                .then((res) => {
                    return res.data?.data?.data
                })
                .catch((err) => {
                    if (err instanceof AxiosError) {
                        notification.error({ message: err.response?.data?.message })
                    }
                    return []
                })
                .finally(() => {
                    setLoader(false)
                })

            console.log(response)
            setApiBanners(response)

            const getFullBannerDataFromBannerFormArray = async () => {
                const FULL_BANNER_API: any = {
                    position: 0,
                    component_type: selectedSection?.component_type,
                    component_config: selectedSection?.component_config,
                    header_config: selectedSection?.header_config,
                    sub_header_config: selectedSection?.sub_header_config,
                    footer_config: selectedSection?.footer_config,
                    background_image: selectedSection?.background_image,
                    section_heading: selectedSection?.section_heading,
                    data_type: selectedSection?.data_type,
                    data: [],
                }

                console.log('FULL BANNER is', FULL_BANNER_API?.section_heading)

                const data = await Promise.all(
                    completeBannerFormData.map(async (banner: any, index: number) => {
                        const image_mobile = await safeImageUrl(banner.image_mobile)
                        const image_web = await safeImageUrl(banner.image_web)

                        return {
                            pk: index,
                            ...banner,
                            quick_filter_tags: banner.quick_filter_tags || [],
                            tags: banner.tags || [],
                            image_mobile,
                            image_web,
                        }
                    }),
                )
                console.log('data is', data)
                FULL_BANNER_API.data = data

                console.log('banner api is:', FULL_BANNER_API.data)

                setApiBanners((prev) => {
                    return prev.map((data) => {
                        if (data.section_heading === FULL_BANNER_API?.section_heading) {
                            return {
                                ...data,
                                data: [...data.data, ...FULL_BANNER_API.data],
                            }
                        }
                        return data
                    })
                })
            }
            await getFullBannerDataFromBannerFormArray()
        }
        fetchBanners()
    }, [completeBannerFormData, selectedSection])

    useEffect(() => {
        console.log('ALL BANNERS', API_BANNERS)
    }, [API_BANNERS])

    const HandleImage = async (file: File) => {
        if (!file) return null
        const formData = new FormData()

        formData.append('file', file)

        formData.append('file_type', 'banners')
        try {
            return await axioisInstance
                .post('fileupload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    console.log(response)
                    const newData = response.data.url
                    notification.success({
                        message: 'Success',
                        description: response?.data?.message || 'Image uploaded successfully',
                    })
                    return newData
                })
        } catch (error: any) {
            notification.error({
                message: 'Upload Failed',
                description: error?.response?.data?.message || 'Image upload failed',
            })
            return null
        }
    }

    const handleVideo = async (files: File[]) => {
        if (files) {
            const formData = new FormData()

            formData.append('file', files)

            formData.append('file_type', 'product')
            formData.append('compression_service', 'slikk')

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

    const calculateAspectRatio = async (files: File[]): Promise<number[]> => {
        if (!files || files.length === 0) {
            return []
        }

        const aspectRatios: number[] = []

        const image = new Image()
        const fileURL = URL.createObjectURL(files)

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

        return aspectRatios
    }

    const handleSubmit = async () => {
        await completeBannerFormData?.forEach(async (banner: any, index: number) => {
            setShowSpinner(true)
            console.log('maxOff value', banner?.maxoff, banner?.minoff)
            const webImageUpload = await HandleImage(banner.image_web_file)
            const mobileImageUpload = await HandleImage(banner.image_mobile_file)
            const webAspectratio = await calculateAspectRatio(banner.image_web_file)
            const mobileAspectratio = await calculateAspectRatio(banner.image_mobile_file)
            const mobileVideoUpload = await handleVideo(banner?.video_file)
            const webVideoUpload = await handleVideo(banner?.video_mobile_file)
            const webLottieUpload = await HandleImage(banner?.lottie_web)
            const mobileLottieUpload = await HandleImage(banner?.lottie_mobile)

            console.log(webImageUpload, mobileImageUpload, mobileVideoUpload, webVideoUpload)

            // if (!webImageUpload && !mobileImageUpload) {
            //     notification.error({
            //         message: 'Upload Failed',
            //         description: 'Error Uploading Banner ' + (index + 1),
            //     })
            //     return
            // }

            console.log('redir url', banner?.web_redirection_url)
            console.log('banner index', banner)
            const data = {
                ...banner,
                division: banner?.division?.map((item: any) => item.id) || [],
                category: banner?.category?.map((item: any) => item.id) || [],
                sub_category: banner?.sub_category?.map((item: any) => item.id) || [],
                product_type: banner?.product_type?.map((item: any) => item.id) || [],
                brand: banner?.brand?.map((item: any) => item.id) || [],
                page: selectedPage.value,
                section_heading: selectedSection?.section_heading,
                image_web: webImageUpload || '',
                image_mobile: mobileImageUpload || '',
                redirection_url: banner?.redirection_url || '',
                extra_attributes: {
                    video_web: webVideoUpload ?? '',
                    video_mobile: mobileVideoUpload ?? '',
                    web_aspect_ratio: banner?.web_aspect_ratio ?? (webAspectratio?.[0] ? Number(webAspectratio[0]?.toFixed(2)) : null),
                    mobile_aspect_ratio:
                        banner?.mobile_aspect_ratio ?? (mobileAspectratio?.[0] ? Number(mobileAspectratio[0]?.toFixed(2)) : null),
                    web_redirection_url:
                        banner.is_custom === true
                            ? `s/${banner.pageName}${banner.subPageName ? `/${banner.subPageName}` : ''}`
                            : (banner?.web_redirection_url ?? null),
                    mobile_redirection_url:
                        banner.is_custom === true
                            ? `s/${banner.pageName}${banner.subPageName ? `/${banner.subPageName}` : ''}`
                            : (banner?.web_redirection_url ?? null),
                    max_off: banner?.maxoff ?? null,
                    min_off: banner?.minoff ?? null,
                    lottie_web: webLottieUpload ?? '',
                    lottie_mobile: mobileLottieUpload ?? '',
                    filter_id_exclude: banner?.extra_attributes?.filter_id_exclude || '',
                    show_subscription_popup: banner?.show_subscription_popup || false,
                },
                image_web_file: null,
                image_mobile_file: null,
            }

            const keysToKeepEvenIfEmpty = ['division', 'category', 'sub_category', 'product_type', 'brand']
            const filteredBody = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => keysToKeepEvenIfEmpty.includes(key) || value !== ''),
            )

            console.log('Filtered Body', filteredBody)
            await axioisInstance
                .post('banners', filteredBody)
                .then((res) => {
                    notification.success({
                        message: 'Successfully uploaded banner ' + (index + 1) || res?.data?.message,
                    })
                })
                .then(() => navigate('/app/appSettings/banners'))

                .catch((err) => {
                    notification.error({
                        message: 'Error when creating banner ' + (index + 1),
                        description: err?.response?.data?.message || 'Error in banner api',
                    })
                })
                .finally(() => {
                    setShowSpinner(false)
                })
        })
    }

    return (
        <div className="gap-3 w-full overflow-hidden">
            <div className="px-6 w-full flex flex-col lg:flex-row gap-3 mb-1">
                <Button size="lg" onClick={() => setCurrentStep(3)} variant="new">
                    Add/Edit More Banners
                </Button>
                {/* TODO : NAVIGATE FIX */}
                <Button
                    size="lg"
                    onClick={() => {
                        handleSubmit()
                    }}
                    variant={showSpinner ? 'default' : 'new'}
                    className="flex gap-2 items-center"
                >
                    {showSpinner && <Spinner size={30} />} {showSpinner ? 'Saving..' : 'Save Banner'}
                </Button>
            </div>
            <div className={`w-full`}>
                {loader ? (
                    <div className="flex items-center justify-center">
                        <Spinner size={30} />
                    </div>
                ) : (
                    <Preview data={{ total: API_BANNERS.length, size: 'sm', width: '400px', data: API_BANNERS }} />
                )}
            </div>
        </div>
    )
}

export default PreviewBanner
