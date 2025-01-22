import { Pagination, Select } from '@/components/ui'
import { Option, pageSizeOptions } from '@/views/org-management/sellers/sellerCommon'
import React from 'react'

interface props {
    page: number
    setPage: (x: number) => void
    pageSize: number
    totalData: number
    setPageSize: (x: number) => void
}

const PageCommon = ({ page, setPage, pageSize, totalData, setPageSize }: props) => {
    return (
        <div className="flex items-center justify-between mt-4">
            <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />
            <div style={{ minWidth: 130 }}>
                <Select<Option>
                    size="sm"
                    isSearchable={false}
                    value={pageSizeOptions.find((option) => option.value === pageSize)}
                    options={pageSizeOptions}
                    onChange={(option) => setPageSize(Number(option?.value))}
                />
            </div>
        </div>
    )
}

export default PageCommon
