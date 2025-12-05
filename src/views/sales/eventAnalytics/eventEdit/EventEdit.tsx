/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import EventForm from '../eventUtils/EventForm'
import { Button, FormContainer } from '@/components/ui'
import { useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'

const EventEdit = () => {
    const { id } = useParams()
    const [eventData, setEventData] = useState<any>(null)

    const fetchData = async (id: string | undefined) => {
        try {
            const response = await axioisInstance.get(`notification/event/${id}`)
            setEventData(response.data)
        } catch (error) {
            console.log('Error fetching event data:', error)
        }
    }

    useEffect(() => {
        fetchData(id)
    }, [id])

    const initialValues = {
        name: eventData?.name || '',
        properties: eventData?.attributes?.properties
            ? Object?.entries(eventData?.attributes?.properties)?.map(([key, val]: any) => ({
                  key: key,
                  path: val?.path,
                  type: val?.type,
              }))
            : [{ key: '', path: '', type: '' }],
        aggregation: eventData?.attributes?.aggregation
            ? Object?.entries(eventData?.attributes?.aggregation)?.map(([key, val]: any) => ({
                  key: key,
                  path: val?.path,
                  type: val?.type,
              }))
            : [{ key: '', path: '', type: '' }],
    }

    const handleSubmit = async (values: any) => {
        console.log('Form submitted with values:', values)
        const formattedProperties: Record<string, any> = {}
        values.properties.forEach((item: any) => {
            if (item.key) {
                formattedProperties[item.key] = {
                    path: item.path,
                    type: item.type,
                }
            }
        })

        const formattedAggregation: Record<string, any> = {}
        values.aggregation.forEach((item: any) => {
            if (item.key) {
                formattedAggregation[item.key] = {
                    path: item.path,
                    type: item.type,
                }
            }
        })

        const finalPayload = {
            name: values.name,
            attributes: {
                properties: formattedProperties,
                aggregation: formattedAggregation,
            },
        }

        try {
            const res = await axioisInstance.patch(`notification/event/${id}`, finalPayload)
            notification.success({ message: res?.data?.data?.message || 'Event updated successfully' })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Error updating event' })
            }
            console.log('Error updating event:', error)
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue, resetForm }) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl ">
                        <EventForm values={values} />
                        <FormContainer className="mt-10">
                            <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EventEdit
