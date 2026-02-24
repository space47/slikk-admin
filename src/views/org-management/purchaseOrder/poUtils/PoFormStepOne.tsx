import { Card, FormContainer, FormItem, Input, Select, Switcher } from '@/components/ui'
import React from 'react'
import { IndianStateCodes, PoField, PoFormFieldArray, PoNatureOption } from './poFormCommon'
import { Field, FieldProps } from 'formik'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import WarehouseSelect from '@/common/WarehouseSelect'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import { BUSINESS_NATURE, WAREHOUSE_DETAILS } from '@/store/types/company.types'

interface Props {
    VendorEntity: {
        label: string
        value: string
    }[]
    businessNatureCompany: BUSINESS_NATURE[]
    wareHouseDetails: WAREHOUSE_DETAILS | undefined
}

const PoFormStepOne = ({ VendorEntity, businessNatureCompany, wareHouseDetails }: Props) => {
    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <WarehouseSelect isSingle label="Select Vendor Warehouse" name={PoField.COMPANY_GST} customCss="xl:w-[800px] w-auto" />
            </div>
            <Card>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Warehouse Details</h3>

                <div className="grid grid-cols-3 gap-y-4 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs mb-1">GSTIN</p>
                        <p className="font-medium text-gray-800">{wareHouseDetails?.gstin || '—'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs mb-1">STATE</p>
                        <p className="font-medium text-gray-800">
                            {IndianStateCodes?.find((item) => item?.value === wareHouseDetails?.gstin?.slice(0, 2))?.label || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-xs mb-1">Name</p>
                        <p className="font-medium text-gray-800">{wareHouseDetails?.warehouse_name || '—'}</p>
                    </div>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-400 text-xs mb-1">Address</p>
                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {wareHouseDetails?.warehouse_address || '—'}
                    </p>
                </div>
            </Card>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-semibold text-gray-800 mb-6">Purchase Order Information</h2>
                <FormContainer className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <FormItem label="Vendor Billing Entity">
                        <Field name={PoField.ORDER_BILLING_ENTITY}>
                            {({ field, form }: FieldProps) => {
                                const selectedValue = VendorEntity?.find((opt) => opt.value === field.value) || null

                                return (
                                    <Select
                                        isClearable
                                        isSearchable
                                        options={VendorEntity}
                                        value={selectedValue}
                                        onChange={(option) => {
                                            const value = option ? option.value : ''
                                            form.setFieldValue(PoField.ORDER_BILLING_ENTITY, value)
                                            const selectedCompanyData = businessNatureCompany.find((item) => item.code === value)
                                            if (selectedCompanyData) {
                                                form.setFieldValue(PoField.ORDER_BILLING_ADDRESS, selectedCompanyData.bill_to?.trim() || '')
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
                    {PoFormFieldArray?.map((item, idx) => {
                        return (
                            <FormItem key={idx} label={item?.label}>
                                <Field
                                    type={item?.type}
                                    name={item?.name}
                                    placeholder={`Enter ${item?.label}`}
                                    component={item?.type === 'checkbox' ? Switcher : Input}
                                />
                            </FormItem>
                        )
                    })}
                    <FormItem label="Expected Delivery Date">
                        <Field name={PoField.EXPECTED_DELIVERY}>
                            {({ field, form }: FieldProps) => {
                                const dateValue = field.value ? dayjs(field.value) : null

                                return (
                                    <DatePicker
                                        placeholder="Select date"
                                        className="w-full rounded-lg"
                                        value={dateValue && dateValue.isValid() ? dateValue : null}
                                        onChange={(value) => {
                                            form.setFieldValue('expected_delivery_date', value ? value.format('YYYY-MM-DD') : '')
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                    <CommonSelect label="Po Nature" name={PoField.PO_NATURE} options={PoNatureOption()} />
                </FormContainer>
            </div>
        </div>
    )
}

export default PoFormStepOne
