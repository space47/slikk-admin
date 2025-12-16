/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button, Card, Input, Spinner } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { riderZoneService } from '@/store/services/riderZoneService'
import { ZONE_STATE, setCount, setPage, setPageSize, setServiceData } from '@/store/slices/riderZoneSlice/riderZoneSlice'
import { notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRiderZoneColumns } from '../riderZoneUtils/useRiderZoneColumns'
import { useNavigate } from 'react-router-dom'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { FiPlus } from 'react-icons/fi'
import { FaMapMarked } from 'react-icons/fa'
import DialogConfirm from '@/common/DialogConfirm'

const RiderZoneTable = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [globalFilter, setGlobalFilter] = useState('')
    const { page, count, pageSize, serviceData } = useAppSelector<ZONE_STATE>((state) => state.riderZone)
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })
    const [isDelete, setIsDelete] = useState(false)
    const [currentId, setCurrentId] = useState<number | null>(null)
    const [deleteZone, deleteResponse] = riderZoneService.useDeleteZoneMutation()
    const { data, isSuccess, isError, isFetching, isLoading, error, refetch } = riderZoneService.useLiveZonesQuery({
        page,
        pageSize,
        name: debounceFilter,
    })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setServiceData(data?.results || []))
            dispatch(setCount(data?.count || 0))
        }
        if (isError) {
            notification.error({
                message: 'Failed to Load Zones',
                description: (error as any)?.data?.message || 'Please try again later',
                placement: 'topRight',
            })
        }
    }, [isSuccess, isError, data, dispatch, error])

    useEffect(() => {
        if (deleteResponse.isSuccess) {
            notification.success({ message: 'Successfully Deleted Rider Zone' })
            setIsDelete(false)
            refetch()
        }
        if (deleteResponse.isError) {
            notification.error({ message: (deleteResponse?.error as any)?.data?.message || 'Failed to delete row' })
        }
    }, [deleteResponse.isSuccess, deleteResponse.isError])

    const handleDelete = (id: number) => {
        setIsDelete(true)
        setCurrentId(id)
    }

    const handleDeleteRow = () => {
        deleteZone({ id: currentId as number })
    }

    const columns = useRiderZoneColumns({ handleDelete })

    const isTableEmpty = !isLoading && !isFetching && (serviceData?.length === 0 || !serviceData)

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex gap-3 items-center">
                        <span>
                            <FaMapMarked className="text-3xl text-purple-600" />
                        </span>
                        Rider Zones
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage delivery zones and their configurations</p>
                </div>
            </div>

            <Card className="border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Input
                            type="search"
                            value={globalFilter}
                            placeholder="Search by zone name..."
                            className=" w-full rounded-lg"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="blue"
                            size="sm"
                            icon={<FiPlus className="w-4 h-4" />}
                            onClick={() => navigate('/app/riderZone/add')}
                        >
                            Add Zone
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table Card */}
            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold">Zones List</div>
                        {isFetching && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Spinner size={16} />
                                Updating...
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-0">
                    {/* Loading State */}
                    {(isLoading || isFetching) && !serviceData?.length ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <Spinner size={48} className="text-primary" />
                            <p className="text-gray-500">Loading zones...</p>
                        </div>
                    ) : isTableEmpty ? (
                        <div className="py-12">
                            <NotFoundData />
                        </div>
                    ) : (
                        <>
                            {/* Data Table */}
                            <div className="overflow-hidden">
                                <EasyTable mainData={serviceData} columns={columns} page={page} pageSize={pageSize} />
                            </div>

                            {/* Pagination */}
                            {count > pageSize && (
                                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                                    <PageCommon
                                        dispatch={dispatch}
                                        page={page}
                                        pageSize={pageSize}
                                        setPage={setPage}
                                        setPageSize={setPageSize}
                                        totalData={count}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>

            {/* Quick Stats Footer */}
            {!isTableEmpty && !isLoading && (
                <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="text-xs">
                        Page {page} of {Math.ceil(count / pageSize)}
                    </div>
                </div>
            )}
            {isDelete && (
                <DialogConfirm
                    IsDelete
                    setIsOpen={setIsDelete}
                    IsOpen={isDelete}
                    closeDialog={() => setIsDelete(false)}
                    headingName="Delete Zone"
                    label="Zone"
                    onDialogOk={handleDeleteRow}
                />
            )}
        </div>
    )
}

export default RiderZoneTable
