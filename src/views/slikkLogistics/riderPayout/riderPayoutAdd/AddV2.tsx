/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input } from '@/components/ui'
import { Formik, Field, FormikProps, Form } from 'formik'
import React, { useState } from 'react'
import { HiOutlineInformationCircle, HiOutlineSave, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RenderPayout from '../components/RenderPayout'

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYOUT_MODELS = [
    { value: 'day-wise', label: 'Day Wise', description: 'Payout calculated per day' },
    { value: 'month-wise', label: 'Month Wise', description: 'Payout calculated per order' },
]

const CURRENCIES = [
    { value: 'INR', label: 'INR (₹)', symbol: '₹', country: 'India' },
    { value: 'USD', label: 'USD ($)', symbol: '$', country: 'United States' },
]

const initialValues: FormValues = {
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

// ─── Helper Functions ─────────────────────────────────────────────────────────

const removeEmptyKeys = (obj: any): any => {
    if (!obj) return obj
    if (Array.isArray(obj)) {
        return obj.map((item) => removeEmptyKeys(item)).filter((item) => item !== undefined && item !== null && item !== '')
    }
    if (typeof obj === 'object') {
        const cleaned: any = {}
        for (const [key, value] of Object.entries(obj)) {
            if (key && key.trim() !== '' && value !== undefined && value !== null && value !== '') {
                const cleanedValue = removeEmptyKeys(value)
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

// ─── Main Component ───────────────────────────────────────────────────────────

const AddV2: React.FC = () => {
    const [preview, setPreview] = useState<string | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (values: FormValues) => {
        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Clean up the values before submitting
        const cleanedValues = {
            ...values,
            commercial_details: {
                ...values.commercial_details,
                incentives: removeEmptyKeys(values.commercial_details.incentives),
                penalties: removeEmptyKeys(values.commercial_details.penalties),
            },
        }

        console.log('Submitting:', cleanedValues)
        setPreview(JSON.stringify(cleanedValues, null, 2))
        setShowPreview(true)

        toast.success('Payout model prepared successfully! Check the preview below.', {
            position: 'top-right',
            autoClose: 3000,
        })

        setIsSubmitting(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <ToastContainer />

            <div className=" px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
                                Configuration
                            </p>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Rider Payout Model</h1>
                            {/* <p className="text-sm text-gray-500 max-w-2xl">
                                Build completely dynamic payout structures with nested objects, arrays, and complex conditions. Create
                                incentives and penalties with unlimited depth and complexity.
                            </p> */}
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
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const cleanedValues = {
                                                    ...values,
                                                    commercial_details: {
                                                        ...values.commercial_details,
                                                        incentives: removeEmptyKeys(values.commercial_details.incentives),
                                                        penalties: removeEmptyKeys(values.commercial_details.penalties),
                                                    },
                                                }
                                                setPreview(JSON.stringify(cleanedValues, null, 2))
                                                setShowPreview(!showPreview)
                                            }}
                                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                                        >
                                            {showPreview ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <HiOutlineSave className="w-4 h-4" />
                                                    Save Payout Model
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>

                {/* JSON Preview */}
                {showPreview && preview && (
                    <div className="mt-6 mb-10 bg-gray-900 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-gray-300">Live Preview</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-mono">JSON Output</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(preview)
                                        toast.success('Copied to clipboard!', {
                                            position: 'top-right',
                                            autoClose: 2000,
                                        })
                                    }}
                                    className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-auto max-h-[600px]">
                            <pre className="text-sm text-green-400 font-mono leading-relaxed">{preview}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddV2
