/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
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

const Brand = () => {
    const [data, setData] = useState<BrandTypes[]>([])
    const [totalData, setTotalData] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [brandId, setBrandId] = useState<number>()
    const [showbrandDelete, setShowBrandDelete] = useState<boolean>(false)

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const filtervalue = globalFilter ? `&q=${globalFilter}` : ''
            const response = await axiosInstance.get(`brands?dashboard=true&p=${page}&page_size=${pageSize}${filtervalue}`)
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize, globalFilter])

    const handleDeleteBrand = (id: number) => {
        setBrandId(id)
        setShowBrandDelete(true)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleSyncBrand = async (name: string) => {
        notification.info({
            message: 'SYNC IN PROCESS',
        })
        const body = {
            task_name: 'resize_product_images',
            brand: name,
        }

        try {
            const response = await axiosInstance.post(`/backend/task/create`, body)
            notification.success({
                message: response?.data?.message || 'SYNCED TO Brand',
            })
        } catch (error: any) {
            console.error(error)
            notification.success({
                message: error.response?.data?.message || 'FAILED TO SYNC Brand',
            })
        }
    }

    const handleDelete = async () => {
        const body = {
            remove_tags: true,
        }
        try {
            await axiosInstance.delete(`/brands/${brandId}`, {
                data: body,
            })
            notification.success({
                message: 'Successfully deleted the brand',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to Delete Brand',
            })
        } finally {
            setShowBrandDelete(false)
        }
    }

    const columns = BrandColumns({ handleSyncBrand, handleDeleteBrand })

    return (
        <div>
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
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
            {showbrandDelete && (
                <DialogConfirm IsDelete setIsOpen={setShowBrandDelete} IsOpen={showbrandDelete} onDialogOk={handleDelete} />
            )}
        </div>
    )
}

export default Brand
