import EasyTable from '@/common/EasyTable'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { pageSizeOptions } from '@/constants/pageUtils.constants'
import AccessDenied from '@/views/pages/AccessDenied'
import React, { useMemo, useState } from 'react'
import { HistoryColumns } from './HistoryColumns'
import { IndentHistoryData } from '../indent/indentUtils/indent.types'
import PageCommon from '@/common/PageCommon'
import UltimateDateFilter from '@/common/UltimateDateFilter'
import moment from 'moment'
import { Spin } from 'antd'
import NotFoundData from '@/views/pages/NotFound/Notfound'

interface Props {
    type: string
}

const UploadHistory = ({ type }: Props) => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0].value)
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))

    const To_Date = useMemo(() => {
        return moment(to).add(1, 'days').format('YYYY-MM-DD')
    }, [to])

    const query = useMemo(() => {
        return `bulkupload/history?type=${type}&p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}`
    }, [page, pageSize, type, from, To_Date])

    const { data: historyData, responseStatus, totalData, loading } = useFetchApi<IndentHistoryData>({ url: query, initialData: [] })
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const columns = HistoryColumns()

    const handleDateChange = (dates: [Date | null, Date | null] | null, setFrom: (x: string) => void, setTo: (x: string) => void) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    if (responseStatus === '403') {
        return <AccessDenied />
    }

    return (
        <Spin spinning={loading}>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="w-full md:w-72">
                        <input
                            placeholder="Search..."
                            value={globalFilter || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-start md:justify-end">
                        <UltimateDateFilter from={from} to={to} setFrom={setFrom} setTo={setTo} handleDateChange={handleDateChange} />
                    </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                    {historyData?.length ? (
                        <>
                            <EasyTable
                                overflow
                                filterValue={globalFilter}
                                page={page}
                                pageSize={pageSize}
                                mainData={historyData}
                                columns={columns}
                            />
                            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
                        </>
                    ) : (
                        <div className="py-16 flex justify-center">
                            <NotFoundData />
                        </div>
                    )}
                </div>
            </div>
        </Spin>
    )
}

export default UploadHistory
