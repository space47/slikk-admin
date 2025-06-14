/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
// import { ridersService } from '@/store/services/riderServices'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { RiderFieldArray, RiderTypeArray } from './riderUtils'
import AddRiderMap from './AddRiderMap'
import { notification } from 'antd'
import FullTimePicker from '@/common/FullTimePicker'
import { ridersService } from '@/store/services/riderServices'
import { RiderAddTypes } from '@/store/types/riderAddTypes'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { RiderDetailType, setRiderProfile } from '@/store/slices/riderDetails/riderDetails.slice'

const AddRider = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)
    const [selectedRider, setSelectedRider] = useState<string | number>()
    const [ridersData, riderDataResponse] = ridersService.useAddRidersMutation()
    const { riderProfile } = useAppSelector<RiderDetailType>((state) => state.riderDetails)
    const [isAddRider, setIsAddRider] = useState(false)

    const { data: riders, isSuccess } = ridersService.useRiderProfileQuery(
        {
            page: 1,
            pageSize: 100,
            mobile: selectedRider?.toString(),
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRiderProfile(riders?.data || []))
        }
    }, [riders, isSuccess, dispatch, selectedRider])
    const initialValue = {
        last_name: selectedRider && !isAddRider ? riderProfile[0].user?.last_name : '',
        mobile: selectedRider && !isAddRider ? riderProfile[0]?.user?.mobile.toString() : '',
        shift_start_time: selectedRider && !isAddRider ? riderProfile[0]?.shift_start_time : '',
        shift_end_time: selectedRider && !isAddRider ? riderProfile[0]?.shift_end_time : '',
        rider_type: selectedRider && !isAddRider ? riderProfile[0]?.rider_type : '',
    }

    useEffect(() => {
        if (riderDataResponse?.isSuccess) {
            notification.success({
                message: riderDataResponse?.data?.success || 'Successfully Added Rider',
            })
            navigate(-1)
        }
    }, [riderDataResponse?.isSuccess])

    useEffect(() => {
        setCurrLat(riderProfile[0]?.service_latitude)
        setCurrLong(riderProfile[0]?.service_longitude)
    }, [riders, selectedRider, riderProfile])

    const handleSubmit = (values: RiderAddTypes) => {
        if (values?.mobile) {
            ridersData({
                mobile: values?.mobile,
                first_name: selectedRider && !isAddRider ? riderProfile[0].user?.first_name : values?.first_name,
                last_name: values?.last_name,
                rider_type: values?.rider_type,
                service_latitude: currLat,
                service_longitude: currLong,
                shift_start_time: values?.shift_start_time,
                shift_end_time: values?.shift_end_time,
            })
                .then(() => {})
                .catch(() => {
                    notification.error({
                        message: 'Failed to add Rider',
                    })
                })
        }
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 flex justify-start">
                                    <button
                                        className={`${isAddRider ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} p-2 flex items-center justify-center  text-white rounded-xl transition duration-200`}
                                        type="button"
                                        onClick={() => setIsAddRider((item) => !item)}
                                    >
                                        {isAddRider ? (
                                            <div className="text-xl ">Select Rider</div>
                                        ) : (
                                            <div className="text-xl ">New Rider</div>
                                        )}
                                    </button>
                                </div>
                                <FormItem label="First Name" className="col-span-1">
                                    <>
                                        {isAddRider === false && (
                                            <select
                                                value={selectedRider || 'SELECT'}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onChange={(e) => setSelectedRider(e.target.value === 'CLEAR' ? '' : e.target.value)}
                                            >
                                                <option disabled value="SELECT">
                                                    SELECT RIDER
                                                </option>
                                                {riderProfile?.map((item, key) => (
                                                    <option key={key} value={item?.user?.mobile}>
                                                        {item.user?.first_name}
                                                    </option>
                                                ))}
                                                <option value="CLEAR" className="bg-red-500 hover:bg-red-400 text-white">
                                                    <span className="flex justify-center items-center ">CLEAR</span>
                                                </option>
                                            </select>
                                        )}
                                        {isAddRider === true && (
                                            <Field
                                                type="text"
                                                name="first_name"
                                                placeholder="Enter First Name"
                                                component={Input}
                                                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        )}
                                    </>
                                </FormItem>
                                {RiderFieldArray?.map((item, key) => (
                                    <FormItem key={key} label={item?.label} className="col-span-1">
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={`Enter ${item?.label}`}
                                            component={Input}
                                            maxLength={item?.name === 'mobile' ? 10 : undefined}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <FullTimePicker label="SHIFT START" name="shift_start_time" fieldname="shift_start_time" />
                                <FullTimePicker label="SHIFT END" name="shift_end_time" fieldname="shift_end_time" />
                            </FormContainer>
                            <div className="mt-8">
                                <div className="text-xl font-bold mb-4 text-gray-700">ADD RIDER LOCATION</div>
                                <AddRiderMap
                                    setMarkLat={setCurrLat ?? 0}
                                    setMarkLong={setCurrLong ?? 0}
                                    markLat={currLat ?? 0}
                                    markLong={currLong ?? 0}
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
