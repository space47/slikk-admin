/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, Select } from '@/components/ui'
import { Option, pageSizeOptions } from '@/views/org-management/sellers/sellerCommon'
import React from 'react'

interface props {
    page: number
    setPage: (x: number) => void
    pageSize: number
    totalData: number
    setPageSize: (x: number) => void
    dispatch?: any
}

const PageCommon = ({ page, setPage, pageSize, totalData, setPageSize, dispatch }: props) => {
    return (
        <div className="flex items-center justify-between mt-4">
            <Pagination
                pageSize={pageSize}
                currentPage={page}
                total={totalData}
                onChange={(page) => (dispatch ? dispatch(setPage(page)) : setPage(page))}
            />
            <div style={{ minWidth: 130 }}>
                <Select<Option>
                    size="sm"
                    isSearchable={false}
                    value={pageSizeOptions.find((option) => option.value === pageSize)}
                    options={pageSizeOptions}
                    onChange={(option) => {
                        if (option) {
                            if (dispatch) {
                                dispatch(setPage(1))
                                dispatch(setPageSize(Number(option.value)))
                            } else {
                                setPage(1)
                                setPageSize(Number(option.value))
                            }
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default PageCommon
