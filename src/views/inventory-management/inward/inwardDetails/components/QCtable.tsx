/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import Input from '@/components/ui/Input'
import type { ColumnDef } from '@tanstack/react-table'
import EasyTable from '@/common/EasyTable'
import { grn_quality_check } from './QCTableCommon'
import { useParams } from 'react-router-dom'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import PageCommon from '@/common/PageCommon'
import { Spinner, Button, Select } from '@/components/ui'
import { GRNItemDetails } from '@/store/types/inward.types'
import { inwardService } from '@/store/services/inwardService'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { FaDownload, FaSync, FaTrash } from 'react-icons/fa'
import DialogConfirm from '@/common/DialogConfirm'
import { Modal } from 'antd'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'

const options = [
    { label: 'PDF', value: 'pdf' },
    { label: 'CSV', value: 'csv' },
]

interface Props {
    setSelectValue: any
    handleRegenerateGrn: (doc_number: string) => Promise<void>
    regenerateLoading: boolean
    handleSyncClick: any
    data?: any

    isSyncing: boolean
}

const QCtable = ({
    handleRegenerateGrn,
    handleSyncClick,
    regenerateLoading,
    setSelectValue,
    data,

    isSyncing,
}: Props) => {
    const { grn_id } = useParams()
    const [grnItems, setGrnItems] = useState<GRNItemDetails[]>([])
    const [deleteSpinner, setDeleteSpinner] = useState(false)
    const [closeGrn, setCloseGrn] = useState(false)
    const [isDeleteGrn, setIsDeleteGrn] = useState(false)
    const [count, setCount] = useState(0)
    const [globalFilter, setGlobalFilter] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })

    const grnItemsApiCall = inwardService.useGdnItemsDetailsQuery({ page, pageSize, grn_id: grn_id, sku: debounceFilter })

    useEffect(() => {
        if (grnItemsApiCall.isSuccess) {
            setGrnItems(grnItemsApiCall?.data?.data?.results)
            setCount(grnItemsApiCall?.data?.data?.count)
        }
    }, [grnItemsApiCall.isSuccess, grnItemsApiCall.data])

    const hasSynced = useMemo(() => grnItems?.some((item) => item.synced_quantity > 0), [grnItems])

    const deleteGrn = async (isForce: string, id: number) => {
        try {
            setDeleteSpinner(true)
            const res = await axioisInstance.delete(`/goods/received/${id}`, {
                data: { confirm_delete: isForce },
            })
            successMessage(res)
            setIsDeleteGrn(false)
            return res?.data?.data
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
                const errMsg = error?.response?.data?.message || error?.message
                return { error: errMsg }
            }
        } finally {
            setDeleteSpinner(false)
        }
    }
    const handleClose = async (id: number) => {
        try {
            setDeleteSpinner(true)
            const body = {
                action: 'completed',
                grn_id: id,
            }
            const res = await axioisInstance.patch(`goods/received/${data?.company}/detail`, body)
            successMessage(res)
            setIsDeleteGrn(false)
            return res?.data?.data
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
                const errMsg = error?.response?.data?.message || error?.message
                return { error: errMsg }
            }
        } finally {
            setDeleteSpinner(false)
        }
    }

    const handleDelete = async (id: number) => {
        const res = await deleteGrn('false', id)
        if (res && !res.error) return
        if (res?.error?.toLowerCase() === 'please confirm delete by setting confirm_delete to true') {
            Modal.confirm({
                title: 'Confirm Force Delete',
                content: 'Are you sure you want to force delete this GRN?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: async () => {
                    await deleteGrn('true', id)
                },
            })
        } else if (res?.error) {
            errorMessage(res.error)
        }
    }

    const columns = useMemo<ColumnDef<grn_quality_check>[]>(
        () => [
            {
                header: 'GRN Number',
                accessorKey: 'grn',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                header: 'QC done by',
                accessorKey: 'qc_done_by.name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SKU code',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Batch Number',
                accessorKey: 'batch_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QTY Sent',
                accessorKey: 'quantity_sent',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QTY Received',
                accessorKey: 'quantity_received',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Passed',
                accessorKey: 'qc_passed',
                cell: (info) => info.getValue(),
            },
            {
                header: 'QC Failed',
                accessorKey: 'qc_failed',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Sync to Inventory',
                accessorKey: 'sent_to_inventory',
                cell: ({ getValue }: any) => {
                    const value = getValue()

                    return (
                        <div>
                            {value === true ? (
                                <div>true</div>
                            ) : (
                                <>
                                    <div>false</div>
                                </>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Images',
                accessorKey: 'images',
                cell: (info) => <img src={info.getValue() as string} alt="Image" style={{ width: '50px', height: '50px' }} />,
            },
            {
                header: 'shipment_item',
                accessorKey: 'shipment_item',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                header: 'Updated By',
                accessorKey: 'last_updated_by.name',
                cell: (info) => info.getValue(),
            },
        ],
        [],
    )

    if (grnItemsApiCall.isError || !grnItemsApiCall.data?.data.results) {
        return <NotFoundData />
    }

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Quality Checklist</h2>
                            <p className="text-gray-600 mt-1">Manage and review your quality inspection details</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="w-full sm:w-auto">
                                <Select
                                    isClearable
                                    size="sm"
                                    isSearchable={false}
                                    options={options}
                                    className="min-w-[180px]"
                                    placeholder="Filter Download by..."
                                    classNamePrefix="custom-select"
                                    onChange={(e) => setSelectValue(e?.value)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="new"
                                    size="sm"
                                    icon={<FaDownload className="w-4 h-4" />}
                                    loading={regenerateLoading}
                                    disabled={regenerateLoading}
                                    onClick={() => handleRegenerateGrn(data.document_number)}
                                >
                                    Export
                                </Button>
                                <>
                                    {data?.status !== 'completed' && (
                                        <>
                                            <Button
                                                variant="accept"
                                                size="sm"
                                                icon={<FaSync className="w-4 h-4" />}
                                                loading={isSyncing}
                                                onClick={() => handleSyncClick(data.grn_number)}
                                            >
                                                Sync GRN
                                            </Button>

                                            {!hasSynced && (
                                                <Button
                                                    variant="reject"
                                                    size="sm"
                                                    icon={<FaTrash className="w-4 h-4" />}
                                                    loading={deleteSpinner}
                                                    onClick={() => setIsDeleteGrn(true)}
                                                >
                                                    Delete GRN
                                                </Button>
                                            )}
                                            {hasSynced && (
                                                <Button
                                                    variant="reject"
                                                    size="sm"
                                                    icon={<FaTrash className="w-4 h-4" />}
                                                    loading={deleteSpinner}
                                                    onClick={() => setCloseGrn(true)}
                                                >
                                                    Close Grn
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Quality Inspection Details</h3>
                    </div>
                    <div className="w-1/2 p-2">
                        <Input
                            value={globalFilter}
                            type="search"
                            className="p-2 font-lg rounded-md shadow border border-block"
                            placeholder="Search all columns..."
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>

                    {(grnItemsApiCall.isLoading || grnItemsApiCall.isFetching) && (
                        <div className="flex items-center justify-center mb-4">
                            <Spinner size={30} />
                        </div>
                    )}

                    <div className="mb-3">
                        <EasyTable overflow mainData={grnItems} columns={columns} page={page} pageSize={pageSize} />
                    </div>
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
                </div>
                {isDeleteGrn && (
                    <DialogConfirm
                        IsDelete
                        IsOpen={isDeleteGrn}
                        closeDialog={() => setIsDeleteGrn(false)}
                        headingName="Delete Grn"
                        setIsOpen={setIsDeleteGrn}
                        label="Grn"
                        onDialogOk={() => handleDelete(data?.id)}
                    />
                )}
                {closeGrn && (
                    <DialogConfirm
                        IsConfirm
                        IsOpen={closeGrn}
                        closeDialog={() => setCloseGrn(false)}
                        headingName="Close Grn"
                        setIsOpen={setCloseGrn}
                        label="Grn"
                        onDialogOk={() => handleClose(data?.id)}
                    />
                )}
            </div>
        </>
    )
}

export default QCtable
