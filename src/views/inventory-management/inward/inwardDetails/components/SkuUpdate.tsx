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
import { IoIosRefresh, IoIosRefreshCircle } from 'react-icons/io'

interface props {
    data: inwardDetailsResponse
}

const SkuUpdate = ({ data }: props) => {
    const { document_number, company } = useParams()
    const [skuWiseData, setSkuWiseData] = useState<skuUpdateType[]>([])
    const [getSkuData, setGetSkuData] = useState<any[]>([])
    const [qcReceived, setQcReceived] = useState<number>()
    const [qcPass, setQcPass] = useState<number>()
    const [qcSent, setQcSent] = useState<number>()
    const [locationInput, setLocationInput] = useState<string>('')
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [qualitySentInput, setQualitySentInput] = useState('')
    const [batchNumberInput, setBatchNumberInput] = useState('')
    const [globalFilter, setGlobalFilter] = useState('')
    const [updatedPassed, setUpdatedPassed] = useState<{
        [key: number]: number
    }>({})
    const [updatedReceived, setUpdatedReceived] = useState<{
        [key: number]: number
    }>({})
    const [updatedLocation, setUpdatedLocation] = useState<{
        [key: number]: string
    }>({})
    const [refreshTable, setRefreshTable] = useState(false)
    const [showSpinner, setShowSpinner] = useState(false)

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
    }, [page, pageSize, globalFilter, skuWiseData, refreshTable])

    const [formData, setFormData] = useState({
        location: '',
        sku: '',
    })

    const getDataInputs = getSkuData?.find((item) => item.sku === formData?.sku)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleAddSku = async () => {
        const { sku, location } = formData

        if (!sku.trim()) return

        const getSameData = getSkuData?.find((item) => item.sku === sku)

        const updatedData = skuWiseData.map((item) => {
            console.log('check start')
            if (item.sku === sku) {
                return {
                    ...item,
                    qc_passed: item.qc_passed + 1,
                    quantity_received: item.quantity_received + 1,
                    qc_failed: item.quantity_received + 1 - (item.qc_passed + 1),
                    location: location || item.location,
                }
            }
            return item
        })

        if (getSameData) {
            updatedData[0] = {
                sku,
                qc_passed: getSameData?.qc_passed + 1,
                quantity_received: getSameData?.quantity_received + 1,
                qc_failed: getSameData.quantity_received + 1 - (getSameData.qc_passed + 1),
                location: formData?.location ? [getSameData?.location, formData.location].filter(Boolean).join(',') : getSameData?.location,
            }
        }

        if (!updatedData.find((item) => item.sku === sku) && !getSameData) {
            updatedData[0] = {
                sku,
                qc_passed: 1,
                quantity_received: 1,
                qc_failed: 0,
                location: location || '',
                document_number: data?.document_number,
                company_id: Number(company),
                quantity_sent: 1,
                batch_number: batchNumberInput ?? '',
            }
        }

        setSkuWiseData(updatedData)

        if (getSameData) {
            try {
                const firstSku = updatedData[0]

                const response = await axioisInstance.patch(`/goods/qualitycheck/${getSameData?.id}`, firstSku)
                console.log('Response:', response.data)
                notification.success({
                    message: response?.data?.message || 'Successfully Updated',
                })
            } catch (error) {
                notification.error({
                    message: 'Failed to Update',
                })
                console.error('Error during API call:', error)
            }
        }
        if (!getSameData) {
            try {
                const firstSku = updatedData[0]

                const response = await axioisInstance.post(`/goods/qualitycheck`, firstSku)
                console.log('Response:', response.data)
                notification.success({
                    message: response?.data?.message || 'Successfully added',
                })
            } catch (error) {
                notification.error({
                    message: 'Failed to add',
                })
                console.error('Error during API call:', error)
            }
        }

        setFormData((prev) => ({
            ...prev,
            sku: '',
        }))
        setQualitySentInput('')
        setBatchNumberInput('')
    }

    const columns = useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
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
                    console.log(row?.original?.sku)
                    const getSame = getSkuData?.find((item) => item.sku === formData?.sku)
                    let value = locationInput !== '' ? locationInput : formData?.location
                    if (getSame) {
                        value = `${getSame?.location}/${formData?.location}`
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
                                onChange={(e) => handleReceivedChange(stockId, Number(e.target.value))}
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
                                onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
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
                                onChange={(e) => handleLocationChange(stockId, e.target.value)}
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

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setUpdatedPassed((prevQuantities) => ({
            ...prevQuantities,
            [id]: newQuantity,
        }))
    }
    const handleReceivedChange = (id: number, newQuantity: number) => {
        setUpdatedReceived((prevQuantities) => ({
            ...prevQuantities,
            [id]: newQuantity,
        }))
    }

    const handleLocationChange = (id: number, newLocation: string) => {
        setUpdatedLocation((prevLocations) => ({
            ...prevLocations,
            [id]: newLocation,
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
            notification.success({
                message: 'Successfully edited',
            })
            setRefreshTable(true)
        } catch (error) {
            console.error(error)
        }
    }

    console.log('SKU', formData.sku)

    return (
        <div className="p-4 flex flex-col gap-6">
            <SkuDataInputs formData={formData} handleInputChange={handleInputChange} handleAddSku={handleAddSku} />

            {getDataInputs === undefined && formData?.sku && (
                <>
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700">QC Sent</label>
                            <input
                                type="text"
                                placeholder="Enter Quantity Sent"
                                className="w-auto xl:w-1/6 border border-gray-300 rounded p-2"
                                value={qualitySentInput}
                                onChange={(e) => setQualitySentInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddSku()
                                    }
                                }}
                            />
                        </div>
                        {/* <div className="grid grid-cols-4 gap-2">
                            <div className="mb-4">
                                <label className="block text-gray-700">Batch Number</label>
                                <input
                                    type="search"
                                    placeholder="Enter Batch Number"
                                    className="w-2/3 border border-gray-300 rounded p-2"
                                    value={batchNumberInput}
                                    onChange={(e) => setBatchNumberInput(e.target.value)}
                                />
                            </div>
                        </div> */}
                    </div>
                </>
            )}

            {<EasyTable noPage overflow mainData={skuWiseData} columns={columns} />}
            <br />
            <br />
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

                    {/* <button onClick={() => setRefreshTable(true)}>
                        <IoIosRefreshCircle className="text-3xl font-bold text-green-600" />
                    </button> */}
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
