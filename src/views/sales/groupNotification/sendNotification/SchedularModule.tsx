/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, Field } from 'formik'
import { FormContainer, FormItem, Input } from '@/components/ui'
import { SchedulerARRAY } from './sendNotify.common'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { DatePicker } from 'antd'
import moment from 'moment'
import Button from '@/components/ui/Button'

const REPEATARRAY = [
    { label: 'Day', value: 'day' },
    { label: 'Hour', value: 'hour' },
]

interface SchedularPageProps {
    handleOk: (values: any) => void
    scheduleValues: any
}

const SchedularPage = ({ handleOk, scheduleValues }: SchedularPageProps) => {
    console.log('Schedule values', scheduleValues)
    const initialValues = {}

    return (
        <div className="space-y-6 shadow-lg rounded-lg px-14 py-9 mb-6 w-[80%] h-1/2">
            <h2 className="text-2xl font-bold mb-6">Schedular Configuration</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    const dateTime = moment(values?.get_date, 'YYYY-MM-DD HH:mm:ss')
                    const modifiedValues: Record<string, string> = {
                        month: dateTime.format('MM'),
                        minute: dateTime.format('mm'),
                        day: dateTime.format('DD'),
                        year: dateTime.format('YYYY'),
                        hour: dateTime.format('HH'),
                        ...values,
                    }

                    switch (values.repeat_data) {
                        case 'day':
                            modifiedValues.day = `*/${dateTime.format('DD')}`
                            break
                        case 'hour':
                            modifiedValues.hour = `*/${dateTime.format('HH')}`
                            break
                        default:
                            break
                    }
                    handleOk(modifiedValues)
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <FormContainer className="grid grid-cols-2 gap-10 items-center">
                            <div>
                                <FormContainer>
                                    <FormItem label="Start Date" className="mt-4">
                                        <Field name="get_date">
                                            {({ field, form }: any) => (
                                                <DatePicker
                                                    showTime
                                                    placeholder=""
                                                    value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                    onChange={(value) => {
                                                        form.setFieldValue('get_date', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                                    }}
                                                    className="xl:w-full"
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </FormContainer>
                            </div>
                            <FormItem className="mt-4" label="Expiry Date">
                                <Field name="expiry_date">
                                    {({ field, form }: any) => (
                                        <DatePicker
                                            placeholder=""
                                            value={field.value ? moment(field.value, 'YYYY-MM-DD') : null}
                                            onChange={(value) => {
                                                form.setFieldValue('expiry_date', value ? value.format('YYYY-MM-DD') : '')
                                            }}
                                            className="xl:w-full"
                                        />
                                    )}
                                </Field>
                                {/* <Field type="date" name="expiry_date" placeholder="Enter expiry date" component={Input}
                                 /> */}
                            </FormItem>
                        </FormContainer>
                        <div>
                            <CommonSelect name="repeat_data" label="Repeat" options={REPEATARRAY} needClassName className="w-1/2" />
                        </div>

                        <div className="text-right mt-6 flex justify-end">
                            <Button variant="solid" type="submit">
                                Schedule
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SchedularPage
