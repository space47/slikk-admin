/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import {
    DeliveryOptions,
    genderOptions,
    groupLocation,
    headingGroup,
    LoyaltyArray,
    LoyaltyOptions,
    orderGroup,
    userProfileGroup,
} from '../addGroup/commonTypesGroup/userProfile'
import { FILTER_STATE } from '@/store/types/filters.types'
import FormButton from '@/components/ui/Button/FormButton'

interface EditGroupForm {
    filters: FILTER_STATE
    spinner: boolean
}

const EditGroupForm = ({ filters, spinner }: EditGroupForm) => {
    return (
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{item.label} Start</label>
                                        <Field
                                            type={item.type}
                                            name={item.start_name}
                                            component={Input}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{item.label} End</label>
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
                            {({ field, form }: FieldProps) => (
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{item.start_placeholder}</label>
                                        <Field
                                            type={item.type}
                                            name={item.start_name}
                                            component={Input}
                                            placeholder={item.start_placeholder}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{item.min_placeholder}</label>
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
                            {({ field, form }: FieldProps) => (
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
                            {({ field, form }: FieldProps) => {
                                const selectedOptions =
                                    field.value?.flatMap((value: any) =>
                                        filters?.filters?.flatMap((filterGroup) =>
                                            filterGroup?.options?.filter((option: any) => option?.value === value),
                                        ),
                                    ) || []
                                return (
                                    <Select
                                        isMulti
                                        placeholder="Select Filter Tags"
                                        options={filters.filters}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        value={selectedOptions}
                                        onChange={(newVal) => {
                                            const newValues = newVal ? newVal.map((val) => val.value) : []
                                            form.setFieldValue(field.name, newValues)
                                        }}
                                        className="w-full"
                                    />
                                )
                            }}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{item.start_placeholder}</label>
                                        <Field
                                            type={item.type}
                                            name={item.start_name}
                                            component={Input}
                                            placeholder={item.start_placeholder}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{item.min_placeholder}</label>
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
                <FormButton isSpinning={spinner} value="Update" />
            </div>
        </FormContainer>
    )
}

export default EditGroupForm
