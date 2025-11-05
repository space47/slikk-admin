import EasyTable from '@/common/EasyTable'
import LoadingSpinner from '@/common/LoadingSpinner'
import { useAppDispatch, useAppSelector } from '@/store'
import { rtvService } from '@/store/services/rtvService'
import { rtvActions, rtvStateType } from '@/store/slices/rtv/rtv.slice'
import React, { useEffect, useState } from 'react'
import { useRtvColumns } from '../rtvUtils/useRtvColumns'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import PageCommon from '@/common/PageCommon'
import { Button, Select } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import ReduxDateRange from '@/common/ReduxDateRange'

const RtvTable = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { rtv, count, page, pageSize, from, to } = useAppSelector<rtvStateType>((state) => state.rtv)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [storeCode, setStoreCode] = useState<number>(1)
    const { data, isLoading, isSuccess, isError } = rtvService.useRtvDataQuery(
        {
            from,
            page,
            pageSize: pageSize,
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
    }, [dispatch, isSuccess, data])

    const columns = useRtvColumns({ storeList })

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(rtvActions.setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            const toDate = dates[1] ? moment(dates[1]).add(1, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD')
            dispatch(rtvActions.setTo(toDate))
        }
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col w-full max-w-xs">
                    <label className="font-semibold text-gray-700 mb-1">Select Store</label>
                    <Select
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={storeList}
                        defaultValue={storeList?.find((item) => item?.id === storeCode)}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id?.toString()}
                        onChange={(newVal) => setStoreCode(newVal?.id as number)}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <Button variant="new" className="mt-8" size="sm" onClick={() => navigate(`/app/goods/rtv/add`)}>
                        Add RTV
                    </Button>

                    <ReduxDateRange
                        handleDateChange={handleDateChange}
                        id="rtv_table"
                        setFrom={rtvActions.setFrom}
                        setTo={rtvActions.setTo}
                    />
                </div>
            </div>
            {isError && <NotFoundData />}
            {isSuccess && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <EasyTable mainData={rtv} page={page} pageSize={pageSize} columns={columns} />
                </div>
            )}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
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
