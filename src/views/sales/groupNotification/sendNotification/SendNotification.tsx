/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import {
    MAXMINARRAY,
    OFFARRAY,
    SendNotificationARRAY,
    UtmArray,
    notificationTypeArray,
    targetPageArray,
    DISCOUNTOPTIONS,
    initialValue,
} from './sendNotify.common'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { Spinner } from '@/components/ui'
import { handleimage } from '@/common/handleImage'
import SchedularModal from './SchedularModule'
import FirstStepNotification from './stepsOfNotifications/FirstStepNotification'
import SecondStepNotification from './stepsOfNotifications/SecondStepNotification'
import ThirdStepNotification from './stepsOfNotifications/ThirdStepNotification'
import Steps from '@/components/ui/Steps'
import FourthStep from './stepsOfNotifications/FourthStep'
import MobilePreview from './mobilePreview/MobilePreview'
import { useNavigate } from 'react-router-dom'
import MobileDrawer from './MobileDrawer'
import FormButton from '@/components/ui/Button/FormButton'

const SendNotification = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [showSpinner, setShowSpinner] = useState(false)
    const [groupDatatoSend, setGroupDataToSend] = useState([])
    const dispatch = useAppDispatch()
    const [currentStep, setCurrentStep] = useState(0)
    const [filterId, setFilterId] = useState()
    const [showScheduleModal, setScheduleModal] = useState(false)
    const [storeSchedular, setStoreSchedular] = useState({})
    const [valueForSchedule, setValueForSchedule] = useState<any>()
    const [messagePreview, setMessagePreview] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [titleView, setTitleView] = useState('')
    const [showMobileView, setShowMobileView] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const fetchGroupValue = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups?p=1&page_size=1000&is_active=true`)
            const data = response?.data?.data.results
            setGroupDataToSend(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGroupValue()
    }, [])

    const handleSubmit = async (values: any) => {
        console.log('values', values)
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(values.message, 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''
        const {
            image_url_array,
            utm_medium,
            utm_source,
            utm_campaign,
            minprice,
            maxprice,
            minoff,
            maxoff,
            event_name,
            utm_tags,
            filtersAdd,
            ...formData
        } = values
        console.log(utm_medium, utm_source, utm_campaign, utm_tags, maxoff, maxprice, minoff, minprice, filtersAdd)

        const targetPage = values?.is_custom
            ? `s/${values?.page}${values?.sub_page ? `/${values?.sub_page}` : ''}`
            : values?.target_page || ''

        const imageUpload = values.image_url_array.length > 0 ? await handleimage('product', image_url_array) : values.image_url
        const data = {
            ...formData,
            title: values?.title ?? '',
            name: values?.event_name ?? '',
            image_url: imageUpload || '',
            notification_group: values?.groupId?.id || '',
            target_page: targetPage,
            filters: [
                ...(values.filters || []),
                ...UtmArray.filter((item) => values[item.name] !== undefined).map(
                    (item) => `${item.name.replace('_', '-')}_${values[item.name]}`,
                ),
                ...MAXMINARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
                ...OFFARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
                ...(values.discountTags || []),
                ...(filterId ? [`filterId_${filterId}`] : []),
            ]
                .filter((filter) => filter)
                .join(','),
            message: plainTextMessage || '',
            sent_to_all: false,
        }

        if (values.users_all) {
            data.users = ''
            data.sent_to_all = true
        } else {
            data.users = values.users?.replace(/\s+/g, '') || ''
        }

        setValueForSchedule(data)

        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== undefined && value !== '' && key !== 'groupId'),
        )
        try {
            setShowSpinner(true)
            const response = await axioisInstance.post(`/notification/send`, filteredData)
            notification.success({ message: response.data.message || 'Notification has been added' })
            // navigate(-1)
        } catch (error: any) {
            console.log(error)
            notification.error({ message: error?.response?.data?.message || error?.response?.message || 'Failed to send' })
        } finally {
            setShowSpinner(false)
        }
    }

    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const handleAddFilter = () => {
        setShowAddFilter((prevFilters) => [...prevFilters, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        setShowAddFilter((prev) => prev.filter((item) => item !== index))
    }
    const [filtersData, setFiltersData] = useState<any[]>([])
    const handleAddFilters = async (values: any) => {
        const newFilterData = showAddFilter.map((_, index) => {
            return values.filtersAdd[index] || []
        })
        setFiltersData((prev: any) => {
            const updatedFilters = [...prev, newFilterData]
            const lastElement = updatedFilters.at(-1)
            sendFilterData(lastElement)
            return updatedFilters
        })
    }

    const sendFilterData = async (filterData: any) => {
        try {
            const body = { filter_data: filterData }
            const response = await axioisInstance.post(`/product/search/criteria`, body)
            const id = response.data?.data?.id
            setFilterId(id)
            notification.success({ message: 'Filters has been set' })
        } catch (error) {
            console.log(error)
        }
    }

    const hanldeSchedule = (value: any) => {
        setValueForSchedule(value)
        setScheduleModal((prev) => !prev)
    }

    const handleOk = async (val: any) => {
        console.log('clicked', val)
        const {
            checkBox_schedule_day,
            checkBox_schedule_minute,
            checkBox_schedule_month,
            checkBox_schedule_year,
            checkBox_schedule_hour,
            ...rest
        } = val ?? {}

        setStoreSchedular(rest)
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(valueForSchedule?.message ?? '', 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''

        const imageUpload =
            valueForSchedule?.image_url_array?.length > 0
                ? await handleimage('product', valueForSchedule.image_url_array)
                : (valueForSchedule?.image_url ?? '')

        const { expiry_date, ...schedulerConfigs } = rest ?? {}

        const targetPage = valueForSchedule?.is_custom
            ? `s/${valueForSchedule?.page}${valueForSchedule?.sub_page ? `/${valueForSchedule?.sub_page}` : ''}`
            : valueForSchedule?.target_page || ''

        const body = {
            title: titleView ?? '',
            message: plainTextMessage ?? '',
            name: valueForSchedule?.event_name ?? '',
            ...(valueForSchedule?.image_url_array.length > 0 ? { image: imageUpload } : {}),
            scheduler_config: schedulerConfigs,
            other_config: {
                filters: [
                    ...(valueForSchedule?.filters ?? []),
                    ...UtmArray.filter((item) => valueForSchedule?.[item.name] !== undefined).map(
                        (item) => `${item.name.replace('_', '-')}_${valueForSchedule?.[item.name]}`,
                    ),
                    ...MAXMINARRAY.filter((item) => valueForSchedule?.[item.name] !== undefined).map(
                        (item) => `${item.name}_${valueForSchedule?.[item.name]}`,
                    ),
                    ...OFFARRAY.filter((item) => valueForSchedule?.[item.name] !== undefined).map(
                        (item) => `${item.name}_${valueForSchedule?.[item.name]}`,
                    ),
                    ...(valueForSchedule?.discountTags ?? []),
                    ...(filterId !== undefined ? [`filterId_${filterId}`] : []),
                ].filter((filter) => filter),
                target_page: targetPage,
                key: valueForSchedule?.key ?? '',
                page_title: valueForSchedule?.page_title ?? '',
            },
            expiry_date: expiry_date || '',
            mobiles: valueForSchedule?.users ?? [],
        }
        const filteredBody = Object.fromEntries(Object.entries(body).filter(([_, value]) => value !== undefined && value !== ''))

        try {
            const response = await axioisInstance.post(`/user_notification`, filteredBody)
            notification.success({ message: 'Scheduled successfully' })
            // navigate(`/app/appsCommuncication/sendNotification`)
        } catch (error: any) {
            console.log(error)
            notification.error({ message: error?.response?.data?.message || error?.response?.message || 'Failed to schedule' })
        } finally {
            setScheduleModal(false)
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

            <div
                className={
                    currentStep === 3
                        ? showScheduleModal
                            ? 'grid xl:grid-cols-2 grid-cols-1 gap-7 xl:gap-0 '
                            : 'flex gap-4 '
                        : 'flex gap-10'
                }
            >
                <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                    {({ values, resetForm, setFieldValue }) => (
                        <Form className="w-full lg:w-2/3 mx-auto xl:mx-0">
                            <FormContainer>
                                {currentStep === 0 && (
                                    <FirstStepNotification
                                        SendNotificationARRAY={SendNotificationARRAY}
                                        values={values}
                                        setImagePreview={setImagePreview}
                                        setMessagePreview={setMessagePreview}
                                        setTitleView={setTitleView}
                                        setFieldValue={setFieldValue}
                                    />
                                )}

                                {currentStep === 1 && (
                                    <SecondStepNotification
                                        values={values}
                                        notificationTypeArray={notificationTypeArray}
                                        groupDatatoSend={groupDatatoSend}
                                        handleAddFilter={handleAddFilter}
                                        showAddFilter={showAddFilter}
                                        filters={filters}
                                        handleRemoveFilter={handleRemoveFilter}
                                        MAXMINARRAY={MAXMINARRAY}
                                        DISCOUNTOPTIONS={DISCOUNTOPTIONS}
                                        targetPageArray={targetPageArray}
                                        handleAddFilters={handleAddFilters}
                                    />
                                )}

                                {currentStep === 2 && <ThirdStepNotification />}
                                {currentStep === 3 && (
                                    <FourthStep
                                        values={values}
                                        handleSchedule={hanldeSchedule}
                                        setValueForSchedule={setValueForSchedule}
                                        valueForSchedule={valueForSchedule}
                                        scheduleModal={showScheduleModal}
                                        setShowScheduleModal={setScheduleModal}
                                        setFieldValue={setFieldValue}
                                        handleOk={handleOk}
                                    />
                                )}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                                {currentStep > 0 && currentStep < 3 && (
                                    <Button
                                        type="button"
                                        variant="pending"
                                        onClick={() => setCurrentStep((prev) => prev - 1)}
                                        className="mr-2 bg-gray-600"
                                    >
                                        Previous
                                    </Button>
                                )}
                                {currentStep < 3 && currentStep > 0 && (
                                    <Button
                                        type="button"
                                        variant="accept"
                                        onClick={() => setCurrentStep((prev) => prev + 1)}
                                        className="mr-2 bg-gray-600"
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
                                        onClick={() => setCurrentStep((prev) => prev + 1)}
                                        className="mr-2 bg-gray-600"
                                    >
                                        Next
                                    </Button>
                                </FormContainer>
                            )}

                            <FormContainer className="flex justify-start">
                                {currentStep === 3 && (
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
                                            onClick={() => setCurrentStep((prev) => prev - 1)}
                                            className="mr-2 mt-5 bg-gray-600"
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex gap-20">
                                            <FormButton isSpinning={showSpinner} value="Submit" />
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

export default SendNotification
