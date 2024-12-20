import { Button, FormContainer, Steps } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import TemplateDetails from './components/TemplateDetails'
import ContentSetup from './components/ContentSetup'
import TemplateMobilePreview from '../templateMobilePreview/TemplateMobilePreview'
import ButtonTemplate from './components/ButtonTemplate'

const AddTemplates = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [templateImagePreview, setTemplateImagePreview] = useState('')
    const [templateTextPreview, setTemplateTextPreview] = useState('')
    const [templateVideoPreview, setTemplateVideoPreview] = useState('')
    const [templatedocsPreview, setTemplatedocsPreview] = useState('')
    const [bodyTemplate, setBodyTemplate] = useState('')
    const initialValue = {}

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1)
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1)
    }

    const handleSubmit = () => {}

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

            {/* <div className="flex justify-center items-center xl:hidden">
        <Button variant="new" className=" xl:hidden" onClick={() => setShowMobileView(true)}>
            Mobile View
        </Button>
    </div> */}

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
                                    />
                                )}

                                {currentStep === 2 && <ButtonTemplate />}
                                {/* {currentStep === 3 && (
                            <FourthStep
                                values={values}
                                handleSchedule={hanldeSchedule}
                                valueForSchedule={valueForSchedule}
                                scheduleModal={showScheduleModal}
                            />
                        )} */}
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
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTemplates
