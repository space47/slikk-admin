/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Spinner } from '@/components/ui'
import { eventSeriesService } from '@/store/services/eventSeriesService'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventFormCommon from '../eventCommons/EventFormCommon'
import { notification } from 'antd'
import axios from 'axios'
import { handleimage, handleVideo } from '@/views/category-management/catalog/handlingProductImage'

const EditEvents = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [editEventSeries, editEventResponse] = eventSeriesService.useEditEventSeriesMutation()
    const [webImageView, setWebImageView] = useState<string[]>([])
    const [mobileImageView, setMobileImageView] = useState<string[]>([])
    const [eventPhotos, setEventPhotos] = useState<string[]>([])
    const [eventVideos, setEventVideos] = useState<string[]>([])
    const [venueImages, setVenueImages] = useState<string[]>([])
    const [spinner, setSpinner] = useState(false)

    const [eventData, setEventData] = useState<any>(null)

    const handleRemoveImage = (type: 'wb' | 'mb' | 'ev' | 'vi' | 'ei') => (e: React.MouseEvent, index: number) => {
        e.preventDefault()

        if (type === 'wb') {
            const updatedImages = webImageView.filter((_, i) => i !== index)
            setWebImageView(updatedImages)
        } else if (type === 'mb') {
            const updatedImages = mobileImageView.filter((_, i) => i !== index)
            setMobileImageView(updatedImages)
        } else if (type === 'ev') {
            const updatedImages = eventVideos.filter((_, i) => i !== index)
            setEventVideos(updatedImages)
        } else if (type === 'vi') {
            const updatedImages = venueImages.filter((_, i) => i !== index)
            setVenueImages(updatedImages)
        } else if (type === 'ei') {
            const updatedImages = eventPhotos.filter((_, i) => i !== index)
            setEventPhotos(updatedImages)
        }
    }

    useEffect(() => {
        if (editEventResponse.isSuccess) {
            notification.success({
                message: (editEventResponse as any).data?.message || 'successfully edited',
            })

            navigate(-1)
        }
        if (editEventResponse.isError) {
            notification.error({
                message: (editEventResponse.error as any)?.data?.message || 'Failed to edit',
            })
        }
    }, [editEventResponse])

    useEffect(() => {
        const fetchEventData = async () => {
            const response = await axioisInstance.get(`/dashboard/promotion/events?event_id=${id}`)
            const data = response.data?.data
            setEventData(data)
            setWebImageView(data?.image_web ? data?.image_web?.split(',') : [])
            setMobileImageView(data?.image_mobile ? data?.image_mobile?.split(',') : [])
            setEventPhotos(data?.extra_attributes?.event_photos ? data?.extra_attributes?.event_photos?.split(',') : [])
            setEventVideos(data?.extra_attributes?.event_videos ? data?.extra_attributes?.event_videos?.split(',') : [])
            setVenueImages(data?.extra_attributes?.venue_images ? data?.extra_attributes?.venue_images?.split(',') : [])
        }
        fetchEventData()
    }, [id])

    const initialValue = {
        name: eventData?.name || '',
        event_type: eventData?.event_type || '',
        description: eventData?.description || '',
        image_web: eventData?.image_web || '',
        image_mobile: eventData?.image_mobile || '',
        total_slots: eventData?.total_slots || 0,
        registration_start_date: eventData?.registration_start_date || '',
        registration_end_date: eventData?.registration_end_date || '',
        event_start_time: eventData?.event_start_time || '',
        event_end_time: eventData?.event_end_time || '',
        code_prefix: eventData?.code_prefix || '',
        is_active: eventData?.is_active || false,
        is_public: eventData?.is_public || false,
        latitude: eventData?.latitude || 12.920216,
        longitude: eventData?.longitude || 77.649326,
        venue: eventData?.venue,
        terms_and_conditions: eventData?.terms_and_conditions,
        extra_attributes: {
            venue_address: eventData?.extra_attributes.venue_address || '',
            category: eventData?.extra_attributes.category || '',
            sponsors: eventData?.extra_attributes.sponsors || [],
            special_instructions: eventData?.extra_attributes.special_instructions || '',
            bg_color: eventData?.extra_attributes.bg_color || '',
            button_color: eventData?.extra_attributes.button_color || '',
            button_font_color: eventData?.extra_attributes.button_font_color || '',
            legal_instruction: eventData?.extra_attributes.legal_instruction || '',
            carousel_auto_scroll: eventData?.extra_attributes.carousel_auto_scroll || false,
            time_interval: eventData?.extra_attributes.time_interval || 0,
            event_photos: eventData?.extra_attributes.event_photos || [],
            event_videos: eventData?.extra_attributes.event_videos || [],
            venue_images: eventData?.extra_attributes.venue_images || [],
            dummy_registration_count: eventData?.extra_attributes?.dummy_registration_count || 0,
        },
    }

    console.log('latitude is', eventData?.latitude)

    const [currLat, setCurrLat] = useState<number>(eventData?.latitude)
    const [currLong, setCurrLong] = useState<number>(eventData?.longitude)

    useEffect(() => {
        if (eventData?.latitude && eventData?.longitude) {
            setCurrLat(eventData.latitude)
            setCurrLong(eventData.longitude)
        }
    }, [eventData])

    const calculateAspectRatioFromStrings = async (imageSources: string[]): Promise<number[]> => {
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
    const calculateAspectRatio = async (files: File[]): Promise<number[]> => {
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

    const handleSubmit = async (values: any) => {
        console.log(`1`, values)
        notification.info({ message: 'In process' })
        setSpinner(true)
        let img_web_url = webImageView.join(',')
        let img_mobile_url = mobileImageView.join(',')
        let event_img_url = eventPhotos?.join(',')
        let event_video_url = eventVideos?.join(',')
        let venue_img_url = venueImages?.join(',')

        const imageWebUpload = await handleimage(values.web_image_array)
        console.log(`2`)
        if (values.web_image_array && values.web_image_array.length && !imageWebUpload) {
            console.log('image Upload return', values.web_image_array)
            return
        } else if (values.web_image_array && imageWebUpload) {
            const temp = [img_web_url, imageWebUpload]
            img_web_url = temp.filter((t) => t).join(',')
        }

        const imageMobileUpload = await handleimage(values.mobile_image_array)

        if (values.mobile_image_array && values.mobile_image_array.length && !imageMobileUpload) {
            return
        } else if (values.mobile_image_array && imageMobileUpload) {
            const temp = [img_mobile_url, imageMobileUpload]
            img_mobile_url = temp.filter((t) => t).join(',')
        }
        const imageEventUpload = await handleimage(values.event_images_array)

        if (values.event_images_array && values.event_images_array.length && !imageEventUpload) {
            return
        } else if (values.event_images_array && imageEventUpload) {
            const temp = [event_img_url, imageEventUpload]
            event_img_url = temp.filter((t) => t).join(',')
        }

        const videoEventUpload = await handleVideo(values.event_video_array)
        if (values.event_video_array && values.event_video_array.length && !videoEventUpload) {
            return
        } else if (values.event_video_array && videoEventUpload) {
            const temp = [event_video_url, videoEventUpload]
            event_video_url = temp.filter((t) => t).join(',')
        }

        const imageVenueUpload = await handleimage(values.venue_img_url)

        if (values.venue_img_url && values.venue_img_url.length && !imageVenueUpload) {
            return
        } else if (values.venue_img_url && imageVenueUpload) {
            const temp = [venue_img_url, imageVenueUpload]
            venue_img_url = temp.filter((t) => t).join(',')
        }

        console.log(`3`)
        const mobileAspectRatio =
            values?.mobile_image_array?.length > 0
                ? await calculateAspectRatio(values.mobile_image_array)
                : values?.image_mobile && typeof mobileImageView !== 'undefined'
                  ? await calculateAspectRatioFromStrings(mobileImageView)
                  : (values?.extra_attributes?.mobile_aspect_ratio ?? null)

        const webAspectRatio =
            values?.web_image_array?.length > 0
                ? await calculateAspectRatio(values.web_image_array)
                : values?.image_web && typeof webImageView !== 'undefined'
                  ? await calculateAspectRatioFromStrings(webImageView)
                  : (values?.extra_attributes?.web_aspect_ratio ?? null)

        console.log('webAspectratio')

        const description = values.description ?? ''
        const specialInstructions = values.extra_attributes.special_instructions ?? ''
        const termsAndConditions = values.terms_and_conditions ?? ''

        const body = {
            ...(values?.name && { name: values.name }),
            ...(values?.event_type && { event_type: values.event_type }),
            ...(description && { description }),
            ...(imageWebUpload && { image_web: img_web_url }),
            ...(imageMobileUpload && { image_mobile: img_mobile_url }),
            ...(values?.total_slots && { total_slots: values.total_slots }),
            ...(values?.registration_start_date && { registration_start_date: values.registration_start_date }),
            ...(values?.registration_end_date && { registration_end_date: values.registration_end_date }),
            ...(values?.event_start_time && { event_start_time: values.event_start_time }),
            ...(values?.event_end_time && { event_end_time: values.event_end_time }),
            ...(values?.code_prefix && { code_prefix: values.code_prefix }),
            is_active: values?.is_active ?? false,
            is_public: values?.is_public ?? false,
            ...(currLat && { latitude: currLat }),
            ...(currLong && { longitude: currLong }),
            ...(termsAndConditions && { terms_and_conditions: termsAndConditions }),
            ...(values?.venue && { venue: values.venue }),
            extra_attributes: {
                ...(values.extra_attributes?.venue_address && { venue_address: values.extra_attributes.venue_address }),
                ...(values.extra_attributes?.category && { category: values.extra_attributes.category }),
                ...(values.extra_attributes?.bg_color && { bg_color: values.extra_attributes.bg_color }),
                ...(values.extra_attributes?.button_color && { button_color: values.extra_attributes.button_color }),
                ...(values.extra_attributes?.button_font_color && { button_font_color: values.extra_attributes.button_font_color }),
                ...(values.extra_attributes?.sponsors && {
                    sponsors: Array.isArray(values.extra_attributes.sponsors)
                        ? values.extra_attributes.sponsors
                        : values.extra_attributes.sponsors.split(','),
                }),
                ...(specialInstructions && { special_instructions: specialInstructions }),
                ...(webAspectRatio[0] && { web_aspect_ratio: Number(webAspectRatio[0]?.toFixed(2)) }),
                ...(mobileAspectRatio[0] && { mobile_aspect_ratio: Number(mobileAspectRatio[0]?.toFixed(2)) }),
                ...(values.extra_attributes?.legal_instruction && { legal_instruction: values.extra_attributes.legal_instruction }),
                ...(values.extra_attributes?.carousel_auto_scroll && {
                    carousel_auto_scroll: values.extra_attributes.carousel_auto_scroll,
                }),
                ...(values.extra_attributes?.time_interval && { time_interval: values.extra_attributes.time_interval }),
                ...(event_img_url && { event_photos: event_img_url }),
                ...(event_video_url && { event_videos: event_video_url }),
                ...(venue_img_url && { venue_images: venue_img_url }),
                dummy_registration_count: values.extra_attributes.dummy_registration_count ?? 0,
            },
        }
        console.log('object', body)
        try {
            await editEventSeries({ id: id, body })
        } catch (error) {
            console.log('error', error)
            notification.error({
                message: 'Failed to edit Event',
            })
        } finally {
            setSpinner(false)
        }
    }

    return (
        <div className="p-4 shadow-lg rounded-xl bg-white dark:bg-gray-900">
            <h3 className="mb-5 from-neutral-900 font-semibold">Edit Event</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-full">
                        {/* Form */}
                        <EventFormCommon
                            editMode
                            setCurrLat={setCurrLat}
                            setCurrLong={setCurrLong}
                            currLat={currLat}
                            currLong={currLong}
                            values={values}
                            initialValue={initialValue}
                            handleRemoveImage={handleRemoveImage}
                            webImageView={webImageView}
                            mobileImageView={mobileImageView}
                            eventPhotos={eventPhotos}
                            eventVideos={eventVideos}
                            venueImages={venueImages}
                        />

                        <br />
                        <FormContainer>
                            <Button variant="accept" type="submit">
                                <div className="flex gap-2 items-center">
                                    {spinner && (
                                        <span>
                                            <Spinner size={20} color="white" />
                                        </span>
                                    )}
                                    Submit
                                </div>
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditEvents
