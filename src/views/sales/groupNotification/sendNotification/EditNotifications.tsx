/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { MAXMINARRAY, OFFARRAY, SendNotificationARRAY, UtmArray } from './sendNotify.common'
import { useAppDispatch } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { handleimage } from '@/common/handleImage'
import FirstStepNotification from './stepsOfNotifications/FirstStepNotification'
import SecondStepNotification from './stepsOfNotifications/SecondStepNotification'
import ThirdStepNotification from './stepsOfNotifications/ThirdStepNotification'
import Steps from '@/components/ui/Steps'
import MobilePreview from './mobilePreview/MobilePreview'
import { useNavigate, useParams } from 'react-router-dom'
import MobileDrawer from './MobileDrawer'
import FormButton from '@/components/ui/Button/FormButton'
import { AxiosError } from 'axios'
import { useNotificationFunc } from './sendNotificationsUtils/useNotificationFunc'
import * as Yup from 'yup'

const validationSchema = Yup.object({
    utm_medium: Yup.string().matches(/^[^_]*$/, 'Underscores are not allowed'),
    utm_source: Yup.string().matches(/^[^_]*$/, 'Underscores are not allowed'),
    utm_campaign: Yup.string().matches(/^[^_]*$/, 'Underscores are not allowed'),
    utm_tags: Yup.string().matches(/^[^_]*$/, 'Underscores are not allowed'),
})

const EditNotification = () => {
    const { id } = useParams()
    const [showSpinner, setShowSpinner] = useState(false)
    const dispatch = useAppDispatch()
    const [currentStep, setCurrentStep] = useState(0)
    const [filterId, setFilterId] = useState<any>('')
    const [messagePreview, setMessagePreview] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [titleView, setTitleView] = useState('')
    const [showMobileView, setShowMobileView] = useState(false)
    const [data, setData] = useState<any>(null)
    const navigate = useNavigate()

    const fetchData = async () => {
        if (id) {
            try {
                const response = await axioisInstance.get(`/user_notification?id=${id}`)
                console.log('fetched data', response.data)
                setData(response.data)
                setTitleView(response.data.message?.title || '')
                setMessagePreview(response.data.message?.message || '')
                setImagePreview(response.data.message?.image || '')
                setData(response.data?.message)
            } catch (error) {
                console.error('Error fetching notification data:', error)
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const { initialValue } = useNotificationFunc({ data })

    useEffect(() => {
        setFilterId(initialValue?.filterId)
    }, [initialValue?.filterId])

    const handleOk = async (val: any) => {
        console.log('form values', val)
        setShowSpinner(true)
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(val?.message ?? '', 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''
        const imageUpload = val?.image_url_array?.length > 0 ? await handleimage('product', val.image_url_array) : (val?.image_url ?? '')
        const targetPage = val?.is_custom ? `s/${val?.page}${val?.sub_page ? `/${val?.sub_page}` : ''}` : val?.target_page || ''

        const body = {
            title: titleView ?? '',
            message: plainTextMessage ?? '',
            name: val?.event_name ?? '',
            ...(val?.image_url_array?.length > 0 ? { image: imageUpload } : {}),
            other_config: {
                filters: [
                    ...(val?.filters ?? []),
                    ...UtmArray.filter((item) => val?.[item.name] !== undefined).map(
                        (item) => `${item.name.replace('_', '-')}_${val?.[item.name]}`,
                    ),
                    ...MAXMINARRAY.filter((item) => val?.[item.name] !== undefined).map((item) => `${item.name}_${val?.[item.name]}`),
                    ...OFFARRAY.filter((item) => val?.[item.name] !== undefined).map((item) => `${item.name}_${val?.[item.name]}`),
                    ...(val?.discountTags ?? []),
                    ...(filterId ? [`filterId_${filterId}`] : []),
                ].filter((filter) => filter),
                target_page: targetPage,
                page_title: val?.page_title ?? '',
                sub_page: val?.sub_page ?? '',
            },
            mobiles: val?.users ?? [],
        }
        const filteredBody = Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined && value !== ''))

        try {
            const response = await axioisInstance.patch(`/user_notification/${id}`, filteredBody)
            notification.success({ message: response?.data?.data?.message || response?.data?.message || 'Scheduled successfully' })
            navigate(`/app/appsCommuncication/sendNotification/${response?.data?.data?.id}`)
        } catch (error) {
            console.log(error)
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Failed to schedule' })
            }
        } finally {
            setShowSpinner(false)
        }
    }

    return (
        <div>
            <div className="mb-10">
                <Steps current={currentStep} className="flex flex-col items-start xl:flex-row">
                    {['Basic', 'Assign Filters', 'UTM', 'Scheduler & User'].map((stepTitle, index) => (
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

            <div className="flex justify-center items-center xl:hidden">
                <Button variant="new" className=" xl:hidden" onClick={() => setShowMobileView(true)}>
                    Mobile View
                </Button>
            </div>

            <div className="flex gap-10">
                <Formik enableReinitialize initialValues={initialValue} onSubmit={handleOk} validationSchema={validationSchema}>
                    {({ values, setFieldValue }) => (
                        <Form className="w-full lg:w-2/3 mx-auto xl:mx-0">
                            <FormContainer>
                                {currentStep === 0 && (
                                    <FirstStepNotification
                                        // editMode={true}
                                        SendNotificationARRAY={SendNotificationARRAY}
                                        values={values as any}
                                        setImagePreview={setImagePreview}
                                        setMessagePreview={setMessagePreview}
                                        setTitleView={setTitleView}
                                        setFieldValue={setFieldValue}
                                        // initialValue={initialValue}
                                        // handleRemoveImage={() => setFieldValue('image_url_array', [])}
                                    />
                                )}

                                {currentStep === 1 && (
                                    <SecondStepNotification
                                        values={values}
                                        setFilterId={setFilterId}
                                        filterId={filterId as unknown as string}
                                    />
                                )}

                                {currentStep === 2 && <ThirdStepNotification />}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                                {currentStep > 0 && currentStep < 2 && (
                                    <Button
                                        type="button"
                                        variant="pending"
                                        className="mr-2 bg-gray-600"
                                        onClick={() => setCurrentStep((prev) => prev - 1)}
                                    >
                                        Previous
                                    </Button>
                                )}
                                {currentStep < 2 && currentStep > 0 && (
                                    <Button
                                        type="button"
                                        variant="accept"
                                        className="mr-2 bg-gray-600"
                                        onClick={() => setCurrentStep((prev) => prev + 1)}
                                    >
                                        Next
                                    </Button>
                                )}
                            </FormContainer>

                            {currentStep === 0 && (
                                <FormContainer className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="accept"
                                        className="mr-2 bg-gray-600"
                                        onClick={() => setCurrentStep((prev) => prev + 1)}
                                    >
                                        Next
                                    </Button>
                                </FormContainer>
                            )}

                            <FormContainer className="flex justify-start">
                                {currentStep === 2 && (
                                    <div className="flex">
                                        <Button
                                            variant="twoTone"
                                            type="button"
                                            className="mr-2 mt-5 bg-gray-600"
                                            onClick={() => setCurrentStep(0)}
                                        >
                                            First Page
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="pending"
                                            className="mr-2 mt-5 bg-gray-600"
                                            onClick={() => setCurrentStep((prev) => prev - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex gap-20">
                                            <FormButton isSpinning={showSpinner} value="Create Template" />
                                        </div>
                                    </div>
                                )}
                            </FormContainer>
                        </Form>
                    )}
                </Formik>

                {currentStep !== 4 && (
                    <div className="w-[250px] bg-contain h-[500px] rounded-[24px] shadow-2xl overflow-hidden bg-gray-100 relative hidden xl:inline">
                        <img src="/img/logo/mobilePreview.jpeg" alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-20 left-1 right-1">
                            <MobilePreview message={messagePreview} image={imagePreview} title={titleView} />
                        </div>
                    </div>
                )}
            </div>
            {showMobileView && (
                <>
                    <MobileDrawer
                        dialogIsOpen={showMobileView}
                        setIsOpen={setShowMobileView}
                        messagePreview={messagePreview}
                        image={imagePreview}
                        title={titleView}
                    />
                </>
            )}
        </div>
    )
}

export default EditNotification
