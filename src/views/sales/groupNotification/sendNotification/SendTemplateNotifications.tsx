/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DAY_OPTIONS, HOUR_OPTIONS, MINUTE_OPTIONS, MONTH_OPTIONS, REPEATARRAY, USERNOTFARRAY } from './sendNotify.common'
import { Checkbox, FormItem, Input } from '@/components/ui'
import { DatePicker, Radio, Select, Checkbox as Checkbx, notification } from 'antd'
import { MdTimer } from 'react-icons/md'
import moment from 'moment'
import { CronExpressionParser } from 'cron-parser'
import SearchableGroups from '@/common/SearchableGroups'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import FormButton from '@/components/ui/Button/FormButton'

interface FormValues {
    users_all?: boolean
    schedule_notification?: boolean
    repeat_type: 'repeat' | 'no_repeat'
    minute_enabled?: boolean
    minute_value?: number
    hour_enabled?: boolean
    hour_value?: number
    day_enabled?: boolean
    day_value?: number
    month_enabled?: boolean
    month_value?: number
    get_date?: string
    expiry_date?: string
    [key: string]: any
}

const CronPreview: React.FC<{ cronExpression: string }> = ({ cronExpression }) => {
    const [nextOccurrences, setNextOccurrences] = useState<string[]>([])

    useEffect(() => {
        if (!cronExpression) {
            setNextOccurrences([])
            return
        }

        try {
            const options = {
                currentDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                tz: 'Asia/Kolkata',
            }
            const interval = CronExpressionParser.parse(cronExpression, options)
            const nextDates = interval.take(10).map((date) => date.toString())
            setNextOccurrences(nextDates)
        } catch (error) {
            setNextOccurrences(['Invalid cron expression'])
        }
    }, [cronExpression])

    if (!cronExpression) return null

    return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div className="font-semibold text-gray-700 mb-3">Next 10 Scheduled Events</div>
            <ul className="list-disc pl-5 space-y-1">
                {nextOccurrences.map((date, index) => (
                    <li key={index} className="text-gray-600">
                        {date}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const RecurrenceField: React.FC<{
    fieldName: string
    label: string
    options: Array<{ value: number | string; label: string }>
    values: any
    setFieldValue: (field: string, value: any) => void
}> = ({ fieldName, label, options, values, setFieldValue }) => {
    const enabledField = `${fieldName}_enabled`
    const valueField = `${fieldName}_value`

    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <Checkbx checked={values[enabledField]} onChange={(e) => setFieldValue(enabledField, e.target.checked)} />
            <span className="text-gray-700 min-w-[60px]">Repeat every</span>
            <Select
                allowClear
                options={options}
                value={values[valueField]}
                style={{ width: 100 }}
                placeholder={label}
                onChange={(value) => setFieldValue(valueField, value)}
            />
            <span className="text-gray-600">{label.toLowerCase()}(s)</span>
        </div>
    )
}

const SendTemplateNotifications: React.FC = () => {
    const { id } = useParams()
    const [cronExpression, setCronExpression] = useState<string>('')
    const [searchInput, setSearchInput] = useState('')
    const [spinner, setSpinner] = useState(false)

    const handleSearchChange = (val: string) => {
        setSearchInput(val)
    }

    const updateCronExpression = (values: FormValues) => {
        if (values.repeat_type !== 'repeat') {
            setCronExpression('')
            return
        }

        const minute =
            values.minute_enabled && values.minute_value ? `*/${values.minute_value}` : values.minute_value ? `${values.minute_value}` : '0'

        const hour = values.hour_enabled && values.hour_value ? `*/${values.hour_value}` : values.hour_value ? `${values.hour_value}` : '0'

        const day = values.day_enabled && values.day_value ? `*/${values.day_value}` : values.day_value ? `${values.day_value}` : '0'

        const month =
            values.month_enabled && values.month_value ? `*/${values.month_value}` : values.month_value ? `${values.month_value}` : '0'

        const cron = `0 ${minute} ${hour} ${day} ${month} *`
        setCronExpression(cron)
    }

    const handleSubmit = async (values: any) => {
        console.log('Form submitted:', values)
        setSpinner(true)
        if (values.schedule_notification) {
            try {
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
                        values.hour_enabled && values.hour_value ? `*/${values.hour_value}` : values.hour_value ? `${values.hour_value}` : 0
                    modifiedValues.day =
                        values.day_enabled && values.day_value ? `*/${values.day_value}` : values.day_value ? `${values.day_value}` : 0
                    modifiedValues.month =
                        values.month_enabled && values.month_value
                            ? `*/${values.month_value}`
                            : values.month_value
                              ? `${values.month_value}`
                              : 0
                    modifiedValues.year = moment().format('YYYY')
                }
                const body = {
                    scheduler_config: modifiedValues,
                    notification_group: values?.groups || '',
                    mobiles: values?.users_all ? '' : values?.users || '',
                    is_active: true,
                }

                const res = await axioisInstance.patch(`/user_notification/${id}`, body)
                notification.success({ message: res?.data?.message || res?.data?.data?.message || 'Notification scheduled successfully' })
            } catch (error) {
                if (error instanceof AxiosError) {
                    notification.error({ message: error?.response?.data?.message || 'Failed to schedule notification' })
                }
            } finally {
                setSpinner(false)
            }
        } else {
            try {
                const body = {
                    notification_id: Number(id),
                    users: values?.users || '',
                    notification_group: values?.groups || '',
                    notification_type: 'app',
                    send_to_all: values?.users_all ? true : false,
                    is_active: true,
                }
                const res = await axioisInstance.post('/notification/send', body)
                notification.success({ message: res?.data?.message || res?.data?.data?.message || 'Notification sent successfully' })
            } catch (error) {
                if (error instanceof AxiosError) {
                    notification.error({ message: error?.response?.data?.message || 'Failed to send notification' })
                }
            } finally {
                setSpinner(false)
            }
        }
    }

    const initialValues: FormValues = {
        repeat_type: 'no_repeat',
    }

    return (
        <div className="max-w-10xl  p-6 bg-white rounded-lg shadow-sm">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Send Template Notifications</h1>
                {id && <p className="text-gray-600">Template ID: {id}</p>}
            </div>

            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="space-y-6">
                        <SearchableGroups label="Groups" name="groups" searchInputs={searchInput} handleSearch={handleSearchChange} />
                        <div className="space-y-4">
                            {USERNOTFARRAY.map((item, index) => (
                                <FormItem key={index} label={item.label} className={item.classname}>
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}
                        </div>

                        {/* Send to all Users - Keeping exact field name */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Field type="checkbox" name="users_all" component={Checkbox} />
                            <label className="font-semibold text-gray-700 cursor-pointer">Send to all Users</label>
                        </div>

                        {/* Schedule Notification Section */}
                        <div className="border-t pt-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Field type="checkbox" name="schedule_notification" component={Checkbox} />
                                <label className="font-semibold text-gray-700 cursor-pointer">Schedule Notification for Later</label>
                            </div>

                            {values.schedule_notification && (
                                <div className="ml-6 space-y-6">
                                    {/* Schedule Type Selection - Keeping exact field name */}
                                    <FormItem label="Schedule Type" className="mb-2">
                                        <Radio.Group
                                            options={REPEATARRAY}
                                            value={values.repeat_type}
                                            optionType="button"
                                            buttonStyle="solid"
                                            onChange={(e) => setFieldValue('repeat_type', e.target.value)}
                                            className="flex gap-2 mt-6"
                                        />
                                    </FormItem>

                                    {/* Recurrence Settings - Keeping exact field names */}
                                    {values.repeat_type === 'repeat' && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recurrence Settings</h3>

                                            <div className="grid md:grid-cols-2 gap-3">
                                                <RecurrenceField
                                                    fieldName="minute"
                                                    label="Minute"
                                                    options={MINUTE_OPTIONS}
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                />

                                                <RecurrenceField
                                                    fieldName="hour"
                                                    label="Hour"
                                                    options={HOUR_OPTIONS}
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                />

                                                <RecurrenceField
                                                    fieldName="day"
                                                    label="Day"
                                                    options={DAY_OPTIONS}
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                />

                                                <RecurrenceField
                                                    fieldName="month"
                                                    label="Month"
                                                    options={MONTH_OPTIONS}
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                />
                                            </div>

                                            {/* Generate Cron Button */}
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => updateCronExpression(values)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    <MdTimer className="text-lg" />
                                                    Generate Schedule Preview
                                                </button>
                                            </div>

                                            {/* Cron Preview */}
                                            <CronPreview cronExpression={cronExpression} />
                                        </div>
                                    )}

                                    {/* Date Selection - Keeping exact field names */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {values.repeat_type === 'no_repeat' && (
                                            <FormItem label="Start Date">
                                                <Field name="get_date">
                                                    {({ field, form }: any) => (
                                                        <DatePicker
                                                            showTime
                                                            placeholder="Select start date and time"
                                                            value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                            onChange={(value) => {
                                                                form.setFieldValue(
                                                                    'get_date',
                                                                    value ? value.format('YYYY-MM-DD HH:mm:ss') : '',
                                                                )
                                                            }}
                                                            className="w-full"
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        )}

                                        <FormItem label="Expiry Date">
                                            <Field name="expiry_date">
                                                {({ field, form }: any) => (
                                                    <DatePicker
                                                        placeholder="Select expiry date"
                                                        value={field.value ? moment(field.value, 'YYYY-MM-DD') : null}
                                                        onChange={(value) => {
                                                            form.setFieldValue('expiry_date', value ? value.format('YYYY-MM-DD') : '')
                                                        }}
                                                        className="w-full"
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end pt-4">
                                        <FormButton isSpinning={spinner} value="Schedule" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button for immediate sending */}
                        {!values.schedule_notification && <FormButton isSpinning={spinner} value="Send Now" />}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SendTemplateNotifications
