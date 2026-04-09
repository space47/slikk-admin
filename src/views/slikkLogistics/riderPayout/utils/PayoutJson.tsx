// PayoutJson.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import { Form } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PayoutFormFields from './PayoutFormFields'

interface AccentClass {
    header: string
    border: string
    badge: string
    ring: string
}

interface JsonEditorProps {
    label: string
    value: string
    field: 'incentives' | 'penalties'
    setter: (v: string) => void
    accentClass: AccentClass
    jsonError: string
    onChange: (raw: string, field: 'incentives' | 'penalties', setter: (v: string) => void) => void
}

// ✅ Defined outside — stable component reference, no remount on parent re-render
const JsonEditor = ({ label, value, field, setter, accentClass, jsonError, onChange }: JsonEditorProps) => {
    const hasError = jsonError.toLowerCase().includes(field)
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div
                className={`bg-gradient-to-r ${accentClass.header} px-6 py-4 border-b ${accentClass.border} flex items-center justify-between`}
            >
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Edit configuration as JSON</p>
                </div>
                <span className={`text-xs ${accentClass.badge} px-2 py-1 rounded-full font-medium`}>JSON</span>
            </div>
            <div className="p-4">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value, field, setter)}
                    rows={20}
                    spellCheck={false}
                    className={`w-full rounded-lg border font-mono text-sm p-3 focus:outline-none focus:ring-2 transition-all resize-y
                        ${hasError ? 'border-red-400 focus:ring-red-300 bg-red-50' : `border-gray-300 ${accentClass.ring} bg-gray-50`}`}
                />
                {hasError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span>⚠</span> {jsonError}
                    </p>
                )}
            </div>
        </div>
    )
}

interface Props {
    values: any
    setFieldValue: any
    jsonError: string
    setJsonError: (v: string) => void
    isLoading: boolean
}

const PayoutJson = ({ values, setFieldValue, jsonError, setJsonError, isLoading }: Props) => {
    const navigate = useNavigate()
    const [incentivesJson, setIncentivesJson] = useState(JSON.stringify(values.commercial_details.incentives, null, 2))
    const [penaltiesJson, setPenaltiesJson] = useState(JSON.stringify(values.commercial_details.penalties, null, 2))

    useEffect(() => {
        setIncentivesJson(JSON.stringify(values.commercial_details.incentives, null, 2))
        setPenaltiesJson(JSON.stringify(values.commercial_details.penalties, null, 2))
    }, [])

    const handleJsonChange = (raw: string, field: 'incentives' | 'penalties', setter: (v: string) => void) => {
        setter(raw)
        try {
            setFieldValue(`commercial_details.${field}`, JSON.parse(raw))
            setJsonError('')
        } catch {
            setJsonError(`${field.charAt(0).toUpperCase() + field.slice(1)} JSON is invalid`)
        }
    }

    return (
        <Form className="w-full space-y-4">
            <PayoutFormFields values={values} setFieldValue={setFieldValue} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <JsonEditor
                    label="Incentives"
                    value={incentivesJson}
                    field="incentives"
                    setter={setIncentivesJson}
                    jsonError={jsonError}
                    onChange={handleJsonChange}
                    accentClass={{
                        header: 'from-indigo-50 to-white',
                        border: 'border-indigo-100',
                        badge: 'bg-indigo-100 text-indigo-600',
                        ring: 'focus:ring-indigo-400',
                    }}
                />
                <JsonEditor
                    label="Penalties"
                    value={penaltiesJson}
                    field="penalties"
                    setter={setPenaltiesJson}
                    jsonError={jsonError}
                    onChange={handleJsonChange}
                    accentClass={{
                        header: 'from-rose-50 to-white',
                        border: 'border-rose-100',
                        badge: 'bg-rose-100 text-rose-600',
                        ring: 'focus:ring-rose-400',
                    }}
                />
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 mt-8">
                <div className="flex items-center justify-between gap-4">
                    <p className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                        <span>ℹ</span> All changes are auto-saved in the form
                    </p>
                    <div className="flex items-center gap-3 ml-auto">
                        <Button type="button" variant="plain" onClick={() => navigate('/app/configurations')}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="solid" loading={isLoading} disabled={!!jsonError || isLoading}>
                            Save Payout Model
                        </Button>
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default PayoutJson
