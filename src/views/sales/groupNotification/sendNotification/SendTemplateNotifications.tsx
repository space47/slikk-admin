/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    DAY_OPTIONS,
    HOUR_OPTIONS,
    MINUTE_OPTIONS,
    MONTH_OPTIONS,
    REPEATARRAY,
    TemplateFormValues,
    USERNOTFARRAY,
} from './sendNotify.common'
import { Checkbox, FormItem, Input } from '@/components/ui'
import { DatePicker, Radio, Select, Checkbox as Checkbx, notification } from 'antd'
import { MdTimer } from 'react-icons/md'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import CronExpressionParser from 'cron-parser'
import SearchableGroups from '@/common/SearchableGroups'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import FormButton from '@/components/ui/Button/FormButton'
import { errorMessage } from '@/utils/responseMessages'
import LoadingSpinner from '@/common/LoadingSpinner'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('Asia/Kolkata')

const CronPreview: React.FC<{ cronExpression: string }> = ({ cronExpression }) => {
    const [nextOccurrences, setNextOccurrences] = useState<string[]>([])

    useEffect(() => {
        if (!cronExpression) {
            setNextOccurrences([])
            return
        }
        try {
            const options = { currentDate: dayjs().tz().format('YYYY-MM-DD HH:mm:ss'), tz: 'Asia/Kolkata' }
            const interval = CronExpressionParser.parse(cronExpression, options)
            const nextDates = interval.take(10).map((date) =>
                dayjs(date as any)
                    .tz()
                    .format('ddd, MMM D YYYY, h:mm A'),
            )
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
    const [data, setData] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)
    const [cronExpression, setCronExpression] = useState<string>('')
    const [searchInput, setSearchInput] = useState('')
    const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    setLoading(true)
                    const response = await axioisInstance.get(`/user_notification?id=${id}`)
                    setData(response.data?.message)
                } catch (error) {
                    if (error instanceof AxiosError) {
                        notification.error({ message: error?.response?.data?.message || 'Failed to load' })
                    }
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchData()
    }, [id])

    console.log('data is', data)

    const handleSearchChange = (val: string) => {
        setSearchInput(val)
    }

    const updateCronExpression = (values: TemplateFormValues) => {
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
        setSpinner(true)
        if (values.schedule_notification) {
            try {
                const dateTime = dayjs(values?.get_date, 'YYYY-MM-DD HH:mm:ss')
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
                    modifiedValues.year = dayjs().format('YYYY')
                }
                const body = {
                    scheduler_config: modifiedValues,
                    notification_group: values?.groups || '',
                    mobiles: values?.users_all ? '' : values?.users?.replaceAll(' ', '') || '',
                    is_active: true,
                    send_to_all: values?.users_all ? true : false,
                }

                const filteredBody = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined && v !== null && v !== ''))
                const res = await axioisInstance.patch(`/user_notification/${id}`, filteredBody)
                notification.success({ message: res?.data?.message || res?.data?.data?.message || 'Notification scheduled successfully' })
            } catch (error) {
                errorMessage(error as AxiosError)
            } finally {
                setSpinner(false)
            }
        } else {
            try {
                const body = {
                    notification_id: Number(id),
                    users: values?.users?.replaceAll(' ', '') || '',
                    notification_group: values?.groups || '',
                    notification_type: 'app',
                    send_to_all: values?.users_all ? true : false,
                }
                const filteredBody = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined && v !== null && v !== ''))
                const res = await axioisInstance.post('/notification/send', filteredBody)
                notification.success({ message: res?.data?.message || res?.data?.data?.message || 'Notification sent successfully' })
            } catch (error) {
                errorMessage(error as AxiosError)
            } finally {
                setSpinner(false)
            }
        }
    }

    const initialValues: TemplateFormValues = { repeat_type: 'no_repeat' }
    const RenderFieldsArray = [
        { label: 'Minute', fieldName: 'minute', options: MINUTE_OPTIONS },
        { label: 'Hour', fieldName: 'hour', options: HOUR_OPTIONS },
        { label: 'Day', fieldName: 'day', options: DAY_OPTIONS },
        { label: 'Month', fieldName: 'month', options: MONTH_OPTIONS },
    ]

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className=" p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Send Template Notifications</h1>
                {id && (
                    <p className="text-gray-500 mt-1 text-sm">
                        Template ID: <span className="font-medium text-gray-700">{id}</span>
                    </p>
                )}
            </div>

            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="space-y-8">
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                            <SearchableGroups label="Groups" name="groups" searchInputs={searchInput} handleSearch={handleSearchChange} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                            {USERNOTFARRAY.map((item, index) => (
                                <FormItem key={index} label={item.label} className={item.classname}>
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <Field type="checkbox" name="users_all" component={Checkbox} />
                            <label className="font-medium text-gray-700 dark:text-gray-200 cursor-pointer">Send to all Users</label>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Field type="checkbox" name="schedule_notification" component={Checkbox} />
                                <label className="font-medium text-gray-700 dark:text-gray-200 cursor-pointer">
                                    Schedule Notification for Later
                                </label>
                            </div>

                            {values.schedule_notification && (
                                <div className="ml-2 md:ml-6 space-y-8">
                                    <span>
                                        {data?.status === 'PROCESSING' && (
                                            <p className='className="mt-10 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm"'>
                                                The notification you are Trying to Send is in PROCESSING and cannot be send at this moment
                                            </p>
                                        )}
                                    </span>
                                    <FormItem label="Schedule Type" className="mb-4">
                                        <br />
                                        <Radio.Group
                                            options={REPEATARRAY}
                                            value={values.repeat_type}
                                            optionType="button"
                                            buttonStyle="solid"
                                            onChange={(e) => setFieldValue('repeat_type', e.target.value)}
                                            className="flex flex-wrap gap-3"
                                        />
                                    </FormItem>
                                    {values.repeat_type === 'repeat' && (
                                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                                Recurrence Settings
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {RenderFieldsArray.map((item, key) => (
                                                    <RecurrenceField
                                                        key={key}
                                                        fieldName={item.fieldName}
                                                        label={item.label}
                                                        options={item.options}
                                                        values={values}
                                                        setFieldValue={setFieldValue}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex justify-end mt-6">
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                                                    onClick={() => updateCronExpression(values)}
                                                >
                                                    <MdTimer className="text-lg" />
                                                    <span>Generate Schedule Preview</span>
                                                </button>
                                            </div>

                                            <CronPreview cronExpression={cronExpression} />
                                        </div>
                                    )}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {values.repeat_type === 'no_repeat' && (
                                            <FormItem label="Start Date">
                                                <Field name="get_date">
                                                    {({ field, form }: any) => (
                                                        <DatePicker
                                                            showTime
                                                            placeholder="Select start date and time"
                                                            value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                                            onChange={(value) =>
                                                                form.setFieldValue(
                                                                    'get_date',
                                                                    value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
                                                                )
                                                            }
                                                            className="w-full"
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        )}
                                    </div>
                                    <div className="flex justify-end pt-6">
                                        <FormButton
                                            isSpinning={spinner}
                                            value="Schedule"
                                            disabled={data && data?.status === 'PROCESSING'}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {!values.schedule_notification && (
                            <div className="flex justify-end">
                                <FormButton isSpinning={spinner} value="Send Now" />
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SendTemplateNotifications
