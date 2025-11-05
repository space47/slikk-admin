import { Pagination, Select } from '@/components/ui'
import { pageSizeOptions } from '@/constants/pageUtils.constants'
import React from 'react'

interface Props {
    page: number
    pageSize: number
    onPageChange: (page: number) => void
    onSelectChange: (pageSize: number) => void
    count: number
}

const TablePagination: React.FC<Props> = ({ page, pageSize, onPageChange, onSelectChange, count }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between mt-4">
            <Pagination pageSize={pageSize} currentPage={page} total={count} className="mb-4 md:mb-0" onChange={onPageChange} />

            <div className="min-w-[130px] flex gap-5">
                <Select
                    size="sm"
                    isSearchable={false}
                    value={pageSizeOptions.find((option) => option.value === pageSize)}
                    options={pageSizeOptions}
                    onChange={(option) => onSelectChange(option?.value as number)}
                />
            </div>
        </div>
    )
}

export default TablePagination
