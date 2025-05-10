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
import { FaEdit, FaPlusCircle } from 'react-icons/fa'
import EventNamesModal from '../EventNamesModal'
import EditEventNamesModal from '../EditEventNameModal'
import { Checkbox } from '@/components/ui'

const AddNotification = () => {
    const dispatch = useAppDispatch()
    const [messageTemplateData, setMessageTemplateData] = useState<any>([])
    const [messageParticular, setMessageParticular] = useState<any>({})
    const [selectedTemplateName, setSelectedTemplateName] = useState<string>()
    const { eventNamesData } = useAppSelector<EventNamesSliceType>((state) => state.eventNames)
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false })
    const { data: eventNameList, isSuccess, refetch: refetchingData } = eventNameService.useEventNamesDataQuery({})

    // useEffect(() => {
    //     if (isModalOpen.add === false && isModalOpen.edit === false) {
    //         refetch()
    //     }
    // }, [refetch, isModalOpen])

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
                const response = await axios.post(`https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/get_message_templates`, body)
                const data = response?.data?.data?.data
                setMessageParticular(data?.find((item: any) => item?.name === selectedTemplateName))
            } catch (error) {
                console.log(error)
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
        console.log('FORMDATA', formData)

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

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-1 gap-10">
                                <FormItem label="Notification Type" className="col-span-1 w-1/2">
                                    <Field name="notification_type">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={notificationTypeArray}
                                                value={notificationTypeArray.find((option) => option.value === field.value)}
                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                {values.notification_type === 'WHATSAPP' || Object.keys(messageParticular).length > 0 ? (
                                    <>
                                        <FormItem label="Template Name/Id">
                                            <div>
                                                <select
                                                    defaultValue={'SELECT'}
                                                    value={selectedTemplateName}
                                                    className="flex-1 border rounded px-2 py-1"
                                                    onChange={(e) => setSelectedTemplateName(e.target.value)}
                                                >
                                                    <option key={'SELECT'} value={'SELECT'} disabled={true}>
                                                        SELECT ID
                                                    </option>
                                                    {messageTemplateData.map((item: any, index: number) => (
                                                        <option key={index} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </FormItem>
                                    </>
                                ) : (
                                    <>
                                        <FormItem label="Template Name/Id" className="">
                                            <Field
                                                type="text"
                                                name="template_id"
                                                placeholder="Enter template name or id"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </>
                                )}

                                {Object.keys(messageParticular).length > 0 && (
                                    <FormItem label="Language" className="">
                                        <Field type="text" name="language" placeholder="Enter Language" component={Input} />
                                    </FormItem>
                                )}
                            </FormContainer>
                            {Object.keys(messageParticular).length > 0 && (
                                <WhatsAppForm values={values} messageParticular={messageParticular} />
                            )}

                            <FormItem label="Message" labelClass="!justify-start" className="col-span-1 w-full">
                                <Field name="message">
                                    {({ field, form }: FieldProps) => (
                                        <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem>
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
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    isClearable
                                                    field={field}
                                                    form={form}
                                                    options={EventNamesArray || []}
                                                    value={EventNamesArray?.find((option) => option.value === field.value)}
                                                    onChange={(newVal) => {
                                                        console.log(newVal?.value)
                                                        form.setFieldValue(field.name, newVal?.value)
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                                {NotificationARRAY.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item?.type === 'checkbox' ? Checkbox : Input}
                                        />
                                    </FormItem>
                                ))}
                            </FormItem>
                        </FormContainer>
                        <FormContainer className="flex justify-end mt-5">
                            <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                Reset
                            </Button>

                            <Button variant="solid" type="submit" className=" text-white">
                                Submit
                            </Button>
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
