/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { notification } from 'antd'
import { useParams } from 'react-router-dom'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { NotificationTYPE, notificationTypeArray } from '../createNotification/createNotification.common'
import { extractPlaceholders, NotificationARRAY } from '../createNotification/NotificationForms'
import { RichTextEditor } from '@/components/shared'
import axios from 'axios'
import WhatsAppForm from '../WhatsAppForm'
import { useAppDispatch, useAppSelector } from '@/store'
import { EventNamesSliceType, setEventNamesData } from '@/store/slices/eventNameSlice/eventName.slice'
import { eventNameService } from '@/store/services/eventNameSerices'
import EventNamesModal from '../EventNamesModal'
import EditEventNamesModal from '../EditEventNameModal'
import { Checkbox } from '@/components/ui'
import { NotificationTypeNamed } from './notification'
import { FaExclamationTriangle, FaSpinner, FaChevronDown, FaSave, FaUndo, FaPlus, FaWhatsapp } from 'react-icons/fa'
import { MdMessage } from 'react-icons/md'

interface MessageTemplate {
    name: string
    language: string
    components: Array<{
        type: 'HEADER' | 'BODY' | 'BUTTONS'
        text?: string
        buttons?: Array<{
            text: string
            sub_type: string
        }>
    }>
}

interface MessageParticular extends MessageTemplate {
    [key: string]: any
}

interface ModalState {
    add: boolean
    edit: boolean
}

const EditNotification = () => {
    const dispatch = useAppDispatch()
    const { id } = useParams<{ id: string }>()
    const [notificationData, setNotificationData] = useState<NotificationTYPE | null>(null)
    const [messageTemplateData, setMessageTemplateData] = useState<MessageTemplate[]>([])
    const [messageParticular, setMessageParticular] = useState<MessageParticular | null>(null)
    const [selectedTemplateName, setSelectedTemplateName] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<ModalState>({ add: false, edit: false })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { eventNamesData } = useAppSelector<EventNamesSliceType>((state) => state.eventNames)
    const { data: eventNameList, isSuccess, isError: eventNameError } = eventNameService.useEventNamesDataQuery({})

    const EventNamesArray = useMemo(() => {
        return (
            eventNamesData?.map((item) => ({
                label: item.name,
                value: item.name,
            })) || []
        )
    }, [eventNamesData])
    useEffect(() => {
        if (isSuccess && eventNameList?.results) {
            dispatch(setEventNamesData(eventNameList.results))
        }
    }, [dispatch, isSuccess, eventNameList])
    const fetchMessageTemplate = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.post('https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/get_message_templates', {
                params: {},
            })
            const data = response?.data?.data?.data || []
            setMessageTemplateData(data)
        } catch (error) {
            notification.error({ message: 'Failed to load message templates' })
        }
    }, [])

    useEffect(() => {
        fetchMessageTemplate()
    }, [fetchMessageTemplate])

    const fetchSelectedMessage = useCallback(async (templateName: string) => {
        if (!templateName) {
            setMessageParticular(null)
            return
        }
        try {
            const response = await axios.post('https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/get_message_templates', {
                params: { name: templateName },
            })
            const data = response?.data?.data?.data || []
            const foundTemplate = data.find((item: MessageTemplate) => item?.name === templateName)
            setMessageParticular(foundTemplate || null)
        } catch (error) {
            console.error('Error fetching selected message:', error)
            notification.error({
                message: 'Error',
                description: 'Failed to load template details',
            })
        }
    }, [])

    const fetchNotificationEditData = useCallback(async () => {
        if (!id) {
            notification.error({
                message: 'Error',
                description: 'No notification ID provided',
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await axiosInstance.get(`/notifications/config?id=${id}`)
            const data = response?.data?.message
            setNotificationData(data)
            if (data?.template_id) {
                setSelectedTemplateName(data.template_id)
                if (data.notification_type === 'WHATSAPP') {
                    await fetchSelectedMessage(data.template_id)
                }
            }
        } catch (error) {
            console.error('Error fetching notification:', error)
            notification.error({
                message: 'Error',
                description: 'Failed to load notification data',
            })
        } finally {
            setIsLoading(false)
        }
    }, [id, fetchSelectedMessage])

    useEffect(() => {
        fetchNotificationEditData()
    }, [fetchNotificationEditData])

    useEffect(() => {
        if (selectedTemplateName) {
            fetchSelectedMessage(selectedTemplateName)
        }
    }, [selectedTemplateName, fetchSelectedMessage])

    const getInitialValues = useCallback((): NotificationTYPE => {
        if (!notificationData) {
            return {
                event_name: '',
                notification_type: '',
                title: '',
                language: '',
                message: '',
                template_id: '',
                is_active: false,
                config_data: {
                    body_config: [],
                    header_config: [],
                    button_config: [{ text: '', sub_type: 'url', index: 0 }],
                },
            }
        }
        if (messageParticular) {
            const headerText =
                messageParticular?.components
                    ?.filter((comp) => comp.type === 'HEADER')
                    ?.map((item) => item.text || '')
                    .join(' ') || ''

            const bodyText =
                messageParticular?.components
                    ?.filter((comp) => comp.type === 'BODY')
                    ?.map((item) => item.text || '')
                    .join(' ') || ''

            return {
                ...notificationData,
                language: messageParticular?.language || notificationData.language,
                message: `${headerText} ${bodyText}`.trim() || notificationData.message,
                template_id: selectedTemplateName || notificationData.template_id,
                config_data: {
                    body_config:
                        messageParticular?.components
                            ?.filter((comp) => comp.type === 'BODY')
                            ?.flatMap((comp) =>
                                extractPlaceholders(comp.text || '').map((placeholder) => ({
                                    textParam: placeholder,
                                    type: 'text',
                                })),
                            ) || [],
                    header_config:
                        messageParticular?.components
                            ?.filter((comp) => comp.type === 'HEADER')
                            ?.flatMap((comp) =>
                                extractPlaceholders(comp.text || '').map((placeholder) => ({
                                    textParam: placeholder,
                                    type: 'text',
                                })),
                            ) || [],
                    button_config: messageParticular?.components
                        ?.filter((comp) => comp.type === 'BUTTONS')
                        ?.flatMap(
                            (comp) =>
                                comp.buttons?.map((btn, btnIndex) => ({
                                    text: btn.text || '',
                                    sub_type: btn.sub_type || 'url',
                                    index: btnIndex,
                                    url: btn.sub_type === 'url' ? '' : undefined,
                                })) || [],
                        ) || [{ text: '', sub_type: 'url', index: 0 }],
                },
            }
        }
        return {
            ...notificationData,
            config_data: notificationData.config_data || {
                body_config: [],
                header_config: [],
                button_config: [{ text: '', sub_type: 'url', index: 0 }],
            },
        }
    }, [notificationData, messageParticular, selectedTemplateName])
    const handleSubmit = async (values: NotificationTYPE) => {
        if (!id) {
            notification.error({ message: 'Error', description: 'No notification ID provided' })
            return
        }

        setIsSubmitting(true)
        try {
            const parser = new DOMParser()
            const htmlDoc = parser.parseFromString(values.message, 'text/html')
            const plainTextMessage = htmlDoc.body.textContent || ''
            const updatedConfigData = {
                ...values.config_data,
                language: values?.language,
                body_config: values?.config_data?.body_config.map(({ textParam, ...rest }) => rest),
                header_config: values?.config_data?.header_config.map(({ textParam, ...rest }) => rest),
                button_config: values?.config_data?.button_config.map(({ text, ...rest }: any) => rest),
            }

            const { language, ...rest } = values
            const formData = {
                ...rest,
                config_data: updatedConfigData,
                event_name: values?.event_name,
                message: plainTextMessage,
                notification_type: messageParticular ? 'WHATSAPP' : values.notification_type,
                template_id: messageParticular ? selectedTemplateName : values.template_id,
            }

            const response = await axiosInstance.patch(`/notifications/config/${id}`, formData)

            notification.success({
                message: response.data.message || 'Notification has been updated successfully',
            })
            fetchNotificationEditData()
        } catch (error: any) {
            console.error('Update error:', error)
            notification.error({
                message: 'Error',
                description: error.response?.data?.message || 'Failed to update notification',
            })
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleModalToggle = (modal: keyof ModalState, value: boolean) => {
        setIsModalOpen((prev) => ({ ...prev, [modal]: value }))
    }
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
                <p className="text-gray-600 text-lg">Loading notification data...</p>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <MdMessage className="text-blue-600" />
                    Edit Notification
                </h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">ID:</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{id}</span>
                </div>
            </div>

            {notificationData ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-700"></div>
                    <Formik enableReinitialize initialValues={getInitialValues()} onSubmit={handleSubmit}>
                        {({ values, setFieldValue, resetForm }) => (
                            <Form className="p-6">
                                <FormContainer>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                        <FormItem label="Notification Type" className="col-span-1">
                                            <Field name="notification_type">
                                                {({ field, form }: FieldProps<any>) => (
                                                    <Select
                                                        field={field}
                                                        form={form}
                                                        options={notificationTypeArray}
                                                        value={notificationTypeArray.find((option) => option.value === field.value)}
                                                        onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                        placeholder="Select notification type"
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem asterisk label="Event Name" className="col-span-1">
                                            <div className="flex gap-2">
                                                <Field name="event_name">
                                                    {({ field, form }: FieldProps<any>) => (
                                                        <Select
                                                            isClearable
                                                            field={field}
                                                            form={form}
                                                            options={EventNamesArray}
                                                            value={EventNamesArray.find((option) => option.value === field.value)}
                                                            onChange={(newVal) => {
                                                                form.setFieldValue(field.name, newVal?.value || '')
                                                            }}
                                                            placeholder="Select event name"
                                                            className="flex-1"
                                                        />
                                                    )}
                                                </Field>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => handleModalToggle('add', true)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                                >
                                                    <FaPlus />
                                                    Add
                                                </Button>
                                            </div>
                                        </FormItem>
                                    </div>
                                    {values.notification_type === 'WHATSAPP' && (
                                        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <FaWhatsapp className="text-green-500 text-2xl" />
                                                <h3 className="text-lg font-semibold text-blue-800">WhatsApp Template Configuration</h3>
                                            </div>
                                            <FormItem label="Template Name">
                                                <div className="relative">
                                                    <select
                                                        value={selectedTemplateName}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white shadow-sm"
                                                        onChange={(e) => setSelectedTemplateName(e.target.value)}
                                                        disabled={messageTemplateData.length === 0}
                                                    >
                                                        <option value="" className="text-gray-400">
                                                            {messageTemplateData.length === 0
                                                                ? 'Loading templates...'
                                                                : 'Select a template'}
                                                        </option>
                                                        {messageTemplateData.map((item: MessageTemplate, index: number) => (
                                                            <option key={`${item.name}-${index}`} value={item.name} className="py-2">
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                        <FaChevronDown />
                                                    </div>
                                                </div>
                                                {selectedTemplateName && (
                                                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                                        ✓ Template loaded from ID: {selectedTemplateName}
                                                    </p>
                                                )}
                                            </FormItem>

                                            {messageParticular && (
                                                <>
                                                    <FormItem label="Language">
                                                        <Field
                                                            type="text"
                                                            name="language"
                                                            placeholder="Enter language"
                                                            component={Input}
                                                            readOnly
                                                            className="bg-gray-50"
                                                        />
                                                    </FormItem>

                                                    <WhatsAppForm values={values} />
                                                </>
                                            )}
                                        </div>
                                    )}
                                    {values.notification_type !== 'WHATSAPP' && !messageParticular && (
                                        <FormItem label="Template Name/ID" className="mb-6">
                                            <Field
                                                type="text"
                                                name="template_id"
                                                placeholder="Enter template name or ID"
                                                component={Input}
                                            />
                                        </FormItem>
                                    )}
                                    <div className="mb-8">
                                        <FormItem label="Message Content" labelClass="!justify-start">
                                            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                                <RichTextEditor value={values.message} onChange={(val) => setFieldValue('message', val)} />
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                                                    <span>Available placeholders:</span>
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {NotificationTypeNamed.map((item, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => {
                                                                const currentValue = values.message || ''
                                                                setFieldValue('message', `${currentValue} {${item}}`)
                                                            }}
                                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm flex items-center gap-2"
                                                        >
                                                            <span>{`{${item}}`}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </FormItem>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {NotificationARRAY.map((item, key) => (
                                            <FormItem key={key} label={item.label} className={item.classname}>
                                                <Field
                                                    type={item.type}
                                                    name={item.name}
                                                    placeholder={item.placeholder}
                                                    component={item.type === 'checkbox' ? Checkbox : Input}
                                                    disabled={item.type === 'checkbox' ? false : isSubmitting}
                                                />
                                            </FormItem>
                                        ))}
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                                        <Button
                                            type="button"
                                            onClick={() => resetForm()}
                                            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                            disabled={isSubmitting}
                                        >
                                            <FaUndo />
                                            Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="solid"
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                            loading={isSubmitting}
                                        >
                                            {!isSubmitting && <FaSave />}
                                            {isSubmitting ? 'Updating...' : 'Update Notification'}
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow border border-gray-200">
                    <div className="text-yellow-500 mb-6">
                        <FaExclamationTriangle className="w-20 h-20 mx-auto opacity-70" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Notification Not Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                        Unable to load notification data. Please check the ID and try again.
                    </p>
                    <Button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        Go Back
                    </Button>
                </div>
            )}
            <EventNamesModal dialogIsOpen={isModalOpen.add} setIsOpen={(val: any) => handleModalToggle('add', val)} />
            <EditEventNamesModal
                dialogIsOpen={isModalOpen.edit}
                setIsOpen={(val: any) => handleModalToggle('edit', val)}
                eventNamesData={eventNamesData}
            />
        </div>
    )
}

export default EditNotification
