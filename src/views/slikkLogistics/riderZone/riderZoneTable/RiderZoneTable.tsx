/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button, Spinner } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { riderZoneService } from '@/store/services/riderZoneService'
import { ZONE_STATE, setCount, setPage, setPageSize, setServiceData } from '@/store/slices/riderZoneSlice/riderZoneSlice'
import { notification } from 'antd'
import React, { useEffect } from 'react'
import { useRiderZoneColumns } from '../riderZoneUtils/useRiderZoneColumns'
import { useNavigate } from 'react-router-dom'
import NotFoundData from '@/views/pages/NotFound/Notfound'

const RiderZoneTable = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { page, count, pageSize, serviceData } = useAppSelector<ZONE_STATE>((state) => state.riderZone)
    const { data, isSuccess, isError, isFetching, isLoading, error } = riderZoneService.useLiveZonesQuery({
        page,
        pageSize,
    })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setServiceData(data?.results || []))
            dispatch(setCount(data?.count || 0))
        }
        if (isError) {
            notification.error({ message: (error as any)?.data?.message || 'Failed to load' })
        }
    }, [isSuccess, isError])

    const columns = useRiderZoneColumns()

    const isTableEmpty = !isLoading && !isFetching && (serviceData?.length === 0 || !serviceData)

    return (
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-end mb-10">
                <Button variant="new" size="sm" onClick={() => navigate(`/app/riderZone/add`)}>
                    Add Zone
                </Button>
            </div>
            {(isLoading || isFetching) && (
                <div className="flex items-center justify-center py-20">
                    <Spinner size={40} />
                </div>
            )}
            {isTableEmpty && <NotFoundData />}
            {!isTableEmpty && !isLoading && !isFetching && (
                <>
                    <EasyTable mainData={serviceData} columns={columns} page={page} pageSize={pageSize} />
                    <div className="mt-4">
                        <PageCommon
                            dispatch={dispatch}
                            page={page}
                            pageSize={pageSize}
                            setPage={setPage}
                            setPageSize={setPageSize}
                            totalData={count}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default RiderZoneTable
