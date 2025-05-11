/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { eventSeriesService } from '@/store/services/eventSeriesService'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EventFormCommon from '../eventCommons/EventFormCommon'
import { notification } from 'antd'
import { handleimage } from '@/common/handleImage'
import axios from 'axios'
import { textParser } from '@/common/textParser'

function removeEmptyValues(obj: any): any {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => [key, typeof value === 'object' && !Array.isArray(value) ? removeEmptyValues(value) : value]),
    )
}

const EditEvents = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [editEventSeries] = eventSeriesService.useEditEventSeriesMutation()
    const [webImageView, setWebImageView] = useState<string[]>([])
    const [mobileImageView, setMobileImageView] = useState<string[]>([])

    const [eventData, setEventData] = useState<any>(null)

    useEffect(() => {
        const fetchEventData = async () => {
            const response = await axioisInstance.get(`/dashboard/promotion/events?event_id=${id}`)
            const data = response.data?.data
            setEventData(data)
            setWebImageView(data?.image_web ? [data?.image_web] : [])
            setMobileImageView(data?.image_mobile ? [data?.image_mobile] : [])
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

        extra_attributes: {
            venue: eventData?.extra_attributes.venue || '',
            category: eventData?.extra_attributes.category || '',
            sponsors: eventData?.extra_attributes.sponsors || [],
            special_instructions: eventData?.extra_attributes.special_instructions || '',
            bg_color: eventData?.extra_attributes.bg_color || '',
            button_color: eventData?.extra_attributes.button_color || '',
            button_font_color: eventData?.extra_attributes.button_font_color || '',
        },
    }

    const [currLat, setCurrLat] = useState<number>(initialValue?.latitude || 12.920216)
    const [currLong, setCurrLong] = useState<number>(initialValue?.longitude || 77.649326)

    const handleRemoveImage = (type: 'image_web' | 'image_mobile') => {
        setEventData((prev: any) => ({
            ...prev,
            [type]: '',
        }))

        if (type === 'image_web') {
            setWebImageView([])
        } else {
            setMobileImageView([])
        }
    }

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

        // const processImageUpload = async (imageArray: any[] | undefined, currentImage: string | null) => {
        //     return imageArray?.length > 0 ? await handleimage('product', imageArray) : (currentImage ?? null)
        // }
        const processImageUpload = async (imageArray: any[], currentImage: string) => {
            return imageArray.length > 0 ? await handleimage('product', imageArray) : currentImage
        }

        console.log(`2`)
        // const imageUploadWeb = await processImageUpload(values?.web_image_array, values?.image_web)
        const imageUploadMobile =
            values?.mobile_image_array?.length > 0 ? await handleimage('product', values.mobile_image_array) : mobileImageView[0] || null

        const imageUploadWeb =
            values?.web_image_array?.length > 0 ? await handleimage('product', values.web_image_array) : webImageView[0] || null

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

        const description = textParser(values.description)
        const specialInstructions = textParser(values.extra_attributes.special_instructions)

        const body = {
            name: values?.name ?? null,
            event_type: values?.event_type ?? null,
            description: description ?? null,
            image_web: imageUploadWeb,
            image_mobile: imageUploadMobile,
            total_slots: values?.total_slots ?? null,
            registration_start_date: values?.registration_start_date ?? null,
            registration_end_date: values?.registration_end_date ?? null,
            event_start_time: values?.event_start_time ?? null,
            event_end_time: values?.event_end_time ?? null,
            code_prefix: values?.code_prefix ?? null,
            is_active: values?.is_active ?? false,
            is_public: values?.is_public ?? false,
            latitude: currLat ?? null,
            longitude: currLong ?? null,
            extra_attributes: {
                venue: values?.extra_attributes?.venue ?? null,
                category: values?.extra_attributes?.category ?? null,
                bg_color: values?.extra_attributes?.bg_color ?? null,
                button_color: values?.extra_attributes?.button_color ?? null,
                button_font_color: values?.extra_attributes?.button_font_color ?? null,
                sponsors: Array.isArray(values?.extra_attributes?.sponsors)
                    ? values?.extra_attributes?.sponsors
                    : (values?.extra_attributes?.sponsors?.split(',') ?? []),
                special_instructions: specialInstructions ?? null,
                web_aspect_ratio: Number(webAspectRatio[0]?.toFixed(2)),
                mobile_aspect_ratio: Number(mobileAspectRatio[0]?.toFixed(2)),
            },
        }

        console.log('here')

        try {
            const response = await axios.patch(`/dashboard/promotion/events/${id}`, body)
            notification.success({
                message: response?.data?.success || 'Successfully Edited Event',
            })
            navigate(-1)
        } catch (error) {
            console.log('error', error)
            notification.error({
                message: 'Failed to edit Event',
            })
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
                        />

                        <br />
                        <FormContainer>
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

export default EditEvents
