/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import TemplateDetails from '../AddTemplates/components/TemplateDetails'
import ContentSetup, { btnsArray } from '../AddTemplates/components/ContentSetup'
import TemplateMobilePreview from '../templateMobilePreview/TemplateMobilePreview'
import ButtonTemplate from '../AddTemplates/components/ButtonTemplate'
import axios from 'axios'
import { handleimage } from '@/common/handleImage'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams } from 'react-router-dom'

const EditTemplates = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [templateImagePreview, setTemplateImagePreview] = useState<any>()
    const [templateTextPreview, setTemplateTextPreview] = useState('')
    const [templateVideoPreview, setTemplateVideoPreview] = useState<any>()
    const [templatedocsPreview, setTemplatedocsPreview] = useState('')
    const [bodyTemplate, setBodyTemplate] = useState('')
    const [buttonText, setButtonText] = useState<any[]>([])
    const [quickButtonText, setQuickButtonText] = useState<any[]>([])
    const [sampleValues, setSampleValues] = useState<any>({})
    const [sampleBodyValues, setSampleBodyValues] = useState<any>({})
    const [bodyButtonVariable, setBodyButtonVariable] = useState<any[]>([])
    const [textButtonVariable, setTextButtonVariable] = useState<any[]>([])
    const [messageTemplateData, setMessageTemplateData] = useState<any>()
    const [templateId, setTemplateId] = useState<number>()
    const [h, setH] = useState('')
    const { name } = useParams()

    const fetchEditMessageTemplate = async () => {
        const body = {
            params: {
                name: name,
            },
        }
        try {
            const response = await axios.post(`https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/get_message_templates`, body)
            const data = response?.data?.data?.data
            setMessageTemplateData(data[0])
            setTemplateId(data[0]?.id)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchEditMessageTemplate()
    }, [])

    console.log('Datatatatataata', messageTemplateData)
    console.log('Template Id', templateId)

    const [storeUploadId, setStoreUploadId] = useState('')

    const initialValue = {
        name: messageTemplateData?.name,
        language: messageTemplateData?.language,
        category: messageTemplateData?.category,
        header: messageTemplateData?.components.find((item) => item?.type === 'HEADER')?.format?.toLowerCase(),
        header_text: messageTemplateData?.components.find((item) => item?.type === 'HEADER')?.text,
        body: messageTemplateData?.components.find((item) => item?.type === 'BODY')?.text,
        footer: messageTemplateData?.components.find((item) => item?.type === 'FOOTER')?.text,
    }

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1)
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1)
    }

    const plaintexter = (data) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(data ?? '', 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''

        return plainTextMessage
    }

    const handleMediaForFacebook = async (file: any) => {
        const body = {
            url: 'https://graph.facebook.com/v21.0/1588246595239188/uploads',
            method: 'POST',
            extra_data: {
                parameters: 'access_token',
            },
            params: {
                file_name: file?.name,
                file_length: file?.size,
                file_type: file?.type,
            },
        }

        try {
            const response = await axios.post(`https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/api_test`, body)
            const data = response?.data
            console.log('data after handle', data?.response?.id)

            return data?.response?.id
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const handleStartUpload = async (file: File, uploadSessionId: string) => {
        const formData = new FormData()
        try {
            formData.append('file', file)
            formData.append('url', `https://graph.facebook.com/v21.0/${uploadSessionId}`)
            const response = await axios.post('https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/upload_media', formData)
            const data = response?.data?.response_data
            setH(data?.h)
            console.log('Response Data:', response?.data)
            return data?.h
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }
    console.log('H ois', h)

    const tokenAouth = import.meta.env.VITE_FACEBOOK_TOKEN
    console.log('AUTH TOKEN', tokenAouth)

    const handleSubmit = async (values: any) => {
        const plainBody = plaintexter(values?.body)
        const plainFooter = plaintexter(values?.footer)

        let headerTextExample = ''
        let hForMedia
        if (values.header === 'text') {
            headerTextExample = values.header_text || 'Sample Text'
        } else if (values.header === 'image') {
            const storeUploadId = await handleMediaForFacebook(templateImagePreview[0])
            headerTextExample = storeUploadId
            hForMedia = await handleStartUpload(templateImagePreview[0], storeUploadId)
        } else if (values.header === 'video') {
            console.log('Handling Video')
            const storeUploadId = await handleMediaForFacebook(templateVideoPreview[0])
            headerTextExample = storeUploadId
            hForMedia = await handleStartUpload(templateVideoPreview[0], storeUploadId)
        } else if (values.header === 'document') {
            headerTextExample = templatedocsPreview || ''
        }

        const formattedBody = {
            name: values.name || '',
            parameter_format: 'NAMED',
            language: values.language || 'en',
            category: values.category || 'MARKETING',
            components: [
                // HEADER Component
                values?.header && {
                    type: 'HEADER',
                    format:
                        values.header === 'text'
                            ? 'TEXT'
                            : values.header === 'image'
                              ? 'IMAGE'
                              : values.header === 'video'
                                ? 'VIDEO'
                                : 'TEXT',
                    ...(values.header === 'text' &&
                        (Object.keys(sampleValues || {}).length > 0
                            ? {
                                  text: headerTextExample || '',
                                  example: {
                                      header_text_named_params: btnsArray
                                          .map((item) => ({
                                              param_name: item,
                                              example: sampleValues[item] || '',
                                          }))
                                          .filter((item) => item.example),
                                  },
                              }
                            : {
                                  text: headerTextExample || '',
                              })),
                    ...(values.header === 'image' || values.header === 'video'
                        ? {
                              example: {
                                  header_handle: hForMedia.split(','),
                              },
                          }
                        : {}),
                },
                // BODY Component
                {
                    type: 'BODY',
                    text: plainBody || '',
                    ...(Object.keys(sampleBodyValues || {}).length > 0
                        ? {
                              example: {
                                  body_text_named_params: btnsArray
                                      .map((item) => ({
                                          param_name: item,
                                          example: sampleBodyValues[item] || '',
                                      }))
                                      .filter((item) => item.example),
                              },
                          }
                        : {}),
                },
                // FOOTER Component
                plainFooter && {
                    type: 'FOOTER',
                    text: plainFooter,
                },
                // BUTTONS Component
                (values.addButtons?.length > 0 || values.quickButtons?.length > 0) && {
                    type: 'BUTTONS',
                    buttons: [
                        ...(values.addButtons?.includes('CALL_TO_ACTION')
                            ? values.buttons
                                  .flatMap((button: any) => {
                                      if (button?.type?.value === 'website') {
                                          const buttonData: any = {
                                              type: 'URL',
                                              text: button.buttonText || 'Default Button',
                                              url: button.websiteUrl,
                                          }
                                          if (button.sampleUrl) {
                                              buttonData.example = [button.sampleUrl]
                                          }
                                          return buttonData
                                      }
                                      if (button?.type?.value === 'phone') {
                                          return {
                                              type: 'PHONE_NUMBER',
                                              text: button.buttonText || 'Default Button',
                                              phone_number: button.phoneNumber,
                                          }
                                      }
                                      return null
                                  })
                                  .filter(Boolean)
                            : []),
                        ...(values.quickButtons?.map((quickButton: any) => ({
                            type: values.addButtons?.includes('QUICK_REPLY') ? 'QUICK_REPLY' : '',
                            text: quickButton.buttonText || 'Stop Promotions',
                        })) || []),
                    ],
                },
            ].filter(Boolean),
        }

        try {
            const response = await fetch(`https://graph.facebook.com/v21.0/${templateId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${tokenAouth}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedBody),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            notification.success({
                message: data?.message || 'Message Template Added',
            })
        } catch (error: any) {
            notification.error({
                message: error?.message || 'Unable to Add',
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
                                {currentStep === 0 && <TemplateDetails />}

                                {currentStep === 1 && (
                                    <ContentSetup
                                        values={values}
                                        setTemplateImagePreview={setTemplateImagePreview}
                                        setTemplateTextPreview={setTemplateTextPreview}
                                        setTemplateVideoPreview={setTemplateVideoPreview}
                                        setTemplatedocsPreview={setTemplatedocsPreview}
                                        setBodyTemplate={setBodyTemplate}
                                        setBodyButtonVariable={setBodyButtonVariable}
                                        setTextButtonVariable={setTextButtonVariable}
                                        setSampleValues={setSampleValues}
                                        sampleValues={sampleValues}
                                        sampleBodyValues={sampleBodyValues}
                                        setSampleBodyValues={setSampleBodyValues}
                                    />
                                )}

                                {currentStep === 2 && (
                                    <ButtonTemplate values={values} setButtonText={setButtonText} setQuickButtonText={setQuickButtonText} />
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

                <div className="w-[450px] bg-contain h-[780px] rounded-[24px] shadow-2xl overflow-hidden bg-gray-100 relative hidden xl:inline">
                    <img src="/img/logo/mobilePreview.jpeg" alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-20 left-1 right-1">
                        <TemplateMobilePreview
                            image={templateImagePreview}
                            video={templateVideoPreview}
                            message={bodyTemplate}
                            text={templateTextPreview}
                            buttonText={buttonText}
                            quickButtonText={quickButtonText}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTemplates
