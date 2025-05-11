/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { eventSeriesService } from '@/store/services/eventSeriesService'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import EventFormCommon from '../eventCommons/EventFormCommon'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { handleimage, handleVideo } from '@/views/category-management/catalog/handlingProductImage'

const AddEvents = () => {
    const navigate = useNavigate()
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)
    const [addEventSeries, addEventResponse] = eventSeriesService.useAddEventSeriesMutation()
    const initialValue = {
        is_active: true,
        is_public: true,
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

    useEffect(() => {
        if (addEventResponse?.isSuccess) {
            notification.success({
                message: addEventResponse?.data?.success || 'Successfully Added Event',
            })
            navigate(-1)
        }
    }, [addEventResponse?.isSuccess])

    const handleImageCheck = async (field: any) => {
        return field && field.length > 0 ? await handleimage(field) : null
    }

    const handleSubmit = async (values: any) => {
        const imageUploadWeb = await handleImageCheck(values.web_image_array)
        const imageUploadMobile = await handleImageCheck(values.mobile_image_array)
        const imageUploadEventVideos = await handleImageCheck(values.event_video_array)
        const imageUploadVenue = await handleImageCheck(values.venue_img_url)
        const imageUploadEventPhotos = await handleImageCheck(values.event_images_array)

        const mobileAspectRatio =
            values.web_image_array?.length > 0
                ? await calculateAspectRatio(values.web_image_array)
                : values?.extra_attributes?.mobile_aspect_ratio || null

        const webAspectRatio =
            values.mobile_image_array?.length > 0
                ? await calculateAspectRatio(values.mobile_image_array)
                : values?.extra_attributes?.web_aspect_ratio || null

        const description = values.description ?? ''
        const specialInstructions = values.extra_attributes.special_instructions ?? ''
        const termsAndConditions = values.terms_and_conditions ?? ''

        const body = {
            name: values.name,
            event_type: values.event_type,
            description: description,
            ...(imageUploadWeb && { image_web: imageUploadWeb }),
            ...(imageUploadMobile && { image_mobile: imageUploadMobile }),
            total_slots: values.total_slots,
            registration_start_date: values.registration_start_date,
            registration_end_date: values.registration_end_date,
            event_start_time: values.event_start_time,
            event_end_time: values.event_end_time,
            ...(values.code_prefix && { code_prefix: values.code_prefix }),
            is_active: values.is_active,
            is_public: values.is_public,
            code_prefix: values.code_prefix,
            ...(currLat && { latitude: currLat }),
            ...(currLong && { longitude: currLong }),
            ...(values?.venue && { venue: values.venue }),
            ...(termsAndConditions && { terms_and_conditions: termsAndConditions }),
            extra_attributes: {
                ...(values.extra_attributes.venue_address && { venue_address: values.extra_attributes.venue_address }),
                ...(values.extra_attributes.category && { category: values.extra_attributes.category }),
                ...(values.extra_attributes.sponsors && { sponsors: values.extra_attributes.sponsors?.split(',') }),
                ...(values?.extra_attributes?.bg_color && { bg_color: values.extra_attributes.bg_color }),
                ...(values?.extra_attributes?.button_color && { button_color: values.extra_attributes.button_color }),
                ...(values?.extra_attributes?.button_font_color && { button_font_color: values.extra_attributes.button_font_color }),
                ...(specialInstructions && { special_instructions: specialInstructions }),
                ...(webAspectRatio[0] && { web_aspect_ratio: Number(webAspectRatio[0]?.toFixed(2)) }),
                ...(mobileAspectRatio[0] && { mobile_aspect_ratio: Number(mobileAspectRatio[0]?.toFixed(2)) }),
                ...(values?.extra_attributes.legal_instruction && { legal_instruction: values.extra_attributes.legal_instruction }),
                ...(values?.extra_attributes.carousel_auto_scroll && {
                    carousel_auto_scroll: values.extra_attributes.carousel_auto_scroll,
                }),
                ...(values?.extra_attributes.time_interval && { time_interval: values.extra_attributes.time_interval }),
                ...(imageUploadEventVideos && { event_video: imageUploadEventVideos }),
                ...(imageUploadVenue && { venue_img_url: imageUploadVenue }),
                ...(imageUploadEventPhotos && { event_images: imageUploadEventPhotos }),
            },
        }

        await addEventSeries(body)
            .unwrap()
            .then(() => {})
            .catch(() => {
                notification.error({
                    message: 'Failed to add Event',
                })
            })
    }

    return (
        <div className="p-4 shadow-lg rounded-xl bg-white dark:bg-gray-900">
            <h3 className="mb-5 from-neutral-900 font-semibold">Add New Event</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-full">
                        <EventFormCommon
                            setCurrLat={setCurrLat}
                            setCurrLong={setCurrLong}
                            currLat={currLat}
                            currLong={currLong}
                            values={values}
                        />
                        {/* Form */}
                        <FormContainer className="mt-5">
                            <Button variant="accept" type="submit">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddEvents
