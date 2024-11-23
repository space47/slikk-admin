/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import {
    MAXMINARRAY,
    OFFARRAY,
    SendNotificationARRAY,
    sendNotificationType,
    UtmArray,
    notificationTypeArray,
    targetPageArray,
    DISCOUNTOPTIONS,
    initialValue,
} from './sendNotify.common'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { Checkbox, Spinner, Upload } from '@/components/ui'
import { handleimage } from '@/common/handleImage'
import SchedularModal from './SchedularModule'
import FirstStepNotification from './stepsOfNotifications/FirstStepNotification'
import SecondStepNotification from './stepsOfNotifications/SecondStepNotification'
import ThirdStepNotification from './stepsOfNotifications/ThirdStepNotification'
import Steps from '@/components/ui/Steps'
import FourthStep from './stepsOfNotifications/FourthStep'
import MobilePreview from './mobilePreview/MobilePreview'
import { useNavigate } from 'react-router-dom'

const SendNotification = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [showSpinner, setShowSpinner] = useState(false)
    const [groupValue, setGroupValue] = useState('')
    const [groupDatatoSend, setGroupDataToSend] = useState([])
    const [clickedGuarantee, setClickedGuarantee] = useState<any>({})
    const [groupId, setgroupId] = useState<string[]>([])
    const dispatch = useAppDispatch()
    const [currentStep, setCurrentStep] = useState(0)
    const [filterId, setFilterId] = useState()
    const [showScheduleModal, setScheduleModal] = useState(false)
    const [storeSchedular, setStoreSchedular] = useState({})
    const [valueForSchedule, setValueForSchedule] = useState<any>()
    const [submitvalue, setSubmitValue] = useState<any>(null)
    const [messagePreview, setMessagePreview] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [titleView, setTitleView] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const fetchGroupValue = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups?group_name=${groupValue}`)
            const data = response?.data?.data.results
            setGroupDataToSend(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (groupValue) {
            fetchGroupValue()
        }
    }, [groupValue])

    const hanldeGroupSearch = async (groupName: string) => {
        console.log('onclicking group', groupName)
        setClickedGuarantee((prevState: any) => ({
            ...prevState,
            [groupName]: !prevState[groupName],
        }))
        try {
            const response = await axioisInstance.get(`/notification/groups?group_name=${groupName}`)
            const Gdata = response?.data?.data.results
            const groupID = Gdata?.map((item: any) => item.id).join(',')
            setgroupId((prev) => [...prev, groupID])
            // setGroupValue(groupName)
            // setGroupDataToSend([])
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (values: any) => {
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
            utm_tags,
            filtersAdd,
            ...formData
        } = values
        console.log(utm_medium, utm_source, utm_campaign, utm_tags, maxoff, maxprice, minoff, minprice, filtersAdd)

        const imageUpload = values.image_url_array.length > 0 ? await handleimage('product', image_url_array) : values.image_url

        const data = {
            ...formData,
            title: titleView ?? '',
            image_url: imageUpload || '',
            notification_group_id: groupId.join(',') || '',
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
        }

        if (values.users_all) {
            data.users = ''
        } else {
            data.users = values.users?.replace(/\s+/g, '') || ''
        }

        setValueForSchedule(data)

        try {
            const response = await axioisInstance.post(`/notification/send`, data)
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
            const body = {
                filter_data: filterData,
            }

            const response = await axioisInstance.post(`/product/search/criteria`, body)

            const id = response.data?.data?.id
            setFilterId(id)
            notification.success({
                message: 'Filters has been set',
            })
        } catch (error) {
            console.log(error)
        }
    }

    if (showSpinner) {
        return <div className="flex h-screen items-center justify-center">{<Spinner size={40} />}</div>
    }

    const hanldeSchedule = (value: any) => {
        setValueForSchedule(value)
        setScheduleModal((prev) => !prev)
    }

    const handleClose = () => {
        setScheduleModal(false)
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

        console.log('Rest of Data', storeSchedular)
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(valueForSchedule?.message ?? '', 'text/html')
        const plainTextMessage = htmlDoc.body.textContent || ''

        const imageUpload =
            valueForSchedule?.image_url_array?.length > 0
                ? await handleimage('product', valueForSchedule.image_url_array)
                : (valueForSchedule?.image_url ?? '')

        const { expiry_date, ...schedulerConfigs } = rest ?? {}

        const body = {
            title: titleView ?? '',
            message: plainTextMessage,
            name: valueForSchedule?.event_name ?? '',
            image: imageUpload,
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
                target_page: valueForSchedule?.target_page ?? '',
                key: valueForSchedule?.key ?? '',
                page_title: valueForSchedule?.page_title ?? '',
            },
            expiry_date: expiry_date ?? '',
            mobiles: valueForSchedule?.users ?? [],
            groups: groupId.join(',') ?? '',
        }

        try {
            const response = await axioisInstance.post(`/user_notification`, body)
            notification.success({
                message: 'Scheduled successfully',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to schedule',
            })
        } finally {
            setScheduleModal(false)
            navigate(`/app/appsCommuncication/sendNotification`)
        }
    }

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1)
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => prev - 1)
    }

    return (
        <div>
            <div className="mb-10">
                <Steps current={currentStep}>
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

            <div className={currentStep === 3 ? (showScheduleModal ? 'grid grid-cols-3 ' : 'flex gap-4 ') : 'flex gap-10'}>
                <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                    {({ values, resetForm }) => (
                        <Form className="w-full lg:w-2/3 mx-auto xl:mx-0">
                            <FormContainer>
                                {currentStep === 0 && (
                                    <FirstStepNotification
                                        SendNotificationARRAY={SendNotificationARRAY}
                                        values={values}
                                        setImagePreview={setImagePreview}
                                        setMessagePreview={setMessagePreview}
                                        setTitleView={setTitleView}
                                    />
                                )}

                                {currentStep === 1 && (
                                    <SecondStepNotification
                                        notificationTypeArray={notificationTypeArray}
                                        groupValue={groupValue}
                                        setGroupValue={setGroupValue}
                                        groupDatatoSend={groupDatatoSend}
                                        clickedGuarantee={clickedGuarantee}
                                        hanldeGroupSearch={hanldeGroupSearch}
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
                                        valueForSchedule={valueForSchedule}
                                        scheduleModal={showScheduleModal}
                                    />
                                )}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                                {currentStep > 0 && currentStep < 3 && (
                                    <Button type="button" variant="pending" onClick={handlePrevious} className="mr-2 bg-gray-600">
                                        Previous
                                    </Button>
                                )}
                                {currentStep < 3 && currentStep > 0 && (
                                    <Button type="button" variant="solid" onClick={handleNext} className="mr-2 bg-gray-600">
                                        Next
                                    </Button>
                                )}
                            </FormContainer>

                            {currentStep === 0 && (
                                <FormContainer className="flex justify-end">
                                    <Button type="button" variant="solid" onClick={handleNext} className="mr-2 bg-gray-600">
                                        Next
                                    </Button>
                                </FormContainer>
                            )}

                            <FormContainer className="flex justify-start">
                                {currentStep === 3 && (
                                    <div className="flex">
                                        <Button type="button" variant="pending" onClick={handlePrevious} className="mr-2 bg-gray-600">
                                            Previous
                                        </Button>
                                        <div className="flex gap-20">
                                            <Button variant="solid" type="submit" className=" text-white">
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </FormContainer>
                        </Form>
                    )}
                </Formik>

                {showScheduleModal && currentStep === 3 ? (
                    <SchedularModal handleOk={handleOk} scheduleValues={valueForSchedule} />
                ) : (
                    <>
                        <div></div>
                    </>
                )}

                <div className="w-[450px] bg-contain h-[780px] rounded-[24px] shadow-2xl overflow-hidden bg-gray-100 relative">
                    <img src="/img/logo/mobilePreview.jpeg" alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-20 left-1 right-1">
                        <MobilePreview message={messagePreview} image={imagePreview} title={titleView} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SendNotification
