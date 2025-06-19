/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import EasyTable from '@/common/EasyTable'
import { notification } from 'antd'
import DialogConfirm from '@/common/DialogConfirm'
import { BrandTypes } from './brandCommon'
import { BrandColumns } from './brandUtils/BrandColumns'
import { Option } from '../catalog/CommonType'
import { pageSizeOptions } from '../orderlist/commontypes'
import { useFetchApi } from '@/commonHooks/useFetchApi'

const Brand = () => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [brandId, setBrandId] = useState<number>()
    const [showBrandDelete, setShowBrandDelete] = useState<boolean>(false)

    const queryParams = useMemo(() => {
        const filterValue = globalFilter ? `&q=${encodeURIComponent(globalFilter)}` : ''
        return `brands?dashboard=true&p=${page}&page_size=${pageSize}${filterValue}`
    }, [page, pageSize, globalFilter])

    const { data, totalData } = useFetchApi<BrandTypes[]>({ url: queryParams })

    const handleDeleteBrand = (id: number) => {
        setBrandId(id)
        setShowBrandDelete(true)
    }

    const handleSyncBrand = async (name: string) => {
        notification.info({ message: 'SYNC IN PROCESS' })
        const body = { task_name: 'resize_product_images', brand: name }

        try {
            const response = await axiosInstance.post(`/backend/task/create`, body)
            notification.success({ message: response?.data?.message || 'SYNCED TO Brand' })
        } catch (error: any) {
            console.error(error)
            notification.success({ message: error.response?.data?.message || 'FAILED TO SYNC Brand' })
        }
    }

    const handleDelete = async () => {
        const body = { remove_tags: true }
        try {
            await axiosInstance.delete(`/brands/${brandId}`, { data: body })
            notification.success({ message: 'Successfully deleted the brand' })
        } catch (error) {
            console.log(error)
            notification.error({ message: 'Failed to Delete Brand' })
        } finally {
            setShowBrandDelete(false)
        }
    }

    const columns = BrandColumns({ handleSyncBrand, handleDeleteBrand })

    return (
        <div className="p-2 rounded-xl shadow-xl">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search here"
                    value={globalFilter}
                    className="p-2 border rounded"
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>
            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(e) => setPage(e)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            if (option) {
                                setPage(1)
                                setPageSize(option?.value)
                            }
                        }}
                    />
                </div>
            </div>
            {showBrandDelete && (
                <DialogConfirm IsDelete setIsOpen={setShowBrandDelete} IsOpen={showBrandDelete} onDialogOk={handleDelete} />
            )}
        </div>
    )
}

export default Brand
