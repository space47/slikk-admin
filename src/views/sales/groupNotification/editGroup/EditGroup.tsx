/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useState } from 'react'

import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { groupLocation, headingGroup, LoyaltyArray, orderGroup, userProfileGroup } from '../addGroup/commonTypesGroup/userProfile'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { notification } from 'antd'
import { useParams } from 'react-router-dom'

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

const EditGroup = () => {
    const [initialData, setInitialData] = useState<any>([])
    const [userData, setUserData] = useState<any[]>([])

    const { groupId } = useParams()

    const fetchGroupNotification = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups?group_id=${groupId}`)
            const data = response?.data?.data?.results
            setInitialData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchForUserData = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups/${groupId}`)
            const data = response?.data?.data
            setUserData(data?.group_users)
        } catch (error) {
            console.error(error)
        }
    }

    useLayoutEffect(() => {
        fetchGroupNotification()
        fetchForUserData()
    }, [groupId])

    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    console.log('Iniyial va;ues', initialData)

    const initialValues = {
        name: initialData[0]?.name,
        user: userData?.flatMap((item) => item?.mobile).join(','),
        // Group fields
        groups: initialData[0]?.group || [],

        // Cart fields
        cart_start: initialData[0]?.rules?.cart?.find((rule: any) => rule.type === 'cart')?.value.start_date || '',
        cart_end: initialData[0]?.rules?.cart?.find((rule: any) => rule.type === 'cart')?.value.end_date || '',

        // User profile fields
        registration_start: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'registration')?.value.start || '',
        registration_end: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'registration')?.value.end || '',
        dob_start: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'dob')?.value.start || '',
        dob_end: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'dob')?.value.end || '',
        gender: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'gender')?.value || [],

        // Order fields
        min_value: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_value')?.value.min || '',
        max_value: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_value')?.value.max || '',
        max_purchase: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'life_time_purchase')?.value.min || '',
        min_purchase: initialData[0]?.rules.order?.find((rule: any) => rule.type === 'life_time_purchase')?.value.max || '',
        min_count: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_count')?.value.min || '',
        max_count: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_count')?.value.max || '',
        order_delivery_type: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_delivery_type')?.value || [],

        // Loyalty
        // max_point_available:  initialData[0]?.rules?.loyalty?.find((rule: any) => rule.type === 'order_type_delivery')?.value || [],
        // min_point_available:  initialData[0]?.rules?.loyalty?.find((rule: any) => rule.type === 'order_type_delivery')?.value || [],

        // Order item fields
        max_basket_size: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'basket_size')?.value.max || '',
        min_basket_size: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'basket_size')?.value.min || '',
        filters: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'tag_filters')?.value || [],

        // Location fields
        city: initialData[0]?.rules?.location?.find((loc: any) => loc.type === 'city')?.value || '',
        state: initialData[0]?.rules?.location?.find((loc: any) => loc.type === 'state')?.value || '',
        distance: initialData[0]?.rules?.location?.find((loc: any) => loc.type === 'distance')?.value || '',
    }

    // const initialValues = {}

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const handleSubmit = async (values: any) => {
        console.log('start')

        const formData = {
            ...(values.name && { name: values.name }),
            ...(values.user && { user: values.user }),
            rules: {
                cart: [
                    ...(values.cart_start && values.cart_end
                        ? [
                              {
                                  type: 'cart',
                                  value: {
                                      start_date: values.cart_start,
                                      end_date: values.cart_end,
                                  },
                              },
                          ]
                        : []),
                ],
                userInfo: [
                    ...(values.registration_start && values.registration_end
                        ? [
                              {
                                  type: 'registration',
                                  value: {
                                      start_date: values.registration_start,
                                      end_date: values.registration_end,
                                  },
                              },
                          ]
                        : []),
                    ...(values.dob_start && values.dob_end
                        ? [
                              {
                                  type: 'dob',
                                  value: {
                                      start_date: values.dob_start,
                                      end_date: values.dob_end,
                                  },
                              },
                          ]
                        : []),
                    ...(values.gender && values.gender.length
                        ? [
                              {
                                  type: 'gender',
                                  value: values.gender.join(','),
                              },
                          ]
                        : []),
                ],
                order: [
                    ...(values.start_date
                        ? [
                              {
                                  type: 'order_date',
                                  value: {
                                      start_date: values.start_date,
                                      end_date: values.end_date || values.start_date, // Adjust end_date if required
                                  },
                              },
                          ]
                        : []),
                    ...(values.max_value && values.min_value
                        ? [
                              {
                                  type: 'order_value',
                                  value: {
                                      max_amount: values.max_value,
                                      min_amount: values.min_value,
                                  },
                              },
                          ]
                        : []),
                    ...(values.max_purchase && values.min_purchase
                        ? [
                              {
                                  type: 'life_time_purchase',
                                  value: {
                                      max_amount: values.max_purchase,
                                      min_amount: values.min_purchase,
                                  },
                              },
                          ]
                        : []),
                    ...(values.max_count && values.min_count
                        ? [
                              {
                                  type: 'order_count',
                                  value: {
                                      max_order_count: values.max_count,
                                      min_order_count: values.min_count,
                                  },
                              },
                          ]
                        : []),
                    ...(values.order_delivery_type && values.order_delivery_type.length
                        ? [
                              {
                                  type: 'order_delivery_type',
                                  value: values.order_delivery_type.join(','),
                              },
                          ]
                        : []),
                ],
                loyalty: [
                    ...(values.loyalty && values.loyalty.length
                        ? [
                              {
                                  type: 'tier',
                                  value: values.loyalty.join(','),
                              },
                          ]
                        : []),
                    ...(values.max_point_available && values.min_point_available
                        ? [
                              {
                                  type: 'points available',
                                  value: {
                                      max: values.max_point_available,
                                      min: values.min_point_available,
                                  },
                              },
                          ]
                        : []),
                    ...(values.max_point_earned && values.min_point_earned
                        ? [
                              {
                                  type: 'points earned',
                                  value: {
                                      max: values.max_point_earned,
                                      min: values.min_point_earned,
                                  },
                              },
                          ]
                        : []),
                    ...(values.max_point_redeemed && values.min_point_redeemed
                        ? [
                              {
                                  type: 'points redeemed',
                                  value: {
                                      max: values.max_point_redeemed,
                                      min: values.min_point_redeemed,
                                  },
                              },
                          ]
                        : []),
                ],
                order_item: [
                    ...(values.max_basket_size && values.min_basket_size
                        ? [
                              {
                                  type: 'basket_size',
                                  value: {
                                      max: values.max_basket_size,
                                      min: values.min_basket_size,
                                  },
                              },
                          ]
                        : []),
                    ...(values.filters
                        ? [
                              {
                                  type: 'tag_filters',
                                  value: values.filters,
                              },
                          ]
                        : []),
                ],
                location: [
                    ...(values.city
                        ? [
                              {
                                  type: 'city',
                                  value: values.city,
                              },
                          ]
                        : []),
                    ...(values.state
                        ? [
                              {
                                  type: 'state',
                                  value: values.state,
                              },
                          ]
                        : []),
                    ...(values.distance
                        ? [
                              {
                                  type: 'distance',
                                  value: values.distance,
                              },
                          ]
                        : []),
                ],
            },
        }

        console.log('mid')
        try {
            const response = await axioisInstance.post(`/notification/groups`, formData)
            console.log(response.data)
            notification.success({
                message: 'success',
                description: response.data.message || 'Successfully added group',
            })

            console.log('finish')
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
                initialValues={initialValues}
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
                                <FormContainer className="w-1/2">
                                    <h3>Cart</h3>
                                    <FormItem className="col-span-1 w-full sm:w-1/2 space-y-2">
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
                                            console.log('Field value of order type', field?.value)
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

export default EditGroup
