import EasyTable from '@/common/EasyTable'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/constants/pageUtils.constants'
import AccessDenied from '@/views/pages/AccessDenied'
import React, { useMemo, useState } from 'react'
import { RtvHistoryData } from '../rtvUtils/rtv.types'
import { useRtvHistoryColumns } from '../rtvUtils/useRtvHistoryColumns'

const RtvHistory = () => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0].value)

    const query = useMemo(() => {
        return `bulkupload/history?type=indent_note&p=${page}&page_size=${pageSize}`
    }, [page, pageSize])

    const { data: indentHistoryData, responseStatus, totalData } = useFetchApi<RtvHistoryData>({ url: query, initialData: [] })
    // const [globalFilter, setGlobalFilter] = useState<string>('')
    const columns = useRtvHistoryColumns()

    if (responseStatus === '403') {
        return <AccessDenied />
    }

    return (
        <div>
            <div>
                <EasyTable overflow mainData={indentHistoryData} columns={columns} />
                <div className="flex items-center justify-between mt-4">
                    <Pagination
                        pageSize={pageSize}
                        currentPage={page}
                        total={totalData}
                        onChange={(page) => {
                            setPage(page)
                        }}
                    />
                    <div style={{ minWidth: 130 }}>
                        <Select
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => {
                                if (option) {
                                    setPageSize(option.value)
                                    setPage(1)
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RtvHistory
