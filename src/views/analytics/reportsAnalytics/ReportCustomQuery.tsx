/* eslint-disable @typescript-eslint/no-explicit-any */
// Types for API responses

import EasyTable from '@/common/EasyTable'
import { textParser } from '@/common/textParser'
import { RichTextEditor } from '@/components/shared'
import { Card, FormItem, Input, Button, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { customQueryService } from '@/store/services/customQueryService'
import { escapeCsvValue, handleDownloadCsv } from '@/common/allTypesCommon'
import { FaDownload, FaLocationArrow } from 'react-icons/fa'
import PageCommon from '@/common/PageCommon'

interface TableItem {
    table_name: string
    name?: string
    [key: string]: any
}

interface TableDataObject {
    data?: TableItem[]
    [key: string]: any
}

const ReportCustomQuery = () => {
    const [value, setValue] = useState('')
    const [generatingQuery, setGeneratingQuery] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [customReportData, setCustomReportData] = useState<any[]>([])
    const [errorData, setErrorData] = useState<string>('')
    const [tablesData, setTablesData] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const [selectedTable, setSelectedTable] = useState<string | null>(null)
    const [columnNames, setColumnNames] = useState<string[]>([])
    const [downloadingQuery, setDownloadingQuery] = useState(false)

    useEffect(() => {
        setColumnNames([])
    }, [selectedTable])

    console.log('customReportData', errorData)

    const { data: queryData, isLoading, isError, isSuccess } = customQueryService.useExecuteQueryQuery({})
    const {
        data: columnData,
        isLoading: columnLoading,
        isSuccess: columnSuccess,
    } = customQueryService.useExecuteQueryQuery({ query_name: selectedTable || '' })

    const data = queryData?.data
    const columnDataList = columnData?.data

    useEffect(() => {
        if (isSuccess) {
            let tables: string[] = []
            if (Array.isArray(data)) {
                tables = data.map((item: TableItem) => item.table_name)
            } else if (data && typeof data === 'object') {
                const first = Object.values(data)[0]
                console.log('first', first)
                if (first && Array.isArray((first as TableDataObject).data)) {
                    tables = ((first as TableDataObject).data as TableItem[]).map((item) => item.table_name)
                } else if (Array.isArray(first)) {
                    tables = (first as TableItem[]).map((item) => item.table_name)
                }
            }
            setTablesData(Array.isArray(tables) ? tables.filter(Boolean) : [])
        }
    }, [isSuccess, data, selectedTable])

    useEffect(() => {
        if (columnSuccess) {
            let columns: string[] = []
            if (Array.isArray(columnDataList)) {
                columns = columnDataList.map((item: TableItem) => item.column_name)
            } else if (columnDataList && typeof columnDataList === 'object') {
                const second = Object.values(columnDataList)[1]
                console.log('second', second)
                if (second && Array.isArray((second as TableDataObject).data)) {
                    columns = ((second as TableDataObject).data as TableItem[]).map((item) => item.column_name)
                } else if (Array.isArray(second)) {
                    columns = (second as TableItem[]).map((item) => item.column_name)
                }
            }
            console.log('columns', columns)
            setColumnNames(columns)
        }
    }, [selectedTable, columnSuccess, columnDataList])

    useEffect(() => {
        if (isError) {
            notification.error({ message: 'Failed to fetch tables' })
        }
    }, [isError])

    const handleInsertVariable = (field: any, form: any, variable: string) => {
        const editor = document.querySelector('[contenteditable="true"]')
        const selection = window.getSelection()
        let isInEditor = false
        if (editor && selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            let node = selection.anchorNode
            while (node) {
                if (node === editor) {
                    isInEditor = true
                    break
                }
                node = node.parentNode
            }
            if (isInEditor) {
                range.deleteContents()
                const textNode = document.createTextNode(`slikk-prod.slikkprodpublic.${variable}`)
                range.insertNode(textNode)
                range.setStartAfter(textNode)
                range.setEndAfter(textNode)
                selection.removeAllRanges()
                selection.addRange(range)
                const currentBody = field.value || ''
                const updatedBody = editor?.innerHTML || currentBody
                form.setFieldValue(field.name, updatedBody)
            } else {
                notification.warning({ message: 'Please place the cursor inside the editor to insert.' })
            }
        } else {
            notification.warning({ message: 'Please place the cursor inside the editor to insert.' })
        }
    }

    const handleGenerateCustomQuery = async () => {
        notification.info({ message: 'Generating Custom Query' })
        const parsedValue = textParser(value)
        console.log(parsedValue)
        const body = {
            query_string: parsedValue,
        }
        setGeneratingQuery(true)
        try {
            const res = await axioisInstance.post(`/query/execute/custom_report`, body)
            const data = res?.data?.data
            setCustomReportData(data)
            notification.success({ message: 'Custom Query Generated Successfully' })
        } catch (error: any) {
            console.log(error)
            notification.error({ message: error?.response?.data?.message || 'Failed to generate custom query' })
            setErrorData(error?.response?.data?.message || 'Failed to generate custom query')
        } finally {
            setGeneratingQuery(false)
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

    const convertToCSV = (data: any[], columns: any[]) => {
        const filteredColumns = columns?.filter((item) => item.header !== 'Edit')
        const header = filteredColumns.map((col) => escapeCsvValue(col.header)).join(',')
        const rows = data
            .map((row: any) => {
                return filteredColumns.map((col: any) => escapeCsvValue(row[col.accessorKey])).join(',')
            })
            .join('\n')

        return `${header}\n${rows}`
    }

    const handleDownloadCsvData = async () => {
        notification.info({ message: 'Download in process' })
        setDownloadingQuery(true)
        try {
            await handleDownloadCsv(customReportData, columns, convertToCSV, 'Sellers.csv')
        } catch (error) {
            console.error(error)
        } finally {
            setDownloadingQuery(false)
        }
        notification.success({ message: 'Download complete' })
    }

    return (
        <div className="mt-5">
            <div className="flex gap-4">
                <FormItem label="" labelClass="!justify-start" className="col-span-1 w-full">
                    <RichTextEditor value={value} onChange={(e) => setValue(e)} placeholder="Enter Custom Query" />
                </FormItem>
                <div className="my-4 ">
                    <Card className="max-w-md mx-auto p-0">
                        <div className="p-4 border-b font-semibold">Tables</div>
                        <div className="p-4">
                            <Input
                                placeholder="Search tables..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="mb-3"
                            />
                            <div style={{ maxHeight: 300 }} className="overflow-y-scroll ">
                                <ul className="divide-y divide-gray-200">
                                    {tablesData
                                        .filter((table: string) => table.toLowerCase().includes(search.toLowerCase()))
                                        .map((table: string) => {
                                            return (
                                                <li
                                                    key={table}
                                                    className={`p-2 cursor-pointer hover:bg-blue-50 rounded ${selectedTable === table ? 'bg-blue-100 font-bold' : ''}`}
                                                >
                                                    {columnLoading && <Spinner size={20} color="blue" />}
                                                    <div className="flex gap-2 items-center">
                                                        <span
                                                            onClick={() => {
                                                                setSelectedTable(table === selectedTable ? null : table)
                                                            }}
                                                        >
                                                            {table}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="twoTone"
                                                            size="sm"
                                                            onClick={() => handleInsertVariable({}, { setFieldValue: setValue }, table)}
                                                            className="ml-2"
                                                        >
                                                            Apply
                                                        </Button>
                                                    </div>

                                                    {selectedTable === table && columnNames.length > 0 && !columnLoading && (
                                                        <ul className="mt-2 text-[14px] text-gray-500 bg-gray-50 rounded p-2 border">
                                                            {columnNames.map((col) => (
                                                                <li key={col}>{col}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            )
                                        })}
                                    {isLoading ? (
                                        <>
                                            <li className="text-gray-400 p-2">Loading...</li>
                                        </>
                                    ) : (
                                        tablesData.filter((table: string) => table.toLowerCase().includes(search.toLowerCase())).length ===
                                            0 && <li className="text-gray-400 p-2">No tables found</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <div>
                <Button
                    type="button"
                    variant="blue"
                    loading={generatingQuery}
                    disabled={!value || value === '<p><br></p>'}
                    onClick={handleGenerateCustomQuery}
                    icon={<FaLocationArrow />}
                >
                    Generate
                </Button>
            </div>
            {customReportData.length > 0 && (
                <>
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="new"
                            onClick={handleDownloadCsvData}
                            icon={<FaDownload />}
                            loading={downloadingQuery}
                            disabled={downloadingQuery}
                        >
                            Download
                        </Button>
                    </div>
                    <div className="mt-10 mb-8 font-bold text-xl">Custom Query Table</div>
                    <EasyTable mainData={paginatedData} columns={columns} overflow />
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalPages} />
                </>
            )}
            {errorData && <div className="mt-10 mb-8 font-bold text-xl text-red-500">Error: {errorData}</div>}
        </div>
    )
}

export default ReportCustomQuery
