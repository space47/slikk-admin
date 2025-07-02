/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { Spinner } from '@/components/ui'
import { IoMdDownload } from 'react-icons/io'
import ImageMODAL from '@/common/ImageModal'
import { notification } from 'antd'
import { Product } from './brandCatalogCommon'
import EasyTable from '@/common/EasyTable'
import { useBrandCatalogColumns } from './brandCatalogUtils/useBrandCatalogColumns'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { pageSizeOptions } from '@/views/category-management/orderlist/commontypes'

const BrandCatalog = () => {
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [showSpinner, setShowSpinner] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<any>([])
    const [noData, setNoData] = useState(false)

    const fetchData = async () => {
        try {
            setShowSpinner(true)
            const response = await axiosInstance.get(
                `merchant/products?dashboard=true&p=${page}&page_size=${pageSize}&company_id=${selectedCompany.id}`,
            )
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
            setShowSpinner(false)
            if (data.length === 0) {
                setNoData(true)
            } else {
                setNoData(false)
            }
        } catch (error) {
            console.error(error)
            setShowSpinner(false)
        }
    }

    const filter = async (page: number, pageSize: number, filter: string = '') => {
        try {
            let searchInputType = `&sku=${filter}`
            let response = await axiosInstance.get(
                `merchant/products?dashboard=true&p=${page}&page_size=${pageSize}${searchInputType}&company_id=${selectedCompany.id}`,
            )

            if (response.data.data.results.length === 0) {
                searchInputType = `&name=${filter}`

                response = await axiosInstance.get(
                    `merchant/products?dashboard=true&p=${page}&page_size=${pageSize}${searchInputType}&company_id=${selectedCompany.id}`,
                )
            }
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        if (globalFilter) {
            filter(page, pageSize, globalFilter)
        } else {
            fetchData()
        }
    }, [page, pageSize, globalFilter, selectedCompany])

    const handleOpenModal = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const handleDownload = async () => {
        try {
            const downloadUrl = `merchant/products?download=true&p=${page}&page_size=${pageSize}&company_id=${selectedCompany.id}`
            const response = await axiosInstance.get(downloadUrl)
            notification.success({
                message: response?.data?.message || 'Downloaded success',
            })
        } catch (error: any) {
            notification.success({
                message: error?.response?.data?.message || 'Failed to download',
            })
            console.log(error)
        }
    }

    const columns = useBrandCatalogColumns({ handleOpenModal })

    return (
        <div className="p-4 shadow-xl rounded-xl">
            {showSpinner ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner size="40px" />
                </div>
            ) : (
                <>
                    <div className="flex xl:justify-between xl:flex-row gap-4 flex-col mb-4 items-center ">
                        <div className="">
                            <input
                                type="text"
                                placeholder="Search here"
                                value={globalFilter}
                                className="p-2 border rounded"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </div>
                        <div className="flex order-first xl:order-none">
                            <button
                                className="bg-gray-100 text-black px-5 py-2 hover:bg-gray-200 rounded-lg flex "
                                onClick={handleDownload}
                            >
                                <IoMdDownload className="text-xl" />
                                Export
                            </button>
                        </div>
                    </div>

                    {noData ? (
                        <div className="flex flex-col gap-1 justify-center items-center h-screen">
                            <h3>No Data Available</h3>
                            <p>Try changing the date </p>
                        </div>
                    ) : (
                        <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />
                        <div style={{ minWidth: 130 }}>
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => {
                                    setPage(1)
                                    setPageSize(Number(option?.value))
                                }}
                            />
                        </div>
                    </div>
                    {showImageModal && (
                        <ImageMODAL
                            dialogIsOpen={showImageModal}
                            setIsOpen={setShowImageModal}
                            image={particularRowImage && particularRowImage?.split(',')}
                        />
                    )}
                </>
            )}
        </div>
    )
}

export default BrandCatalog
