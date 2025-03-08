/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
// import { ridersService } from '@/store/services/riderServices'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { RiderFieldArray, RiderTypeArray } from './riderUtils'
import AddRiderMap from './AddRiderMap'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import FullTimePicker from '@/common/FullTimePicker'

const AddRider = () => {
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)
    // const [ridersData] = ridersService.useAddRidersMutation()
    const initialValue = {}
    //TODO: connvert this to rtk query and define its type
    const handleSubmit = async (values: any) => {
        const body = {
            mobile: values?.mobile,
            first_name: values?.first_name,
            last_name: values?.last_name,
            rider_type: values?.rider_type,
            service_latitude: currLat,
            service_longitude: currLong,
            shift_start_time: values?.shift_start_time,
            shift_end_time: values?.shift_end_time,
        }
        console.log('body is', body)
        try {
            const response = await axioisInstance.post(`/rider/profile`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Added Rider',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to add Rider',
            })
            console.error(error)
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
                    <Form className="w-3/4">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {RiderFieldArray?.map((item, key) => (
                                    <FormItem key={key} label={item?.label}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={`Enter ${item?.label}`}
                                            component={Input}
                                            maxLength={item?.name === 'mobile' && 10}
                                        />
                                    </FormItem>
                                ))}
                                <FormItem label="rider_type">
                                    <Field name="rider_type">
                                        {({ form, field }: FieldProps) => {
                                            const selectedCompany = RiderTypeArray.find((option) => option.label === field?.value)
                                            return (
                                                <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                                    <Select
                                                        isClearable
                                                        className="w-full"
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
                            {/* MAP for lat and long */}
                            <div className="text-xl font-bold mb-6">ADD RIDER LOCATION</div>
                            <AddRiderMap setMarkLat={setCurrLat} setMarkLong={setCurrLong} markLat={currLat} markLong={currLong} />
                        </FormContainer>

                        <FormContainer className="mt-10">
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
