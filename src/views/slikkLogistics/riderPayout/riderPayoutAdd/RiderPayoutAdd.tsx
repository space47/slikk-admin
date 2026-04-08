/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormItem, Input } from '@/components/ui'
import { Formik, Field, FormikProps, Form } from 'formik'
import React, { useEffect, useState } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import RenderPayout from '../components/RenderPayout'
import { notification } from 'antd'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { riderPayoutService } from '@/store/services/riderPayoutService'
import { CURRENCIES, PAYOUT_MODELS, removeEmptyKeys } from '../utils/riderPayoutCommon'

interface FormValues {
    name: string
    description: string
    commercial_details: {
        payout_model: string
        base_payout: number
        currency: string
        incentives: any
        penalties: any
    }
}

const initialValues: FormValues = {
    name: '',
    description: '',
    commercial_details: {
        payout_model: 'day-wise',
        base_payout: 0,
        currency: 'INR',
        incentives: {
            order_count_incentive: {
                thresholds: [
                    { min_orders: 0, max_orders: 7, incentive_amount: 0, type: 'flat' },
                    { min_orders: 8, max_orders: 9, incentive_amount: 50, type: 'flat' },
                    { min_orders: 10, max_orders: 11, incentive_amount: 75, type: 'flat' },
                    { min_orders: 12, max_orders: 13, incentive_amount: 100, type: 'flat' },
                    { min_orders: 14, max_orders: 15, incentive_amount: 125, type: 'flat' },
                    { min_orders: 16, max_orders: 100, incentive_amount: 150, type: 'flat' },
                ],
            },
            time_incentive: {
                thresholds: [
                    { min_hours: 0, max_hours: 11, incentive_amount: 0, type: 'flat' },
                    { min_hours: 12, max_hours: 15, incentive_amount: 90, type: 'hour-wise' },
                ],
            },
            days_worked_in_month_incentive: {
                thresholds: [
                    { min_days: 0, max_days: 26, incentive_amount: 0, type: 'flat' },
                    { min_days: 27, max_days: 31, incentive_amount: 1000, type: 'day-wise' },
                ],
            },
            on_time_delivery_incentive: {
                thresholds: [{ min_orders: 1, max_orders: 100, incentive_amount: 10, type: 'order-wise' }],
            },
            days_worked_in_week_incentive: {
                minimum_days: 6,
                mandatory_days: [3, 4, 5, 6],
                incentive_amount: 100,
            },
            distance_incentive: {
                thresholds: [{ min_distance: 0, max_distance: 15, incentive_amount: 0, type: 'flat' }],
            },
        },
        penalties: {
            time_penalty: {
                thresholds: [{ min_hours: 0, max_hours: 10, penalty_amount: 90, type: 'hour-wise' }],
            },
            weekend_penalty: {
                thresholds: [{ is_weekend: true, penalty_amount: 150, type: 'daily', penalty_amount_type: 'percentage' }],
            },
            order_rejection_penalty: {
                thresholds: [{ min_rejections: 0, max_rejections: 100, penalty_amount: 25, type: 'order-wise' }],
            },
            late_checkin_penalty: {
                thresholds: [
                    { min_minutes: 0, max_minutes: 15, penalty_amount: 0, type: 'flat' },
                    { min_minutes: 15, max_minutes: 600, penalty_amount: 25, type: 'flat' },
                ],
            },
        },
    },
}

const RiderPayoutAdd = () => {
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})
    const [createPayout, createResponse] = riderPayoutService.useCreatePayoutMutation()

    useEffect(() => {
        if (createResponse.isSuccess) {
            notification.success({ message: 'successfully created rider payout' })
        }
        if (createResponse.isError) {
            const errorMessage = getApiErrorMessage(createResponse.error)
            notification.error({ message: errorMessage })
        }
    }, [createResponse.isSuccess, createResponse.isError, createResponse.error])

    const handleSubmit = async (values: FormValues) => {
        const cleanedValues = {
            ...values,
            commercial_details: {
                ...values.commercial_details,
                incentives: removeEmptyKeys(values.commercial_details.incentives),
                penalties: removeEmptyKeys(values.commercial_details.penalties),
            },
        }

        createPayout(cleanedValues as any)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className=" px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                                Configuration
                            </p>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Rider Payout Model</h1>
                        </div>
                    </div>
                </div>

                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }: FormikProps<FormValues>) => (
                        <Form className="space-y-6">
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
                                                Name
                                                <span className="text-xs text-gray-400 font-normal">(required)</span>
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
                                                Description
                                                <span className="text-xs text-gray-400 font-normal">(optional)</span>
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
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">Commercial Details</h2>
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
                                                    onChange={(e) =>
                                                        setFieldValue('commercial_details.base_payout', Number(e.target.value))
                                                    }
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
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-indigo-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">Incentives</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <RenderPayout
                                        obj={values.commercial_details.incentives}
                                        parentKey="commercial_details.incentives"
                                        setFieldValue={setFieldValue}
                                        editableKeys={editableKeys}
                                        setEditableKeys={setEditableKeys}
                                    />
                                </div>
                            </div>

                            {/* Penalties Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="bg-gradient-to-r from-rose-50 to-white px-6 py-4 border-b border-rose-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">Penalties</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <RenderPayout
                                        obj={values.commercial_details.penalties}
                                        parentKey="commercial_details.penalties"
                                        setFieldValue={setFieldValue}
                                        editableKeys={editableKeys}
                                        setEditableKeys={setEditableKeys}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 mt-8 transition-all">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                                        <HiOutlineInformationCircle className="w-4 h-4" />
                                        <span>All changes are auto-saved in the form</span>
                                    </div>

                                    <div className="flex items-center gap-3 ml-auto">
                                        <Button
                                            variant="blue"
                                            size="sm"
                                            loading={createResponse.isLoading}
                                            disabled={createResponse.isLoading}
                                        >
                                            Save Payout Model
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default RiderPayoutAdd
