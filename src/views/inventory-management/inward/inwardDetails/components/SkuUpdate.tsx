/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import { pageSizeOptions, skuUpdateType } from './QCTableCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Pagination, Select } from '@/components/ui'
import { Option } from '../../inwardCommon'
import SkuDataInputs from './SkuDataInputs'
import { FaSync } from 'react-icons/fa'
import LoadingSpinner from '@/common/LoadingSpinner'
import PrinterComp from './PrinterComp'
import TabsCommon from '@/common/TabsCommon'
import { InwardTabs } from '../inwardCommon'
import { useMaterialFailedColumns } from './materialUtils/useMaterialColumns'
import { handleDownloadCsv } from '@/common/allTypesCommon'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'

const SkuUpdate = () => {
    const { grn_id, company } = useParams()
    const [skuWiseData, setSkuWiseData] = useState<skuUpdateType[]>([])
    const [getSkuData, setGetSkuData] = useState<any[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [qualitySentInput, setQualitySentInput] = useState('')
    const [batchNumberInput, setBatchNumberInput] = useState('')
    const [globalFilter, setGlobalFilter] = useState('')
    const [updatedPassed, setUpdatedPassed] = useState<{ [key: number]: number }>({})
    const [updatedReceived, setUpdatedReceived] = useState<{ [key: number]: number }>({})
    const [updatedLocation, setUpdatedLocation] = useState<{ [key: number]: string }>({})
    const [refreshTable, setRefreshTable] = useState(false)
    const [showSpinner, setShowSpinner] = useState(false)
    const [dataForPrinter, setDataForPrinter] = useState([])
    const [failedQc, setFailedQc] = useState<any>([])
    const [activeTab, setActiveTab] = useState('passed')
    const [counter, setCounter] = useState(0)
    const [qcFailedData, setQcFailedData] = useState<any>({
        failed: 0,
        set: 0,
        passed: 0,
    }) // not a nice idea but using as my brain is not braining now

    useEffect(() => {
        if (grn_id) {
            localStorage.getItem(`failed_${grn_id}`)
            setFailedQc(JSON.parse(localStorage.getItem(`failed_${grn_id}`) || '[]'))
        }
    }, [grn_id])

    const fetchSkuData = async () => {
        try {
            setShowSpinner(true)
            let searchFilter = ''
            if (globalFilter) {
                searchFilter = `&sku=${globalFilter}`
            }
            const response = await axioisInstance.get(`/goods/qualitycheck?grn_id=${grn_id}${searchFilter}&p=${page}&page_size=${pageSize}`)
            const data = response?.data?.data
            setGetSkuData(data?.results)
            setTotalData(data?.count)
            setRefreshTable(false)
        } catch (error: any) {
            console.log(error)
            notification.error({
                message: 'Error',
                description: error?.data?.message || error?.data?.data?.message || 'Something went wrong',
            })
        } finally {
            setShowSpinner(false)
        }
    }

    useEffect(() => {
        fetchSkuData()
        if (skuWiseData || refreshTable) {
            fetchSkuData()
        }
    }, [page, pageSize, globalFilter, refreshTable, counter])

    const [formData, setFormData] = useState({ location: '', sku: '', barcode: '', skid: '' })

    const fetchDataForPrinter = async () => {
        try {
            const response = await axioisInstance.get(`inventory?p=1&page_size=10&&sku=${formData?.sku}`)
            const data = response?.data?.data
            setDataForPrinter(data?.results)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (formData?.sku) {
            fetchDataForPrinter()
        }
    }, [formData?.sku])

    const columns = useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
            {
                header: 'QUANTITY SENT',
                accessorKey: 'quantity_sent',
            },
            {
                header: 'QUANTITY RECEIVED',
                accessorKey: 'quantity_received',
                cell: () => {
                    return qcFailedData?.set
                },
            },
            {
                header: 'QC PASSED',
                accessorKey: 'qc_passed',
                cell: () => {
                    return qcFailedData?.passed
                },
            },

            {
                header: 'QC FAILED',
                accessorKey: 'qc_failed',
                cell: () => {
                    return <div>{qcFailedData?.failed}</div>
                },
            },
            {
                header: 'LOCATION',
                accessorKey: 'location',
                cell: ({ row }: any) => {
                    console.log(row?.original?.sku, qualitySentInput)
                    const getSame = getSkuData?.find((item) => item.sku === formData?.sku)
                    let value = formData?.location

                    if (getSame) {
                        value =
                            formData?.location && formData.location !== getSame?.location
                                ? `${getSame?.location}/${formData?.location}`
                                : getSame?.location
                    }
                    return <div className="flex gap-1 items-center">{value}</div>
                },
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() =>
                            handleEditSku(
                                row?.original?.location,
                                row?.original?.qc_passed,
                                row?.original?.quantity_received,
                                row?.original?.qc_failed,
                                row?.original?.sku,
                            )
                        }
                    >
                        <FaSync className="text-xl text-green-600" />
                    </button>
                ),
            },
        ],
        [formData],
    )

    const columns2 = useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
            {
                header: 'QUANTITY SENT',
                accessorKey: 'quantity_sent',
            },
            {
                header: 'QUANTITY RECEIVED',
                accessorKey: 'quantity_received',
                cell: ({ row }: any) => {
                    const stockId = row.original.id
                    const value = updatedReceived[stockId] ?? row?.original?.quantity_received

                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px]"
                                type="number"
                                min={0}
                                value={value}
                                onChange={(e) => handleChanges(stockId, Number(e.target.value), setUpdatedReceived)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'QC PASSED',
                accessorKey: 'qc_passed',
                cell: ({ row }: any) => {
                    const stockId = row.original.id
                    const value = updatedPassed[stockId] ?? row?.original?.qc_passed

                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px]"
                                type="number"
                                min={0}
                                value={value}
                                onChange={(e) => handleChanges(stockId, Number(e.target.value), setUpdatedPassed)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'QC FAILED',
                accessorKey: 'qc_failed',
                cell: ({ row }: any) => {
                    const stockId = row.original.id

                    const received = updatedReceived[stockId] ?? row?.original?.quantity_received ?? 0
                    const passed = updatedPassed[stockId] ?? row?.original?.qc_passed ?? 0

                    const qcFail = received - passed

                    return <div>{qcFail}</div>
                },
            },
            {
                header: 'LOCATION',
                accessorKey: 'location',
                cell: ({ row }: any) => {
                    const stockId = row.original.id
                    const value = updatedLocation[stockId] ?? row?.original?.location

                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[100px]"
                                type="text"
                                value={value}
                                onChange={(e) => handleChanges(stockId, e.target.value, setUpdatedLocation)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() =>
                            handleEditSku2(
                                row?.original?.id,
                                row?.original?.location,
                                row?.original?.qc_passed,
                                row?.original?.quantity_received,
                                row?.original?.qc_failed,
                                row?.original?.sku,
                            )
                        }
                    >
                        <FaSync className="text-xl text-green-600" />
                    </button>
                ),
            },
        ],
        [updatedPassed, updatedReceived, updatedLocation, skuWiseData],
    )

    const failedColumns = useMaterialFailedColumns()

    const handleChanges = (id: number, newQuantity: number | string, setValue: any) => {
        setValue((prevQuantities: any) => ({ ...prevQuantities, [id]: newQuantity }))
    }

    const convertToCSV = (data: any[], columns: any[]) => {
        const header = columns.map((col) => col.header).join(',')
        const rows = data
            .map((row) => {
                return columns
                    .map((col) => {
                        if (col.accessorKey === 'sku') {
                            return `${row?.sku}`
                        } else if (col.accessorKey === 'quantity_sent') {
                            return row?.quantity_sent
                        } else if (col.accessorKey === 'location') {
                            return row?.location
                        } else {
                            return ''
                        }
                    })
                    .join(',')
            })
            .join('\n')
        return `${header}\n${rows}`
    }

    const handleDownloadFailedCsv = () => {
        handleDownloadCsv(failedQc, failedColumns, convertToCSV, 'failedQC.csv')
    }

    const handleEditSku = async (oLocation: string, oPassed: number, oReceived: number, oFailed: number, oSku: string) => {
        const getSame = getSkuData?.find((item) => item.sku === oSku)
        const body = {
            location: oLocation,
            qc_passed: oPassed,
            quantity_received: oReceived,
            qc_failed: oReceived - oPassed,
            sku: oSku,
        }
        try {
            const res = await axioisInstance.patch(`/goods/qualitycheck/${getSame?.id}`, body)
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }
    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }
    const handleEditSku2 = async (id: number, oLocation: string, oPassed: number, oReceived: number, oFailed: number, oSku: string) => {
        const body = {
            location: updatedLocation[id] ?? oLocation,
            qc_passed: updatedPassed[id] ?? oPassed,
            quantity_received: updatedReceived[id] ?? oReceived,
            qc_failed: (updatedReceived[id] ?? oReceived) - (updatedPassed[id] ?? oPassed),
            sku: oSku,
            action: 'replace',
        }

        try {
            await axioisInstance.patch(`/goods/qualitycheck/${id}`, body)
            notification.success({ message: 'Successfully edited' })
            setRefreshTable(true)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Failed to edit' })
            }
        }
    }

    return (
        <div className="p-4 flex flex-col gap-6 shadow-xl">
            <SkuDataInputs
                formData={formData}
                setBatchNumberInput={setBatchNumberInput}
                skuWiseData={skuWiseData}
                setQualitySentInput={setQualitySentInput}
                setSkuWiseData={setSkuWiseData}
                batchNumberInput={batchNumberInput}
                company={company}
                setFormData={setFormData}
                setCounter={setCounter as any}
                setFailedQc={setFailedQc}
                setQcFailedData={setQcFailedData}
            />
            {<EasyTable noPage overflow mainData={skuWiseData} columns={columns} />}
            <div className="flex justify-start items-center mb-10">
                {skuWiseData?.length > 0 && <span className="text-xl font-bold">Print Product Data: </span>}
                <span>{skuWiseData?.length > 0 && <PrinterComp dataForPrinter={dataForPrinter} />}</span>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-between">
                    <label htmlFor="" className="font-bold text-xl">
                        QC Details
                    </label>
                </div>

                <div className=" flex justify-between">
                    <input
                        type="text"
                        placeholder="Enter Sku"
                        className="w-1/4 border border-gray-300 rounded p-2"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target?.value)}
                    />
                </div>

                <div>
                    <TabsCommon
                        tabLists={InwardTabs}
                        activeTab={activeTab}
                        handleChange={(val) => {
                            console.log('val', val)
                            setActiveTab(val)
                        }}
                    />
                </div>

                {activeTab === 'passed' && (
                    <>
                        {showSpinner ? (
                            <>
                                <LoadingSpinner />
                            </>
                        ) : (
                            <EasyTable noPage overflow mainData={getSkuData} columns={columns2} />
                        )}
                        <div className="flex items-center justify-between mt-4">
                            <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />
                            <div style={{ minWidth: 130 }}>
                                <Select<Option>
                                    size="sm"
                                    isSearchable={false}
                                    value={pageSizeOptions.find((option) => option.value === pageSize)}
                                    options={pageSizeOptions}
                                    onChange={(option) => onSelectChange(option?.value)}
                                />
                            </div>
                        </div>
                    </>
                )}
                {activeTab === 'failed' && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                onClick={handleDownloadFailedCsv}
                            >
                                Download Failed Files
                            </button>
                        </div>
                        <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-4">
                            <EasyTable noPage overflow mainData={failedQc} columns={failedColumns} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SkuUpdate
