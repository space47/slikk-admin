import React, { useEffect } from 'react'

import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik' // Add FieldProps here
import * as Yup from 'yup'
import { useState } from 'react'
import { message, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

import { RichTextEditor } from '@/components/shared'
import { groupLocation, orderGroup, userProfileGroup } from './commonTypesGroup/userProfile'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'

const genderOptions = [
    {
        value: 'Men',
        label: 'Men',
    },
    {
        value: 'Women',
        label: 'Women',
    },
]
const DeliveryOptions = [
    { label: 'Express', value: 'EXPRESS' },
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Try&Buy', value: 'TRY_AND_BUY' },
]

const AddGroup = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const initialValue = {}

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const handleSubmit = (values: any) => {
        const formData = {
            user: [
                {
                    type: 'registration',
                    value: {
                        start: values.registration_start,
                        end: values.registration_end,
                    },
                },
                {
                    type: 'dob',
                    value: {
                        start: values.dob_start,
                        end: values.dob_end,
                    },
                },
                {
                    type: 'gender',
                    value: values.gender ? values.gender.split(',') : [],
                },
            ],
            order: {
                create_date: values.create_date,
                order_value: values.order_value,
                life_time_purchase: values.life_time_purchase,
                order_type_delivery: values.order_type_delivery,
                order_count: values.order_count,
            },
            order_item: {
                basket_size: values.basket_size,
                tage_filters: values.filters,
            },
            location: {
                city: values.city,
                state: values.state,
                distance: values.distance,
            },
        }

        console.log('To be sent to API', formData.user)
    }
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <h3>User:</h3> <br />
                            <div className="grid grid-cols-2 gap-4">
                                <FormContainer>
                                    <FormItem label="Registration Date" className="flex gap-2 w-1/2">
                                        <Field type="date" name="registration_start" component={Input} />
                                        <Field type="date" name="registration_end" component={Input} />
                                    </FormItem>
                                </FormContainer>
                                <FormContainer>
                                    <FormItem label="Date of Birth" className="col-span-1 w-1/2">
                                        <Field type="date" name="dob_start" component={Input} />
                                        <Field type="date" name="dob_end" component={Input} />
                                    </FormItem>
                                </FormContainer>
                                <FormItem asterisk label="Gender" className="col-span-1 w-1/2">
                                    <Field name="gender">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    isMulti
                                                    field={field}
                                                    form={form}
                                                    options={genderOptions}
                                                    value={genderOptions.find((option) => option.value === field.value)}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </div>
                        </FormContainer>
                        {/* order................................................................................................. */}
                        <FormContainer>
                            <h3>Order:</h3> <br />
                            <FormContainer className="grid grid-cols-2 gap-4">
                                <FormItem className="">
                                    {orderGroup.map((item, key) => (
                                        <FormItem key={key} label={item.label}>
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormItem>
                                <FormItem asterisk label="Delivery Type" className="col-span-1 w-1/2">
                                    <Field name="order_type_delivery">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={DeliveryOptions}
                                                    value={DeliveryOptions.find((option) => option.value === field.value)}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                        {/* OrderItem................................ */}
                        <FormContainer className="grid grid-cols-2 gap-10">
                            <h3>Order Item</h3> <br />
                            <FormItem label="Basket Size">
                                <Field type="number" name="basket_size" placeholder="Enter Basket Size" component={Input} />
                            </FormItem>
                            <FormItem label="Filters">
                                <Field name="filters">
                                    {({ field, form }: FieldProps<any>) => {
                                        return (
                                            <Select
                                                isMulti
                                                placeholder="Select Filter Tags"
                                                options={filters.filters}
                                                getOptionLabel={(option) => option.label}
                                                getOptionValue={(option) => option.value}
                                                onChange={(newVal) => {
                                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                                    form.setFieldValue(field.name, newValues)
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>
                        </FormContainer>
                        {/* Location */}
                        <FormContainer>
                            <h3>Location</h3> <br />
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {groupLocation.map((item, key) => (
                                    <FormItem key={key} label={item.label}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
                            </FormContainer>
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
        </div>
    )
}

export default AddGroup
