/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { Card } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { FaCopy, FaDownload } from 'react-icons/fa'
import { FilterDataType } from './filterListUtils/filterCommon'
import moment from 'moment'
import { notification } from 'antd'

const FilterTable = () => {
    const [filterId, setFilterId] = useState<string | undefined>('')
    const [data, setData] = useState<FilterDataType | null>(null)

    console.log('FILTER ID', data)

    const convertToCSV = (objArray: string[]) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
        let str = ''
        for (let i = 0; i < array.length; i++) {
            str = str + array[i] + '\r\n'
        }
        return str
    }

    const handleDownloadCsv = (data: string[]) => {
        const csvData = convertToCSV(data)
        const blob = new Blob([csvData], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `filter_${filterId}_barcodes.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const handleCopy = (file: string) => {
        navigator.clipboard.writeText(file)
        notification.success({ message: 'Copied' })
    }

    const handleSubmit = async (values: any) => {
        console.log(values)
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                            <CommonFilterSelect
                                isSku
                                isCsv
                                noExtra
                                values={values}
                                filterId={filterId}
                                setFilterId={setFilterId}
                                setData={setData}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
            <div>
                {data && (
                    <Card className="p-5 shadow-md rounded-2xl border border-gray-200 bg-white space-y-4 mt-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-lg font-semibold text-gray-800">Filter Details</h2>

                            <button
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                onClick={() => handleDownloadCsv(data?.barcodes)}
                            >
                                <FaDownload className="text-base" />
                                Download CSV of Barcode
                            </button>
                        </div>

                        {/* Body */}
                        <div className="grid gap-3 text-sm text-gray-700">
                            <div className="flex flex-row gap-4">
                                <span className=" uppercase text-gray-500">Filter ID:</span>
                                <span className="font-medium flex gap-2 items-center cursor-pointer">
                                    {data?.id}
                                    {''}
                                    <FaCopy onClick={() => handleCopy(data?.id?.toString())} />
                                </span>
                            </div>

                            <div className="flex flex-row gap-4">
                                <span className=" uppercase text-gray-500">Filters Selected:</span>
                                <div className="">{JSON.parse(data?.search_data)}</div>
                            </div>
                            <div className="flex flex-row gap-4">
                                <span className=" uppercase text-gray-500">Create Date:</span>
                                <div className="">{moment(data?.created_date).format('YYYY-MM-DD HH:mm:ss a')}</div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default FilterTable
