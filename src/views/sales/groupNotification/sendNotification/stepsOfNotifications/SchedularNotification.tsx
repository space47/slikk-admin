import { Field, Form, Formik } from 'formik'
import React from 'react'
import { SchedulerARRAY } from '../sendNotify.common'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import moment from 'moment'
import { DatePicker } from 'antd'

interface SchedularModal {
    handleOk: any
}

const SchedularNotification = ({ handleOk }: SchedularModal) => {
    const initialValues = {}

    return (
        <div>
            <div className="f">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
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
                                    {/* {SchedulerARRAY.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="flex gap-3">
                                            <div>Frequent</div>
                                            <Field
                                                type="checkbox"
                                                name={`checkBox_${item.name}`}
                                                placeholder={`Enter ${item.label}`}
                                                component={Input}
                                            />

                                        </FormItem>
                                    ))} */}

                                    <h3> Date and Time</h3>
                                    <FormContainer>
                                        <Field name="get_date">
                                            {({ field, form }: any) => (
                                                <DatePicker
                                                    showTime
                                                    placeholder=""
                                                    value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                    onChange={(value) => {
                                                        form.setFieldValue('get_date', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormContainer>
                                </FormContainer>
                                <FormItem className="" label="Expiry Date">
                                    <Field name="expiry_date">
                                        {({ field, form }: any) => (
                                            <DatePicker
                                                showTime
                                                placeholder=""
                                                value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                onChange={(value) => {
                                                    form.setFieldValue('expiry_date', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <div className="text-right mt-6">
                                    <Button variant="solid" type="submit">
                                        Schedule
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default SchedularNotification
