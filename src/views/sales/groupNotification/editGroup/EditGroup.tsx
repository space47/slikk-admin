/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useState } from 'react'

import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { form, groupLocation, headingGroup, LoyaltyArray, orderGroup, userProfileGroup } from '../addGroup/commonTypesGroup/userProfile'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { notification } from 'antd'
import { useParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Spinner } from '@/components/ui'

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
    const [spinner, setSpinner] = useState(false)
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

    const initialValues = {
        name: initialData[0]?.name,
        user: initialData[0]?.user?.map((item: any) => item?.mobile).join(',') || '',
        groups: initialData[0]?.group || [],
        cart_start: initialData[0]?.rules?.cart?.find((rule: any) => rule.type === 'cart')?.value.start_date || '',
        cart_end: initialData[0]?.rules?.cart?.find((rule: any) => rule.type === 'cart')?.value.end_date || '',
        registration_start: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'registration')?.value.start || '',
        registration_end: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'registration')?.value.end || '',
        dob_start: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'dob')?.value.start || '',
        dob_end: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'dob')?.value.end || '',
        gender: initialData[0]?.rules?.userInfo?.find((info: any) => info.type === 'gender')?.value || [],
        min_value: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_value')?.value.min || '',
        max_value: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_value')?.value.max || '',
        max_purchase: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'life_time_purchase')?.value.min || '',
        min_purchase: initialData[0]?.rules.order?.find((rule: any) => rule.type === 'life_time_purchase')?.value.max || '',
        min_count: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_count')?.value.min || '',
        max_count: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_count')?.value.max || '',
        order_delivery_type: initialData[0]?.rules?.order?.find((rule: any) => rule.type === 'order_delivery_type')?.value || [],
        max_basket_size: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'basket_size')?.value.max || '',
        min_basket_size: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'basket_size')?.value.min || '',
        filters: initialData[0]?.rules?.order_item?.find((item: any) => item.type === 'tag_filters')?.value || [],
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
        console.log('mid')
        try {
            const response = await axioisInstance.patch(`/notification/groups/${groupId}`, form(values, '', []))
            console.log(response.data)
            notification.success({
                message: 'success',
                description: response.data.message || 'Successfully added group',
            })

            console.log('finish')
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to add' })
            }
        } finally {
            setSpinner(false)
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
                    <Form className="p-6 w-full shadow-xl rounded-xl bg-white">
                        <FormContainer className="space-y-8">
                            {/* Groups Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Groups</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {headingGroup.map((item, key) => (
                                        <FormItem key={key} label={item.label} className={item.className}>
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={Input}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </FormItem>
                                    ))}
                                </div>
                            </div>

                            {/* Cart Section */}
                            <div className="space-y-4 border border-gray-300 p-6 rounded-lg bg-white">
                                <h3 className="text-lg font-semibold text-gray-800">Cart</h3>
                                <div className="w-full md:w-1/2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cart Start</label>
                                            <Field
                                                type="date"
                                                name="cart_start"
                                                component={Input}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </FormItem>
                                        <FormItem className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cart End</label>
                                            <Field
                                                type="date"
                                                name="cart_end"
                                                component={Input}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>

                            {/* User Section */}
                            <div className="space-y-4 border border-gray-300 p-6 rounded-lg bg-white">
                                <h3 className="text-lg font-semibold text-gray-800">User</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userProfileGroup.map((item, key) => (
                                        <div key={key} className="space-y-4">
                                            <FormItem label={item.label} className="space-y-2">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {item.label} Start
                                                        </label>
                                                        <Field
                                                            type={item.type}
                                                            name={item.start_name}
                                                            component={Input}
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {item.label} End
                                                        </label>
                                                        <Field
                                                            type={item.type}
                                                            name={item.end_name}
                                                            component={Input}
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        </div>
                                    ))}
                                    <FormItem label="Gender" className="space-y-2" asterisk>
                                        <Field name="gender">
                                            {({ field, form }: FieldProps<any>) => (
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
                                                    className="w-full"
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </div>

                            {/* Order Section */}
                            <div className="space-y-4 border border-gray-300 p-6 rounded-lg bg-white">
                                <h3 className="text-lg font-semibold text-gray-800">Order</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {orderGroup.map((item, key) => (
                                        <div key={key} className="space-y-4">
                                            <FormItem label={item.label} className="space-y-2">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {item.start_placeholder}
                                                        </label>
                                                        <Field
                                                            type={item.type}
                                                            name={item.start_name}
                                                            component={Input}
                                                            placeholder={item.start_placeholder}
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {item.min_placeholder}
                                                        </label>
                                                        <Field
                                                            type={item.type}
                                                            name={item.end_name}
                                                            component={Input}
                                                            placeholder={item.min_placeholder}
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        </div>
                                    ))}
                                    <FormItem label="Delivery Type" className="space-y-2" asterisk>
                                        <Field name="order_delivery_type">
                                            {({ field, form }: FieldProps<any>) => (
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
                                                    className="w-full"
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </div>

                            {/* Order Item Section */}
                            <div className="space-y-4 border border-gray-300 p-6 rounded-lg bg-white">
                                <h3 className="text-lg font-semibold text-gray-800">Order Item</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormItem label="Basket Size" className="space-y-2">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Basket Size</label>
                                                <Field
                                                    type="text"
                                                    name="max_basket_size"
                                                    placeholder="Max"
                                                    component={Input}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Basket Size</label>
                                                <Field
                                                    type="text"
                                                    name="min_basket_size"
                                                    placeholder="Min"
                                                    component={Input}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </FormItem>
                                    <FormItem label="Filters" className="space-y-2">
                                        <Field name="tag_filters">
                                            {({ field, form }: FieldProps<any>) => (
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
                                                    className="w-full"
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </div>

                            {/* Loyalty Section */}
                            <div className="space-y-4 border border-gray-300 p-6 rounded-lg bg-white">
                                <h3 className="text-lg font-semibold text-gray-800">Loyalty</h3>
                                <div className="w-full md:w-1/2">
                                    <FormItem label="Loyalty" className="space-y-2" asterisk>
                                        <Field name="loyalty">
                                            {({ field, form }: FieldProps<any>) => (
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
                                                    className="w-full"
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {LoyaltyArray.map((item, key) => (
                                        <div key={key} className="space-y-4">
                                            <FormItem label={item.label} className="space-y-2">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {item.start_placeholder}
                                                        </label>
                                                        <Field
                                                            type={item.type}
                                                            name={item.start_name}
                                                            component={Input}
                                                            placeholder={item.start_placeholder}
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {item.min_placeholder}
                                                        </label>
                                                        <Field
                                                            type={item.type}
                                                            name={item.end_name}
                                                            component={Input}
                                                            placeholder={item.min_placeholder}
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-4 border border-gray-300 p-6 rounded-lg bg-white">
                                <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {groupLocation.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="space-y-2">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={Input}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </FormItem>
                                    ))}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4 pt-6">
                                <Button
                                    variant="solid"
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    {spinner && <Spinner size={20} color="white" />}
                                    Submit
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditGroup
