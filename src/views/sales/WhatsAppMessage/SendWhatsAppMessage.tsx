import { Button, FormContainer, Steps } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllGroupAPI } from '@/store/action/group.action'
import { GroupData } from '@/store/types/groups.types'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import FirstStep from './steps/FirstStep'
import axios from 'axios'
import SecondStep from './steps/SecondStep'
import ThirdStep from './steps/ThirdStep'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const SendWhatsAppMessage = () => {
    const dispatch = useAppDispatch()
    const [currentStep, setCurrentStep] = useState(0)
    const [messageTemplateData, setMessageTemplateData] = useState<any>([])
    const [messageParticular, setMessageParticular] = useState<any>([])
    const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null)
    const group = useAppSelector<GroupData>((state) => state.group)
    useEffect(() => {
        dispatch(getAllGroupAPI())
    }, [dispatch])

    console.log('groups', group?.group)

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
                setMessageParticular(data?.find((item) => item?.name === selectedTemplateName))
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        fetchSelectedMessage()
    }, [selectedTemplateName])

    console.log('messsasasasasas', messageParticular)

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1)
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1)
    }

    const initialValue = {
        template_name: messageParticular?.name,
        language_code: messageParticular?.language,
        header: messageParticular?.components?.find((item) => item?.type === 'HEADER')?.format,
        body: messageParticular?.components?.find((item) => item?.type === 'BODY')?.format,
        header_text: messageParticular?.components
            ?.find((item) => item?.example?.header_text_named_params)
            ?.example?.header_text_named_params?.map((item) => `{${item?.param_name}}`),
        body_text: messageParticular?.components
            ?.find((item) => item?.example?.body_text_named_params)
            ?.example?.body_text_named_params?.map((item) => `{${item?.param_name}}`),
        button_text: messageParticular?.components
            ?.find((item) => item?.example?.button_text_named_params)
            ?.example?.button_text_named_params?.map((item) => `{${item?.param_name}}`),
    }

    console.log('initial ava', initialValue)

    const handleSubmit = async (values: any) => {
        console.log('syar', values?.group)
        const body = {
            campaign: values?.campaign || '',
            users: values?.user || '',
            template_name: values?.template_name || '',
            language_code: values?.language_code || '',
            body_config: {
                text: values?.body_text || [],
            },
            header_config: (() => {
                if (values?.header === 'TEXT') {
                    return { text: values?.header_text || [] }
                }
                if (values?.header === 'IMAGE') {
                    return { image: { link: values?.header_image_link || '' } }
                }
                if (values?.header === 'VIDEO') {
                    return {
                        video: {
                            link: values?.header_video_link || '',
                            caption: values?.header_video_caption || '',
                            id: values?.header_video_id || '',
                        },
                    }
                }
                return undefined
            })(),
            button_config: {
                buttons: [
                    {
                        type: values?.button?.type || '',
                        sub_type: values?.button?.sub_type || '',
                        url: values?.button?.url || '',
                        payload: values?.button?.payload || '',
                        index: values?.button?.index || 0,
                    },
                ],
            },
        }

        console.log('Body is', body)

        try {
            const response = await axioisInstance.post(`/whatsapp/message/send`, body)
            notification.success({
                message: response?.data?.message || 'Message has been sent',
            })
        } catch (error) {
            notification?.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message,
            })
            console.error(error)
        }
    }

    return (
        <div>
            <div className="mb-10">
                <Steps current={currentStep} className="flex flex-col items-start xl:flex-row">
                    {['Template Details', 'Content Setup', 'Button Setup'].map((stepTitle, index) => (
                        <Steps.Item
                            key={index}
                            title={
                                <span
                                    className={`p-2 rounded-md ${
                                        currentStep === index
                                            ? 'text-green-500 font-bold bg-gray-200 px-2 py-2 rounded-md text-xl'
                                            : 'text-inherit font-normal'
                                    }`}
                                >
                                    {stepTitle}
                                </span>
                            }
                        />
                    ))}
                </Steps>
            </div>

            <div className="flex justify-between">
                <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                    {({ values, resetForm }) => (
                        <Form className="w-full lg:w-2/3 mx-auto xl:mx-0">
                            <FormContainer>
                                {currentStep === 0 && (
                                    <div>
                                        <FirstStep
                                            messageTemplateData={messageTemplateData}
                                            setSelectedTemplateName={setSelectedTemplateName}
                                            selectedTemplateName={selectedTemplateName}
                                        />
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div>
                                        <SecondStep group={group} values={values} />
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div>
                                        <ThirdStep values={values} />
                                    </div>
                                )}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                                {currentStep > 0 && currentStep < 2 && (
                                    <Button type="button" variant="pending" onClick={handlePrevious} className="mr-2 bg-gray-600">
                                        Previous
                                    </Button>
                                )}
                                {currentStep < 2 && currentStep > 0 && (
                                    <Button type="button" variant="accept" onClick={handleNext} className="mr-2 bg-gray-600">
                                        Next
                                    </Button>
                                )}
                            </FormContainer>

                            {currentStep === 0 && (
                                <FormContainer className="flex justify-end">
                                    <Button type="button" variant="accept" onClick={handleNext} className="mr-2 bg-gray-600">
                                        Next
                                    </Button>
                                </FormContainer>
                            )}

                            <FormContainer className="flex justify-start">
                                {currentStep === 2 && (
                                    <div className="flex">
                                        <Button type="button" variant="pending" onClick={handlePrevious} className="mr-2 bg-gray-600">
                                            Previous
                                        </Button>
                                        <div className="flex gap-20">
                                            <Button variant="accept" type="submit" className=" text-white">
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default SendWhatsAppMessage
