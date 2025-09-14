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
        properties: [{ key: '', type: '' }],
    }

    const handleSubmit = async (values: any) => {
        console.log('Form submitted with values:', values)
        const formattedProps: Record<string, string> = {}
        values.properties.forEach((item: any) => {
            if (item.key && item.type) {
                formattedProps[item.key] = item.type
            }
        })

        const finalPayload = {
            name: values.name,
            attributes: formattedProps,
        }

        try {
            const res = await axioisInstance.post(`notification/event`, finalPayload)
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
            <Formik
                enableReinitialize
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
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

export default EventAdd
