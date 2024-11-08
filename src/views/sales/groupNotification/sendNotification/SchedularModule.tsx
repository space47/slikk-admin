/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Formik, Form, Field } from 'formik'
import { FormContainer, FormItem, Input } from '@/components/ui'
import { SchedulerARRAY } from './sendNotify.common'

interface SchedularModalProps {
    dialogIsOpen: boolean
    handleClose: () => void
    handleOk: (values: any) => void
    scheduleValues: any
}

const SchedularModal = ({ dialogIsOpen, handleClose, handleOk, scheduleValues }: SchedularModalProps) => {
    console.log('Schedule values', scheduleValues)
    const initialValues = {}

    return (
        <Dialog isOpen={dialogIsOpen} onClose={handleClose} onRequestClose={handleClose}>
            <h5 className="mb-4">Schedular Config</h5>
            <Formik
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    const modifiedValues = { ...values }
                    SchedulerARRAY.forEach((item) => {
                        if (values[`checkBox_${item.name}`]) {
                            modifiedValues[item.name] = `*/${modifiedValues[item.name]}`
                        }
                    })

                    handleOk(modifiedValues)
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-3 gap-2">
                            {SchedulerARRAY.map((item, key) => (
                                <FormItem key={key} label={item.label} className="flex gap-3">
                                    <div>Frequent</div>
                                    <Field
                                        type="checkbox"
                                        name={`checkBox_${item.name}`}
                                        placeholder={`Enter ${item.label}`}
                                        component={Input}
                                    />

                                    <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} />
                                </FormItem>
                            ))}
                        </FormContainer>
                        <FormItem className="" label="Expiry Date">
                            <Field
                                type="text"
                                name="expiry_date"
                                placeholder="Enter Expiry Date"
                                component={Input}
                                className="col-span-1 w-1/2"
                            />
                        </FormItem>
                        <div className="text-right mt-6">
                            <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="solid" type="submit">
                                Okay
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default SchedularModal
