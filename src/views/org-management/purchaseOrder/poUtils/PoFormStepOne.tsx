/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Select, Switcher } from '@/components/ui'
import React from 'react'
import { IndianStateCodes, PoField, PoFormFieldArray, PoNatureOption } from './poFormCommon'
import { Field, FieldProps } from 'formik'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import WarehouseSelect from '@/common/WarehouseSelect'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import { BUSINESS_NATURE, WAREHOUSE_DETAILS } from '@/store/types/company.types'
import { Building2, MapPin, Calendar, Tag, Truck, AlertCircle, HelpCircle } from 'lucide-react'

interface Props {
    VendorEntity: {
        label: string
        value: string
    }[]
    businessNatureCompany: BUSINESS_NATURE[]
    wareHouseDetails: WAREHOUSE_DETAILS | undefined
    values: any
}

const PoFormStepOne = ({ VendorEntity, businessNatureCompany, wareHouseDetails, values }: Props) => {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-5 pb-2 border-b border-gray-100">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">Warehouse Selection</h3>
                    <div className="ml-auto text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            Select vendor warehouse
                        </span>
                    </div>
                </div>
                <WarehouseSelect isSingle label="Select Vendor Warehouse" name={PoField.COMPANY_GST} customCss="w-full" />
            </div>
            {values[PoField.COMPANY_GST] && wareHouseDetails && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 border-b border-blue-100">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <h3 className="text-sm font-semibold text-gray-700">Warehouse Details</h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">GSTIN</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-mono font-medium text-gray-800">{wareHouseDetails?.gstin || '—'}</p>
                                    {wareHouseDetails?.gstin && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">State</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {IndianStateCodes?.find((item) => item?.value === wareHouseDetails?.gstin?.slice(0, 2))?.label || '-'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Warehouse Name</p>
                                <p className="text-sm font-medium text-gray-800">{wareHouseDetails?.warehouse_name || '—'}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Address</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{wareHouseDetails?.warehouse_address || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 rounded-lg">
                            <Tag className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h2 className="text-base font-semibold text-gray-800">Purchase Order Information</h2>
                    </div>
                </div>

                <div className="p-6">
                    <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <FormItem
                            label={
                                <span className="text-sm font-medium text-gray-700">
                                    Vendor Billing Entity <span className="text-red-500">*</span>
                                </span>
                            }
                            className="col-span-1"
                        >
                            <Field name={PoField.ORDER_BILLING_ENTITY}>
                                {({ field, form }: FieldProps) => {
                                    const selectedValue = VendorEntity?.find((opt) => opt.value?.trim() === field.value?.trim()) || null

                                    return (
                                        <Select
                                            isClearable
                                            isSearchable
                                            placeholder="Select vendor billing entity..."
                                            options={VendorEntity}
                                            value={selectedValue}
                                            className="rounded-lg"
                                            onChange={(option) => {
                                                const value = option ? option.value : ''
                                                form.setFieldValue(PoField.ORDER_BILLING_ENTITY, value)
                                                const selectedCompanyData = businessNatureCompany.find((item) => item.code === value)
                                                if (selectedCompanyData) {
                                                    form.setFieldValue(
                                                        PoField.ORDER_BILLING_ADDRESS,
                                                        selectedCompanyData.bill_to?.trim() || '',
                                                    )
                                                    form.setFieldValue(
                                                        PoField.ORDER_SHIPPING_ADDRESS,
                                                        selectedCompanyData.ship_to?.trim() || '',
                                                    )
                                                } else {
                                                    form.setFieldValue(PoField.ORDER_BILLING_ADDRESS, '')
                                                    form.setFieldValue(PoField.ORDER_SHIPPING_ADDRESS, '')
                                                }
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                        {PoFormFieldArray?.map((item, idx) => (
                            <FormItem key={idx} label={<span className="text-sm font-medium text-gray-700">{item?.label}</span>}>
                                <Field
                                    type={item?.type}
                                    name={item?.name}
                                    placeholder={`Enter ${item?.label?.toLowerCase()}`}
                                    component={item?.type === 'checkbox' ? Switcher : Input}
                                    className="rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                />
                            </FormItem>
                        ))}
                        <FormItem label={<span className="text-sm font-medium text-gray-700">PO Nature</span>}>
                            <CommonSelect label="" name={PoField.PO_NATURE} options={PoNatureOption()} className="rounded-lg" />
                        </FormItem>
                        <FormItem label={<span className="text-sm font-medium text-gray-700">Expected Delivery Date</span>}>
                            <Field name={PoField.EXPECTED_DELIVERY}>
                                {({ field, form }: FieldProps) => {
                                    const dateValue = field.value ? dayjs(field.value) : null

                                    return (
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                                            <DatePicker
                                                placeholder="Select expected delivery date"
                                                className="w-full rounded-lg pl-9"
                                                value={dateValue && dateValue.isValid() ? dateValue : null}
                                                onChange={(value) => {
                                                    form.setFieldValue(PoField.EXPECTED_DELIVERY, value ? value.format('YYYY-MM-DD') : '')
                                                }}
                                                format="DD/MM/YYYY"
                                            />
                                        </div>
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <FormItem label={<span className="text-sm font-medium text-gray-700">Expiry Date</span>}>
                            <Field name={PoField.PO_EXPIRY_DATE}>
                                {({ field, form }: FieldProps) => {
                                    const dateValue = field.value ? dayjs(field.value) : null

                                    return (
                                        <div className="relative">
                                            <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                                            <DatePicker
                                                placeholder="Select expiry date"
                                                className="w-full rounded-lg pl-9"
                                                disabledDate={(current) => current && current.isAfter(dayjs().add(30, 'day').endOf('day'))}
                                                value={dateValue && dateValue.isValid() ? dateValue : null}
                                                onChange={(value) => {
                                                    form.setFieldValue(PoField.PO_EXPIRY_DATE, value ? value.format('YYYY-MM-DD') : '')
                                                }}
                                                format="DD/MM/YYYY"
                                            />
                                        </div>
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <div className="col-span-1 md:col-span-2 mt-2">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <Field type="checkbox" name="with_gst" component={Switcher} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Purchase Price With GST</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {values.with_gst ? 'Prices already include GST' : 'GST will be added to prices'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <Field type="checkbox" name="with_sp" component={Switcher} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Calculation on Price Tag</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {values.with_sp ? 'Calculations will use Selling Price' : 'Calculations will use MRP'}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                                            values.with_sp
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}
                                    >
                                        {values.with_sp ? 'Using SP (Selling Price)' : 'Using MRP (Maximum Retail Price)'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormContainer>
                </div>
            </div>
        </div>
    )
}

export default PoFormStepOne
