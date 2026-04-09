// PayoutFormFields.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React from 'react'
import { CURRENCIES, PAYOUT_MODELS } from './riderPayoutCommon'

interface Props {
    values: any
    setFieldValue: any
}

const PayoutFormFields = ({ values, setFieldValue }: Props) => {
    return (
        <>
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-indigo-600">📋</span>
                        Basic Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">General details about the payout model</p>
                </div>
                <div className="p-6 space-y-5">
                    <FormItem
                        asterisk
                        label={
                            <span className="flex items-center gap-1">
                                Name <span className="text-xs text-gray-400 font-normal">(required)</span>
                            </span>
                        }
                    >
                        <Field
                            type="text"
                            name="name"
                            component={Input}
                            placeholder="e.g., Premium Payout Model - April 2026"
                            className="w-full focus:ring-2 focus:ring-indigo-300 transition-all"
                        />
                    </FormItem>
                    <FormItem
                        label={
                            <span className="flex items-center gap-1">
                                Description <span className="text-xs text-gray-400 font-normal">(optional)</span>
                            </span>
                        }
                    >
                        <Field
                            type="text"
                            name="description"
                            component={Input}
                            placeholder="Brief description of this payout model"
                            className="w-full focus:ring-2 focus:ring-indigo-300 transition-all"
                        />
                    </FormItem>
                </div>
            </div>

            {/* Commercial Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Commercial Details</h2>
                    <p className="text-sm text-gray-500 mt-1">Payout structure and financial parameters</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormItem asterisk label="Payout Model">
                            <select
                                value={values.commercial_details.payout_model}
                                onChange={(e) => setFieldValue('commercial_details.payout_model', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
                            >
                                {PAYOUT_MODELS.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label} - {m.description}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                {PAYOUT_MODELS.find((m) => m.value === values.commercial_details.payout_model)?.description}
                            </p>
                        </FormItem>

                        <FormItem asterisk label="Base Payout">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {CURRENCIES.find((c) => c.value === values.commercial_details.currency)?.symbol}
                                </span>
                                <input
                                    type="number"
                                    value={values.commercial_details.base_payout}
                                    onChange={(e) => setFieldValue('commercial_details.base_payout', Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        </FormItem>

                        <FormItem asterisk label="Currency">
                            <select
                                value={values.commercial_details.currency}
                                onChange={(e) => setFieldValue('commercial_details.currency', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
                            >
                                {CURRENCIES.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label} - {c.country}
                                    </option>
                                ))}
                            </select>
                        </FormItem>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PayoutFormFields
