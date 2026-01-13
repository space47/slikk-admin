/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { FiPlus, FiAlertTriangle } from 'react-icons/fi'
import EasyTable from '@/common/EasyTable'
import LoadingSpinner from '@/common/LoadingSpinner'
import ReduxDateRange from '@/common/ReduxDateRange'
import PageCommon from '@/common/PageCommon'
import { Button, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { rtvService } from '@/store/services/rtvService'
import { rtvActions, rtvStateType } from '@/store/slices/rtv/rtv.slice'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useRtvColumns } from '../rtvUtils/useRtvColumns'
import { BsShopWindow } from 'react-icons/bs'

const RtvTable = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { rtv, count, page, pageSize, from, to } = useAppSelector<rtvStateType>((state) => state.rtv)

    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)

    const [storeCode, setStoreCode] = useState<number>(1)

    const { data, isLoading, isSuccess, isError, error } = rtvService.useRtvDataQuery(
        {
            from,
            page,
            pageSize,
            to: moment(to).add(1, 'days').format('YYYY-MM-DD'),
            store_id: storeCode,
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(rtvActions.setRtvData(data?.data?.results))
            dispatch(rtvActions.setCount(data?.data?.count))
        }
    }, [isSuccess, data, dispatch])

    const columns = useRtvColumns({ storeList })

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (!dates?.[0]) return

        dispatch(rtvActions.setFrom(moment(dates[0]).format('YYYY-MM-DD')))

        const toDate = dates[1] ? moment(dates[1]).add(1, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD')

        dispatch(rtvActions.setTo(toDate))
    }

    /* ---------------- ERROR HANDLING ---------------- */

    if (isError) {
        const status = (error as any)?.status

        if (status === 403) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <FiAlertTriangle className="text-red-500 text-5xl mb-4" />
                    <h2 className="text-xl font-semibold">Access Denied</h2>
                    <p className="text-gray-500 mt-1">You don’t have permission to view RTV data.</p>
                </div>
            )
        }
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* ---------------- PAGE HEADER ---------------- */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <span>
                        <BsShopWindow className="text-3xl text-purple-600" />
                    </span>
                    <span>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Return to Vendor (RTV)</h1>
                        <p className="text-sm text-gray-500">View and manage RTV entries</p>
                    </span>
                </div>

                <Button variant="new" size="sm" className="flex items-center gap-2" onClick={() => navigate('/app/goods/rtv/add')}>
                    <FiPlus />
                    Add RTV
                </Button>
            </div>

            {/* ---------------- FILTERS ---------------- */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-wrap gap-6 items-end">
                <div className="w-full max-w-xs">
                    <label className="flex items-center gap-2 text-sm font-medium mb-1">Store</label>
                    <Select
                        isClearable
                        options={storeList}
                        defaultValue={storeList?.find((item) => item?.id === storeCode)}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id?.toString()}
                        onChange={(val) => setStoreCode(val?.id as number)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <ReduxDateRange
                        handleDateChange={handleDateChange}
                        id="rtv_table"
                        setFrom={rtvActions.setFrom}
                        setTo={rtvActions.setTo}
                    />
                </div>
            </div>

            {/* ---------------- TABLE ---------------- */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                {isSuccess && rtv?.length > 0 ? (
                    <EasyTable mainData={rtv} page={page} pageSize={pageSize} columns={columns} />
                ) : (
                    <div className="py-12 text-center text-gray-500">No RTV records found</div>
                )}
            </div>

            {/* ---------------- PAGINATION ---------------- */}
            <div className="flex justify-end">
                <PageCommon
                    dispatch={dispatch}
                    page={page}
                    pageSize={pageSize}
                    setPage={rtvActions.setPage}
                    setPageSize={rtvActions.setPageSize}
                    totalData={count}
                />
            </div>
        </div>
    )
}

export default RtvTable
