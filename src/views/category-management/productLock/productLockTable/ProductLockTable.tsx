/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Select } from '@/components/ui'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import { useAppDispatch, useAppSelector } from '@/store'
import { productService } from '@/store/services/productService'
import {
    setProductLockLockData,
    setCount,
    productLockInterfaceType,
    setGlobalFilter,
    setPage,
    setPageSize,
} from '@/store/slices/productData/productLock.slice'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductLockColumns } from '../productLockUtils/useProductLockColumns'
import EasyTable from '@/common/EasyTable'

const ProductLockTable = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { productLockData, count, page, pageSize, globalFilter } = useAppSelector<productLockInterfaceType>((state) => state.productLock)

    const { data, isSuccess } = productService.useProductLockDataQuery({
        page: page,
        pageSize: pageSize,
        globalFilter: globalFilter,
    })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setProductLockLockData((data?.data?.results as any) || []))
            dispatch(setCount(data?.data?.count || 0))
        }
    }, [isSuccess, data, dispatch])

    const columns = useProductLockColumns()

    return (
        <div className="p-2 shadow-xl rounded-xl">
            <div>
                <div className="flex justify-between">
                    <div>
                        <input
                            type="search"
                            placeholder="Search"
                            className="w-full border border-gray-300 rounded p-2"
                            value={globalFilter}
                            onChange={(e) => dispatch(setGlobalFilter(e.target?.value))}
                        />
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <div>
                                <Button onClick={() => navigate(`/app/category/productLock/add`)} variant="new">
                                    Add New
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <EasyTable overflow mainData={productLockData} columns={columns} page={page} pageSize={pageSize} />

                    <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                        <Pagination
                            pageSize={pageSize}
                            currentPage={page}
                            total={count}
                            className="mb-4 md:mb-0"
                            onChange={(page) => {
                                dispatch(setPage(page))
                            }}
                        />

                        <div className="min-w-[130px] flex gap-5">
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => {
                                    if (option) {
                                        dispatch(setPageSize(option?.value))
                                        dispatch(setPage(1))
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductLockTable
