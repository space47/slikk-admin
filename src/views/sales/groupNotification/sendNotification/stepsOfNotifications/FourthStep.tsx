/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Dialog } from '@/components/ui'
import React, { useEffect, useState } from 'react'
import { sendNotificationType, USERNOTFARRAY } from '../sendNotify.common'
import { Formik, Form, Field } from 'formik'
import moment from 'moment'
import Button from '@/components/ui/Button'
import { CronExpressionParser } from 'cron-parser'
import { MdTimer } from 'react-icons/md'
import { DatePicker, Radio, Select, Checkbox as Checkbx } from 'antd'

interface FourthStepProps {
    handleSchedule: (value: any) => void
    valueForSchedule: any
    scheduleModal: boolean
    values: sendNotificationType
    setValueForSchedule: (value: any) => void
    setShowScheduleModal: (value: boolean) => void
    setFieldValue: any
    handleOk: (values: any) => void
}

const FourthStep = ({
    scheduleModal,
    handleSchedule,
    values,
    setValueForSchedule,
    setShowScheduleModal,
    handleOk,
    setFieldValue,
}: FourthStepProps) => {
    console.log('values', values?.schedule_notification)

    const handleClose = () => {
        setFieldValue('schedule_notification', false)
        setShowScheduleModal(false)
    }

    return (
        <div
            className={
                scheduleModal
                    ? 'pace-y-6 shadow-lg rounded-lg px-14 py-9 xl:w-[500px] xl:h-[390px] '
                    : 'pace-y-6 shadow-lg rounded-lg px-14 py-9 xl:w-2/3 xl:h-[390px] '
            }
        >
            {USERNOTFARRAY.map((item, key) => (
                <FormItem key={key} label={item.label} className={item.classname}>
                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                </FormItem>
            ))}

            <div className="flex gap-3 ">
                <Field type="checkbox" name="users_all" component={Checkbox} />
                <div className="font-bold">Send to all Users</div>
            </div>
            <br />
            <FormContainer className="flex gap-3">
                <Field name="schedule_notification">
                    {({ field, form }: any) => (
                        <>
                            <Field
                                type="checkbox"
                                name="schedule_notification"
                                onChange={(e) => {
                                    form.setFieldValue('schedule_notification', true)
                                    setShowScheduleModal(true)
                                    setValueForSchedule(form.values)
                                }}
                            />
                            <div className="font-bold">Schedule Notification for Later</div>
                        </>
                    )}
                </Field>
            </FormContainer>
            {!values?.users_all && (
                <div className="mt-4 px-4 py-2 rounded-md flex flex-col bg-blue-50 border border-blue-200 text-blue-800 font-medium shadow-sm w-fit">
                    <div>Group Name : {values?.groupId?.name || 'No Group Selected'}</div>
                    <div>Users: {values?.groupId?.user?.length || 0}</div>
                </div>
            )}
            {scheduleModal && (
                <SchedularPage
                    handleOk={handleOk}
                    showScheduleModal={scheduleModal}
                    setShowScheduleModal={setShowScheduleModal}
                    scheduleValues={values}
                    setFieldValuex={setFieldValue}
                    handleClose={handleClose}
                />
            )}
        </div>
    )
}

export default FourthStep

interface SchedularPageProps {
    handleOk: (values: any) => void
    scheduleValues: any
    showScheduleModal: boolean
    setShowScheduleModal: (value: boolean) => void
    setFieldValuex: (field: string, value: any) => void
    handleClose: () => void
}

const REPEATARRAY = [
    { label: 'FIXED', value: 'no_repeat' },
    { label: 'REPEAT', value: 'repeat' },
]

const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => ({ label: i.toString(), value: i.toString() }))
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({ label: i.toString(), value: i.toString() }))
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }))
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }))

const SchedularPage = ({ handleOk, showScheduleModal, setShowScheduleModal, setFieldValuex, handleClose }: SchedularPageProps) => {
    const [nextOccurrences, setNextOccurrences] = useState<string[]>([])
    const [cronExpression, setCronExpression] = useState<string>('')

    const initialValues = {
        repeat_type: 'no_repeat',
        minute_enabled: false,
        hour_enabled: false,
        day_enabled: false,
        month_enabled: false,
        minute_value: '',
        hour_value: '',
        day_value: '',
        month_value: '',
    }

    useEffect(() => {
        if (cronExpression) {
            try {
                const options = {
                    currentDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    tz: `Asia/Kolkata`,
                }
                const interval = CronExpressionParser.parse(cronExpression, options)
                const nextDates = interval.take(10).map((date) => date.toString())
                setNextOccurrences(nextDates)
            } catch (error) {
                setNextOccurrences(['Invalid cron expression'])
            }
        }
    }, [cronExpression])

    const updateCronExpression = (values: any) => {
        if (values.repeat_type !== 'repeat') {
            setCronExpression('')
            return
        }

        const minute =
            values.minute_enabled && values.minute_value ? `*/${values.minute_value}` : values.minute_value ? `${values.minute_value}` : 0
        const hour = values.hour_enabled && values.hour_value ? `*/${values.hour_value}` : values.hour_value ? `${values.hour_value}` : 0
        const day = values.day_enabled && values.day_value ? `*/${values.day_value}` : values.day_value ? `${values.day_value}` : 0
        const month =
            values.month_enabled && values.month_value ? `*/${values.month_value}` : values.month_value ? `${values.month_value}` : 0

        const cron = `0 ${minute} ${hour} ${day} ${month} *`
        setCronExpression(cron)
    }

    return (
        <Dialog isOpen={showScheduleModal} onClose={handleClose} className="mb-10" width={800}>
            <div className="mt-10 mb-6 max-h-[70vh]  rounded-lg overflow-scroll bg-white shadow-xl">
                <div className=" mt-10 rounded-lg px-14 py-auto mb-6 overflow-y-scroll">
                    <h2 className="text-2xl font-bold mb-6">Schedular Configuration</h2>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values: any) => {
                            const dateTime = moment(values?.get_date, 'YYYY-MM-DD HH:mm:ss')
                            const modifiedValues: any = {
                                month: dateTime.format('MM'),
                                minute: dateTime.format('mm'),
                                day: dateTime.format('DD'),
                                year: dateTime.format('YYYY'),
                                hour: dateTime.format('HH'),
                            }

                            if (values.repeat_type === 'repeat') {
                                modifiedValues.minute =
                                    values.minute_enabled && values.minute_value
                                        ? `*/${values.minute_value}`
                                        : values.minute_value
                                          ? `${values.minute_value}`
                                          : 0
                                modifiedValues.hour =
                                    values.hour_enabled && values.hour_value
                                        ? `*/${values.hour_value}`
                                        : values.hour_value
                                          ? `${values.hour_value}`
                                          : 0
                                modifiedValues.day =
                                    values.day_enabled && values.day_value
                                        ? `*/${values.day_value}`
                                        : values.day_value
                                          ? `${values.day_value}`
                                          : 0
                                modifiedValues.month =
                                    values.month_enabled && values.month_value
                                        ? `*/${values.month_value}`
                                        : values.month_value
                                          ? `${values.month_value}`
                                          : 0
                                modifiedValues.year = moment().format('YYYY')
                            }

                            handleOk(modifiedValues)
                        }}
                    >
                        {({ setFieldValue, values }) => {
                            return (
                                <Form className="">
                                    <div>
                                        <FormItem label="Schedule Type" className="mb-6">
                                            <Radio.Group
                                                options={REPEATARRAY}
                                                defaultValue={REPEATARRAY[0].value}
                                                value={values.repeat_type}
                                                optionType="button"
                                                buttonStyle="solid"
                                                className="flex gap-4"
                                                onChange={(e) => setFieldValue('repeat_type', e.target.value)}
                                            />
                                        </FormItem>
                                    </div>

                                    {values.repeat_type === 'repeat' && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-4">Recurrence Settings</h3>
                                            <div className="grid xl:grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Checkbx
                                                        checked={values.minute_enabled}
                                                        onChange={(e) => setFieldValue('minute_enabled', e.target.checked)}
                                                    />
                                                    <span className="mr-2">Repeat</span>
                                                    <Select
                                                        allowClear
                                                        options={MINUTE_OPTIONS}
                                                        value={values.minute_value}
                                                        style={{ width: 100 }}
                                                        placeholder="Minutes"
                                                        onChange={(value) => setFieldValue('minute_value', value)}
                                                    />
                                                    <span>minute(s)</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Checkbx
                                                        checked={values.hour_enabled}
                                                        onChange={(e) => setFieldValue('hour_enabled', e.target.checked)}
                                                    />
                                                    <span className="mr-2">Repeat</span>
                                                    <Select
                                                        allowClear
                                                        options={HOUR_OPTIONS}
                                                        value={values.hour_value}
                                                        style={{ width: 100 }}
                                                        placeholder="Hours"
                                                        onChange={(value) => setFieldValue('hour_value', value)}
                                                    />
                                                    <span>hour(s)</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Checkbx
                                                        checked={values.day_enabled}
                                                        onChange={(e) => setFieldValue('day_enabled', e.target.checked)}
                                                    />
                                                    <span className="mr-2">Repeat</span>
                                                    <Select
                                                        allowClear
                                                        options={DAY_OPTIONS}
                                                        value={values.day_value}
                                                        style={{ width: 100 }}
                                                        placeholder="Days"
                                                        onChange={(value) => setFieldValue('day_value', value)}
                                                    />
                                                    <span>day(s)</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Checkbx
                                                        checked={values.month_enabled}
                                                        onChange={(e) => setFieldValue('month_enabled', e.target.checked)}
                                                    />
                                                    <span className="mr-2">Repeat</span>
                                                    <Select
                                                        allowClear
                                                        options={MONTH_OPTIONS}
                                                        value={values.month_value}
                                                        style={{ width: 100 }}
                                                        placeholder="Months"
                                                        onChange={(value) => setFieldValue('month_value', value)}
                                                    />
                                                    <span>month(s)</span>
                                                </div>
                                                <div>
                                                    <button type="button" onClick={() => updateCronExpression(values)}>
                                                        <MdTimer className="text-xl font-bold" />
                                                    </button>
                                                </div>
                                            </div>

                                            {cronExpression && (
                                                <div className="mt-6">
                                                    <div>
                                                        <div className="mb-5 font-bold">Schedule for next 10 events</div>
                                                        <ul className="list-disc pl-5">
                                                            {nextOccurrences.map((date, index) => (
                                                                <li key={index}>{date}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <FormContainer className="xl:grid xl:grid-cols-2 xl:gap-10 flex flex-col ">
                                        {values?.repeat_type === 'no_repeat' && (
                                            <div>
                                                <FormContainer>
                                                    <FormItem label="Start Date" className="mt-4">
                                                        <Field name="get_date">
                                                            {({ field, form }: any) => (
                                                                <DatePicker
                                                                    showTime
                                                                    placeholder=""
                                                                    value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                                    className=""
                                                                    onChange={(value) => {
                                                                        form.setFieldValue(
                                                                            'get_date',
                                                                            value ? value.format('YYYY-MM-DD HH:mm:ss') : '',
                                                                        )
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                </FormContainer>
                                            </div>
                                        )}
                                        <FormItem className="mt-4" label="Expiry Date">
                                            <Field name="expiry_date">
                                                {({ field, form }: any) => (
                                                    <DatePicker
                                                        placeholder=""
                                                        value={field.value ? moment(field.value, 'YYYY-MM-DD') : null}
                                                        className=""
                                                        onChange={(value) => {
                                                            form.setFieldValue('expiry_date', value ? value.format('YYYY-MM-DD') : '')
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>

                                    <div className="text-right mt-6 flex justify-end">
                                        <Button variant="solid" type="submit">
                                            Schedule
                                        </Button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Dialog>
    )
}
