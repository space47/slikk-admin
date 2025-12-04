/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React from 'react'
import EventForm from '../eventUtils/EventForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'

const EventAdd = () => {
    const initialValues = {
        name: '',
        properties: [{ key: '', path: '', type: '' }],
        aggregation: [{ key: '', path: '', type: '' }],
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

        console.log('FINAL PAYLOAD =>', finalPayload)

        try {
            const res = await axioisInstance.post(`notification/event`, finalPayload)
            notification.success({ message: res?.data?.data?.message || 'Event created successfully' })
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
                {({ values }) => (
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

export default EventAdd
