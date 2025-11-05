/* eslint-disable @typescript-eslint/no-explicit-any */
import FullDateForm from '@/common/FullDateForm'
import { Button, Checkbox, Dialog, FormContainer, FormItem } from '@/components/ui'
import { offersService } from '@/store/services/offersService'
import { notification } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { useEffect } from 'react'

interface Props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    offerIdStore: number[]
}

const BulkOfferUpdateModal = ({ isOpen, setIsOpen, offerIdStore }: Props) => {
    const [bulkUpdate, updateResponse] = offersService.useOffersEditBulkMutation()

    useEffect(() => {
        if (updateResponse.isSuccess) {
            console.log('updateResponse', updateResponse)
            notification.success({ message: updateResponse?.data?.message || 'Offer updated successfully' })
            setIsOpen(false)
        }
        if (updateResponse.isError) {
            console.log('updateResponse error', updateResponse)
            notification.error({ message: (updateResponse?.error as any)?.data?.body?.message || 'Something went wrong' })
            console.log('updateResponse error', updateResponse)
        }
    }, [])

    const handleSubmit = async (values: any) => {
        console.log(values)
        const offerBody = offerIdStore?.map((id) => ({
            id,
            is_active: values.is_active,
            start_date: values.start_date,
            end_date: values.end_date,
        }))

        const body = { offers: offerBody }
        await bulkUpdate(body)
    }

    return (
        <div>
            <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)}>
                <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                    {() => (
                        <Form>
                            <FormItem label="Is Active">
                                <Field name="is_active" component={Checkbox} type="checkbox" />
                            </FormItem>

                            <FullDateForm label="SHIFT START" name="start_date" fieldname="start_date" />
                            <FullDateForm label="SHIFT END" name="end_date" fieldname="end_date" />

                            <FormContainer className="flex justify-end pt-4">
                                <Button variant="accept" type="submit">
                                    Submit
                                </Button>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    )
}

export default BulkOfferUpdateModal
