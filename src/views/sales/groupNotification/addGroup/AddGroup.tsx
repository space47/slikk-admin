/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'

import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik' // Add FieldProps here
// import * as Yup from 'yup'
// import { useState } from 'react'
// import { message, notification } from 'antd'
// import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

import { groupLocation, headingGroup, LoyaltyArray, orderGroup, userProfileGroup } from './commonTypesGroup/userProfile'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { notification } from 'antd'

const genderOptions = [
    {
        value: 'M',
        label: 'Men',
    },
    {
        value: 'F',
        label: 'Female',
    },
]
const DeliveryOptions = [
    { label: 'Express', value: 'EXPRESS' },
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Try&Buy', value: 'TRY_AND_BUY' },
]

const LoyaltyOptions = [
    { label: 'Explorer', value: 'Explorer' },
    { label: 'TRENDSETTER', value: 'Trendsetter' },
    { label: 'ICON', value: 'Icon' },
]

const AddGroup = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const initialValue = {}

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const handleSubmit = async (values: any) => {
        console.log('Form values:', values) // Log values to check before proceeding
        console.log('max', values.gender)

        const formData = {
            name: values.name,
            user: values.user,
            rules: {
                cart: [
                    {
                        type: 'cart',
                        value: {
                            start_date: values.cart_start,
                            end_date: values.cart_end,
                        },
                    },
                ],
                userInfo: [
                    {
                        type: 'registration',
                        value: {
                            start_date: values.registration_start,
                            end_date: values.registration_end,
                        },
                    },
                    {
                        type: 'dob',
                        value: {
                            start_date: values.dob_start,
                            end_date: values.dob_end,
                        },
                    },
                    {
                        type: 'gender',
                        value: values.gender.join(','),
                    },
                ],
                order: [
                    {
                        type: 'order_date',
                        value: {
                            start_date: values.start_date,
                            end_date: values.start_date,
                        },
                    },
                    {
                        type: 'order_value',
                        value: {
                            max_amount: values.max_value,
                            min_amoun: values.min_value,
                        },
                    },
                    {
                        type: 'life_time_purchase',
                        value: {
                            max_amount: values.max_purchase,
                            min_amount: values.min_purchase,
                        },
                    },
                    {
                        type: 'order_count',
                        value: {
                            max_order_count: values.max_count,
                            min_order_count: values.min_count,
                        },
                    },
                    {
                        type: 'order_delivery_type',
                        value: values.order_delivery_type.join(','),
                    },
                ],
                loyalty: [
                    { type: 'tier', value: values.loyalty.join(',') },
                    {
                        type: 'points available',
                        value: {
                            max: values.max_point_available,
                            min: values.min_point_available,
                        },
                    },
                    {
                        type: 'points earned',
                        value: {
                            max: values.max_point_earned,
                            min: values.min_point_earned,
                        },
                    },
                    {
                        type: 'points redeemed',
                        value: {
                            max: values.max_point_redeemed,
                            min: values.min_point_redeemed,
                        },
                    },
                ],
                order_item: [
                    {
                        type: 'basket_size',
                        value: {
                            max: values.max_basket_size,
                            min: values.min_basket_size,
                        },
                    },
                    {
                        type: 'tag_filters',
                        value: values.filters,
                    },
                ],

                location: [
                    {
                        type: 'city',
                        value: values.city,
                    },
                    {
                        type: 'state',
                        value: values.state,
                    },
                    {
                        type: 'distance',
                        value: values.distance,
                    },
                ],
            },
        }

        console.log('To be sent to API', formData)
        try {
            const response = await axioisInstance.post(`/notification/groups`, formData)
            console.log(response.data)
            notification.success({
                message: 'success',
                description: response.data.message || 'Successfully added group',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to add group',
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
                {({ resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer>
                                <h3>Groups</h3>
                                <FormContainer className="grid grid-cols-2 gap-6">
                                    {headingGroup.map((item, key) => (
                                        <FormItem key={key} label={item.label} className={item.className}>
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            </FormContainer>
                            <FormContainer>
                                <h3>cart:</h3>

                                <FormContainer className="w-1/2">
                                    <FormItem label="Cart" className="col-span-1 w-full sm:w-1/2 space-y-2">
                                        <div className="flex flex-col">
                                            <label className="text-gray-700 font-semibold mb-1">Cart Start</label>
                                            <Field
                                                type="date"
                                                name="cart_start"
                                                component={Input}
                                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-gray-700 font-semibold mb-1">Cart End</label>
                                            <Field
                                                type="date"
                                                name="cart_end"
                                                component={Input}
                                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </FormItem>
                                </FormContainer>
                            </FormContainer>
                            <h3>User:</h3> <br />
                            <div className="grid grid-cols-2 gap-4">
                                {userProfileGroup.map((item, key) => {
                                    return (
                                        <FormContainer key={key} className="space-y-4">
                                            <FormItem label={item.label} className="col-span-1 w-full sm:w-1/2 space-y-2">
                                                <div className="flex flex-col">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.label} Start</label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.start_name}
                                                        component={Input}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col mt-4">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.label} End</label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.end_name}
                                                        component={Input}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormItem>
                                        </FormContainer>
                                    )
                                })}
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
                                                    onChange={(newVal) => {
                                                        const newValues = newVal ? newVal.map((val) => val.value) : []
                                                        form.setFieldValue(field.name, newValues)
                                                    }}
                                                    // onChange={(option) => form.setFieldValue(field.name, option?.value)}
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
                                {orderGroup.map((item, key) => {
                                    return (
                                        <FormContainer key={key} className="space-y-4">
                                            <FormItem label={item.label} className="col-span-1 w-full sm:w-1/2 space-y-2">
                                                <div className="flex flex-col">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.start_placeholder} </label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.start_name}
                                                        component={Input}
                                                        placeholder={item.start_placeholder}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col mt-4">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.min_placeholder} </label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.end_name}
                                                        component={Input}
                                                        placeholder={item.min_placeholder}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormItem>
                                        </FormContainer>
                                    )
                                })}
                                <FormItem asterisk label="Delivery Type" className="col-span-1 w-1/2">
                                    <Field name="order_delivery_type">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    isMulti
                                                    field={field}
                                                    form={form}
                                                    options={DeliveryOptions}
                                                    value={DeliveryOptions.find((option) => option.value === field.value)}
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
                        </FormContainer>
                        {/* OrderItem................................ */}
                        <FormContainer className="grid grid-cols-2 gap-10">
                            <h3>Order Item</h3> <br />
                            <FormItem label="Basket Size" className="col-span-1 w-full sm:w-1/2 space-y-2">
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold mb-1">Max Basket Size</label>{' '}
                                    <Field
                                        type="number"
                                        name="max_basket_size"
                                        placeholder="Max"
                                        component={Input}
                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 font-semibold mb-1">Min Basket Size</label>
                                    <Field
                                        type="number"
                                        name="min_basket_size"
                                        placeholder="Min"
                                        component={Input}
                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </FormItem>
                            <FormItem label="Filters">
                                <Field name="tag_filters">
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
                            <h3>Loyalty:</h3>
                            <br />
                            <FormItem asterisk label="Loyalty" className="col-span-1 w-1/2">
                                <Field name="loyalty">
                                    {({ field, form }: FieldProps<any>) => {
                                        return (
                                            <Select
                                                isMulti
                                                field={field}
                                                form={form}
                                                options={LoyaltyOptions}
                                                value={LoyaltyOptions.find((option) => option.value === field.value)}
                                                onChange={(newVal) => {
                                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                                    form.setFieldValue(field.name, newValues)
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>
                            <FormContainer className="grid grid-cols-2 gap-6">
                                {LoyaltyArray.map((item, key) => {
                                    return (
                                        <FormContainer key={key} className="space-y-4">
                                            <FormItem label={item.label} className="col-span-1 w-full sm:w-1/2 space-y-2">
                                                <div className="flex flex-col">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.start_placeholder} </label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.start_name}
                                                        component={Input}
                                                        placeholder={item.start_placeholder}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col mt-4">
                                                    <label className="text-gray-700 font-semibold mb-1">{item.min_placeholder} </label>
                                                    <Field
                                                        type={item.type}
                                                        name={item.end_name}
                                                        component={Input}
                                                        placeholder={item.min_placeholder}
                                                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </FormItem>
                                        </FormContainer>
                                    )
                                })}
                            </FormContainer>
                        </FormContainer>

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
