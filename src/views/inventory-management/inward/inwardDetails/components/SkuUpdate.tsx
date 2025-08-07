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
import { inwardDetailsResponse } from '../inwardCommon'
import LoadingSpinner from '@/common/LoadingSpinner'
import PrinterComp from './PrinterComp'

interface props {
    data: inwardDetailsResponse
}

const SkuUpdate = ({ data }: props) => {
    const { document_number, company } = useParams()
    const [skuWiseData, setSkuWiseData] = useState<skuUpdateType[]>([])
    const [getSkuData, setGetSkuData] = useState<any[]>([])
    const [qcReceived, setQcReceived] = useState<number>()
    const [qcPass, setQcPass] = useState<number>()
    const [locationInput, setLocationInput] = useState<string>('')
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
    const [counter, setCounter] = useState(0)

    const fetchSkuData = async () => {
        try {
            setShowSpinner(true)
            let searchFilter = ''
            if (globalFilter) {
                searchFilter = `&sku=${globalFilter}`
            }
            const response = await axioisInstance.get(
                `/goods/qualitycheck?grn_number=${document_number}${searchFilter}&p=${page}&page_size=${pageSize}`,
            )
            const data = response?.data?.data
            setGetSkuData(data?.results)
            setTotalData(data?.count)
            setRefreshTable(false)
        } catch (error) {
            console.log(error)
        } finally {
            setShowSpinner(false)
        }
    }

    useEffect(() => {
        fetchSkuData()
        if (skuWiseData || refreshTable) {
            fetchSkuData()
        }
    }, [page, pageSize, globalFilter, skuWiseData, refreshTable, counter])

    const [formData, setFormData] = useState({ location: '', sku: '' })

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
                cell: ({ row }: any) => {
                    const value = qcReceived ?? row?.original?.quantity_received
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px] "
                                type="number"
                                min={0}
                                value={value}
                                onChange={(e) => setQcReceived(Number(e.target.value))}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'QC PASSED',
                accessorKey: 'qc_passed',
                cell: ({ row }: any) => {
                    const value = qcPass ?? row?.original?.qc_passed
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px] "
                                type="number"
                                min={0}
                                value={value}
                                onChange={(e) => setQcPass(Number(e.target.value))}
                            />
                        </div>
                    )
                },
            },

            {
                header: 'QC FAILED',
                accessorKey: 'qc_failed',
                cell: ({ row }: any) => {
                    const received = qcReceived ?? row?.original?.quantity_received ?? 0
                    const passed = qcPass ?? row?.original?.qc_passed ?? 0

                    const qcFail = received - passed
                    return <div>{qcFail}</div>
                },
            },
            {
                header: 'LOCATION',
                accessorKey: 'location',
                cell: ({ row }: any) => {
                    console.log(row?.original?.sku, qualitySentInput)
                    const getSame = getSkuData?.find((item) => item.sku === formData?.sku)
                    let value = locationInput !== '' ? locationInput : formData?.location

                    if (getSame) {
                        value =
                            formData?.location && formData.location !== getSame?.location
                                ? `${getSame?.location}/${formData?.location}`
                                : getSame?.location
                    }
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[100px] "
                                type="text"
                                min={0}
                                value={value}
                                onChange={(e) => setLocationInput(e.target.value)}
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
        [formData, qcReceived, qcPass, locationInput],
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

    const handleChanges = (id: number, newQuantity: number | string, setValue: any) => {
        setValue((prevQuantities: any) => ({
            ...prevQuantities,
            [id]: newQuantity,
        }))
    }

    const handleEditSku = async (oLocation: string, oPassed: number, oReceived: number, oFailed: number, oSku: string) => {
        const getSame = getSkuData?.find((item) => item.sku === oSku)
        const body = {
            location: locationInput ?? oLocation,
            qc_passed: qcPass ?? oPassed,
            quantity_received: qcReceived ?? oReceived,
            qc_failed: (qcReceived ?? oReceived) - (qcPass ?? oPassed),
            sku: oSku,
        }

        try {
            await axioisInstance.patch(`/goods/qualitycheck/${getSame?.id}`, body)
            notification.success({
                message: 'Successfully edited',
            })
        } catch (error) {
            console.error(error)
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
        }

        try {
            await axioisInstance.patch(`/goods/qualitycheck/${id}`, body)
            notification.success({ message: 'Successfully edited' })
            setRefreshTable(true)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <SkuDataInputs
                formData={formData}
                setBatchNumberInput={setBatchNumberInput}
                getSkuData={getSkuData}
                skuWiseData={skuWiseData}
                data={data}
                setQualitySentInput={setQualitySentInput}
                setSkuWiseData={setSkuWiseData}
                batchNumberInput={batchNumberInput}
                company={company}
                setFormData={setFormData}
                setCounter={setCounter as any}
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
            </div>
        </div>
    )
}

export default SkuUpdate
