import EasyTable from '@/common/EasyTable'
import { textParser } from '@/common/textParser'
import { RichTextEditor } from '@/components/shared'
import { FormItem, Pagination, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { notification } from 'antd'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { pageSizeOptions } from '../overview/analyticsCommon'

const ReportCustomQuery = () => {
    const [value, setValue] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [customReportData, setCustomReportData] = useState<any[]>([])

    const handleGenerateCustomQuery = async () => {
        notification.info({ message: 'Generating Custom Query' })

        const parsedValue = textParser(value)
        console.log(parsedValue)
        const body = {
            query_string: parsedValue,
        }
        try {
            const res = await axioisInstance.post(`/query/execute/custom_report`, body)
            const data = res?.data?.data
            setCustomReportData(data)
            notification.success({ message: 'Custom Query Generated Successfully' })
        } catch (error) {
            console.log(error)
            notification.error({ message: 'Failed to generate custom query' })
        }
    }

    const columns = useMemo(() => {
        if (!customReportData || customReportData.length === 0) return []

        return Object.keys(customReportData[0]).map((key) => ({
            header: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            accessorKey: key,
            cell: ({ getValue }: any) => {
                const value = getValue()

                if (value === null || value === undefined) return <span>-</span>
                if (key.toLowerCase().includes('date')) {
                    return (
                        <span>
                            {moment(Number(value)).isValid() ? moment(Number(value)).utcOffset(330).format('YYYY-MM-DD hh:mm:ss a') : value}
                        </span>
                    )
                }

                if (key.toLowerCase().includes('image') && typeof value === 'string') {
                    return <img src={value?.split(',')[0] || value} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                }

                if (typeof value === 'object') {
                    return <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                }
                return <span>{value}</span>
            },
        }))
    }, [customReportData])

    const paginatedData = customReportData ? customReportData?.slice((page - 1) * pageSize, page * pageSize) : []
    const totalPages = Math.ceil(customReportData.length / pageSize)

    return (
        <div>
            <FormItem label="Custom Query" labelClass="!justify-start" className="col-span-1 w-full">
                <RichTextEditor value={value} onChange={(e) => setValue(e)} />
            </FormItem>
            <div>
                <button
                    type="button"
                    className="text-white p-2 rounded-xl font-bold disabled:cursor-not-allowed disabled:opacity-50 bg-blue-500 hover:bg-blue-600"
                    disabled={!value || value === '<p><br></p>'}
                    onClick={handleGenerateCustomQuery}
                >
                    Generate
                </button>
            </div>
            {customReportData.length > 0 && (
                <>
                    <div className="mt-10 mb-8 font-bold text-xl">Custom Query Table</div>
                    <EasyTable mainData={paginatedData} columns={columns} overflow />

                    <div className="flex items-center justify-between mt-4">
                        <Pagination currentPage={page} total={totalPages} onChange={(page) => setPage(page)} />
                        <div style={{ minWidth: 130 }}>
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => setPageSize(Number(option?.value))}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ReportCustomQuery
