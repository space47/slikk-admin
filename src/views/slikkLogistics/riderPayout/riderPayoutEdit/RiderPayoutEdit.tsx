/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormItem, Input } from '@/components/ui'
import { Formik, Field, FormikProps, Form } from 'formik'
import React, { useEffect, useState } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RenderPayout from '../components/RenderPayout'
import { useParams } from 'react-router-dom'
import { RiderPayout } from '@/store/types/riderPayout.types'
import { riderPayoutService } from '@/store/services/riderPayoutService'
import { notification } from 'antd'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
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

const RiderPayoutEdit = () => {
    const { id } = useParams()
    const [payoutData, setPayoutData] = useState<RiderPayout | null>(null)
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})
    const payoutCall = riderPayoutService.useSinglePayoutListQuery({ id }, { skip: !id })
    const [createPayout, createResponse] = riderPayoutService.useCreatePayoutMutation()

    useEffect(() => {
        if (payoutCall.isSuccess) {
            setPayoutData(payoutCall.data.data.results[0])
        }
    }, [payoutCall.isSuccess, payoutCall.data?.data])

    const convertApiToFormValues = (data: RiderPayout | null): FormValues => {
        if (!data) {
            return {
                name: '',
                description: '',
                commercial_details: {
                    payout_model: 'day-wise',
                    base_payout: 0,
                    currency: 'INR',
                    incentives: {},
                    penalties: {},
                },
            }
        }

        return {
            name: data.name || '',
            description: data.description || '',
            commercial_details: {
                payout_model: data.commercial_details?.payout_model || 'day-wise',
                base_payout: data.commercial_details?.base_payout || 0,
                currency: data.commercial_details?.currency || 'INR',
                incentives: data.commercial_details?.incentives || {},
                penalties: data.commercial_details?.penalties || {},
            },
        }
    }

    const cleanEmptyValues = (obj: any): any => {
        if (!obj) return obj
        if (Array.isArray(obj)) {
            return obj
                .map((item) => cleanEmptyValues(item))
                .filter(
                    (item) =>
                        item !== undefined && item !== null && item !== '' && !(typeof item === 'object' && Object.keys(item).length === 0),
                )
        }
        if (typeof obj === 'object') {
            const cleaned: any = {}
            for (const [key, value] of Object.entries(obj)) {
                if (key && key.trim() !== '' && value !== undefined && value !== null && value !== '') {
                    const cleanedValue = cleanEmptyValues(value)
                    if (
                        cleanedValue !== undefined &&
                        cleanedValue !== null &&
                        (typeof cleanedValue !== 'object' || Object.keys(cleanedValue).length > 0)
                    ) {
                        cleaned[key] = cleanedValue
                    }
                }
            }
            return cleaned
        }
        return obj
    }

    console.log(cleanEmptyValues)

    const extractEditableKeys = (obj: any, prefix = ''): Record<string, string> => {
        const keys: Record<string, string> = {}

        if (!obj || typeof obj !== 'object') return keys

        Object.keys(obj).forEach((key) => {
            const fullPath = prefix ? `${prefix}.${key}` : key
            keys[key] = key

            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(keys, extractEditableKeys(obj[key], fullPath))
            }
        })

        return keys
    }

    const initialValues = convertApiToFormValues(payoutData)

    useEffect(() => {
        if (payoutData?.commercial_details) {
            const incentivesKeys = extractEditableKeys(payoutData.commercial_details.incentives || {})
            const penaltiesKeys = extractEditableKeys(payoutData.commercial_details.penalties || {})
            setEditableKeys({ ...incentivesKeys, ...penaltiesKeys })
        }
    }, [payoutData])

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
            <ToastContainer />

            <div className=" px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                                Configuration
                            </p>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Rider Payout Model</h1>
                        </div>
                    </div>
                </div>

                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }: FormikProps<FormValues>) => (
                        <Form className="space-y-6">
                            {/* Basic Info Section */}
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

                            {/* Commercial Details */}
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

                            {/* Incentives Section */}
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

export default RiderPayoutEdit
