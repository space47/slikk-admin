/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
// import { API_RESPONSE } from './data';
import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import AllComponents from '@/preview/BannerComps/AllComponent'

function PreviewBanner({ setCurrentStep, completeBannerFormData, selectedPage, selectedSection, headingData }: any) {
    const navigate = useNavigate()
    const [API_BANNERS, setApiBanners] = useState<any[]>([])
    const [viewSize, setViewSize] = useState('lg')

    useEffect(() => {
        const fetchBanners = async () => {
            const response = await axioisInstance
                .get('page/sections?device_type=Web')
                .then((res) => {
                    return res.data.data
                })
                .catch((err) => {
                    return []
                })

            console.log(response)
            setApiBanners(response)
            const getFullBannerDataFromBannerFormArray = () => {
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

                const data: any[] = []

                completeBannerFormData?.forEach((banner: any, index: number) => {
                    console.log(banner)
                    data.push({
                        pk: index,
                        ...banner,
                        quick_filter_tags: banner.quick_filter_tags || [],
                        tags: banner.tags || [],
                    })
                })
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
            getFullBannerDataFromBannerFormArray()
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
                division: banner?.division?.map((item: any) => item.name).join(',') || '',
                category: banner?.category?.map((item: any) => item.name).join(',') || '',
                sub_category: banner?.sub_category?.map((item: any) => item.name).join(',') || '',
                product_type: banner?.product_type?.map((item: any) => item.name).join(',') || '',
                brand: banner?.brand?.map((item: any) => item.name).join(',') || '',
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
                },
                image_web_file: null,
                image_mobile_file: null,
            }

            console.log('Data to send', data)

            await axioisInstance
                .post('banners', data)
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
        })
    }

    return (
        <div className="gap-3 w-full overflow-hidden">
            <div className="mb-5 w-full px-[10%]  flex flex-col lg:flex-row gap-3">
                <Button size="lg" onClick={() => setCurrentStep(3)} variant="new">
                    Add/Edit More Banners
                </Button>
                {/* TODO : NAVIGATE FIX */}
                <Button
                    size="lg"
                    onClick={() => {
                        handleSubmit()
                    }}
                    variant="new"
                >
                    Save Banner
                </Button>
            </div>
            <div className="mb-5 w-full px-[10%] flex flex-col lg:flex-row gap-4">
                <Button size="lg" onClick={() => setViewSize('sm')} variant="new">
                    Mobile View
                </Button>
                <Button size="lg" onClick={() => setViewSize('md')} variant="new">
                    Tablet View
                </Button>
                <Button size="lg" onClick={() => setViewSize('lg')} variant="new">
                    Laptop View
                </Button>
            </div>
            <div className={`bg-black w-full`}>
                {/* <AllComponentsLib data={API_BANNERS} size={viewSize} /> */}
                <AllComponents data={API_BANNERS} size={viewSize} />
            </div>
        </div>
    )
}

export default PreviewBanner
