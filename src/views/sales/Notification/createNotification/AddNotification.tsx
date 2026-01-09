/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { extractPlaceholders, NotificationARRAY } from './NotificationForms'
import { RichTextEditor } from '@/components/shared'
import axios from 'axios'
import WhatsAppForm from '../WhatsAppForm'
import { notificationTypeArray } from './createNotification.common'
import { useAppDispatch, useAppSelector } from '@/store'
import { eventNameService } from '@/store/services/eventNameSerices'
import { EventNamesSliceType, setEventNamesData } from '@/store/slices/eventNameSlice/eventName.slice'
import { FaEdit, FaPaperPlane, FaPlusCircle, FaRedo } from 'react-icons/fa'
import EventNamesModal from '../EventNamesModal'
import EditEventNamesModal from '../EditEventNameModal'
import { Checkbox } from '@/components/ui'
import { NotificationTypeNamed } from '../editNotification/notification'
import { FaMessage } from 'react-icons/fa6'

const AddNotification = () => {
    const dispatch = useAppDispatch()
    const [messageTemplateData, setMessageTemplateData] = useState<any>([])
    const [messageParticular, setMessageParticular] = useState<any>({})
    const [selectedTemplateName, setSelectedTemplateName] = useState<string>()
    const { eventNamesData } = useAppSelector<EventNamesSliceType>((state) => state.eventNames)
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false })
    const [loadingSelectedMessage, setLoadingSelectedMessage] = useState(false)
    const { data: eventNameList, isSuccess, refetch: refetchingData } = eventNameService.useEventNamesDataQuery({})

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEventNamesData(eventNameList?.results || []))
        }
    }, [dispatch, isSuccess, eventNameList])

    const EventNamesArray = eventNamesData?.map((item) => ({
        label: item.name,
        value: item.name,
    }))

    const fetchMessageTemplate = async () => {
        const params: Record<string, any> = {}
        const body = { params }

        try {
            const response = await axios.post(`https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/get_message_templates`, body)
            const data = response?.data?.data?.data
            setMessageTemplateData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMessageTemplate()
    }, [])

    const fetchSelectedMessage = async () => {
        const params: Record<string, any> = {}
        const body = { params }

        if (selectedTemplateName) {
            params.name = selectedTemplateName
            try {
                setLoadingSelectedMessage(true)
                const response = await axios.post(`https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/get_message_templates`, body)
                const data = response?.data?.data?.data
                setMessageParticular(data?.find((item: any) => item?.name === selectedTemplateName))
            } catch (error) {
                console.log(error)
            } finally {
                setLoadingSelectedMessage(false)
            }
        }
    }

    useEffect(() => {
        fetchSelectedMessage()
    }, [selectedTemplateName])

    console.log('messageParticular', messageParticular, selectedTemplateName)

    const initialValue: any = {
        event_name: '',
        language: Object.keys(messageParticular).length > 0 ? messageParticular?.language : '',
        title: '',
        template_id: Object.keys(messageParticular).length > 0 ? selectedTemplateName : '',
        message:
            Object.keys(messageParticular).length > 0
                ? `${messageParticular?.components?.filter((comp: any) => comp.type === 'HEADER')?.map((item: any) => item.text)}
                    ${messageParticular?.components?.filter((comp: any) => comp.type === 'BODY')?.map((item: any) => item.text)}
                    `
                : '',
        is_active: false,
        config_data: {
            body_config:
                messageParticular?.components
                    ?.filter((comp: any) => comp.type === 'BODY')
                    ?.flatMap((comp: any) =>
                        extractPlaceholders(comp.text).map((placeholder) => ({ textParam: placeholder, type: 'text' })),
                    ) || [],
            header_config: messageParticular?.components?.some((comp: any) => comp.type === 'HEADER' && comp.format === 'IMAGE')
                ? {
                      type: 'image',
                      link: messageParticular?.components.find((comp: any) => comp.type === 'HEADER' && comp.format === 'IMAGE')?.example
                          ?.header_handle?.[0],
                  }
                : messageParticular?.components
                      ?.filter((comp: any) => comp.type === 'HEADER')
                      ?.flatMap((comp: any) =>
                          extractPlaceholders(comp.text).map((placeholder) => ({
                              textParam: placeholder,
                              type: 'text',
                          })),
                      ) || [],

            button_config: messageParticular?.components
                ?.filter((comp: any) => comp.type === 'BUTTONS')
                ?.some((comp: any) => comp.buttons?.some((btn: any) => btn.example))
                ? messageParticular?.components
                      ?.filter((comp: any) => comp.type === 'BUTTONS')
                      ?.flatMap((comp: any) =>
                          comp.buttons?.map((btn: any, index: any) => ({
                              text: btn.text || '',
                              sub_type: btn.sub_type || 'url',
                              index,
                          })),
                      ) || [{ url: '', sub_type: 'url', index: 0 }]
                : null,
        },
    }

    const handleSubmit = async (values: any) => {
        console.log(values?.notification_type)
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(values.message, 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''
        const updatedConfigData = {
            ...values.config_data,
            language: values?.language,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            body_config: values?.config_data?.body_config.map(({ textParam, ...rest }: any) => rest),
            header_config: messageParticular?.components?.some((comp: any) => comp.type === 'HEADER' && comp.format === 'IMAGE')
                ? [
                      {
                          type: 'image',
                          link: values?.config_data.header_config.link,
                      },
                  ]
                : values?.config_data?.header_config.map(({ textParam, ...rest }: any) => rest),
            ...(messageParticular?.components
                ?.filter((comp: any) => comp.type === 'BUTTONS')
                ?.some((comp: any) => comp.buttons?.some((btn: any) => btn.example))
                ? { button_config: values?.config_data?.button_config.map(({ text, ...rest }: any) => rest) }
                : {}),
        }

        const formData = {
            ...values,
            event_name: values?.event_name,
            config_data: updatedConfigData,
            message: plainTextMessage,
            notification_type: Object.keys(messageParticular).length > 0 ? 'WHATSAPP' : values.notification_type,
        }
        try {
            const response = await axioisInstance.post(`/notifications/config`, formData)
            notification.success({
                message: 'SUCCESS',
                description: response.data.message || 'Notification has been added',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'FAILURE',
                description: 'Failed to create notification',
            })
        }
    }

    const handleInsertVariable = (field: any, form: any, variable: string) => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const textNode = document.createTextNode(`{{${variable}}}`)
            range.insertNode(textNode)
            range.setStartAfter(textNode)
            range.setEndAfter(textNode)
            selection.removeAllRanges()
            selection.addRange(range)
        }
        form.setFieldValue(field.name, field.value || '')
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-700"></div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm }) => (
                    <Form className="p-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                                <FaMessage className="text-blue-600" />
                                Edit Notification Configuration
                            </h2>
                        </div>

                        <FormContainer>
                            {/* Header Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                <FormItem label="Notification Type" className="col-span-1">
                                    <Field name="notification_type">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={notificationTypeArray}
                                                value={notificationTypeArray.find((option) => option.value === field.value)}
                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                placeholder="Select type..."
                                                className="w-full"
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {values.notification_type === 'WHATSAPP' || Object.keys(messageParticular).length > 0 ? (
                                    <>
                                        <FormItem label="Template Name/ID" className="col-span-1">
                                            <div className="relative">
                                                <select
                                                    value={selectedTemplateName}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white shadow-sm"
                                                    onChange={(e) => setSelectedTemplateName(e.target.value)}
                                                >
                                                    <option key={'SELECT'} value={'SELECT'} disabled className="text-gray-400">
                                                        SELECT TEMPLATE
                                                    </option>
                                                    {messageTemplateData.map((item: any, index: number) => (
                                                        <option key={index} value={item.name} className="py-2 hover:bg-blue-50">
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                    <span className="text-sm">▼</span>
                                                </div>
                                            </div>
                                        </FormItem>
                                    </>
                                ) : (
                                    <FormItem label="Template Name/ID" className="col-span-1">
                                        <Field
                                            type="text"
                                            name="template_id"
                                            placeholder="Enter template name or id"
                                            component={Input}
                                            className="w-full"
                                        />
                                    </FormItem>
                                )}
                            </div>
                            {loadingSelectedMessage && (
                                <div className="mt-4 mb-7 flex justify-center items-center">
                                    <div className="text-blue-500 animate-ping">Loading Data...</div>
                                </div>
                            )}
                            {Object.keys(messageParticular).length > 0 && (
                                <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                                    <FormItem label="Language" className="w-1/2">
                                        <Field
                                            type="text"
                                            name="language"
                                            placeholder="Enter Language"
                                            component={Input}
                                            className="w-full"
                                        />
                                    </FormItem>
                                </div>
                            )}
                            {Object.keys(messageParticular).length > 0 && (
                                <div className="mb-8">
                                    <WhatsAppForm values={values} messageParticular={messageParticular} />
                                </div>
                            )}
                            <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <FormItem label="Message Content" labelClass="!justify-start" className="w-full">
                                    <Field name="message">
                                        {({ field, form }: FieldProps) => (
                                            <div className="space-y-4">
                                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                                    <RichTextEditor
                                                        value={field.value}
                                                        onChange={(val) => form.setFieldValue(field.name, val)}
                                                    />
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-600 mb-3">Available Variables:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {NotificationTypeNamed.map((item, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                                                                onClick={() => handleInsertVariable(field, form, item)}
                                                            >
                                                                <span className="text-blue-600 font-mono">{`{${item}}`}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                <FormItem asterisk label="EVENT NAMES" className="col-span-1 w-1/2">
                                    <div className="flex items-center gap-2 mb-5">
                                        <span onClick={() => setIsModalOpen({ ...isModalOpen, add: true })}>
                                            <FaPlusCircle className="text-xl text-green-500 cursor-pointer" />
                                        </span>
                                        <span onClick={() => setIsModalOpen({ ...isModalOpen, edit: true })}>
                                            <FaEdit className="text-xl text-blue-600 cursor-pointer" />
                                        </span>
                                    </div>
                                    <Field name="event_name">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                isClearable
                                                field={field}
                                                form={form}
                                                options={EventNamesArray || []}
                                                value={EventNamesArray?.find((option) => option.value === field.value)}
                                                onChange={(newVal) => form.setFieldValue(field.name, newVal?.value)}
                                                placeholder="Select event name..."
                                                className="w-full"
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {NotificationARRAY.map((item, key) => (
                                        <FormItem key={key} label={item.label} className={item.classname}>
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                className="w-full"
                                            />
                                        </FormItem>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                                <Button type="button" variant="default" onClick={() => resetForm()} icon={<FaRedo />}>
                                    Reset Form
                                </Button>

                                <Button type="submit" variant="solid" icon={<FaPaperPlane />}>
                                    Update Notification
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
            {isModalOpen.add && <EventNamesModal dialogIsOpen={isModalOpen.add} setIsOpen={setIsModalOpen} refetch={refetchingData} />}
            {isModalOpen.edit && (
                <EditEventNamesModal
                    dialogIsOpen={isModalOpen.edit}
                    setIsOpen={setIsModalOpen}
                    eventNamesData={eventNamesData}
                    refetch={refetchingData}
                />
            )}
        </div>
    )
}

export default AddNotification
