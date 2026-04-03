/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { Button, Card, Input, Spinner } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { FaCopy, FaSearch, FaFilter, FaSync } from 'react-icons/fa'
import { FilterDataType } from './filterListUtils/filterCommon'
import moment from 'moment'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'

const FilterTable = () => {
    const navigate = useNavigate()
    const [filterId, setFilterId] = useState<string | undefined>('')
    const [data, setData] = useState<FilterDataType | null>(null)
    const [runningTask, setRunningTask] = useState(false)
    const [search, setSearch] = useState('')

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        notification.success({
            message: 'Copied to clipboard',
            description: 'Filter ID has been copied',
            placement: 'bottomRight',
        })
    }

    useEffect(() => {
        setFilterId(search)
    }, [search])

    const handleSubmit = async (values: any) => {
        console.log(values)
    }

    const parsedSearchData = useMemo(() => {
        if (!data?.search_data) return null

        if (typeof data.search_data === 'object') return data.search_data

        try {
            return JSON.parse(data.search_data)
        } catch (e) {
            console.error('Invalid JSON:', data.search_data)
            return null
        }
    }, [data])

    const handleTask = async () => {
        setRunningTask(true)
        try {
            const body = {
                task_name: 'refresh_filter_id_data',
                filter_ids: data?.id?.toString() || '',
            }
            const res = await axioisInstance.post(`/backend/task/process`, body)
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setRunningTask(false)
        }
    }

    return (
        <div className="">
            <div className="flex justify-between items-center">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Filter Management</h1>
                    <p className="text-gray-600">Search and view filter configurations</p>
                </div>
                <div>
                    <Button variant="new" size="sm" onClick={() => navigate(`/app/category/filters/google`)}>
                        Google Filters
                    </Button>
                </div>
            </div>
            <div className="mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Enter Filter ID to search..."
                        className="pl-10 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2">Enter a Filter ID or use the filter selector below to load details</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <FaFilter className="text-blue-600 text-lg" />
                    <h2 className="text-lg font-semibold text-gray-800">Filter Selector</h2>
                </div>
                <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                    {({ values }) => (
                        <Form className="space-y-4">
                            <CommonFilterSelect
                                isSku
                                isCsv
                                noExtra
                                values={values}
                                filterId={filterId}
                                setFilterId={setFilterId}
                                setData={setData}
                            />
                        </Form>
                    )}
                </Formik>
            </div>

            {data && (
                <Card className="p-6 rounded-2xl shadow-md border bg-white space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Filter Details</h2>
                    </div>

                    <div className="grid gap-4 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="uppercase text-gray-500 w-32">Filter ID</span>
                            <span
                                className="flex items-center gap-2 font-medium cursor-pointer hover:text-blue-600"
                                onClick={() => handleCopy(data.id?.toString())}
                            >
                                {data.id}
                                <FaCopy />
                            </span>
                            <button className="flex gap-2 p-1 items-center bg-gray-600 text-white rounded-xl" onClick={handleTask}>
                                {runningTask ? (
                                    <Spinner size={10} color="white" />
                                ) : (
                                    <>
                                        <FaSync /> Refresh
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="uppercase text-gray-500 w-32">Created At</span>
                            <span className="font-medium">{moment(data.created_date).format('YYYY-MM-DD hh:mm:ss A')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="uppercase text-gray-500 w-38">Total Barcodes:</span>
                            <span className="font-medium">{data?.barcodes?.length}</span>
                        </div>
                        <div>
                            <span className="uppercase text-gray-500 block mb-2">Filters Selected</span>

                            {parsedSearchData ? (
                                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-64">
                                    {JSON.stringify(parsedSearchData, null, 2)}
                                </pre>
                            ) : (
                                <span className="text-gray-400 italic">No filter data available</span>
                            )}
                        </div>
                    </div>
                </Card>
            )}
            {!data && (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <FaSearch className="text-blue-600 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Filter Selected</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Enter a Filter ID above or use the filter selector to load filter details and configuration.
                    </p>
                </div>
            )}
        </div>
    )
}

export default FilterTable
