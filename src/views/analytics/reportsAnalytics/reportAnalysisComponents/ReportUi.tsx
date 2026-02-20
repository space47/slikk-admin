import { Button, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'
import { FaChartBar, FaExclamationTriangle, FaMagic, FaSearch, FaTable, FaTimes } from 'react-icons/fa'
import { HiSelector } from 'react-icons/hi'

interface Props {
    isCustomQuery: boolean
    reportQueryNames: {
        label: string
        value: string
    }[]
    setStoreName: (x: string) => void
    setShowTable: (x: boolean) => void
    storeName: string
    setIsCustomQuery: Dispatch<SetStateAction<boolean>>
    errorQuery: string
}

export const ReportUi = ({
    isCustomQuery,
    reportQueryNames,
    setShowTable,
    setStoreName,
    setIsCustomQuery,
    storeName,
    errorQuery,
}: Props) => {
    const ReportTypeAndName = () => {
        return (
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                    {!isCustomQuery ? (
                        <div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <HiSelector className="text-indigo-500 text-xl" />
                                    <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Select Report Name</label>
                                </div>
                                <Field name="target_page">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            isClearable
                                            placeholder={
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <FaSearch className="text-sm" />
                                                    <span>Search or select a page...</span>
                                                </div>
                                            }
                                            options={reportQueryNames}
                                            value={reportQueryNames?.find((option) => option.value === field.value)}
                                            onChange={(option) => {
                                                form.setFieldValue(field.name, option?.value)
                                                setStoreName(option?.value as string)
                                                setShowTable(false)
                                            }}
                                            className="w-full"
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <FaMagic className="text-indigo-600 dark:text-indigo-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Custom Query Editor</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    Write your own SQL query for advanced reporting
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <Button
                        type="button"
                        variant={isCustomQuery ? 'reject' : 'accept'}
                        disabled={!!storeName && !isCustomQuery}
                        onClick={() => setIsCustomQuery((Prev) => !Prev)}
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                        {isCustomQuery ? (
                            <>
                                <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
                                Close Custom Query
                            </>
                        ) : (
                            <>
                                <FaMagic className="group-hover:rotate-12 transition-transform duration-300" />
                                Add Custom Query
                            </>
                        )}
                    </Button>
                </div>
            </div>
        )
    }
    const ChartUi = () => {
        return (
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                        <FaChartBar className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-wrap break-words overflow-auto">
                        <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                            Selected: <span className="font-bold">{storeName}</span>
                        </p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Configure report parameters below</p>
                    </div>
                </div>
            </div>
        )
    }

    const GenerateUI = () => {
        return (
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
                        <FaExclamationTriangle className="text-amber-600 dark:text-amber-400 text-xl" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-lg">Ready to Generate Reports</h4>
                        <p className="text-amber-700 dark:text-amber-400 mt-2">
                            Select a target page from the dropdown above or enable custom query mode to start generating reports.
                        </p>
                        <p className="text-sm text-amber-600 dark:text-amber-500 mt-2">
                            You can customize date ranges, filters, and visualization options.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const ErrorUi = () => {
        return (
            <div className="mt-6 mx-auto ">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-500 rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 dark:bg-red-800/30 rounded-lg">
                            <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-700 dark:text-red-300 text-lg">Error Generating Report</h3>
                            <p className="text-red-600 dark:text-red-400 mt-1">{errorQuery}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const SpinnerUi = () => {
        return (
            <div className="mt-10 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">Generating your report...</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait a moment</p>
                </div>
            </div>
        )
    }
    const TableUI = () => {
        return (
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <FaTable className="text-indigo-600 dark:text-indigo-400 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Report Results</h2>
                            <p className="text-gray-600 dark:text-gray-400">Analyze and visualize your data</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return { ReportTypeAndName, ChartUi, GenerateUI, ErrorUi, SpinnerUi, TableUI }
}
