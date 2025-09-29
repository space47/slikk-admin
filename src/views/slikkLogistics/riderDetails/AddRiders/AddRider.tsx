/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Dropdown, FormContainer, FormItem, Input, Select } from '@/components/ui'
// import { ridersService } from '@/store/services/riderServices'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState, useMemo } from 'react'
import { RiderFieldArray, RiderTypeArray, SearchRider } from './riderUtils'
import AddRiderMap from './AddRiderMap'
import { notification } from 'antd'
import FullTimePicker from '@/common/FullTimePicker'
import { ridersService } from '@/store/services/riderServices'
import { RiderAddTypes } from '@/store/types/riderAddTypes'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { RiderDetailType, setRiderProfile } from '@/store/slices/riderDetails/riderDetails.slice'
import { GenericCommonTypes } from '@/common/allTypesCommon'
import AssignStoreToUser from '@/common/AssignStoreToUser'
import { HiSearch } from 'react-icons/hi'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'

const AddRider = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    // Remove separate lat/long state, will use Formik values instead
    const [selectedRider, setSelectedRider] = useState<string | number>()
    const [ridersData, riderDataResponse] = ridersService.useAddRidersMutation()
    const [editRiders, riderEditResponse] = ridersService.useEditRidersMutation()
    const { riderProfile } = useAppSelector<RiderDetailType>((state) => state.riderDetails)
    const [isAddRider, setIsAddRider] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SearchRider[0])

    const { data: riders, isSuccess } = ridersService.useRiderProfileQuery(
        {
            page: 1,
            pageSize: 100,
            mobile: currentSelectedPage?.value === 'mobile' ? selectedRider?.toString() : '',
            name: currentSelectedPage?.value === 'name' ? selectedRider?.toString() : '',
        },
        { refetchOnMountOrArgChange: true },
    )
    useEffect(() => {
        if (isSuccess) {
            dispatch(setRiderProfile(riders?.data || []))
        }
    }, [riders, isSuccess, dispatch, selectedRider])
    const initialValue = useMemo(() => {
        if (selectedRider && !isAddRider && riderProfile && riderProfile.length > 0) {
            const user = riderProfile[0]?.user || {}
            return {
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                mobile: user.mobile ? user.mobile.toString() : '',
                shift_start_time: riderProfile[0]?.shift_start_time || '',
                shift_end_time: riderProfile[0]?.shift_end_time || '',
                rider_type: riderProfile[0]?.rider_type || '',
                is_active: riderProfile[0]?.is_active || false,
                lat: riderProfile[0]?.service_latitude,
                long: riderProfile[0]?.service_longitude,
            }
        }
        return {
            first_name: '',
            last_name: '',
            mobile: '',
            shift_start_time: '',
            shift_end_time: '',
            rider_type: '',
            is_active: false,
            lat: 12.920216,
            long: 77.649326,
        }
    }, [selectedRider, isAddRider, riderProfile])

    useEffect(() => {
        if (riderDataResponse?.isSuccess) {
            notification.success({
                message: riderDataResponse?.data?.success || 'Successfully Added Rider',
            })
            navigate(-1)
        }
        if (riderEditResponse?.isSuccess) {
            notification.success({
                message: riderEditResponse?.data?.success || 'Successfully Updated Rider',
            })
            // navigate(-1)
        }
    }, [riderDataResponse, riderEditResponse])

    // Remove effect that sets currLat/currLong

    const handleSubmit = (values: RiderAddTypes) => {
        console.log('values are', values)
        if (!values?.mobile) {
            notification.error({ message: 'Mobile is required' })
        }
        if (values?.mobile) {
            const payload = {
                mobile: values?.mobile,
                first_name: selectedRider && !isAddRider ? riderProfile[0].user?.first_name : values?.first_name,
                last_name: values?.last_name,
                rider_type: values?.rider_type,
                service_latitude: values?.lat,
                service_longitude: values?.long,
                shift_start_time: values?.shift_start_time,
                shift_end_time: values?.shift_end_time,
                is_active: values?.is_active || false,
                agency: values?.agency || '',
            }
            if (isAddRider) {
                ridersData(payload)
                    .then(() => {})
                    .catch(() => {
                        notification.error({
                            message: 'Failed to add Rider',
                        })
                    })
            } else {
                editRiders(payload)
                    .then(() => {})
                    .catch(() => {
                        notification.error({
                            message: 'Failed to add Rider',
                        })
                    })
            }
        }
    }
    const setSearchOnEnter = () => {
        if (searchInput.trim()) {
            setSelectedRider(searchInput.trim())
        }
    }

    const handleSearchWithIcon = () => {
        setSearchOnEnter()
    }
    const handleSelect = (e: any, setCurrent: any) => {
        const selected = SearchRider.find((item) => item.value === e)
        if (selected) {
            setCurrent(selected)
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 flex justify-start gap-6 items-center">
                                    <Button
                                        variant={isAddRider ? 'reject' : 'accept'}
                                        type="button"
                                        size="sm"
                                        className="flex items-center"
                                        onClick={() => setIsAddRider((item) => !item)}
                                    >
                                        {isAddRider ? (
                                            <div className="text-xl">Select Rider</div>
                                        ) : (
                                            <div className="text-xl ">New Rider</div>
                                        )}
                                    </Button>
                                    {!isAddRider && (
                                        <>
                                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center order-2 lg:order-1 w-full lg:w-auto">
                                                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md w-full sm:w-auto">
                                                    <Input
                                                        type="search"
                                                        name="search"
                                                        placeholder="Search here..."
                                                        value={searchInput}
                                                        className="w-full sm:w-[180px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                                                        onChange={(e) => setSearchInput(e.target.value)}
                                                        onKeyDown={(e: any) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault()
                                                                setSearchOnEnter()
                                                            }
                                                        }}
                                                    />
                                                    <div
                                                        className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer"
                                                        onClick={handleSearchWithIcon}
                                                    >
                                                        <HiSearch className="text-white text-xl" />
                                                    </div>
                                                    <div className="bg-gray-100 dark:bg-blue-600 dark:text-white font-bold text-sm rounded-md">
                                                        <Dropdown
                                                            className="text-black bg-gray-200 font-bold"
                                                            title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                                            onSelect={(e) => handleSelect(e, setCurrentSelectedPage)}
                                                        >
                                                            {SearchRider?.map((item, key) => (
                                                                <DropdownItem key={key} eventKey={item.value}>
                                                                    <span>{item.label}</span>
                                                                </DropdownItem>
                                                            ))}
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {RiderFieldArray?.map((item, key) => (
                                    <FormItem key={key} label={item?.label} className="col-span-1">
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={`Enter ${item?.label}`}
                                            component={item.type === 'checkbox' ? Checkbox : Input}
                                            maxLength={item?.name === 'mobile' ? 10 : undefined}
                                            className="w-full"
                                        />
                                    </FormItem>
                                ))}
                                <FormItem label="Rider Type" className="col-span-1">
                                    <Field name="rider_type">
                                        {({ form, field }: FieldProps) => {
                                            const selectedCompany = RiderTypeArray.find((option) => option.label === field?.value)
                                            return (
                                                <div className="w-full">
                                                    <Select
                                                        isClearable
                                                        className="w-1/2"
                                                        options={RiderTypeArray}
                                                        getOptionLabel={(option) => option.label}
                                                        getOptionValue={(option) => option.value}
                                                        value={selectedCompany || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('rider_type', newVal?.value)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                                {!isAddRider && <AssignStoreToUser mobile={values?.mobile || ''} customClass="mb-6 xl:ml-20" />}
                                <FullTimePicker label="SHIFT START" name="shift_start_time" fieldname="shift_start_time" />
                                <FullTimePicker label="SHIFT END" name="shift_end_time" fieldname="shift_end_time" />
                                <CommonSelect
                                    label="Rider Agency"
                                    name="agency"
                                    options={[
                                        { label: 'Pidge', value: 'pidge' },
                                        { label: 'Pico', value: 'pico' },
                                    ]}
                                />
                            </FormContainer>
                            <div className="mt-8">
                                <div className="text-xl font-bold mb-4 text-gray-700">ADD RIDER LOCATION</div>
                                <div>
                                    <div className="grid grid-cols-2 gap-2 mb-6">
                                        <Input
                                            name="lat"
                                            type="number"
                                            value={values.lat}
                                            placeholder="Enter latitude"
                                            onChange={(e: GenericCommonTypes['InputEvent']) => setFieldValue('lat', Number(e.target.value))}
                                        />
                                        <Input
                                            name="long"
                                            type="number"
                                            value={values.long}
                                            placeholder="Enter longitude"
                                            onChange={(e: GenericCommonTypes['InputEvent']) =>
                                                setFieldValue('long', Number(e.target.value))
                                            }
                                        />
                                    </div>
                                </div>
                                <AddRiderMap
                                    setMarkLat={(lat: number) => setFieldValue('lat', lat)}
                                    setMarkLong={(lng: number) => setFieldValue('long', lng)}
                                    markLat={values.lat}
                                    markLong={values.long}
                                />
                            </div>
                        </FormContainer>
                        <FormContainer className="mt-8 flex justify-end">
                            <Button variant="accept" type="submit">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddRider
