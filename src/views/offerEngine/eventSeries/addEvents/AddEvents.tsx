/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { eventSeriesService } from '@/store/services/eventSeriesService'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import EventFormCommon from '../eventCommons/EventFormCommon'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { handleimage } from '@/common/handleImage'
import { textParser } from '@/common/textParser'

const AddEvents = () => {
    const navigate = useNavigate()
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)
    const [addEventSeries, addEventResponse] = eventSeriesService.useAddEventSeriesMutation()
    const initialValue = {}

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

    useEffect(() => {
        if (addEventResponse?.isSuccess) {
            notification.success({
                message: addEventResponse?.data?.success || 'Successfully Added Event',
            })
            navigate(-1)
        }
    }, [addEventResponse?.isSuccess])

    const handleSubmit = async (values: any) => {
        const processImageUpload = async (imageArray: any[], currentImage: string) => {
            return imageArray.length > 0 ? await handleimage('product', imageArray) : currentImage
        }
        const imageUploadWeb = await processImageUpload(values.web_image_array, values.image_web)
        const imageUploadMobile = await processImageUpload(values.mobile_image_array, values.image_mobile)

        // const mobileAspectratio =
        //     values.web_image_array?.length > 0
        //         ? await calculateAspectRatio(values.web_image_array)
        //         : values.image_mobile
        //           ? await calculateAspectRatioFromStrings(values.image_mobile)
        //           : values?.extra_attributes?.mobile_aspect_ratio || null

        // const webAspectratio =
        //     values.web_image_array?.length > 0
        //         ? await calculateAspectRatio(values.web_image_array)
        //         : values.image_web
        //           ? await calculateAspectRatioFromStrings(values.image_web)
        //           : values?.extra_attributes?.web_aspect_ratio || null

        const description = textParser(values.description)
        const specialInstructions = textParser(values.extra_attributes.special_instructions)

        const body = {
            name: values.name,
            event_type: values.event_type,
            description: description,
            image_web: imageUploadWeb,
            image_mobile: imageUploadMobile,
            total_slots: values.total_slots,
            registration_start_date: values.registration_start_date,
            registration_end_date: values.registration_end_date,
            event_start_time: values.event_start_time,
            event_end_time: values.event_end_time,
            code_prefix: values.code_prefix,
            is_active: values.is_active,
            is_public: values.is_public,
            latitude: currLat,
            longitude: currLong,
            extra_attributes: {
                venue: values.extra_attributes.venue,
                category: values.extra_attributes.category,
                sponsors: values.extra_attributes.sponsors?.split(','),
                special_instructions: specialInstructions,
                // web_aspect_ratio: webAspectratio,
                // mobile_aspect_ratio: mobileAspectratio,
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
